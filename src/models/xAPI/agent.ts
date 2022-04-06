export function isIAgent(val: any): val is IAgent {
    if(!val.mbox && !val.mbox_sha1sum && !val.openid && !val.name && !val.account) return false;
    return true;
}
export interface IAgent {
    mbox?: string;
    mbox_sha1sum?: string;
    openid?: string;
    name?: string;
    account?: {
        name: string;
        homePage: string;
    }
}

export interface IGroup extends IAgent {
    member: IAgent[];
}