import Button from "@/components/ui/Button";
import styles from "./Home.module.scss";
import Link from "next/link";

const HomeView = () => {
  return (
    <div className={styles.home}>
      <div className={styles.home__image}>
        <div className={styles.home__image__text}>
          <h1>Hello </h1>
          <h1>Sneakerhead!! </h1>
          <Link href={"/products"}>
            <Button className={styles.home__image__text__button} type="button">
              Choose Your Sneakers!
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
