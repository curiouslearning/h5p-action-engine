import { IActionObject } from '../models/models'
import IStatement from '../models/xAPI/statement';
import Permissions from '../helpers/permissions';
import PreRequisites from '../helpers/prerequisites';

export type CloseCallback = () => void;

export interface ICloseObject extends IActionObject {
    callback: CloseCallback;
}
export default class Close {
    name: string;
    permissions: Permissions;
    prereqs: PreRequisites;
    callback: CloseCallback;

    constructor(data: ICloseObject) {
        this.name = data.name;
        this.permissions = new Permissions(data.permissions);
        this.prereqs = new PreRequisites(data.prereqs);
    }

    /**
     * close
     */
    public close(agent: string): void {
        const reqVals = this.aggregatePreReqs(this.prereqs.getReqIds()
        );
        const canClose = this.permissions.hasPermission(agent) &&
            this.prereqs.satisfiesPreReqs(reqVals);
        if (canClose) {
            this.executeClose();
        }
    }

    private executeClose() {
        if(this.callback) {
            this.callback();
        }
    }

    private aggregatePreReqs(ids: string[]): {[key: string]: any} {

    }

}