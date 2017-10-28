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
        public Id: string,
        public NodeId: string,
        public RemoteAddress: string,
        public Protocol: string,
        public CreationTime: string
    ) { }
}

export class Session {
    constructor(
        public User: string,
        public ConnID: string,
        public RemoteAddress: string,
        public Protocol: string,
        public CreationTime: string
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