import Head from "next/head";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";
import MainLayout from "@/Layout/MainLayout";
import { QueryClientProvider, QueryClient } from "react-query";
// import { ReactQueryDevtools } from "react-query/devtools";

function MyApp({ Component, pageProps }) {
  const Layout = Component?.Layout || MainLayout;

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <>
      <Head>
        <title>Rojgar</title>
        <meta name="description" content="Online job portal" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <div>
          <Toaster />
        </div>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
