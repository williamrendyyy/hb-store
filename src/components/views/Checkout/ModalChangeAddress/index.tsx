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
  const [updateAddress, setUpdateAddress] = useState<number>();
  const { setToaster } = useContext(ToasterContext);

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    let data;
    if (profile.address) {
      data = {
        address: [
          ...profile.address,
          {
            recipient: form.recipient.value,
            phone: form.phone.value,
            addressLine: form.addressLine.value,
            note: form.note.value,
            isMain: false,
          },
        ],
      };
    } else {
      data = {
        address: [
          {
            recipient: form.recipient.value,
            phone: form.phone.value,
            addressLine: form.addressLine.value,
            note: form.note.value,
            isMain: true,
          },
        ],
      };
    }
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

  const handleDeleteAddress = async (id: number) => {
    const address = profile.address;
    address.splice(id, 1);
    const data = {
      address,
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
        setToaster({
          variant: "success",
          message: "Delete Address Success",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "Delete Address Failed",
      });
    }
  };

  const handleChangeMainAddress = async (id: number) => {
    const address = profile.address;
    address.forEach((item: { isMain: boolean }, index: number) => {
      if (index === id) {
        item.isMain = true;
      } else {
        item.isMain = false;
      }
    });
    const data = {
      address,
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
        setToaster({
          variant: "success",
          message: "Change Main Address Success",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "Change Main Address Failed",
      });
    }
  };

  const handleChangeAddress = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const address = profile.address;
    const id = updateAddress || 0;
    address[id] = {
      recipient: form.recipient.value,
      phone: form.phone.value,
      addressLine: form.addressLine.value,
      note: form.note.value,
      isMain: false,
    };
    const data = {
      address,
    };

    try {
      const result = await userServices.updateProfile(data);
      if (result.status === 200) {
        setIsLoading(false);
        setUpdateAddress(undefined);
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
      <h2 className={styles.modal__title}>Select Address</h2>
      {profile?.address?.map((item: any, id: number) => (
        <div key={item.addresLine}>
          <div
            className={`${styles.modal__address} ${
              id === selectedAddress ? styles["modal__address--active"] : ""
            }`}
          >
            <div
              className={styles.modal__address__info}
              onClick={() => {
                setSelectedAddress(id);
                setChangeAddress(false);
              }}
            >
              <h2 className={styles.modal__address__info__title}>
                {item.recipient}
              </h2>
              <p>Phone: {item.phone}</p>
              <p>Address: {item.addressLine}</p>
              <p>Note: {item.note}</p>
            </div>

            <div className={styles.modal__address__action}>
              <Button
                type="button"
                className={styles.modal__address__action__delete}
                onClick={() => handleDeleteAddress(id)}
                disabled={isLoading || id === selectedAddress}
              >
                <i className="bx bx-trash-alt" />
              </Button>

              <Button
                type="button"
                className={styles.modal__address__action__change}
                onClick={() => handleChangeMainAddress(id)}
                disabled={isLoading || item.isMain}
              >
                <i className="bx bx-pin" />
              </Button>

              <Button
                type="button"
                className={styles.modal__address__action__change}
                onClick={() =>
                  id === updateAddress
                    ? setUpdateAddress(undefined)
                    : setUpdateAddress(id)
                }
                disabled={isLoading}
              >
                <i className="bx bx-edit" />
              </Button>
            </div>
          </div>

          {id === updateAddress && (
            <div className={styles.modal__form}>
              <form
                className={styles.modal__form__group}
                onSubmit={handleChangeAddress}
              >
                <Input
                  type="text"
                  label="Recipient"
                  name="recipient"
                  placeholder="Recipient"
                  defaultValue={item.recipient}
                />
                <Input
                  type="text"
                  label="Number Phone"
                  name="phone"
                  placeholder="Insert Number Phone"
                  defaultValue={item.phone}
                />
                <Textarea
                  name="addressLine"
                  placeholder="Insert Address"
                  label="Address Line"
                  defaultValue={item.addressLine}
                />
                <Input
                  type="text"
                  name="note"
                  placeholder="Insert Detail Address"
                  label="Note"
                  defaultValue={item.note}
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
