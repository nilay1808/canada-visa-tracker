export function getDarkModeValueFromLocalStorage() {
  const localValue = window.localStorage.getItem("darkMode");

  return localValue === "true";
}

export function setDarkModeValueInLocalStorage(value: boolean) {
  window.localStorage.setItem("darkMode", `${value}`);
}
