import React, { useState, useEffect } from "react";
import { RootState } from "@/store";
import { removeFromCart, updateCartItemQuantity } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  const cart = useAppSelector((state: RootState) => state.cart);
  const dispatch = useAppDispatch();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (selectAll) {
      setSelectedItems(cart.items.map((item) => item.id));
    } else if (selectedItems.length === cart.items.length) {
      setSelectAll(true);
    }
  }, [cart.items, selectAll]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(
        updateCartItemQuantity({ id: productId, quantity: newQuantity })
      );
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
    setSelectedItems(selectedItems.filter((id) => id !== productId));
  };

  const handleItemSelect = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedItems(cart.items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const totalItems = selectedItems.reduce((sum, id) => {
    const item = cart.items.find((item) => item.id === id);
    return sum + (item ? item.quantity : 0);
  }, 0);

  const totalPrice = selectedItems.reduce((sum, id) => {
    const item = cart.items.find((item) => item.id === id);
    return sum + (item ? item.price * item.quantity : 0);
  }, 0);

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h2 className="text-xl font-semibold mb-4">
            Your shopping cart is empty.
          </h2>
          <Link
            to="/products"
            className="bg-pink-300 text-white py-2 px-4 rounded hover:bg-pink-400 transition-colors"
          >
            Continue to Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-4/6 mx-auto p-4">
      <div className="bg-pink-200 p-4 mb-4 flex items-center">
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h1 className="text-2xl font-bold">My Cart</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <span className="ml-2">Select All</span>
              </th>
              <th className="py-2 px-4 text-left">Product</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Quantity</th>
              <th className="py-2 px-4 text-left">Sub Total</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {cart.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-4 px-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemSelect(item.id)}
                  />
                </td>
                <td className="py-4 px-4 flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <span>{item.name}</span>
                </td>
                <td className="py-4 px-4">USD {item.price.toFixed(2)}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      className={`bg-gray-200 px-2 py-1 rounded-l ${
                        item.quantity === 1
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      className="bg-gray-200 px-2 py-1 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-4 px-4">
                  USD {(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 bg-gray-50">
          <div className="flex justify-between mb-2">
            <span>Selected Items</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-bold">Total</span>
            <span className="font-bold">USD {totalPrice.toFixed(2)}</span>
          </div>
          <button
            className={`w-full py-2 rounded transition-colors ${
              selectedItems.length > 0
                ? "bg-pink-300 text-white hover:bg-pink-400"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={selectedItems.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
