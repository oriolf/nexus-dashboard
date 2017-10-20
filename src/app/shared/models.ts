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