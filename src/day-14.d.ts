type DecipherNaughtyList<LIST extends string> =
    LIST extends `${infer NAME}/${infer REST}`
        ? NAME | DecipherNaughtyList<REST>
        : LIST;
