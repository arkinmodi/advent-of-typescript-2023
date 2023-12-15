type BoxToys<
    N extends string,
    B extends number,
    T extends string[] = [],
> = B extends T["length"] ? T : BoxToys<N, B, [...T, N]>;
