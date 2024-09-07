import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import cartSlice, { addToCart } from "@/store/cartSlice";
import { Product } from "@/store/productSlice";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.cart);
  const [quantity, setQuantity] = useState(1);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (quantity > 0) {
      dispatch(addToCart({ product, quantity }));
      setQuantity(1);
      setShowAddedToCart(true);
      setTimeout(() => setShowAddedToCart(false), 3000); // Hide after 3 seconds
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    setQuantity(isNaN(newQuantity) ? 1 : Math.max(1, newQuantity));
  };

  return (
    <Card className="w-full h-full flex flex-col justify-between relative">
      <CardContent className="pt-6 flex flex-col items-center">
        <ProductImage product={product} />
        <ProductInfo product={product} />
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <QuantityInput quantity={quantity} onChange={handleQuantityChange} />
        <AddToCartButton onClick={handleAddToCart} />
      </CardFooter>
      {showAddedToCart && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center p-4">
          <p className="text-lg font-bold mb-2">Item(s) added to My Cart</p>
          <Link to={"/cart"}>
            <Button className="mt-2">View Cart</Button>
          </Link>
          <Button
            variant={"outline"}
            className="mt-2"
            onClick={() => {
              setShowAddedToCart(false);
            }}
          >
            Continues to shopping
          </Button>
        </div>
      )}
    </Card>
  );
};

const ProductImage: React.FC<{ product: Product }> = ({ product }) => (
  <Dialog>
    <DialogTrigger asChild>
      <img
        src={product.image}
        alt={product.name}
        className="w-32 h-32 object-contain mb-2 cursor-pointer"
      />
    </DialogTrigger>
    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-center">{product.name}</DialogTitle>
      </DialogHeader>
      <ProductDetails product={product} />
      <p className="text-center text-sm text-gray-500 mt-4">
        Touch or click anywhere to close
      </p>
    </DialogContent>
  </Dialog>
);

const ProductDetails: React.FC<{ product: Product }> = ({ product }) => (
  <div className="flex flex-col items-center">
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
      <img
        src={product.image}
        alt={product.name}
        className="w-64 h-64 object-contain"
      />
      {product.image2 && (
        <img
          src={product.image2}
          alt={`${product.name} - Additional View`}
          className="w-64 h-64 object-contain"
        />
      )}
    </div>
    {product.description ? (
      <p className="text-center max-w-md">{product.description}</p>
    ) : (
      <p className="text-center text-gray-500 italic">
        No description available.
      </p>
    )}
    <p className="font-bold mt-2">${product.price.toFixed(2)}</p>
  </div>
);

const ProductInfo: React.FC<{ product: Product }> = ({ product }) => (
  <div className="text-center">
    <h3 className="text-sm mb-1">{product.name}</h3>
    <p className="font-bold mb-2">${product.price.toFixed(2)}</p>
  </div>
);

const QuantityInput: React.FC<{
  quantity: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ quantity, onChange }) => (
  <Input
    type="number"
    min="1"
    value={quantity}
    onChange={onChange}
    className="w-20 text-center"
  />
);

const AddToCartButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <Button onClick={onClick} className="w-full">
    ADD TO CART
  </Button>
);

export default ProductItem;
