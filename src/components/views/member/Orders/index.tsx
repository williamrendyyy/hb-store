import MemberLayout from "@/components/layouts/MemberLayout";
import Button from "@/components/ui/Button";
import styles from "./Orders.module.scss";
import { useEffect, useState } from "react";
import { User } from "@/types/user.type";
import userServices from "@/services/user";
import { convertIDR } from "@/utils/currency";
import Script from "next/script";
import ModalDetailOrder from "./ModalDetailOrder";
import productServices from "@/services/product";

const MemberOrdersView = () => {
  const [profile, setProfile] = useState<User | any>({});
  const [detailOrder, setDetailOrder] = useState<any>({});
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    const { data } = await productServices.getAllProducts();
    setProducts(data.data);
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const getProfile = async () => {
    const { data } = await userServices.getProfile();
    setProfile(data.data);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <>
      <Script
        src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <MemberLayout>
        <div className={styles.orders}>
          <h1>Orders History</h1>
          <table className={styles.orders__table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {profile?.transaction?.map((transaction: any, index: number) => (
                <tr key={transaction.order_id}>
                  <td>{index + 1}</td>
                  <td>{transaction.order_id}</td>
                  <td>{convertIDR(transaction.total)}</td>
                  <td>{transaction.status}</td>
                  <td>
                    <div className={styles.orders__table__action}>
                      <Button
                        type="button"
                        onClick={() => setDetailOrder(transaction)}
                        className={styles.orders__table__action__edit}
                      >
                        <i className="bx bx-dots-vertical-rounded" />
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          window.snap.pay(transaction.token);
                        }}
                        className={styles.orders__table__action__payment}
                        disabled={transaction.status !== "pending"}
                      >
                        <i className="bx bx-money" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </MemberLayout>
      {Object.keys(detailOrder).length > 0 && (
        <ModalDetailOrder
          setDetailOrder={setDetailOrder}
          detailOrder={detailOrder}
          products={products}
        />
      )}
    </>
  );
};

export default MemberOrdersView;
