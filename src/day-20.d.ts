type Letters = {
    A: ["█▀█ ", "█▀█ ", "▀ ▀ "];
    B: ["█▀▄ ", "█▀▄ ", "▀▀  "];
    C: ["█▀▀ ", "█ ░░", "▀▀▀ "];
    E: ["█▀▀ ", "█▀▀ ", "▀▀▀ "];
    H: ["█ █ ", "█▀█ ", "▀ ▀ "];
    I: ["█ ", "█ ", "▀ "];
    M: ["█▄░▄█ ", "█ ▀ █ ", "▀ ░░▀ "];
    N: ["█▄░█ ", "█ ▀█ ", "▀ ░▀ "];
    P: ["█▀█ ", "█▀▀ ", "▀ ░░"];
    R: ["█▀█ ", "██▀ ", "▀ ▀ "];
    S: ["█▀▀ ", "▀▀█ ", "▀▀▀ "];
    T: ["▀█▀ ", "░█ ░", "░▀ ░"];
    Y: ["█ █ ", "▀█▀ ", "░▀ ░"];
    W: ["█ ░░█ ", "█▄▀▄█ ", "▀ ░ ▀ "];
    " ": ["░", "░", "░"];
    ":": ["#", "░", "#"];
    "*": ["░", "#", "░"];
};

type ToAsciiArt<
    INPUT extends string,
    CURRENT_LINE extends [string, string, string] = ["", "", ""],
    OUTPUT extends string[] = [],
> = INPUT extends `\n${infer NEXT_LINE}`
    ? ToAsciiArt<NEXT_LINE, ["", "", ""], [...OUTPUT, ...CURRENT_LINE]>
    : INPUT extends `${infer FIRST}${infer REST}`
      ? Uppercase<FIRST> extends keyof Letters
          ? ToAsciiArt<
                REST,
                [
                    `${CURRENT_LINE[0]}${Letters[Uppercase<FIRST>][0]}`,
                    `${CURRENT_LINE[1]}${Letters[Uppercase<FIRST>][1]}`,
                    `${CURRENT_LINE[2]}${Letters[Uppercase<FIRST>][2]}`,
                ],
                OUTPUT
            >
          : never
      : [...OUTPUT, ...CURRENT_LINE];
