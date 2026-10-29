#!/usr/bin/env bash
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a
umask 022

# Provision the inspected Ubuntu 24.04 VM. Preserve password-based SSH access.
test "$(id -u)" -eq 0
. /etc/os-release
test "$ID" = ubuntu
test "$VERSION_CODENAME" = noble

apt-get update
apt-get -y -o Dpkg::Options::=--force-confdef -o Dpkg::Options::=--force-confold full-upgrade
apt-get install -y ca-certificates curl ufw fail2ban unattended-upgrades
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
cat >/etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: noble
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

install -d -m 0755 /etc/docker
if test ! -e /etc/docker/daemon.json; then
  cat >/etc/docker/daemon.json <<'EOF'
{
  "live-restore": true,
  "log-driver": "json-file",
  "log-opts": {"max-size": "10m", "max-file": "3"}
}
EOF
fi
systemctl enable docker containerd
systemctl restart docker

ufw default deny incoming
ufw default deny routed
ufw default allow outgoing
ufw limit 22/tcp comment 'SSH administration'
ufw allow 80/tcp comment 'HTTP ACME and HTTPS redirect'
ufw allow 443/tcp comment 'HTTPS website'
ufw --force enable
systemctl enable --now ufw

# Docker published ports traverse FORWARD instead of UFW INPUT.
install -m 0755 /opt/skufuslugi/deploy/docker-firewall.sh /usr/local/sbin/skufuslugi-docker-firewall
install -m 0644 /opt/skufuslugi/deploy/docker-firewall.service /etc/systemd/system/skufuslugi-docker-firewall.service
systemctl daemon-reload
systemctl enable --now skufuslugi-docker-firewall.service

cat >/etc/fail2ban/jail.d/skufuslugi.local <<'EOF'
[sshd]
enabled = true
backend = systemd
port = 22
maxretry = 5
findtime = 10m
bantime = 1h
banaction = ufw
EOF
systemctl enable --now fail2ban
systemctl restart fail2ban

cat >/etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF
cat >/etc/apt/apt.conf.d/52skufuslugi-upgrades <<'EOF'
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Origins-Pattern:: "origin=Docker,label=Docker CE,codename=noble";
EOF
systemctl enable apt-daily.timer apt-daily-upgrade.timer

cat >/etc/sysctl.d/60-skufuslugi-security.conf <<'EOF'
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.default.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
net.ipv4.tcp_syncookies = 1
net.ipv4.conf.all.rp_filter = 2
net.ipv4.conf.default.rp_filter = 2
kernel.kptr_restrict = 2
kernel.dmesg_restrict = 1
EOF
sysctl --system
printf '\nProvisioning completed.\n'
