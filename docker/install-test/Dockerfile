# A clean machine with Node.js and nothing else: installs bpmn-server, bpmn-web and bpmn-client the way users do
# (test.sh). Built and run by run.sh / run.cmd.
FROM node:22-slim
WORKDIR /work
COPY test.sh check-web.mjs check-client.mjs /test/
RUN chmod +x /test/test.sh
CMD ["/test/test.sh"]
