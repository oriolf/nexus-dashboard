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

export class Node {
    constructor(
        public NodeId: string,
        public Version: string,
        public Clients: number,
        public Listening: boolean,
        public Load: { string: number }
    ) { }
}