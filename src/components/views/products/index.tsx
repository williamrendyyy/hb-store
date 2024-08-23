import styles from "./Products.module.scss";
import { Product } from "@/types/product.type";
import Card from "./Card";
import Link from "next/link";

type PropTypes = {
  products: Product[];
};

const ProductView = (props: PropTypes) => {
  const { products } = props;
  return (
    <>
      <div className={styles.product}>
        <div className={styles.product__title}>
          All Product ({products.length})
        </div>
        <div className={styles.product__main}>
          <div className={styles.product__main__content}>
            {products.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <Card product={product} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductView;
