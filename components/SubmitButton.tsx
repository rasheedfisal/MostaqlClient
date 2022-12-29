type Props = {
  title: string;
  clicked: boolean;
  loadingTitle: string;
  icon: JSX.Element;
};
const SubmitButton = ({ title, clicked, loadingTitle, icon }: Props) => {
  return (
    <button
      type="submit"
      className={
        clicked
          ? "inline-flex justify-center items-center w-full py-4 font-medium text-center text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker"
          : "w-full py-4 font-medium text-center text-white transition-colors duration-200 rounded-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-darker"
      }
      disabled={clicked}
    >
      <div className="flex flex-row items-center justify-center">
        {clicked ? (
          <>
            <svg
              className="w-6 h-6 mr-3 -ml-1 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <div className="font-bold">{loadingTitle}</div>
          </>
        ) : (
          <>
            <div className="mr-2">{icon}</div>
            <div className="font-bold">{title}</div>
          </>
        )}
      </div>
    </button>
  );
};

export default SubmitButton;
