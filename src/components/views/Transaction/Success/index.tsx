import Button from "@/components/ui/Button";
import styles from "./Success.module.scss";
import { useRouter } from "next/router";

const SuccessView = () => {
  const { push } = useRouter();
  return (
    <div className={styles.success}>
      <h1>Payment Success</h1>
      <h4>Thank you for your order!</h4>
      <Button type="button" onClick={() => push("/member/orders")}>
        Check Your Order Here
      </Button>
    </div>
  );
};

export default SuccessView;
