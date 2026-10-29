FROM caddy:2-alpine@sha256:eb4d35b7452d1ab6171fbdbe8d9275b2301dad6dad92115d91e19fb9b24d510f

# High internal ports do not need the upstream binary's file capability.
RUN setcap -r /usr/bin/caddy

COPY --chown=10001:10001 deploy/Caddyfile /etc/caddy/Caddyfile
COPY --chown=10001:10001 dist/ /srv/

USER 10001:10001
WORKDIR /srv

EXPOSE 8080 8443

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
