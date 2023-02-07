export const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const getMonthName = (monthNumber: number) => {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  const formatter = new Intl.DateTimeFormat("en-us", { month: "short" });

  return formatter.format(date);
};
