# Tutorial
In this tutorial we will go through a complete Workflow Example.
But First let us see what is an already built Workflow will behave like to the end-user

Without any installation, let us go to bpmnServer [Demo Website](https://bpmn.omniworkflow.com)

1. Select Model `Leave Application'
2. Execute the model
3. Fill the form with requested input
4. You will see now the new `instance` of the model been created along with the data and items

# Installation

### Local Install

This needs Node.js 20 or later. `--memory` tries it without a database, and its data is lost when the server stops:

```sh
npx bpmn-server init my-app --memory
cd my-app
npm start
```

Open http://localhost:3000 and sign in as `admin`, password `admin`. To keep your data, see [Installation](../setup.md).


Use your browser to view the bpmn-server running

<!--include -->

## Initialize data
