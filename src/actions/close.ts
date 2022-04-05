import { IActionObject } from '../models/models'
import IStatement from '../models/xAPI/statement';
import Permissions from '../helpers/permissions';
import Evaluator from '../helpers/evaluator';

export type CloseCallback = () => void;

export interface ICloseObject extends IActionObject {
    callback: CloseCallback;
}
export default class Close {
    name: string;
    permissions: Permissions;
    prereqs: Evaluator;
    callback: CloseCallback;

    constructor(data: ICloseObject) {
        this.name = data.name;
        this.permissions = new Permissions(data.permissions);
        this.prereqs = new Evaluator(data.agent, data.prereqs);
    }

    /**
     * close
     */
    public async close(agent: string): Promise<void> {
        const canClose = await this.permissions.hasPermission(agent) &&
            this.prereqs.eval();
        if (canClose) {
            this.executeClose();
        }
    }

    private executeClose() {
        if(this.callback) {
            this.callback();
        }
    }
}