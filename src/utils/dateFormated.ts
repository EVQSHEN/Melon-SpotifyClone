function dateFormated(added_at: string) {
  const dateObject = new Date(added_at);
  let day = String(dateObject.getUTCDate());
  let month = String(dateObject.getUTCMonth() + 1);
  const year = String(dateObject.getUTCFullYear());
  day = day.length === 1 ? '0' + day : day;
  month = month.length === 1 ? '0' + month : month;
  return day + '.' + month + '.' + year;
}
export default dateFormated;
