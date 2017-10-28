export class User {
    constructor(
        public User: string,
        public Tags: { string: { string: any } },
        public Templates: string[],
        public Whitelist: string[],
        public Blaclist: string[],
        public MaxSessions: number,
        public Disabled: boolean
    ) { }
}

export class UserSessions {
    constructor(
        public User: string,
        public Sessions: SessionInfo[],
        public N: number
    ) { }
}

export class SessionInfo {
    constructor(
        Id: string,
        NodeId: string,
        RemoteAddress: string,
        Protocol: string,
        CreationTime: string
    ) { }
}

export class Node {
    constructor(
        public NodeId: string,
        public Version: string,
        public Clients: number,
        public Listening: boolean,
        public Load: { string: number }
    ) { }
}