import Head from "next/head";
import HomeView from "@/components/views/Home";

export default function Home() {
  return (
    <>
      <Head>
        <title>Holly Beast Store</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <HomeView />
      </main>
    </>
  );
}

// const HomePage = () => {
//   return (
//     <>
//       <HomeView />
//     </>
//   );
// };

// export default HomePage;
