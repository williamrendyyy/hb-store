import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import userServices from "@/services/user";
import { User } from "@/types/user.type";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import styles from "./ModalUpdateUser.module.scss";
import { ToasterContext } from "@/contexts/ToasterContext";

type Proptypes = {
  updatedUser: User | any;
  setUpdatedUser: Dispatch<SetStateAction<{}>>;
  setUsersData: Dispatch<SetStateAction<User[]>>;
};
const ModalUpdateUser = (props: Proptypes) => {
  const { updatedUser, setUpdatedUser, setUsersData } = props;
  const { setToaster } = useContext(ToasterContext);

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form: any = event.target as HTMLFormElement;
    const data = {
      role: form.role.value,
    };

    const result = await userServices.updateUser(updatedUser.id, data);
    if (result.status === 200) {
      setIsLoading(false);
      setUpdatedUser({});
      const { data } = await userServices.getAllUsers();
      setUsersData(data.data);
      setToaster({
        variant: "success",
        message: "User updated successfully",
      });
    } else {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "User failed to updated",
      });
    }
  };
  return (
    <Modal onClose={() => setUpdatedUser({})}>
      <h1>Update User</h1>
      <form onSubmit={handleUpdateUser} className={styles.form}>
        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={updatedUser.email}
          disabled
          className={styles.form__input}
        />
        <Input
          label="Fullname"
          name="fullname"
          type="text"
          defaultValue={updatedUser.fullname}
          disabled
          className={styles.form__input}
        />
        <Input
          label="Phone"
          name="phone"
          type="number"
          defaultValue={updatedUser.phone}
          disabled
          className={styles.form__input}
        />
        <Select
          label="Role"
          name="role"
          defaultValue={updatedUser.role}
          options={[
            { label: "Member", value: "member" },
            { label: "Admin", value: "admin" },
          ]}
          className={styles.form__input}
        />
        <Button type="submit">{isLoading ? "Updating..." : "Update"}</Button>
      </form>
    </Modal>
  );
};

export default ModalUpdateUser;
