# Docker images for bpmn-web
## Install
```
git clone https://github.com/bpmnServer/docker.git 
cd docker
```
## Docker operations

<table>
<tr><th>Action</th><th>Command</th></tr>
<tr><td>Start</td><td>>docker compose up -d</td></tr>
<tr><td>Stop</td><td>>docker compose down</td></tr>
<tr><td>View Logs</td><td>>docker compose logs -f</td></tr>
<tr><td>Interactive Session</td><td></td></tr>
<tr><td>&nbsp&nbsp  in Windows</td><td>>it.cmd</td></tr>
<tr><td>&nbsp&nbsp  in Linux</td><td>>sh it.sh</td></tr>
</table>

## Customize Image/Container
- To customize container edit included `docker-compose.yml`

- To customise image edit `image/dockerFile`
