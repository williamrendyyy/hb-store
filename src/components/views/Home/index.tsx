import Button from "@/components/ui/Button";
import styles from "./Home.module.scss";
import Link from "next/link";

const HomeView = () => {
  return (
    <div className={styles.home}>
      <h1>Hello Guys</h1>
      <Link href={"/products"}>
        <Button className={styles.home__button} type="button">
          Order Here!
        </Button>
      </Link>
    </div>
  );
};

export default HomeView;
