#!/usr/bin/env bash
set -euo pipefail
interface=$(ip -4 route show default | awk 'NR==1 {print $5}')
test -n "$interface"

iptables -w -N SKUF-DOCKER-FW 2>/dev/null || true
iptables -w -F SKUF-DOCKER-FW
iptables -w -A SKUF-DOCKER-FW -m conntrack --ctstate ESTABLISHED,RELATED -j RETURN
iptables -w -A SKUF-DOCKER-FW -i "$interface" -p tcp -m conntrack --ctorigdstport 80 -j RETURN
iptables -w -A SKUF-DOCKER-FW -i "$interface" -p tcp -m conntrack --ctorigdstport 443 -j RETURN
iptables -w -A SKUF-DOCKER-FW -i "$interface" -j DROP
iptables -w -A SKUF-DOCKER-FW -j RETURN
iptables -w -C DOCKER-USER -j SKUF-DOCKER-FW 2>/dev/null || iptables -w -I DOCKER-USER 1 -j SKUF-DOCKER-FW

# Cover Docker IPv6 forwarding too, when Docker has enabled its IPv6 chain.
if ip6tables -w -S DOCKER-USER >/dev/null 2>&1; then
  ip6tables -w -N SKUF-DOCKER-FW 2>/dev/null || true
  ip6tables -w -F SKUF-DOCKER-FW
  ip6tables -w -A SKUF-DOCKER-FW -m conntrack --ctstate ESTABLISHED,RELATED -j RETURN
  ip6tables -w -A SKUF-DOCKER-FW -i "$interface" -p tcp -m conntrack --ctorigdstport 80 -j RETURN
  ip6tables -w -A SKUF-DOCKER-FW -i "$interface" -p tcp -m conntrack --ctorigdstport 443 -j RETURN
  ip6tables -w -A SKUF-DOCKER-FW -i "$interface" -j DROP
  ip6tables -w -A SKUF-DOCKER-FW -j RETURN
  ip6tables -w -C DOCKER-USER -j SKUF-DOCKER-FW 2>/dev/null || ip6tables -w -I DOCKER-USER 1 -j SKUF-DOCKER-FW
fi
