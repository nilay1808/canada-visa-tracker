export const visaTypes = [
  "child_adopted",
  "child_dependent",
  "refugees_gov",
  "refugees_private",
  "study",
  "supervisa",
  "visitor-outside-canada",
  "work",
] as const;

export type VisaType = (typeof visaTypes)[number];

export function assertValidVisaCategoryCode(
  categoryCode: any
): asserts categoryCode is VisaType {
  if (typeof categoryCode !== "string") {
    throw new Error("categoryCode is not a string");
  }

  if (!visaTypes.includes(categoryCode as VisaType)) {
    throw new Error(`Invalid categoryCode=${categoryCode}`);
  }
}

export function getInfoForVisaType(visaType: string) {
  assertValidVisaCategoryCode(visaType);
  switch (visaType) {
    case "visitor-outside-canada":
      return {
        icon: "🧳",
        title: "Tourist",
        description: "For people visiting Canada for tourism or leisure",
      };
    case "supervisa":
      return {
        icon: "🧑‍🦳",
        title: "Super Visa",
        description:
          "For parents and grandparents of Canadian citizens or permanent residents to visit their family",
      };
    case "study":
      return {
        icon: "📕",
        title: "Study",
        description:
          "For people who want to study at a Canadian university or college",
      };
    case "work":
      return {
        icon: "🖥️",
        title: "Work",
        description: "For people who want to work in Canada for a limited time",
      };
    case "child_dependent":
      return {
        icon: "🧒",
        title: "Child Dependent",
        description:
          "For children of Canadian citizens or permanent residents who want to live in Canada",
      };
    case "child_adopted":
      return {
        icon: "🧒",
        title: "Child Adopted",
        description:
          "For children who are adopted by Canadian citizens or permanent residents",
      };
    case "refugees_gov":
      return {
        icon: "🆘",
        title: "Refugees",
        description: "For people who are refugees and want to live in Canada",
      };
    case "refugees_private":
      return {
        icon: "🆘",
        title: "Refugees (private)",
        description: "For people who are refugees and want to live in Canada",
      };
  }
}
