export const toReadableTime = (time: Date) => {
  let diffms = new Date().getTime() - time.getTime();
  let minuteDiff = Math.floor(diffms / 60000);
  if (minuteDiff < 1) {
    return "now";
  }
  if (minuteDiff < 60) {
    return minuteDiff + "m";
  }
  if (minuteDiff < 1440) {
    return Math.floor(minuteDiff / 60) + "h";
  }
  return (
    Math.floor(minuteDiff / 1440) +
    " day" +
    (Math.floor(minuteDiff / 1440) > 1 ? "s" : "") +
    " ago"
  );
};
