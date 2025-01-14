export type ItemHistory = {
    id?: string;
    itemid: string;
    agentid?: string;
    volume: number;
    inbound: boolean;
    outsup: boolean;
    createat: string;
};

export type Agent = {
    id: string;
    agent: string;
};

export type Item ={
    id?: string;
    name: string;
    unitprice: number;
    currentvolume: number;
}