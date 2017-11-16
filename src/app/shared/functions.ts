export function Max(a: number, b: number): number {
    return a < b? b: a;
}

export function Min(a: number, b: number): number {
    return a < b? a: b;
}

export function isPrefix(prefix: string, s: string): boolean {
    return s.indexOf(prefix) === 0;
}