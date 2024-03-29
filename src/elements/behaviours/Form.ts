import { Behaviour } from '.';
/*  'camunda:formData'
  <extensionElements>
<camunda: formData >
    <camunda: formField id = "surname" label = "Surname" type = "string" />
        <camunda: formField id = "givenName" label = "Given name" type = "string" />
            </camunda:formData>
            < /extensionElements> */
class CamundaFormData extends Behaviour {
    fields;
    init() {
        this.fields = [];
        this.definition.$children.forEach(f => {
            this.fields.push(f);
        });
    }
    getFields() { return this.fields; }
    describe() {
        let desc = [];
        let fields = '';
        this.fields.forEach(f => {
            desc.push(['Form Field', `id: ${f.id} name: ${f.label} type: ${ f.type }`]);
            //fields += `<p/>field id:'${f.id}'  name:'${f.label}' type: ${f.type} `
        });
        return desc;//['input fields', fields];
    }
}


export { CamundaFormData }