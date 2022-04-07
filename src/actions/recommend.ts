import { resolve } from "path";
import Evaluator from "../helpers/evaluator";
import { IActionObject, PreRequisitesObject } from "../models/models";
import IStatement from '../models/xAPI/statement';
import IStatementReqObject from "../models/xAPI/statementReqObject";
import Action from "./action";

export interface IRecObject extends IActionObject {
    name: string;
    recData: IRecData[];
    baseCase: IRecData;
}

export interface IRecData {
    name: string;
    index: number;
    preReqs: PreRequisitesObject;
    value: string;
}

function isIRecObject(val: any): val is IRecObject {
    if (!val.name) return false;
    if (!val.recData) return false;
    if (!val.baseCase) return false;
    return true;
}

export default class Recommend extends Action {
    recommendation: (data: string) => void;
    cases: IRecData[];
    baseCase: IRecData;
    constructor(
        data: IRecObject,
        rec: (data: string) => void,
        statements: IStatement[],
        fetchData = false
        ) {
            if(!isIRecObject(data)) {
                throw new Error("param 'data' must implement the IRecObject interface");
            }
            super(data, ()=> {rec(data.baseCase.value)}, statements, fetchData); 
            this.cases = data.recData;
            this.baseCase = data.baseCase;
            this.recommendation = rec
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
            const recData = await this.calculateRecCase();
            this.recommendation(recData.value);
            return true;
        }
        return false;
    }

    public async calculateRecCase(): Promise<IRecData> {

        const results = this.cases.map(async recCase => {
            const evaluator = new Evaluator(this.agent,
            recCase.preReqs,
            this.fetchData,
            this.data
            )
            const pass = await evaluator.eval();
            if(pass) return recCase.index;
            return -1;
        });
        const caseIndex = await Promise.all(results).then((vals) => {
            return Math.max(...vals);
        })
        const rec = this.cases.find(recCase => recCase.index === caseIndex);
        if(!rec) {
            return this.baseCase;
        }
        return rec;
    }

    public async evaluate(): Promise<boolean> {
        this.canExecute = this.orgList.permissions.indexOf(this.org) !== -1
        this.evaluated = true;
        return new Promise<boolean>(()=>  {return this.canExecute})
    }
}