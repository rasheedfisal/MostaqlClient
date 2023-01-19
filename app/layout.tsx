import { StateContextProvider } from "../context/AppConext";
import ReactQueryWrapper from "./ReactQueryWrapper";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>Architect</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <script>0</script>
        <ReactQueryWrapper>
          <StateContextProvider>{children}</StateContextProvider>
        </ReactQueryWrapper>
      </body>
    </html>
  );
}
