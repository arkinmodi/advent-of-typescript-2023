export type FindSanta<
    T extends string[][],
    R extends unknown[] = [],
    C extends unknown[] = [],
> = R["length"] extends T["length"]
    ? never
    : "🎅🏼" extends T[R["length"]][number]
      ? "🎅🏼" extends T[R["length"]][C["length"]]
          ? [R["length"], C["length"]]
          : FindSanta<T, R, [...C, 0]>
      : FindSanta<T, [...R, 0], C>;
