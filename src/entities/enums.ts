export type ConstAssertionEnum<T> = T[keyof T];
export const SYSTEM_USER_ID = "SYSTEM";

export enum TestEnum {
  HELLO = "WORLD",
  FIZZ = "BUZZ",
}

export const TestConst = {
  FOO: "BAR",
  BAZ: "BLITZ",
} as const;

export type TestConst = ConstAssertionEnum<typeof TestConst>;

export const Status = {
  /**
   * Order initialized
   */
  NEW: "New",
} as const;

export type Status = ConstAssertionEnum<typeof Status>;
