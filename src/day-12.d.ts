type FindSanta<T extends string[]> = T extends [
    ...infer R extends string[],
    infer L extends string,
]
    ? L extends "🎅🏼"
        ? R["length"]
        : FindSanta<R>
    : never;
