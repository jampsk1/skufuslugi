#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose config --quiet

# Retain the running image for rollback before replacing the local tag.
if docker container inspect skufuslugi >/dev/null 2>&1; then
  previous=$(docker inspect --format '{{.Image}}' skufuslugi)
  docker image tag "$previous" skufuslugi:previous
fi
docker compose build --pull

docker volume create skufuslugi_caddy_data >/dev/null
docker volume create skufuslugi_caddy_config >/dev/null
image=$(docker compose config --images | head -n 1)
docker run --rm --network none --read-only --user 0:0 \
  --cap-drop ALL --cap-add CHOWN --cap-add FOWNER --cap-add DAC_OVERRIDE \
  --security-opt no-new-privileges:true \
  --entrypoint sh \
  -v skufuslugi_caddy_data:/data -v skufuslugi_caddy_config:/config \
  "$image" -c 'chown -R 10001:10001 /data /config && find /data /config -type d -exec chmod 700 {} +'
docker compose run --rm --no-deps web caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
docker compose up -d --wait --wait-timeout 120
docker compose ps
