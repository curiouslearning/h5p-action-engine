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