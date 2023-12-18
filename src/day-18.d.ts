type Count<
    LIST extends string[],
    ITEM extends string,
    TOTAL extends string[] = [],
> = LIST extends [infer F, ...infer R extends string[]]
    ? F extends ITEM
        ? Count<R, ITEM, [...TOTAL, ITEM]>
        : Count<R, ITEM, TOTAL>
    : TOTAL["length"];
