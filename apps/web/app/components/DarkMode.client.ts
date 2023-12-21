export function getDarkModeValueFromLocalStorage() {
  const localValue = window.localStorage.getItem("darkMode");

  if (localValue === null) {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDark;
  }

  return localValue === "true";
}

export function setDarkModeValueInLocalStorage(value: boolean) {
  window.localStorage.setItem("darkMode", `${value}`);
}
