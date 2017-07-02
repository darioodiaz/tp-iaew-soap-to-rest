#!/usr/bin/env bash

set -e

echo "Starting Tp-IAEW server"
echo "Starting db"
docker-compose up -d db
echo "Waiting for up..."
sleep 10
docker-compose up -d
docker-compose logs -f