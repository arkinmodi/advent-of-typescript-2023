type DayCounter<
    START extends number,
    END extends number,
    DAYS extends number[] = [],
> = DAYS["length"] extends END
    ? START
    : START | DayCounter<[...DAYS, 1]["length"], END, [...DAYS, 1]>;
