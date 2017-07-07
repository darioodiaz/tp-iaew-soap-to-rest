#!/usr/bin/env bash

set -e

echo "Starting Tp-IAEW server"
docker-compose up -d
docker-compose logs -f