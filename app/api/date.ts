// const { differenceInSeconds, formatDistanceToNow } = require("date-fns");

import { differenceInSeconds, formatDistanceToNow } from "date-fns";

export function timeAgo(isoDate: Date) {
  const date = new Date(isoDate);
  const secondsDifference = differenceInSeconds(new Date(), date);

  if (secondsDifference < 60) {
    return `${secondsDifference} seconds ago`;
  } else {
    return formatDistanceToNow(date);
  }
}
