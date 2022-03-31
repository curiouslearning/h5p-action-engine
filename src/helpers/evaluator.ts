import _ from 'lodash';
import Client, {StatementQueryParams} from './client'
import {
    PreRequisitesObject,
    IPreReq,
    IRangePreReq,
    IReqOperators
} from "../models/models";
import IStatement from '../models/xAPI/statement';
import { IAgent } from '../models/xAPI/agent';
import IStatementReqObject, {
    IActivityReqObject,
    IStatementRefReqObj
} from "../models/xAPI/statementReqObject";
export default class Evaluator {
    agent: IAgent;
    name: string;
    reqs: IStatementReqObject[];
    constructor(agent: IAgent, data: PreRequisitesObject) {
        this.agent = agent;
        this.name = data.name;
        this.reqs = data.reqs;
    }

    public async eval(): Promise<boolean> {
        for(let key in this.reqs) {
            const req = this.reqs[key];
            const statements= await this.fetchStatementsToEval(this.agent, req);
            for (const statement in statements) {
                if(!this.satisfiesPreReqs(req, statement)) {
                    return false;
                }
            }
        }
        return true;
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

    private satisfiesPreReq(req: IPreReq<any>, value: any): boolean {
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
                    const rangeReq = req as IRangePreReq<typeof req.value>;
                    return (value >= rangeReq.range.min) &&
                        (value <= rangeReq.range.max);
                default: return false;
            }
        }
    }
    
    private isPreReq(val: any): val is IPreReq<any> {
        return val.value !== undefined && val.operator !== undefined
    }
    private isActivityOrRefReq(val: any):
        val is IActivityReqObject | IStatementRefReqObj
        {
            return val.objectType &&
                (val.objectType.value === "Activity" ||
                val.objectType.value === "StatementRef");
        }

    private async fetchStatementsToEval(
        agent: IAgent,
        reqObj: IStatementReqObject
        ): Promise<(IStatement | string)[]> {
            const client = new Client();
            const _object = _.get(reqObj, "object");
            const _context = _.get(reqObj, "context");
            const _timestamp = _.get(reqObj, "timestamp");
            let params: StatementQueryParams = {agent};
            if (_object && this.isActivityOrRefReq(_object)) {
                params['activity'] = _object.id.value;
            }
            if(_context) {
                params['registration'] = _context.registration.value;
            }
            if(_timestamp) {
                switch (_timestamp.operator) {
                    case IReqOperators.GTE:
                        params['since'] = _timestamp.value;
                        break;
                    case IReqOperators.LTE:
                        params['until'] = _timestamp.value;
                        break;
                    case IReqOperators.RANGE:
                        const range = _timestamp as IRangePreReq<string>
                        params['since'] = range.range.min;
                        params['until'] = range.range.max;
                        break;
                }
            }
            try {
                return await client.getStatements(params);
            } catch(e) {
                console.error(e);
                return [];
            }
    }

}