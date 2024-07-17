import { Product } from "@/types/product.type";
import styles from "./Cart.module.scss";
import Image from "next/image";
import { convertIDR } from "@/utils/currency";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import { Fragment, useContext, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import userServices from "@/services/user";
import { ToasterContext } from "@/contexts/ToasterContext";
import { useSession } from "next-auth/react";
import productServices from "@/services/product";
import Link from "next/link";

const CartView = () => {
  const { setToaster } = useContext(ToasterContext);
  const session: any = useSession();
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  const getCart = async () => {
    const { data } = await userServices.getCart();
    setCart(data.data);
  };

  const getAllProducts = async () => {
    const { data } = await productServices.getAllProducts();
    setProducts(data.data);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    if (session.data?.accessToken) {
      getCart();
    }
  }, [session]);

  const getProduct = (id: string) => {
    const product: any = products.find((product: Product) => product.id === id);
    return product;
  };

  const getOptionsSize = (id: string, selected: string) => {
    const product: any = products.find((product: Product) => product.id === id);
    const options: any = product?.stock.map(
      (stock: { size: string; qty: number }) => {
        if (stock.qty > 0) {
          return {
            label: stock.size,
            value: stock.size,
            selected: stock.size === selected,
          };
        }
      }
    );
    const data = options?.filter((option: any) => option !== undefined);
    return data;
  };

  const getTotalPrize = () => {
    const total = cart.reduce(
      (acc: number, item: { id: string; size: string; qty: number }) => {
        const product: any = getProduct(item.id);
        return acc + parseInt(product?.price) * item.qty;
      },
      0
    );
    return total;
  };

  const handleDeleteCart = async (id: string, size: string) => {
    const newCart = cart.filter((item: { id: string; size: string }) => {
      return item.id !== id || item.size !== size;
    });
    try {
      const result = await userServices.addToCart({
        carts: newCart,
      });
      if (result.status === 200) {
        setCart(newCart);
        setToaster({
          variant: "success",
          message: "Success delete item",
        });
      }
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Item deleted failed",
      });
    }
  };

  return (
    <div className={styles.cart}>
      <div className={styles.cart__main}>
        <h1 className={styles.cart__main__title}>Cart</h1>
        {cart.length > 0 ? (
          <div className={styles.cart__main__list}>
            {cart.map((item: { id: string; size: string; qty: number }) => (
              <Fragment key={`${item.id}-${item.size}`}>
                <div className={styles.cart__main__list__item}>
                  {getProduct(item.id)?.image && (
                    <Image
                      src={`${getProduct(item.id)?.image}`}
                      width={150}
                      height={150}
                      alt={`${item.id}-${item.size}`}
                      className={styles.cart__main__list__item__image}
                    />
                  )}

                  <div className={styles.cart__main__list__item__info}>
                    <h4 className={styles.cart__main__list__item__info__title}>
                      {getProduct(item.id)?.name}
                    </h4>
                    <p
                      className={styles.cart__main__list__item__info__category}
                    >
                      {getProduct(item.id)?.category}
                    </p>

                    <div className={styles.cart__main__list__item__info__data}>
                      <label
                        className={
                          styles.cart__main__list__item__info__data__size
                        }
                      >
                        Size
                        <Select
                          name="size"
                          options={getOptionsSize(item.id, item.size)}
                          disabled
                        />
                      </label>
                      <label
                        className={
                          styles.cart__main__list__item__info__data__qty
                        }
                      >
                        Qty
                        <Input
                          className={
                            styles.cart__main__list__item__info__data__qty__input
                          }
                          name="qty"
                          type="number"
                          defaultValue={item.qty}
                          disabled
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      className={styles.cart__main__list__item__info__delete}
                      onClick={() => handleDeleteCart(item.id, item.size)}
                    >
                      <i className="bx bx-trash" />
                    </button>
                  </div>
                  <h4 className={styles.cart__main__list__item__price}>
                    {convertIDR(getProduct(item.id)?.price)}
                  </h4>
                </div>
                <hr className={styles.cart__main__list__divider} />
              </Fragment>
            ))}
          </div>
        ) : (
          <div className={styles.cart__main__empty}>
            <h1 className={styles.cart__main__empty__title}>Cart is empty</h1>
          </div>
        )}
      </div>
      <div className={styles.cart__summary}>
        <h1 className={styles.cart__summary__title}>Summary</h1>
        <div className={styles.cart__summary__item}>
          <h4>Subtotal</h4>
          <p>{convertIDR(getTotalPrize())}</p>
        </div>
        <div className={styles.cart__summary__item}>
          <h4>Delivery</h4>
          <p>{convertIDR(0)}</p>
        </div>
        <div className={styles.cart__summary__item}>
          <h4>Tax</h4>
          <p>{convertIDR(0)}</p>
        </div>
        <hr />
        <div className={styles.cart__summary__item}>
          <h4>Total</h4>
          <p>{convertIDR(getTotalPrize())}</p>
        </div>
        <hr />
        <Link href="/checkout">
          <Button type="button" className={styles.cart__summary__button}>
            Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CartView;
