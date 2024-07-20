import Button from "@/components/ui/Button";
import styles from "./Success.module.scss";

const SuccessView = () => {
  return (
    <div className={styles.success}>
      <h1>Payment Success</h1>
      <h4>Thank you for your order!</h4>
      <Button type="button">Check Order Here</Button>
    </div>
  );
};

export default SuccessView;
