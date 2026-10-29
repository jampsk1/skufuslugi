#!/usr/bin/env python3
"""Verify the public Docker deployment using only the Python standard library."""

import argparse
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import hashlib
import http.client
import ipaddress
import json
from pathlib import Path
import socket
import ssl
import sys
from urllib.parse import quote, urlsplit


PORTS = (22, 80, 443, 2375, 2376, 3000, 3306, 5432, 6379, 8080, 8081, 8443, 9090)
ALLOWED_PORTS = {22, 80, 443}
HTTP_TIMEOUT = 10


class HTTPSConnection(http.client.HTTPSConnection):
    """Keep TLS SNI and hostname verification even when connecting to a fixed IP."""

    def __init__(self, domain, connect_ip, context):
        super().__init__(domain, timeout=HTTP_TIMEOUT, context=context)
        self.connect_ip = connect_ip

    def connect(self):
        raw = socket.create_connection(
            (self.connect_ip or self.host, self.port), timeout=self.timeout
        )
        try:
            self.sock = self._context.wrap_socket(raw, server_hostname=self.host)
        except BaseException:
            raw.close()
            raise


def get(domain, connect_ip, path, context, https=True):
    connection = (
        HTTPSConnection(domain, connect_ip, context)
        if https
        else http.client.HTTPConnection(connect_ip or domain, port=80, timeout=HTTP_TIMEOUT)
    )
    try:
        connection.connect()
        certificate = connection.sock.getpeercert() if https else None
        connection.request(
            "GET", path, headers={"Host": domain, "Accept-Encoding": "identity"}
        )
        response = connection.getresponse()
        return (
            response.status,
            {key.lower(): value for key, value in response.getheaders()},
            response.read(),
            certificate,
        )
    finally:
        connection.close()


def certificate_summary(certificate):
    issuer = {
        key: value
        for relative_name in certificate.get("issuer", ())
        for key, value in relative_name
    }
    expires = certificate.get("notAfter")
    return {
        "trust_and_hostname_verified": True,
        "issuer": issuer,
        "expires_utc": (
            datetime.fromtimestamp(ssl.cert_time_to_seconds(expires), timezone.utc).isoformat()
            if expires
            else None
        ),
    }


def check_port(target, port):
    try:
        with socket.create_connection((target, port), timeout=1):
            return {"port": port, "state": "open", "allowed": port in ALLOWED_PORTS}
    except (OSError, TimeoutError):
        return {"port": port, "state": "closed_or_filtered"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--domain", default="skufuslugi.ru")
    parser.add_argument("--ip", help="Connect to this IPv4/IPv6 address; retain domain TLS SNI and Host")
    args = parser.parse_args()
    if args.ip:
        try:
            ipaddress.ip_address(args.ip)
        except ValueError:
            parser.error("--ip must be a literal IPv4 or IPv6 address")
    if not args.domain or any(char in args.domain for char in "/:@ "):
        parser.error("--domain must be a DNS hostname without scheme or port")

    dist = Path(__file__).resolve().parents[1] / "dist"
    files = sorted(path for path in dist.rglob("*") if path.is_file())
    result = {
        "checked_at_utc": datetime.now(timezone.utc).isoformat(),
        "domain": args.domain,
        "connect_target": args.ip or args.domain,
        "expected_files": len(files),
        "tls": None,
        "checks": [],
        "files": [],
        "ports": [],
        "failures": [],
    }
    failures = result["failures"]
    context = ssl.create_default_context()

    def record(name, ok, **details):
        result["checks"].append({"check": name, "ok": ok, **details})
        if not ok:
            failures.append(name)

    if not files:
        failures.append("local dist directory has no files")

    try:
        status, headers, _, _ = get(args.domain, args.ip, "/", context, https=False)
        location = headers.get("location", "")
        destination = urlsplit(location)
        valid_redirect = (
            status in (301, 308)
            and destination.scheme == "https"
            and destination.hostname == args.domain.lower()
            and destination.port in (None, 443)
            and destination.username is None
            and destination.password is None
        )
        record("http_redirect", valid_redirect, status=status, location=location)
    except Exception as error:
        record("http_redirect", False, error=f"{type(error).__name__}: {error}")

    https_available = False
    try:
        status, headers, _, certificate = get(args.domain, args.ip, "/", context)
        https_available = True
        result["tls"] = certificate_summary(certificate)
        record("https_homepage", status == 200, status=status)
        for header in (
            "content-security-policy", "x-content-type-options", "x-frame-options",
            "strict-transport-security",
        ):
            value = headers.get(header, "")
            record(f"header:{header}", bool(value.strip()), value=value)
        record("server_header_absent", "server" not in headers)
    except Exception as error:
        record("https_homepage", False, error=f"{type(error).__name__}: {error}")

    if https_available:
        for local_path in files:
            path = "/" + quote(local_path.relative_to(dist).as_posix(), safe="/")
            expected = hashlib.sha256(local_path.read_bytes()).hexdigest()
            item = {"path": path, "expected_sha256": expected, "ok": False}
            try:
                status, headers, body, _ = get(args.domain, args.ip, path, context)
                actual = hashlib.sha256(body).hexdigest()
                item.update(status=status, actual_sha256=actual)
                item["ok"] = (
                    status == 200
                    and expected == actual
                    and headers.get("content-encoding", "identity").lower() in ("", "identity")
                )
            except Exception as error:
                item["error"] = f"{type(error).__name__}: {error}"
            result["files"].append(item)
            if not item["ok"]:
                failures.append(f"file:{path}")

        for path in (
            "/.env", "/.git/config", "/.openai/hosting.json", "/assets/.hidden",
            "/__deployment_check_missing_file__.txt",
        ):
            try:
                status, _, _, _ = get(args.domain, args.ip, path, context)
                record(f"not_found:{path}", status == 404, status=status)
            except Exception as error:
                record(f"not_found:{path}", False, error=f"{type(error).__name__}: {error}")

    with ThreadPoolExecutor(max_workers=len(PORTS)) as pool:
        result["ports"] = list(pool.map(lambda port: check_port(args.ip or args.domain, port), PORTS))
    for item in result["ports"]:
        if item["state"] == "open" and not item["allowed"]:
            failures.append(f"unexpected_open_port:{item['port']}")

    result["verified_files"] = sum(item["ok"] for item in result["files"])
    result["ok"] = not failures
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
