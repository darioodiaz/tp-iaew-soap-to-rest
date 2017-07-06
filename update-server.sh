#!/usr/bin/env bash

set -e

docker-compose stop backend
./docker-clean-logs.sh tpiaew-backend
git pull
cd ./backend && yarn deploy && cd ..
docker-compose up -d backend
docker-compose logs -f