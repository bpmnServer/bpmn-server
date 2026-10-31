FOR /F "tokens=*" %%g IN ('docker ps -a --format "{{.ID}}" -f "name=bpmn-server-bpmn-web"') do (SET id=%%g)
docker exec -it %id% sh
