import { IAgent, IGroup } from './agent';
import IActivity from './activity';

export interface IVerb {
    id: string;
    display: {[key: string]: string};
}

export interface IResult {
    score?: {
        scaled?: number;
        raw?: number;
        min?: number;
        max?: number;
    }
    success?: boolean;
    completion?: boolean;
    response?: string;
    duration?: string;
    extensions?: {[key: string]: any};
}

export interface IContext {
    registration?: string;
    instructor?: IAgent | IGroup
    instructorName?: string;
    team?: IGroup;
    contextActivities?: {
        parent?: IActivity | IActivity[];
        grouping?: IActivity | IActivity[];
        category?: IActivity | IActivity[];
        other?: IActivity | IActivity[];
    }
    language?: string;
    statement?: IStatementRef;
    extensions: {[key: string]: any;};

}

export interface IStatementRef {
    objectType: string;
    id: string;

}

export interface IAttachment {
  usageType: string;
  display: {[key: string]: string;};
  description?: {[key: string]: string;};
  contentType: string;
  length: number;
  sha2: string;
  fileUrl?: string;
}


export default interface IStatement {
    actor: IAgent | IGroup | IActivity;
    verb: IVerb;
    object: IAgent | IGroup | IActivity | IStatement |IStatementRef;
    result?: IResult;
    context?: IContext;
    authority?: IAgent | IGroup;
    attachments?: IAttachment[];
    timestamp?: string;
    stored?: string;
    id?: string;
}