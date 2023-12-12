import HeroSection from "@/component/HeroSection";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Rojgar</title>
        <meta name="description" content="Revolutionizing Talent Acquisition" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <HeroSection />
    </>
  );
}
