export const viasCategoryCodes = [
  "child_adopted",
  "child_dependent",
  "refugees_gov",
  "refugees_private",
  "study",
  "supervisa",
  "visitor-outside-canada",
  "work",
] as const;

export type VisaCategoryCode = (typeof viasCategoryCodes)[number];

export function assertValidVisaCategoryCode(
  categoryCode: any
): asserts categoryCode is VisaCategoryCode {
  if (typeof categoryCode !== "string") {
    throw new Error("categoryCode is not a string");
  }

  if (!viasCategoryCodes.includes(categoryCode as VisaCategoryCode)) {
    throw new Error(`Invalid categoryCode=${categoryCode}`);
  }
}

export function getTitleForCategoryCode(categoryCode: VisaCategoryCode) {
  assertValidVisaCategoryCode(categoryCode);
  switch (categoryCode) {
    case "visitor-outside-canada":
      return "🧳 Visitor/Tourist";
    case "supervisa":
      return "🧑‍🦳 Super";
    case "study":
      return "📕 Study";
    case "work":
      return "🖥️ Work";
    case "child_dependent":
      return "🧒 Child Dependent";
    case "child_adopted":
      return "🧒 Child Adopted";
    case "refugees_gov":
      return "🆘 Refugees";
    case "refugees_private":
      return "🆘 Refugees (private)";
  }
}
