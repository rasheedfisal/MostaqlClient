"use client";

import { useLocalStorage } from "../../hooks/useStorage";
import useUpdateEffect from "../../hooks/useUpdateEffect";
import { useLoaded } from "../../hooks/useLoaded";
import { BounceLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
// import useUpdateEffect from "../../hooks/useUpdateEffect";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useLocalStorage("dark", false);
  const loaded = useLoaded();

  // const [isDark, setIsDark] = useState<boolean>(
  //   localStorage.getItem("dark") == null
  //     ? false
  //     : JSON.parse(localStorage.getItem("dark")!)
  // );
  // const setTheme = (value: boolean) => {
  //   // window.localStorage.setItem("dark", value);
  //   setIsDark(value);
  // };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    // setTheme(isDark as unknown as string);
  };
  const [color, setColor] = useLocalStorage("color", "cyan");
  const setColors = (color: string) => {
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
    root.style.setProperty(
      "--color-primary-dark",
      `var(--color-${color}-dark)`
    );
    root.style.setProperty(
      "--color-primary-darker",
      `var(--color-${color}-darker)`
    );
    // setSelectedColor(color);
    // window.localStorage.setItem("color", color);
    setColor(color);
    //
  };
  useUpdateEffect(() => {
    setColors(color);
  }, []);

  return (
    <div className={isDark && loaded ? "dark" : "light"}>
      {/* // <!-- Loading screen --> */}
      {!loaded && (
        <div
          // x-ref="loading"

          className="fixed inset-0 z-50 flex items-center justify-center text-2xl font-semibold bg-white"
          // className="fixed inset-0 z-50 flex items-center justify-center text-2xl font-semibold text-white bg-primary-darker"
        >
          {/* Loading..... */}
          <BounceLoader size={50} color="#8b8d8d" speedMultiplier={3} />
        </div>
      )}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4 antialiased text-gray-900 bg-gray-100 dark:bg-dark dark:text-light">
        {/* <!-- Brand --> */}
        <a
          href="../index.html"
          className="inline-block mb-6 text-3xl font-bold tracking-wider uppercase text-primary-dark dark:text-light"
        >
          Architect
        </a>
        <main>
          <ToastContainer />
          {children}
        </main>
      </div>
      {/* <!-- Toggle dark mode button --> */}
      <div className="fixed bottom-5 left-5">
        <button
          aria-hidden="true"
          // @click="toggleTheme"
          onClick={toggleTheme}
          className="p-2 transition-colors duration-200 rounded-full shadow-md bg-primary hover:bg-primary-darker focus:outline-none focus:ring focus:ring-primary"
        >
          {isDark && loaded ? (
            <svg
              // x-show="isDark"
              className={`w-8 h-8 text-white`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          ) : (
            <svg
              // x-show="!isDark"
              className={`w-8 h-8 text-white`}
              // className="w-8 h-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
