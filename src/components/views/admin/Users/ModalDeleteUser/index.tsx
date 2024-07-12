import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import userServices from "@/services/user";
import styles from "./ModalDeleteUser.module.scss";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useState } from "react";
import { User } from "@/types/user.type";

type Proptypes = {
  deletedUser: any;
  setDeletedUser: Dispatch<SetStateAction<{}>>;
  setUsersData: Dispatch<SetStateAction<User[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
};

const ModalDeleteUser = (props: Proptypes) => {
  const { deletedUser, setDeletedUser, setUsersData, setToaster, session } =
    props;
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const result = await userServices.deleteUser(
      deletedUser.id,
      session.data?.accessToken
    );
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
