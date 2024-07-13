export type Product = {
  id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  category: string;
  created_at: Date;
  updated_at: Date;
  stock: [
    {
      size: string;
      qty: number;
    }
  ];
};
