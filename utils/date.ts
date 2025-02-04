import { format, formatDistanceToNow } from "date-fns";

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  let result = formatDistanceToNow(date, { addSuffix: true });
  if (result.includes("about")) result = result.split("about")[1].trim();
  return result;
};

export const formDateString = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString); 
  const formattedDate = format(date, 'dd-MM-yyyy hh:mmaaa');
  return formattedDate;
};
