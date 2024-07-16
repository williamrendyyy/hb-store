import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import styles from "./ModalDeleteProduct.module.scss";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import productServices from "@/services/product";
import { Product } from "@/types/product.type";
import { deleteFile } from "@/lib/firebase/service";
import { ToasterContext } from "@/contexts/ToasterContext";

type Proptypes = {
  deletedProduct: Product | any;
  setDeletedProduct: Dispatch<SetStateAction<{}>>;
  setProductsData: Dispatch<SetStateAction<Product[]>>;
};

const ModalDeleteProduct = (props: Proptypes) => {
  const { deletedProduct, setDeletedProduct, setProductsData } = props;
  const { setToaster } = useContext(ToasterContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    const result = await productServices.deleteProduct(deletedProduct.id);
    if (result.status === 200) {
      setIsLoading(false);
      deleteFile(
        `/images/products/${deletedProduct.id}/${
          deletedProduct.image.split("%2F")[3].split("?")[0]
        }`,
        async (status: boolean) => {
          if (status) {
            setToaster({
              variant: "success",
              message: "Product deleted successfully",
            });
            setDeletedProduct({});
            const { data } = await productServices.getAllProducts();
            setProductsData(data.data);
          }
        }
      );
    } else {
      setIsLoading(false);
      setToaster({
        variant: "danger",
        message: "Product failed to deleted",
      });
    }
  };
  return (
    <Modal onClose={() => setDeletedProduct({})}>
      <h1 className={styles.modal__title}>Are You Sure?</h1>
      <Button type="button" onClick={() => handleDelete()}>
        {isLoading ? "Deleting..." : "Delete"}
      </Button>
    </Modal>
  );
};

export default ModalDeleteProduct;
