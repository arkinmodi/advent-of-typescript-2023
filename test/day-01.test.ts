import type { Expect, Equal } from "type-testing";

import type { SantasFavoriteCookies } from "src/day-01";

type test_0_actual = SantasFavoriteCookies;
type test_0_expected = "ginger-bread" | "chocolate-chip";
type test_0 = Expect<Equal<test_0_actual, test_0_expected>>;
