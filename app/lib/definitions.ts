export type ItemHistory = {
    id: string;
    itemid: string;
    agentid: string;
    volume: number;
    inbound: boolean;
    outsup: boolean;
    createat: string;
};

export type Agent = {
    id: string;
    agent: string;
};