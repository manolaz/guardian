import { ModuleVariableModel } from '../module-variable.model';
import { PolicyRoleModel } from '../policy-role.model';

export class RoleVariables {
    public name?: string;
    public value?: string;
    public data?: PolicyRoleModel;

    constructor(role?: PolicyRoleModel | ModuleVariableModel | string, value?: string) {
        if (typeof role === 'string') {
            this.name = role;
            this.value = role;
        } else if (role instanceof ModuleVariableModel) {
            this.name = role.name;
            this.value = role.name;
        } else if (role) {
            this.name = role.name;
            this.value = role.name;
            this.data = role;
        } else {
            this.name = '';
            this.value = '';
        }
        if (value !== undefined) {
            this.value = value;
        }
    }
}
