type RemoveNaughtyChildren<T extends Record<string, unknown>> = {
    [K in keyof T as Exclude<K, `naughty_${string}`>]: T[K];
};
