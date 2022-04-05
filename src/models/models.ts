import { IAgent } from './xAPI/agent';
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

export interface IPreReq<Type> {
    operator: IReqOperators | string;
    value: Type;
};

export interface IRangePreReq<Type> extends IPreReq<Type> {
    range: {
        min: Type;
        max: Type;
    }
}

export interface PreRequisitesObject {
    name: string;
    reqs: IStatementReqObject[];
}

export interface IActionObject {
    name: string;
    agent: IAgent;
    org: string;
    permissions: IPermissionsObject;
    prereqs: PreRequisitesObject;
    action: () => void;
}

export interface WorkflowObject {
    name: string;
    actions: Array<IActionObject>;
    permissions: {[key: string]:  IPermissionsObject};
    prereqs:{[key: string]: PreRequisitesObject};
}
