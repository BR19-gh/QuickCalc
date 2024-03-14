export function formatDate(timestamp) {
  const date = new Date(timestamp);

  return date.toLocaleTimeString("en-UK", {
    year: "2-digit",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
