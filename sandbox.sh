#!/usr/bin/env bash
set -euo pipefail

PROFILE="${AWS_PROFILE:-sandbox}"
STAGE="${STAGE:-sandbox}"
REGION="${REGION:-us-east-1}"
ENV_SUFFIX="${ENV_SUFFIX:-$STAGE}"
TARGET_FUNCTION="${1:-}"

if [[ -z "$TARGET_FUNCTION" ]]; then
	echo "Usage: ./dev.sh <ExportScheduleFunctionName>" >&2
	exit 1
fi

export DB_HOST="$(AWS_PROFILE="$PROFILE" AWS_SDK_LOAD_CONFIG=1 aws ssm get-parameter --name "rdsMySqlHost-${ENV_SUFFIX}" --query 'Parameter.Value' --output text --region "$REGION")"
export DB_USER="$(AWS_PROFILE="$PROFILE" AWS_SDK_LOAD_CONFIG=1 aws ssm get-parameter --name "rdsMySqlUsername-${ENV_SUFFIX}" --query 'Parameter.Value' --output text --region "$REGION")"
export DB_PASSWORD="$(AWS_PROFILE="$PROFILE" AWS_SDK_LOAD_CONFIG=1 aws ssm get-parameter --name "rdsMySqlPassword-${ENV_SUFFIX}" --with-decryption --query 'Parameter.Value' --output text --region "$REGION")"
export DB_NAME="$(AWS_PROFILE="$PROFILE" AWS_SDK_LOAD_CONFIG=1 aws ssm get-parameter --name "rdsMySqlDb-${ENV_SUFFIX}" --query 'Parameter.Value' --output text --region "$REGION")"
export S3_BUCKET="$(AWS_PROFILE="$PROFILE" AWS_SDK_LOAD_CONFIG=1 aws ssm get-parameter --name "db-parquet-exports-${ENV_SUFFIX}" --query 'Parameter.Value' --output text --region "$REGION")"

for var in DB_HOST DB_USER DB_PASSWORD DB_NAME S3_BUCKET; do
	if [[ -z "${!var:-}" ]]; then
		echo "Missing required environment value: $var" >&2
		exit 1
	fi
done

npm run build:lambda

INVOKE_CONFIG="${INVOKE_CONFIG:-serverless.yml}"
SCHEDULE_EVENT_PATH="${SCHEDULE_EVENT_PATH:-src/schedules/test-schedule-event.json}"

if [[ ! -f "$INVOKE_CONFIG" ]]; then
	echo "Missing serverless config file: $INVOKE_CONFIG" >&2
	exit 1
fi

if [[ ! -f "$SCHEDULE_EVENT_PATH" ]]; then
	echo "Missing schedule event file: $SCHEDULE_EVENT_PATH" >&2
	exit 1
fi

echo "Invoking $TARGET_FUNCTION from $INVOKE_CONFIG"
AWS_PROFILE="$PROFILE" SLS_NODE_MAX_OLD_SPACE_SIZE="${SLS_NODE_MAX_OLD_SPACE_SIZE:-12288}" ./scripts/sls-with-profile.sh invoke local --config "$INVOKE_CONFIG" -f "$TARGET_FUNCTION" --path "$SCHEDULE_EVENT_PATH" --stage "$STAGE" --region "$REGION"