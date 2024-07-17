import CartView from "@/components/views/Cart";
import Head from "next/head";

const CartPage = () => {
  return (
    <>
      <Head>
        <title>Cart Page</title>
      </Head>
      <CartView />
    </>
  );
};

export default CartPage;
