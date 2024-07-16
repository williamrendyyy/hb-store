import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import userServices from "@/services/user";
import styles from "./ModalDeleteUser.module.scss";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { User } from "@/types/user.type";
import { ToasterContext } from "@/contexts/ToasterContext";

type Proptypes = {
  deletedUser: User | any;
  setDeletedUser: Dispatch<SetStateAction<{}>>;
  setUsersData: Dispatch<SetStateAction<User[]>>;
};

const ModalDeleteUser = (props: Proptypes) => {
  const { deletedUser, setDeletedUser, setUsersData } = props;
  const { setToaster } = useContext(ToasterContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const result = await userServices.deleteUser(deletedUser.id);
    if (result.status === 200) {
      setIsLoading(false);
      setToaster({
        variant: "success",
        message: "User deleted successfully",
      });
      setDeletedUser({});
      const { data } = await userServices.getAllUsers();
      setUsersData(data.data);
    } else {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "User failed to deleted",
      });
    }
  };
  return (
    <Modal onClose={() => setDeletedUser({})}>
      <h1 className={styles.modal__title}>Are You Sure?</h1>
      <Button type="button" onClick={() => handleDelete()}>
        {isLoading ? "Deleting..." : "Delete"}
      </Button>
    </Modal>
  );
};

export default ModalDeleteUser;
