export enum InteractionType {
    CHOICE = "CHOICE",
    FILLIN = "FILL-IN",
    LIKERT = "LIKERT",
    LONGFILLIN = "LONG-FILL-IN",
    MATCHING = "MATCHING",
    NUMERIC = "NUMERIC",
    OTHER = "OTHER",
    PERFORMANCE = "PERFORMANCE",
    SEQUENCING = "SEQUENCING",
    TRUEFALSE = "TRUE-FALSE",
}

export default interface IActivity {
    objectType: string;
    id: string;
    definition: {
        name?: {[key: string]: string};
        description?: {[key: string]: string};
        type?: string;
        moreInfo?: string;
        extensions: {[key: string]: any};
    };
    interactionType?: InteractionType;
    correctResponsePattern?: string[];
    choices?: string[];
    scale?: any[];
    source?: any[];
    target?: any[];
    steps?: any[];

}