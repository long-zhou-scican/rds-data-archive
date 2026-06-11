#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: scripts/sls-with-profile.sh <serverless-subcommand...>" >&2
  exit 1
fi

PROFILE="${AWS_PROFILE:-sandbox}"

if ! command -v aws >/dev/null 2>&1; then
  echo "Error: aws CLI is not installed or not in PATH." >&2
  exit 1
fi

aws_config_file="${AWS_CONFIG_FILE:-$HOME/.aws/config}"
aws_credentials_file="${AWS_SHARED_CREDENTIALS_FILE:-$HOME/.aws/credentials}"

if ! aws configure list-profiles 2>/dev/null | grep -Fxq "$PROFILE"; then
  echo "Error: AWS profile '$PROFILE' is not configured." >&2
  echo "Checked config files:" >&2
  echo "  AWS config: $aws_config_file" >&2
  echo "  AWS credentials: $aws_credentials_file" >&2
  echo "Fix: configure the profile or run with AWS_PROFILE=<existing-profile>." >&2
  exit 1
fi

if creds_env="$(aws configure export-credentials --profile "$PROFILE" --format env 2>/dev/null)"; then
  eval "$creds_env"
  unset AWS_PROFILE
  unset AWS_DEFAULT_PROFILE
else
  echo "Warning: could not export credentials for profile '$PROFILE'." >&2
  echo "Attempting profile-based auth; if this is an SSO profile run: aws sso login --profile $PROFILE" >&2
fi

max_old_space_size="${SLS_NODE_MAX_OLD_SPACE_SIZE:-8192}"
local_serverless_entry="./node_modules/serverless/bin/serverless.js"
node_opts="${NODE_OPTIONS:-}"
if [[ "$node_opts" != *"--max-old-space-size"* ]]; then
  node_opts="${node_opts} --max-old-space-size=${max_old_space_size}"
fi

if [[ -f "$local_serverless_entry" ]]; then
  NODE_OPTIONS="$node_opts" AWS_SDK_LOAD_CONFIG=1 node --max-old-space-size="$max_old_space_size" "$local_serverless_entry" "$@"
else
  NODE_OPTIONS="$node_opts" AWS_SDK_LOAD_CONFIG=1 serverless "$@"
fi
