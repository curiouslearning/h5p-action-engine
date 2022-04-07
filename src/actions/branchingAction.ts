import Evaluator from "../helpers/evaluator";
import { IActionObject, PreRequisitesObject } from "../models/models";
import IStatement from '../models/xAPI/statement';
import Action from "./action";

export interface IBranchObject extends IActionObject {
    name: string;
    branchData: IBranchData[];
    baseBranch: IBranchData;
}

export interface IBranchData {
    name: string;
    index: number;
    preReqs: PreRequisitesObject;
    value: string;
}

function isIBranchObject(val: any): val is IBranchObject {
    if (!val.name) return false;
    if (!val.branchData) return false;
    if (!val.baseBranch) return false;
    return true;
}

export default class BranchingAction extends Action {
    callback: (data: string) => void;
    cases: IBranchData[];
    baseBranch: IBranchData;
    constructor(
        data: IBranchObject,
        callback: (data: string) => void,
        statements: IStatement[],
        fetchData = false
        ) {
            if(!isIBranchObject(data)) {
                throw new Error("param 'data' must implement the IBranchObject interface");
            }
            super(data, ()=> {callback(data.baseBranch.value)}, statements, fetchData); 
            this.cases = data.branchData;
            this.baseBranch = data.baseBranch;
            this.callback = callback
    }

    public async execute(): Promise<boolean> {
        if(!this.cases) {
            return super.execute();
        }
        if(!this.evaluated) {
            if(this.orgList.permissions.indexOf(this.org) !== -1) {
                this.canExecute = true;
            } else {
                this.canExecute = false;
            }
            this.evaluated = true;
        }

        if(this.canExecute) {
            const branchData = await this.pickBranch();
            this.callback(branchData.value);
            return true;
        }
        return false;
    }

    public async pickBranch(): Promise<IBranchData> {

        const results = this.cases.map(async branch => {
            const evaluator = new Evaluator(this.agent,
            branch.preReqs,
            this.fetchData,
            this.data
            )
            const pass = await evaluator.eval();
            if(pass) return branch.index;
            return -1;
        });
        const branchIndex = await Promise.all(results).then((vals) => {
            return Math.max(...vals);
        })
        const callback = this.cases.find(branch => branch.index === branchIndex);
        if(!callback) {
            return this.baseBranch;
        }
        return callback;
    }

    public async evaluate(): Promise<boolean> {
        this.canExecute = this.orgList.permissions.indexOf(this.org) !== -1
        this.evaluated = true;
        return new Promise<boolean>(()=>  {return this.canExecute})
    }
}