type StreetSuffixTester<
    STREET extends string,
    SUFFIX extends string,
> = STREET extends `${string}${SUFFIX}` ? true : false;
