import fetch from 'node-fetch';
import IStatement from "../models/xAPI/statement";
import {IAgent} from '../models/xAPI/agent';
const STATEMENTS= process.env.STATEMENT_ENDPOINT;


enum ResultsFormat {
    EXACT = "exact",
    IDS = "ids",
    CANONICAL = "canonical"
};
export type StatementQueryParams = {
    agent?: IAgent;
    verb?: string;
    activity?: string,
    registration?: string,
    related_activities?: boolean;
    related_agents?: boolean;
    since?: string;
    until?: string;
    limit?: number;
    format?: ResultsFormat;
    attachments?: boolean;
    ascending?: boolean;
}
type StatementsResponse = {
    statements: IStatement[] | string[];
    more: string;
}

export default class Client {
    private isStatementsResponse(val: any): val is StatementsResponse {
        return val.statements !== null && val.more !== null;
    }

    public async getStatements(
        values: StatementQueryParams
        ):
        Promise<(IStatement | string)[]> {
            if(!STATEMENTS) throw new Error("Statements endpoint has not been defined!");
            try{
                const paramArry = Object.entries(values).map((entry: any) => {
                    return entry.map((elem: any) => elem.toString()
                )});
                const query = new URLSearchParams(paramArry);
                const endpoint = STATEMENTS.concat(query.toString());
                let result = await fetch(endpoint);
                let rows: (IStatement|string)[] = []
                if(this.isStatementsResponse(result.body)) {
                    rows = result.body.statements;
                    let more = result.body.more;
                    while(more !== '') {
                        result = await fetch(more);
                        if(this.isStatementsResponse(result.body)) {
                            rows = [...rows, ...result.body.statements]
                        }
                    }
                }
                return rows;

            } catch(e) {
                console.error(e);
                return []
            }
        }
}