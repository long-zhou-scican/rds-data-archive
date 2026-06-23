#!/bin/bash
# Test script: Read sample data from all DynamoDB tables in us-west-2
# Usage: ./scripts/test-ddb-read-all.sh
#
# Ensure AWS credentials are exported before running:
#   export AWS_ACCESS_KEY_ID="..."
#   export AWS_SECRET_ACCESS_KEY="..."
#   export AWS_SESSION_TOKEN="..."

REGION="us-west-2"
MAX_ITEMS=3

echo "============================================"
echo " DynamoDB Read Test - Region: $REGION"
echo " Max items per table: $MAX_ITEMS"
echo "============================================"
echo ""

# List all tables in the region
echo ">>> Listing all tables in $REGION..."
TABLES=$(aws dynamodb list-tables --region "$REGION" --output json 2>&1)
if [ $? -ne 0 ]; then
  echo "ERROR: Failed to list tables"
  echo "$TABLES"
  exit 1
fi

TABLE_NAMES=$(echo "$TABLES" | python3 -c "import json,sys; d=json.load(sys.stdin); [print(t) for t in d.get('TableNames',[])]")
TABLE_COUNT=$(echo "$TABLE_NAMES" | grep -c .)

echo "Found $TABLE_COUNT table(s)"
echo ""

# Iterate and scan each table
SUCCESS=0
FAILED=0
EMPTY=0

for TABLE in $TABLE_NAMES; do
  echo "--------------------------------------------"
  echo "Table: $TABLE"
  echo "--------------------------------------------"

  # Describe table (key schema)
  DESC=$(aws dynamodb describe-table --table-name "$TABLE" --region "$REGION" \
    --query "Table.{Keys:KeySchema,ItemCount:ItemCount,Size:TableSizeBytes}" \
    --output json 2>&1)

  if [ $? -ne 0 ]; then
    echo "  ERROR describing table: $DESC"
    FAILED=$((FAILED + 1))
    echo ""
    continue
  fi

  ITEM_COUNT=$(echo "$DESC" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('ItemCount',0))")
  SIZE_BYTES=$(echo "$DESC" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('Size',0))")
  KEYS=$(echo "$DESC" | python3 -c "import json,sys; d=json.load(sys.stdin); keys=d.get('Keys',[]); print(', '.join([f\"{k['AttributeName']} ({k['KeyType']})\" for k in keys]))")

  echo "  Keys: $KEYS"
  echo "  Items: $ITEM_COUNT | Size: $SIZE_BYTES bytes"

  # Scan sample items
  SCAN_RESULT=$(aws dynamodb scan --table-name "$TABLE" --region "$REGION" \
    --max-items "$MAX_ITEMS" --output json 2>&1)

  if [ $? -ne 0 ]; then
    echo "  ERROR scanning table: $SCAN_RESULT"
    FAILED=$((FAILED + 1))
    echo ""
    continue
  fi

  SCAN_COUNT=$(echo "$SCAN_RESULT" | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d.get('Items',[])))")

  if [ "$SCAN_COUNT" -eq 0 ]; then
    echo "  Result: EMPTY (0 items returned)"
    EMPTY=$((EMPTY + 1))
  else
    echo "  Result: OK ($SCAN_COUNT item(s) returned)"
    # Print first item keys only (not full data)
    echo "$SCAN_RESULT" | python3 -c "
import json,sys
d=json.load(sys.stdin)
items=d.get('Items',[])
if items:
    first=items[0]
    attrs=list(first.keys())
    print(f'  Attributes: {attrs}')
    # Print compact first item (truncate long values)
    compact={}
    for k,v in first.items():
        for typ,val in v.items():
            if isinstance(val,str) and len(val)>80:
                compact[k]=f'{typ}:{val[:80]}...'
            elif isinstance(val,dict):
                compact[k]=f'{typ}:{{...}}'
            elif isinstance(val,list):
                compact[k]=f'{typ}:[{len(val)} items]'
            else:
                compact[k]=f'{typ}:{val}'
    print(f'  Sample: {json.dumps(compact, indent=4)[:500]}')
"
    SUCCESS=$((SUCCESS + 1))
  fi
  echo ""
done

echo "============================================"
echo " Summary"
echo "============================================"
echo "  Total tables: $TABLE_COUNT"
echo "  With data:    $SUCCESS"
echo "  Empty:        $EMPTY"
echo "  Failed:       $FAILED"
echo "============================================"
