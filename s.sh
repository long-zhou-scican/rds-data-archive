AWS_PROFILE=sandbox ./scripts/sls-with-profile.sh invoke local \
  --config serverless.yml \
  -f genericDataSearch \
  --path src/handlers/test-generic-data-search-event.json \
  --stage sandbox \
  --region us-east-1