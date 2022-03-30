import { IPreReq } from "../models";
export interface IAgentReqObject {
    objectType?: IPreReq;
    mbox?: IPreReq;
    mbox_sha1sum?: IPreReq;
    openid?: IPreReq;
    account?: IPreReq | {
        name?: IPreReq;
        homePage?: IPreReq;
    }
}

export interface IActivityReqObject {
    objectType?: IPreReq;
    id?: IPreReq;
    definition: IPreReq | {
        name?: {[key: string]: IPreReq};
        description: {[key: string]: IPreReq};
        type?: IPreReq;
        moreInfo?: IPreReq;
        extensions?:{[key: string]: IPreReq};
    }
    interactionType?: IPreReq;
    correctResponsePattern?: IPreReq;
    choices?: IPreReq;
    scale?: IPreReq;
    source?: IPreReq;
    target?: IPreReq;
    steps?: IPreReq;
}

export interface IGroupReqObject extends IAgentReqObject {
    name?: IPreReq;
    members?: IPreReq;
}

export default interface IStatementReqObject {
    id?: IPreReq;
    timestamp?: IPreReq;
    stored?: IPreReq;
    actor?: IPreReq| IAgentReqObject | IActivityReqObject;
    verb?: IPreReq | {
        id: IPreReq;
        display: {[key: string]: IPreReq};
    };
    object?: IPreReq | IAgentReqObject | IActivityReqObject;
    result?: IPreReq | {
        score?: {
            rawScore?: IPreReq;
            scaledScore?: IPreReq;
            minimumScore?: IPreReq;
            maximumScore?: IPreReq;
        };
        success?: IPreReq;
        completion?: IPreReq;
        response?: IPreReq;
        duration?: IPreReq;
        extensions?: {[key: string]: IPreReq};

    };
    context?: {
        registration?: IPreReq;
        instructor?: IPreReq;
        instructorName: IPreReq;
        team?: IPreReq;
        contextActivities: IPreReq;
        language?: IPreReq;
        statement?: IPreReq;
        extensions: {[key: string]: IPreReq};
    }
    authority: IPreReq;
    attachments: IPreReq;
}