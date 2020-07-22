#!/bin/bash
rm bpmnServer/docs/api.old -r
mv bpmnServer/docs/api bpmnServer/docs/api.old

npx typedoc -out bpmnServer/docs/api bpmnServer/src --mode file --readme none --excludePrivate
