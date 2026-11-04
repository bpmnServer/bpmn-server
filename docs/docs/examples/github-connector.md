# Call a REST API and catch an HTTP error

The **GitHub repository** example in 3.5.2 reads a public repository and saves selected response fields.
Run it in a local app with the UI and administration enabled and demo mode off. The app needs outbound
access to `api.github.com`. The public lookup can run without a key within GitHub's unauthenticated rate limit.

1. Download [GitHub repository.bpmn](https://raw.githubusercontent.com/bpmnServer/bpmn-server/v3.5.2/testSampleApp/processes/GitHub%20repository.bpmn)
   and [github.json](https://raw.githubusercontent.com/bpmnServer/bpmn-server/v3.5.2/testSampleApp/connectors/openapi/github.json).
2. Open **Administration → Connectors** and add the OpenAPI document with the ID `github`. Paste the
   contents of `github.json` and use the document's default base URL.
3. Import the BPMN model. In **Get the repository**, inspect the connector binding `github/repos/get`.
   It maps `data.owner` and `data.repo` to path parameters and maps the response to `data.description`
   and `data.starsCount`.
4. Start **GitHub repository** with `owner=bpmnServer` and `repo=bpmn-server`. Check the completed instance's
   data for the description and numeric star count.
5. Start another instance with the same owner and `repo=bpmn-server-example-missing-repository`.
   A GitHub 404 raises `HTTP_404`. The **No such repository** boundary event catches it and the diagram shows
   the **Not found** end event.

See [Connectors](../connectors.md) for the wizard, authorization, and how network failures differ from HTTP responses.
