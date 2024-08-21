import Toaster from "@/components/ui/Toaster";
import { Lato } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../Navbar";
import { Dispatch, SetStateAction, useContext, useEffect } from "react";
import { ToasterContext } from "@/contexts/ToasterContext";
import { ToasterType } from "@/types/toaster.type";
import Footer from "../Footer";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

const disableNavbar = ["auth", "admin", "member"];
const disableFooter = ["auth", "admin", "member"];

type Propstypes = {
  children: React.ReactNode;
};

const AppShell = (props: Propstypes) => {
  const { children } = props;
  const { pathname } = useRouter();
  const { toaster }: ToasterType = useContext(ToasterContext);

  return (
    <>
      <Head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </Head>
      <div className={lato.className}>
        {!disableNavbar.includes(pathname.split("/")[1]) && <Navbar />}
        {children}
        {Object.keys(toaster).length > 0 && <Toaster />}
        {!disableFooter.includes(pathname.split("/")[1]) && <Footer />}
      </div>
    </>
  );
};

export default AppShell;
