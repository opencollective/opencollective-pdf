export const parseToBooleanDefaultTrue = (value) => {
  if (value === null || value === undefined || value === "") {
    return true;
  }
  const string = value.toString().trim().toLowerCase();
  return !["off", "disabled", "0", "false", "no", 0].includes(string);
};
