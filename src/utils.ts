import { format } from "date-fns";

export function formatDateStr(date = new Date()) {
  return format(date, "yyyy-MM-dd hh:mm:ss");
}
