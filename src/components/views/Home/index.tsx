import Button from "@/components/ui/Button";
import styles from "./Home.module.scss";
import Link from "next/link";
import Image from "next/image";

const HomeView = () => {
  return (
    <>
      <div className={styles.home}>
        <div className={styles.home__text}>
          <h1 className={styles.home__text__title}>
            Discover our Curated Collection
          </h1>
          <p className={styles.home__text__subtitle}>
            Explore our carefully selected products for your home and lifestyle.
          </p>
          <Link href="/products">
            <Button type="button" className={styles.home__button}>
              Shop Now
            </Button>
          </Link>
        </div>
        <div className={styles.home__image}>
          <Image
            src="/icon.png"
            alt="sneakers"
            width="600"
            height="600"
            className={styles.home__image__icon}
          />
        </div>
      </div>

      <div className={styles.home}>
        <div className={styles.home__text}>
          <h1 className={styles.home__text__title}>Home View</h1>
        </div>
      </div>
    </>
  );
};

export default HomeView;
