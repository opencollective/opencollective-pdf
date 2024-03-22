export const getFullName = ({ firstName = undefined, middleName = undefined, lastName = undefined }): string => {
  return [firstName, middleName, lastName].filter(Boolean).join(' ');
};
