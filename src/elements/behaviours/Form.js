"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamundaFormData = void 0;
const _1 = require(".");
/*  'camunda:formData'
  <extensionElements>
<camunda: formData >
    <camunda: formField id = "surname" label = "Surname" type = "string" />
        <camunda: formField id = "givenName" label = "Given name" type = "string" />
            </camunda:formData>
            < /extensionElements> */
class CamundaFormData extends _1.Behaviour {
    init() {
        this.fields = [];
        this.definition.$children.forEach(f => {
            this.fields.push(f);
        });
    }
    getFields() { return this.fields; }
    describe() {
        let fields = '';
        this.fields.forEach(f => { fields += `<p/>field id:'${f.id}'  name:'${f.label}' type: ${f.type} `; });
        return ['input fields', fields];
    }
}
exports.CamundaFormData = CamundaFormData;
//# sourceMappingURL=Form.js.map