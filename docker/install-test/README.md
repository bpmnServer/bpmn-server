# Install test

Installs bpmn-server, bpmn-web and bpmn-client in a clean container (Node.js 22, nothing else) the way the
READMEs tell users to, and checks that each step works. Needs Docker.

```sh
sh run.sh                     # the packages of this repository (npm pack): run before publishing
sh run.sh npm                 # the packages published on npm (latest)
sh run.sh npm 3.5.0           # a published version
TEMPLATE=minimal sh run.sh    # with npx bpmn-server init --minimal
```

On Windows, use `run.cmd` the same way (`set TEMPLATE=minimal` first for the minimal application).

What it does, in `test.sh`:

1. `npx bpmn-server init my-app`: creates the application, with a MongoDB in a second container.
2. `npm install`, `npm run verify`, `npm run setup`, `npm start`. Checks that the sign-in page answers, that
   other pages are behind it, and that the model editor's bundle was published (`check-web.mjs`).
3. bpmn-client in a project of its own. Lists the models with the keys from the application's `.env`, starts
   `Hello`, and runs it to its end (`check-client.mjs`).

It exits 0 when everything passes. The containers and the database are removed afterwards. With the local
packages, the application installs the packed `.tgz` files, so nothing has to be published first.
