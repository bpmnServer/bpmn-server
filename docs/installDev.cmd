md dev
cd dev
git clone https://github.com/bpmnServer/bpmn-server
git clone https://github.com/bpmnServer/bpmn-web
git clone https://github.com/bpmnServer/bpmn-client
git clone https://github.com/bpmnServer/docs

cd bpmn-server
call npm i
call npm run build
cd ../bpmn-web
call npm i
call npm i ../bpmn-server
call npm run setup
call npm run setup
call npm run build
call npm run cli
call npm run test

cd ../bpmn-client
call npm i
cd ../docs
call npm i

