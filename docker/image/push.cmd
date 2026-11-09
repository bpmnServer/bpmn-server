@echo off
rem Publish only the new BPMN Server Docker Hub repository.
docker push --all-tags bpmnserver/bpmn-server
