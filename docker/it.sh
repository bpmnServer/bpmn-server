#!/bin/bash
id=$(docker ps -a --format "{{.ID}}" -f "name=bpmn-server-bpmn-web-*")
docker exec -it $id sh
