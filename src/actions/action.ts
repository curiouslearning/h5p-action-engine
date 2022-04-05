import Evaluator from "../helpers/evaluator";
import { IActionObject, IPermissionsObject, PreRequisitesObject } from "../models/models";
import { IAgent } from "../models/xAPI/agent";
import IStatement from "../models/xAPI/statement";

export default class Action {
    action: () => void;
    org: string;
    agent: IAgent;
    orgList: IPermissionsObject;
    preReqs: PreRequisitesObject;
    evaluated: boolean;
    canExecute: boolean;
    data: IStatement[];
    fetchData: boolean;

    constructor (
        data: IActionObject,
        statements: IStatement[] = [],
        fetchData = false
    ) {
        this.action = data.action;
        this.org = data.org;
        this.agent = data.agent;
        this.orgList = data.orgList;
        this.preReqs = data.prereqs;
        this.evaluated = false;
        this.canExecute = false;
        this.data = statements;
        this.fetchData = fetchData;
    }

    public async execute(): Promise<boolean>{
        if(!this.evaluated) {
            await this.evaluate();
        }
        if (this.canExecute) {
            this.action();
            return true;
        }
        return false;
    }

    public async evaluate(): Promise<boolean> {
        const hasPermission = this.orgList.permissions.indexOf(this.org) !== -1;
        const evaluator = new Evaluator(
            this.agent,
            this.preReqs,
            this.fetchData,
            this.data
        );
        const meetsPreReqs = await evaluator.eval();
        this.canExecute = hasPermission && meetsPreReqs;
        this.evaluated = true;
        return this.canExecute;
    }
}