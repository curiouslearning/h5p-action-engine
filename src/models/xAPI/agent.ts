export interface IAgent {
    mbox: string;
    mbox_sha1sum: string;
    openid: string;
    account: {
        name: string;
        homePage: string;
    }
}

export interface IGroup extends IAgent {
    name: string;
    member: IAgent[];
}