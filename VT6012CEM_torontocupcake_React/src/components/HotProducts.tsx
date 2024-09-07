import React from "react";
import { useSelector } from "react-redux";
import ProductItem from "./ProductItem";
import { RootState } from "@/store";
import { ProductType } from "@/store/productSlice";

const HotProducts: React.FC = () => {
  const products = useSelector((state: RootState) =>
    state.products.products.filter((product) =>
      product.types.includes(ProductType.Hot)
    )
  );

  return (
    <section className="py-4">
      <div className="container mx-auto">
        <h2 className="text-center text-3xl font-bold mb-4">Hot Product</h2>
        <p className="text-center mb-8">
          $3.75 each | $21.50 half dozen | $41.50 dozen
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotProducts;
