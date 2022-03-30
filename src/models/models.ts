import IStatement from './xAPI/statement';
import IStatementReqObject from './xAPI/statementReqObject';

export interface IPermissionsObject {
    name: string;
    permissions: Array<string>;
}

export enum IReqOperators {
    GT = "GT",
    LT = "LT",
    GTE = "GTE",
    LTE = "LTE",
    EQ = "EQ",
    NOT = "NOT",
    RANGE = "RANGE" 
}

export type IPreReq =  {
    operator: IReqOperators;
    value: any;
};

export interface PreRequisitesObject {
    name: string;
    reqs: {[key: string]: IStatementReqObject}
}

export interface IActionObject {
    name: string;
    permissions: IPermissionsObject;
    prereqs: PreRequisitesObject;
}

export interface WorkflowObject {
    name: string;
    actions: Array<IActionObject>;
    permissions: IPermissionsObject;
    prereqs: PreRequisitesObject;
}
