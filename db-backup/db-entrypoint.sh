#!/usr/bin/env bash

set +e

echo "Cleaning db..."
rm -f -r /data/db/*
echo "Db cleaned succesfully"

echo "Installing ps..."
apt-get update && apt-get install -y procps

echo "Starting mongo db in background..."
mongod&
echo "Getting mongo db pid.."
MONGO_PID=$(ps -aux | grep mongod | awk 'NR==1{print $2}')
sleep 2

echo "Restoring db..."
mongorestore --db tpiaew /data/backup

echo "DB ready"
wait $MONGO_PID