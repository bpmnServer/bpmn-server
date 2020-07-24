import { Behaviour } from '.';
declare class CamundaFormData extends Behaviour {
    fields: any;
    init(): void;
    getFields(): any;
    describe(): string[];
}
export { CamundaFormData };
