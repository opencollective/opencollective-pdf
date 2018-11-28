#!/bin/bash

if [ "$NODE_ENV" = "circleci" ]; then
  echo "> Starting api server"
  cd ~/cache/opencollective-api
  PG_DATABASE=opencollective_dvl npm start &
  API_PID=$!
  cd -
  echo "> Starting frontend server"
  npm start &
  FRONTEND_PID=$!
fi

echo ""
echo "Waiting 10sec (give some time for servers to be up and running)"
sleep 10
echo ""

echo "> Starting server jest tests"
npm run test:server
RETURN_CODE=$?
if [ $RETURN_CODE -ne 0 ]; then
  echo "Error with jest tests, exiting"
  exit 1;
fi

if [ "$NODE_ENV" = "circleci" ]; then
  echo "Killing all node processes"
  kill $API_PID;
  kill $FRONTEND_PID;
  echo "Exiting with code $RETURN_CODE"
  exit $RETURN_CODE
fi
