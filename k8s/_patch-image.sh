#!/usr/bin/env bash
set -euo pipefail
ns=popcat
sha=${1:?need short sha}
kubectl -n $ns set image deploy/popcat-backend app=ghcr.io/OWNER/popcat-backend:$sha
kubectl -n $ns set image deploy/popcat-frontend web=ghcr.io/OWNER/popcat-frontend:$sha
