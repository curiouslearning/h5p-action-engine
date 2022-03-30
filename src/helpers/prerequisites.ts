import _ from 'lodash';
import { PreRequisitesObject, IPreReq, IReqOperators } from "../models/models";
import IStatement from '../models/xAPI/statement';
import IStatementReqObject from "../models/xAPI/statementReqObject";
export default class PreRequisites {
    name: string;
    reqs: {[key: string]: IStatementReqObject};
    constructor(data: PreRequisitesObject) {
        this.name = data.name;
        this.reqs = data.reqs;
    }

    public getReqIds(): string[] | null {
        return this.reqs? Object.keys(this.reqs) : null;
    }

    public getReqValues(id: string): IStatement {
        if (!this.reqs[id]) return null;

        return (this.reqs && this.reqs[id])? this.reqs[id].value : null;
    }

    public getReqOperator(id: string): IReqOperators | null {
        return (this.reqs && this.reqs[id])? this.reqs[id].operator : null;
    }

    public satisfiesPreReqs(reqs: any, vals: any): boolean {
        if(this.isPreReq(reqs)) {
            return this.satisfiesPreReq(reqs, vals);
        } else {
            for (const key in Object.keys(reqs)) {
                const reqChild = reqs[key];
                const valChild = vals[key];
                if(!vals.hasOwnProperty(key)) {
                    return false;
                }
                if(!this.satisfiesPreReq(reqChild, valChild)) {
                    return false;
                }
            }
            return true;
        }
    }

    private satisfiesPreReq(req: IPreReq, value: any): boolean {
        if(req) {
            switch (req.operator) {
                case "GT":
                    return value > req.value;
                case "LT":
                    return value < req.value;
                case "GTE": 
                    return value >= req.value;
                case "LTE":
                    return value <= req.value;
                case "EQ": 
                    return value === req.value;
                case "NOT":
                    return value !== req.value;
                case "RANGE":
                    return (value >= req.value.min) &&
                        (value <= req.value.max);
                default:
                    return false;
            }
        }
    }

    private isPreReq(val: any): val is IPreReq {
        return val.value !== undefined && val.operator !== undefined
    }

}