import { IPermissionsObject } from '../models/models'
export default class Permissions {
    name: string;
    permissions: {[key: string]: boolean}
    constructor(data: IPermissionsObject) {
        this.name = data.name;
        data.permissions.forEach(agent => {
            this.permissions[agent] = true;
        })
    } 

    public hasPermission(agent: string): boolean {
        return (this.permissions[agent]);
    }
}