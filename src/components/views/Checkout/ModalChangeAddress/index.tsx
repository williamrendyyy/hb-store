import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import styles from "./ModalChangeAddress.module.scss";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import userServices from "@/services/user";
import { ToasterContext } from "@/contexts/ToasterContext";
import { profile } from "console";

type Proptypes = {
  profile: any;
  setChangeAddress: Dispatch<SetStateAction<boolean>>;
  setSelectedAddress: Dispatch<SetStateAction<number>>;
  setProfile: Dispatch<SetStateAction<{}>>;
  selectedAddress: number;
};

const ModalChangeAddress = (props: Proptypes) => {
  const {
    profile,
    setProfile,
    setChangeAddress,
    setSelectedAddress,
    selectedAddress,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isAddNew, setIsAddNew] = useState(false);
  const { setToaster } = useContext(ToasterContext);

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      address: [
        ...profile.address,
        {
          recipient: form.recipient.value,
          phone: form.phone.value,
          addressLine: form.addressLine.value,
          note: form.note.value,
        },
      ],
    };
    try {
      const result = await userServices.updateProfile(data);
      if (result.status === 200) {
        setIsLoading(false);
        setIsAddNew(false);
        setProfile({
          ...profile,
          address: data.address,
        });
        form.reset();
        setToaster({
          variant: "success",
          message: "Add New Address Success",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "Add New Address Failed",
      });
    }
  };
  return (
    <Modal onClose={() => setChangeAddress(false)}>
      <h1 className={styles.modal__title}>Change Address</h1>
      {profile.address.map((item: any, id: number) => (
        <div
          key={item.addresLine}
          className={`${styles.modal__address} ${
            id === selectedAddress ? styles["modal__address--active"] : ""
          }`}
          onClick={() => {
            setSelectedAddress(id);
            setChangeAddress(false);
          }}
        >
          <h3 className={styles.modal__address__title}>{item.recipient}</h3>
          <p>Phone: {item.phone}</p>
          <p>Address: {item.addressLine}</p>
          <p>Note: {item.note}</p>
        </div>
      ))}
      <Button
        className={styles.modal__button}
        type="button"
        onClick={() => setIsAddNew(!isAddNew)}
      >
        {isAddNew ? "Cancel" : "Add New Address"}
      </Button>
      {isAddNew && (
        <div className={styles.modal__form}>
          <form
            className={styles.modal__form__group}
            onSubmit={handleAddAddress}
          >
            <Input
              type="text"
              label="Recipient"
              name="recipient"
              placeholder="Recipient"
            />
            <Input
              type="text"
              label="Number Phone"
              name="phone"
              placeholder="Insert Number Phone"
            />
            <Textarea
              name="addressLine"
              placeholder="Insert Address"
              label="Address Line"
            />
            <Input
              type="text"
              name="note"
              placeholder="Insert Detail Address"
              label="Note"
            />
            <Button
              className={styles.modal__button}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
};

export default ModalChangeAddress;
