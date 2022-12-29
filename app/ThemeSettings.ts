export const setColors = (color: string) => {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", `var(--color-${color})`);
  root.style.setProperty("--color-primary-50", `var(--color-${color}-50)`);
  root.style.setProperty("--color-primary-100", `var(--color-${color}-100)`);
  root.style.setProperty(
    "--color-primary-light",
    `var(--color-${color}-light)`
  );
  root.style.setProperty(
    "--color-primary-lighter",
    `var(--color-${color}-lighter)`
  );
  root.style.setProperty("--color-primary-dark", `var(--color-${color}-dark)`);
  root.style.setProperty(
    "--color-primary-darker",
    `var(--color-${color}-darker)`
  );
  // setSelectedColor(color);
  // window.localStorage.setItem("color", color);

  //   return color;
  //
};
