import { Product } from "@/types/product.type";
import styles from "./DetailProduct.module.scss";
import Image from "next/image";
import { convertIDR } from "@/utils/currency";
import Button from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import userServices from "@/services/user";
import { ToasterContext } from "@/contexts/ToasterContext";
import Link from "next/link";

const DetailItem = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "/",
    url: "/",
  },
  {
    title: " Products",
    url: "/products",
  },
];
type PropTypes = {
  product: Product | any;
  cart: any;
  productId: string | string[] | undefined;
};

const DetailProductView = (props: PropTypes) => {
  const { product, cart, productId } = props;
  const { setToaster } = useContext(ToasterContext);
  const { status }: any = useSession();
  const router = useRouter();
  const { pathname, push } = useRouter();
  const [selectedSize, setSelectedSize] = useState("");

  const handleAddToCart = async () => {
    let newCart = [];
    if (selectedSize !== "") {
      if (
        cart.filter(
          (item: any) => item.id === productId && item.size === selectedSize
        ).length > 0
      ) {
        newCart = cart.map((item: any) => {
          if (item.id === productId && item.size === selectedSize) {
            item.qty += 1;
          }
          return item;
        });
      } else {
        newCart = [
          ...cart,
          {
            id: productId,
            size: selectedSize,
            qty: 1,
          },
        ];
      }
      try {
        const result = await userServices.addToCart({
          carts: newCart,
        });
        if (result.status === 200) {
          setSelectedSize("");
          setToaster({
            variant: "success",
            message: "Successfully added to cart",
          });
        }
      } catch (error) {
        setToaster({
          variant: "danger",
          message: "Failed to add to cart",
        });
      }
    }
  };

  return (
    <>
      <div className={styles.detail}>
        <div className={styles.detail__title}>
          {DetailItem.map((item) => (
            <Link
              key={`title-${item.title}`}
              className={`${styles.detail__title__text} ${
                pathname === item.url && styles["detail__title__text__active"]
              }`}
              href={item.url}
            >
              {item.title}
            </Link>
          ))}

          <p className={styles.detail__title__text}> / </p>
          <h1 className={styles.detail__title__text}>{product?.name}</h1>
        </div>
        <div className={styles.detail__main}>
          <div className={styles.detail__main__left}>
            <Image
              src={product?.image}
              alt={product?.name}
              width={500}
              height={500}
              className={styles.detail__main__left__image}
            />
          </div>
          <div className={styles.detail__main__right}>
            <h1>{product?.name}</h1>
            <h3 className={styles.detail__main__right__category}>
              {product?.category}
            </h3>
            <p></p>
            <h3 className={styles.detail__main__right__price}>
              {convertIDR(product?.price)}
            </h3>
            <p className={styles.detail__main__right__description}>
              {product?.description}
            </p>
            <p className={styles.detail__main__right__subtitle}>
              Sizes Available
            </p>
            <div className={styles.detail__main__right__size}>
              {product?.stock?.map((item: { size: string; qty: number }) => (
                <div
                  className={styles.detail__main__right__size__item}
                  key={item.size}
                >
                  <input
                    className={styles.detail__main__right__size__item__input}
                    type="radio"
                    id={`size-${item.size}`}
                    name="size"
                    disabled={item.qty === 0}
                    onClick={() => setSelectedSize(item.size)}
                    checked={selectedSize === item.size}
                  />
                  <label
                    className={styles.detail__main__right__size__item__label}
                    htmlFor={`size-${item.size}`}
                  >
                    {item.size}
                  </label>
                </div>
              ))}
            </div>
            <Button
              className={styles.detail__main__right__add}
              type={status === "authenticated" ? "submit" : "button"}
              onClick={() => {
                status === "unauthenticated"
                  ? router.push(`/auth/login?callbackUrl=${router.asPath}`)
                  : handleAddToCart();
              }}
            >
              Add To Cart
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailProductView;
