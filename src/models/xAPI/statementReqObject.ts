import { IPreReq } from "../models";
import { InteractionType } from "./activity";
import { IAgent } from "./agent";
import { IAttachment, IStatementRef } from "./statement";
export interface IAgentReqObject {
    name?: IPreReq<string>;
    objectType?: IPreReq<string>;
    mbox?: IPreReq<string>;
    mbox_sha1sum?: IPreReq<string>;
    openid?: IPreReq<string>;
    account?: {
        name?: IPreReq<string>;
        homePage?: IPreReq<string>;
    }
}

export interface IActivityReqObject {
    objectType?: IPreReq<string>;
    id?: IPreReq<string>;
    definition: {
        name?: {[key: string]: IPreReq<string>};
        description: {[key: string]: IPreReq<string>};
        type?: IPreReq<string>;
        moreInfo?: IPreReq<string>;
        extensions?:{[key: string]: IPreReq<any>};
    }
    interactionType?: IPreReq<InteractionType>;
    correctResponsePattern?: IPreReq<string[]>;
    choices?: IPreReq<string[]>;
    scale?: IPreReq<string[]>;
    source?: IPreReq<string[]>;
    target?: IPreReq<string[]>;
    steps?: IPreReq<string[]>;
}

export interface IGroupReqObject extends IAgentReqObject {
    members?: IPreReq<IAgent[]>;
}

export interface IStatementRefReqObj {
    objectType?: IPreReq<string>;
    id: IPreReq<string>;
}

export default interface IStatementReqObject {
    id?: IPreReq<string>;
    timestamp?: IPreReq<string>;
    stored?: IPreReq<string>;
    actor?: IAgentReqObject | IActivityReqObject;
    verb?: {
        id: IPreReq<string>;
        display?: {[key: string]: IPreReq<string>};
    };
    object?: IAgentReqObject | IActivityReqObject;
    result?: {
        score?: {
            raw?: IPreReq<number>;
            scaled?: IPreReq<number>;
            min?: IPreReq<number>;
            max?: IPreReq<number>;
        };
        success?: IPreReq<boolean>;
        completion?: IPreReq<boolean>;
        response?: IPreReq<string>;
        duration?: IPreReq<string>;
        extensions?: {[key: string]: IPreReq<any>};

    };
    context?: {
        registration?: IPreReq<string>;
        instructor?: IPreReq<IAgent>;
        instructorName?: IPreReq<string>;
        team?: IPreReq<IAgent>;
        contextActivities?: IPreReq<{[key: string]: string}>;
        language?: IPreReq<string>;
        statement?: IPreReq<IStatementRef>;
        extensions: {[key: string]: IPreReq<any>};
    }
    authority?: IAgentReqObject;
    attachments?: IPreReq<IAttachment[]>;
}