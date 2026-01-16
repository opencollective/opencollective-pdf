export const parseToBoolean = (value: string | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return undefined;
  }
  const string = value.toString().trim().toLowerCase();
  return ['on', 'enabled', '1', 'true', 'yes', 1].includes(string);
};

export const parseToBooleanDefaultTrue = (value: string | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return true;
  }
  const string = value.toString().trim().toLowerCase();
  return !['off', 'disabled', '0', 'false', 'no', 0].includes(string);
};
