export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
export const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `0${d.getMonth() + 1}`.slice(-2); // Adding leading zero
  const day = `0${d.getDate()}`.slice(-2); // Adding leading zero
  return `${month}-${day}-${year}`;
};
