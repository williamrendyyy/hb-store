import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";
import styles from "./ModalAddProduct.module.scss";
import { Product } from "@/types/product.type";
import InputFile from "@/components/ui/InputFile";
import productServices from "@/services/product";
import { uploadFile } from "@/lib/firebase/service";
import Image from "next/image";
import { ToasterContext } from "@/contexts/ToasterContext";

type Propypes = {
  setModalAddProduct: Dispatch<SetStateAction<boolean>>;
  setProductsData: Dispatch<SetStateAction<Product[]>>;
};

const ModalAddProduct = (props: Propypes) => {
  const { setModalAddProduct, setProductsData } = props;
  const { setToaster } = useContext(ToasterContext);
  const [isLoading, setIsLoading] = useState(false);
  const [stockCount, setStockCount] = useState([{ size: "", qty: 0 }]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleStock = (e: any, i: number, type: string) => {
    const newStockCount: any = [...stockCount];
    newStockCount[i][type] = e.target.value;
    setStockCount(newStockCount);
  };

  const uploadImage = (id: string, form: any) => {
    const file = form.image.files[0];
    const newName = "main." + file.name.split(".")[1];
    if (file) {
      uploadFile(
        id,
        file,
        newName,
        "products",
        async (status: boolean, newImageURL: string) => {
          if (status) {
            const data = {
              image: newImageURL,
            };
            const result = await productServices.updateProduct(id, data);
            if (result.status === 200) {
              setProductsData(result.data.data);
              setUploadedImage(null);
              form.reset();
              setModalAddProduct(false);
              const { data } = await productServices.getAllProducts();
              setProductsData(data.data);
              setToaster({
                variant: "success",
                message: "Product added successfully",
              });
            } else {
              setToaster({
                variant: "danger",
                message: "Product failed to add",
              });
            }
          } else {
            setToaster({
              variant: "danger",
              message: "Product failed to add",
            });
          }
        }
      );
    }
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form: any = event.target as HTMLFormElement;
    const stock = stockCount.map((stock) => {
      return {
        size: stock.size,
        qty: parseInt(`${stock.qty}`),
      };
    });
    const data = {
      name: form.name.value,
      price: parseInt(form.price.value),
      description: form.description.value,
      category: form.category.value,
      status: form.status.value,
      stock: stock,
      image: "",
    };

    const result = await productServices.addProduct(data);

    if (result.status === 200) {
      uploadImage(result.data.data.id, form);
    }
  };

  return (
    <Modal onClose={() => setModalAddProduct(false)}>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="Insert product name"
          className={styles.form__input}
        />
        <Input
          label="Price"
          name="price"
          type="number"
          placeholder="Insert product price"
          className={styles.form__input}
        />
        <Input
          label="Description"
          name="description"
          type="text"
          placeholder="Insert product description"
          className={styles.form__input}
        />
        <Select
          label="Category"
          name="category"
          options={[
            { label: "Men", value: "Men's Shoes" },
            { label: "Women", value: "Women's Shoes" },
          ]}
          className={styles.form__input}
        />
        <Select
          className={styles.form__input}
          label="Status"
          name="status"
          options={[
            { label: "Released", value: "true" },
            { label: "Not Released", value: "false" },
          ]}
        />
        <label htmlFor="image">Image</label>
        <div className={styles.form__image}>
          {uploadedImage ? (
            <Image
              src={URL.createObjectURL(uploadedImage)}
              alt="image"
              width={100}
              height={100}
            />
          ) : (
            <div className={styles.form__image__placeholder}>No Image</div>
          )}
          <InputFile
            name="image"
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
          />
        </div>
        <label htmlFor="stock">Stock</label>
        {stockCount.map((item: { size: string; qty: number }, i: number) => (
          <div className={styles.form__stock} key={i}>
            <div className={styles.form__stock__item}>
              <Input
                label="Size"
                name="size"
                type="text"
                placeholder="Insert Size"
                className={styles.form__input}
                onChange={(e) => {
                  handleStock(e, i, "size");
                }}
              />
            </div>
            <div className={styles.form__stock__item}>
              <Input
                label="Qty"
                name="qty"
                type="number"
                placeholder="Insert Quantity"
                onChange={(e) => {
                  handleStock(e, i, "qty");
                }}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          className={styles.form__stock__button}
          onClick={() => setStockCount([...stockCount, { size: "", qty: 0 }])}
        >
          Add New Stock
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Add Product"}
        </Button>
      </form>
    </Modal>
  );
};

export default ModalAddProduct;
