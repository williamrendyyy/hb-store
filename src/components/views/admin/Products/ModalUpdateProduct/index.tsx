import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import styles from "./ModalUpdateProduct.module.scss";
import { Product } from "@/types/product.type";
import InputFile from "@/components/ui/InputFile";
import productServices from "@/services/product";
import { useSession } from "next-auth/react";
import { uploadFile } from "@/lib/firebase/service";
import Image from "next/image";

type Propypes = {
  updatedProduct: Product | any;
  setUpdatedProduct: Dispatch<SetStateAction<boolean>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  setProductsData: Dispatch<SetStateAction<Product[]>>;
};

const ModalUpdateProduct = (props: Propypes) => {
  const { updatedProduct, setUpdatedProduct, setToaster, setProductsData } =
    props;
  const [isLoading, setIsLoading] = useState(false);
  const [stokCount, setStokCount] = useState(updatedProduct.stock);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const session: any = useSession();
  console.log(updatedProduct);

  const handleStock = (e: any, i: number, type: string) => {
    const newStockCount: any = [...stokCount];
    newStockCount[i][type] = e.target.value;
    setStokCount(newStockCount);
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
            const result = await productServices.updateProduct(
              id,
              data,
              session.data?.accessToken
            );
            if (result.status === 200) {
              setProductsData(result.data.data);
              setUploadedImage(null);
              form.reset();
              setUpdatedProduct(false);
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

  const updateProduct = async (
    form: any,
    newImageURL: string = updatedProduct.image
  ) => {
    const data = {
      name: form.name.value,
      price: form.price.value,
      category: form.category.value,
      status: form.status.value,
      stock: stokCount,
      image: newImageURL,
    };
    const result = await productServices.updateProduct(
      updatedProduct.id,
      data,
      session.data?.accessToken
    );
    if (result.status === 200) {
      setProductsData(result.data.data);
      setUploadedImage(null);
      form.reset();
      setUpdatedProduct(false);
      const { data } = await productServices.getAllProducts();
      setProductsData(data.data);
      setToaster({
        variant: "success",
        message: "Product updated successfully",
      });
    } else {
      setToaster({
        variant: "danger",
        message: "Product failed to update",
      });
    }
  };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form: any = event.target as HTMLFormElement;
    const file = form.image.files[0];

    if (file) {
      const newName = "main." + file.name.split(".")[1];
      uploadFile(
        updatedProduct.id,
        file,
        newName,
        "products",
        async (status: boolean, newImageURL: string) => {
          if (status) {
            updateProduct(form, newImageURL);
          } else {
            setToaster({
              variant: "danger",
              message: "Product failed to update",
            });
          }
        }
      );
    } else {
      updateProduct(form);
    }
  };

  return (
    <Modal onClose={() => setUpdatedProduct(false)}>
      <h1>Update User</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Name"
          name="name"
          type="text"
          placeholder="Insert product name"
          defaultValue={updatedProduct.name}
        />
        <Input
          label="Price"
          name="price"
          type="number"
          placeholder="Insert price"
          defaultValue={updatedProduct.price}
        />
        <Select
          label="Category"
          name="category"
          options={[
            { label: "Men", value: "men" },
            { label: "Women", value: "women" },
          ]}
          defaultValue={updatedProduct.category}
        />
        <Select
          label="Status"
          name="status"
          options={[
            { label: "Released", value: "true" },
            { label: "Not Released", value: "false" },
          ]}
          defaultValue={updatedProduct.status}
        />
        <label htmlFor="image">Image</label>
        <div className={styles.form__image}>
          <Image
            width={200}
            height={200}
            src={
              uploadedImage
                ? URL.createObjectURL(uploadedImage)
                : updatedProduct.image
            }
            alt="image"
            className={styles.form__image__preview}
          />
          <InputFile
            name="image"
            uploadedImage={uploadedImage}
            setUploadedImage={setUploadedImage}
          />
        </div>
        <label htmlFor="stock">Stock</label>
        {stokCount.map((item: { size: string; qty: number }, i: number) => (
          <div className={styles.form__stock} key={i}>
            <div className={styles.form__stock__item}>
              <Input
                label="Size"
                name="size"
                type="text"
                placeholder="Insert size"
                onChange={(e) => {
                  handleStock(e, i, "size");
                }}
                defaultValue={item.size}
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
                defaultValue={item.qty}
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          className={styles.form__stock__button}
          onClick={() => setStokCount([...stokCount, { size: "", qty: 0 }])}
        >
          Add New Stock
        </Button>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Update Product"}
        </Button>
      </form>
    </Modal>
  );
};

export default ModalUpdateProduct;
