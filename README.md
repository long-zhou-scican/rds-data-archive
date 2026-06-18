# run deploy

npm run sls:deploy -- --stage sandbox --region us-east-1

npm run sls:deploy -- --stage dev --region us-east-1

# List discovered functions:

src/schedules/invoke-all-schedules.sh --list

# Invoke all locally (default):

src/schedules/invoke-all-schedules.sh

# With stage/region:

src/schedules/invoke-all-schedules.sh --stage sandbox --region us-east-1

# Remote invoke (AWS):

src/schedules/invoke-all-schedules.sh --remote --stage sandbox
