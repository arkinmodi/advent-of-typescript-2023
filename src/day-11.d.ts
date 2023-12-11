type SantaListProtector<T> = {
    readonly [K in keyof T]: keyof T[K] extends object
        ? T[K]
        : SantaListProtector<T[K]>;
};
