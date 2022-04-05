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
    reqs: IStatementReqObject[];
    data: IStatement[];
    shouldFetchStatements = true;

    constructor(
        agent: IAgent,
        prereqs: PreRequisitesObject,
        fetchStatements: boolean = true,
        data?: IStatement[],
    ) {
        this.agent = agent;
        this.reqs = prereqs.reqs;
        this.shouldFetchStatements = fetchStatements;
        if (data) {
            this.data = data;
        } else {
            this.data = [];
        }

    }

    private async loadStatements(
        req: IStatementReqObject
        ): Promise<(string|IStatement)[]> {
            if(this.data && !this.shouldFetchStatements) {
                return this.data;
            } else if(this.shouldFetchStatements) {
                let statements = await this.fetchStatementsToEval(this.agent, req);
                if(!this.data) {
                    return statements;
                }
                return [...statements, ...this.data];
            } else{
                return [];
            }
    }

    public async eval(): Promise<boolean> {
        for(let i=0; i < this.reqs.length; i++) {
            const req = this.reqs[i];
            if (req) {
                const statements= await this.loadStatements(req);
                let reqPassed = false;
                for (let j=0; j < statements.length; j++) {
                    if(this.satisfiesPreReqs(req, statements[j])) {
                        reqPassed = true;
                    }
                }
                if(!reqPassed) {
                    return false;
                }
            }
        }
        return true;
    }


    public satisfiesPreReqs(reqs: any, vals: any): boolean {
        if(reqs === null || reqs === undefined) {
            console.warn('found null value in PreReq') 
            return true;
        } if(this.isPreReq(reqs)){
            return this.satisfiesPreReq(reqs, vals);
        } else  {
            for (const key in reqs) {
                const reqChild = reqs[key];
                const valChild = vals[key];
                if(!valChild) {
                    return false;
                } 
                if(!this.satisfiesPreReqs(reqChild, valChild)) {
                    return false;
                }
            }
            return true;
        }
    }

    private satisfiesPreReq(req: IPreReq<any>, value: any): boolean {
        switch (req.operator as IReqOperators) {
            case IReqOperators.GT:
                return value > req.value;
            case IReqOperators.LT:
                return value < req.value;
            case IReqOperators.GTE: 
                return value >= req.value;
            case IReqOperators.LTE:
                return value <= req.value;
            case IReqOperators.EQ: 
                return value === req.value;
            case IReqOperators.NOT:
                return value !== req.value;
            case IReqOperators.RANGE:
                const rangeReq = req as IRangePreReq<typeof req.value>;
                return (value >= rangeReq.range.min) &&
                    (value <= rangeReq.range.max);
            default: return false;
        }
    }
    
    private isPreReq(val: any): val is IPreReq<any> {
        return val && (val.value !== undefined || val.range !== undefined) && val.operator !== undefined
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
            const params = this.createParams(agent, reqObj);
            try {
                return await client.getStatements(params);
            } catch(e) {
                console.error(e);
                return [];
            }
    }

    private createParams(
        agent: IAgent,
        reqObj: IStatementReqObject
        ): StatementQueryParams {
            const _object = _.get(reqObj, "object");
            const _context = _.get(reqObj, "context");
            const _timestamp = _.get(reqObj, "timestamp");
            let params: StatementQueryParams = {agent};
            if (_object && this.isActivityOrRefReq(_object)) {
                params['activity'] = _object.id? _object.id.value : undefined;
            }
            if(_context) {
                params['registration'] = _context.registration? _context.registration.value : undefined;
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
            return params;
        }

}