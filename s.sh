#!/usr/bin/env bash
set -euo pipefail

npm run build:lambda

AWS_PROFILE=dev ./scripts/sls-with-profile.sh invoke local \
  --config serverless.yml \
  -f genericDataSearch \
  --path src/handlers/test-generic-data-search-event.json \
  --stage dev \
  --region us-east-1