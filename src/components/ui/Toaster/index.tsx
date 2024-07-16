import { useContext, useEffect, useRef, useState } from "react";
import styles from "./Toaster.module.scss";
import { ToasterContext } from "@/contexts/ToasterContext";
import { ToasterType } from "@/types/toaster.type";

const toasterVariant: any = {
  success: {
    title: "Success!",
    icon: "bx-check-circle",
    color: "#9FE6A0",
    barColor: "#4AA96C",
  },
  danger: {
    title: "Error!",
    icon: "bx-check-circle",
    color: "#FA9494",
    barColor: "#EB1D36",
  },
  warning: {
    title: "Warning!",
    icon: "bx-check-circle",
    color: "#F6E9B2",
    barColor: "#F3CA52",
  },
};
const Toaster = () => {
  const { toaster, setToaster }: ToasterType = useContext(ToasterContext);
  const [lengthBar, setLengthBar] = useState(100);
  const timerRef = useRef<any>(null);

  const timerStart = () => {
    timerRef.current = setInterval(() => {
      setLengthBar((prevLength) => prevLength - 0.14);
    }, 1);
  };

  useEffect(() => {
    timerStart();
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (lengthBar < 0) {
      setToaster({});
    }
  }, [lengthBar, setToaster]);

  return (
    <div
      className={`${styles.toaster} ${styles[`toaster--${toaster.variant}`]}`}
    >
      <div className={styles.toaster__main}>
        <div className={styles.toaster__main__icon}>
          <i
            className={`bx ${toasterVariant[`${toaster.variant}`].icon}`}
            style={{ color: toasterVariant[`${toaster.variant}`].barColor }}
          />
        </div>
        <div className={styles.toaster__main__text}>
          <p className={styles.toaster__main__text__title}>
            {toasterVariant[`${toaster.variant}`].title}
          </p>
          <p className={styles.toaster__main__text__message}>
            {toaster.message}
          </p>
        </div>
        <i
          className={`bx bx-x ${styles.toaster__main__close}`}
          onClick={() => setToaster("")}
        />
      </div>
      <div
        className={`${styles.toaster__timer}`}
        style={{ backgroundColor: toasterVariant[`${toaster.variant}`].color }}
      >
        <div
          style={{
            width: `${lengthBar}%`,
            height: "100%",
            backgroundColor: toasterVariant[`${toaster.variant}`].barColor,
          }}
        />
      </div>
    </div>
  );
};
export default Toaster;
