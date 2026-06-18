#!/usr/bin/env bash
set -euo pipefail

PROFILE="${AWS_PROFILE:-dev}"
STAGE="${STAGE:-dev}"
REGION="${REGION:-us-east-1}"
TARGET_FUNCTION="${1:-unitsOffsetsExportSchedule}"
EVENT_PATH="${SCHEDULE_EVENT_PATH:-src/schedules/test-schedule-event.json}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVERLESS_CONFIG="${INVOKE_CONFIG:-serverless.yml}"

if [[ ! -f "$ROOT_DIR/$SERVERLESS_CONFIG" ]]; then
  echo "Missing serverless config file: $ROOT_DIR/$SERVERLESS_CONFIG" >&2
  exit 1
fi

if [[ ! -f "$ROOT_DIR/$EVENT_PATH" ]]; then
  echo "Missing event file: $ROOT_DIR/$EVENT_PATH" >&2
  exit 1
fi

echo "Invoking REMOTE Lambda function '$TARGET_FUNCTION'"
echo "Profile: $PROFILE | Stage: $STAGE | Region: $REGION"
echo "Event: $EVENT_PATH"

start_epoch="$(date +%s)"
(
  cd "$ROOT_DIR"
  AWS_PROFILE="$PROFILE" ./scripts/sls-with-profile.sh invoke \
    --config "$SERVERLESS_CONFIG" \
    -f "$TARGET_FUNCTION" \
    --path "$EVENT_PATH" \
    --stage "$STAGE" \
    --region "$REGION" \
    --log
)
end_epoch="$(date +%s)"

echo "Remote invoke finished in $((end_epoch - start_epoch))s"
