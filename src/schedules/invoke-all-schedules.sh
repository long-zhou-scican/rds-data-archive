#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SERVERLESS_FILE="$ROOT_DIR/serverless.yml"
EVENT_FILE="$ROOT_DIR/src/schedules/test-schedule-event.json"
STAGE="dev"
REGION=""
MODE="local"
LIST_ONLY="false"

usage() {
  cat <<'EOF'
Invoke all schedule functions in serverless.yml.

Usage:
  src/schedules/invoke-all-schedules.sh [options]

Options:
  --stage <name>    Serverless stage (default: dev)
  --region <name>   AWS region override
  --event <path>    Event JSON file path (default: src/schedules/test-schedule-event.json)
  --remote          Use "sls invoke" instead of "sls invoke local"
  --list            Print discovered schedule functions and exit
  -h, --help        Show this help

Examples:
  src/schedules/invoke-all-schedules.sh
  src/schedules/invoke-all-schedules.sh --stage qa --region us-east-1
  src/schedules/invoke-all-schedules.sh --remote --stage dr
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --stage)
      STAGE="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    --event)
      EVENT_FILE="$2"
      shift 2
      ;;
    --remote)
      MODE="remote"
      shift
      ;;
    --list)
      LIST_ONLY="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ ! -f "$SERVERLESS_FILE" ]]; then
  echo "serverless.yml not found at $SERVERLESS_FILE" >&2
  exit 1
fi

if [[ ! -f "$EVENT_FILE" ]]; then
  echo "Event file not found: $EVENT_FILE" >&2
  exit 1
fi

if ! command -v sls >/dev/null 2>&1; then
  echo "'sls' command is not installed or not in PATH." >&2
  exit 1
fi

SCHEDULE_FUNCTIONS=()
while IFS= read -r function_name; do
  if [[ -n "$function_name" ]]; then
    SCHEDULE_FUNCTIONS+=("$function_name")
  fi
done < <(
  awk '
    /^functions:/ { in_functions = 1; next }
    in_functions && /^[^ ]/ { in_functions = 0 }
    !in_functions { next }

    /^  [A-Za-z0-9_]+:/ {
      current = $1
      sub(/:$/, "", current)
      next
    }

    /handler:[[:space:]]*dist-lambda\/schedules\// {
      if (current != "") {
        print current
      }
    }
  ' "$SERVERLESS_FILE"
)

if [[ ${#SCHEDULE_FUNCTIONS[@]} -eq 0 ]]; then
  echo "No schedule functions found in serverless.yml" >&2
  exit 1
fi

if [[ "$LIST_ONLY" == "true" ]]; then
  printf '%s\n' "${SCHEDULE_FUNCTIONS[@]}"
  exit 0
fi

echo "Discovered ${#SCHEDULE_FUNCTIONS[@]} schedule functions."
echo "Mode: $MODE"
echo "Stage: $STAGE"
echo "Event: $EVENT_FILE"
[[ -n "$REGION" ]] && echo "Region: $REGION"

echo

success_count=0
fail_count=0

for function_name in "${SCHEDULE_FUNCTIONS[@]}"; do
  echo "==== Invoking $function_name ===="

  if [[ "$MODE" == "remote" ]]; then
    cmd=(sls invoke -f "$function_name" --path "$EVENT_FILE" --stage "$STAGE")
  else
    cmd=(sls invoke local -f "$function_name" --path "$EVENT_FILE" --stage "$STAGE")
  fi

  if [[ -n "$REGION" ]]; then
    cmd+=(--region "$REGION")
  fi

  if (cd "$ROOT_DIR" && "${cmd[@]}"); then
    success_count=$((success_count + 1))
  else
    fail_count=$((fail_count + 1))
  fi

  echo
 done

echo "Completed. Success: $success_count, Failed: $fail_count"
if [[ $fail_count -gt 0 ]]; then
  exit 1
fi
