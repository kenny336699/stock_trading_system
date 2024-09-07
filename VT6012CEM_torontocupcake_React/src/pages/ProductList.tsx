import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Product, ProductType } from "@/store/productSlice";
import ProductItem from "@/components/ProductItem";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProductList: React.FC = () => {
  const products = useSelector((state: RootState) => state.products.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ProductType | "all">("all");
  const [sortOption, setSortOption] = useState<string>("nameAsc");

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (filterType === "all" ||
            product.types.includes(filterType as ProductType))
      )
      .sort((a, b) => {
        switch (sortOption) {
          case "nameAsc":
            return a.name.localeCompare(b.name);
          case "nameDesc":
            return b.name.localeCompare(a.name);
          case "priceLowToHigh":
            return a.price - b.price;
          case "priceHighToLow":
            return b.price - a.price;
          default:
            return 0;
        }
      });
  }, [products, searchTerm, filterType, sortOption]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-wrap gap-4">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select
          onValueChange={(value) =>
            setFilterType(
              value === "all" ? "all" : (Number(value) as ProductType)
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value={ProductType.AlwaysAvailable.toString()}>
                Always Available
              </SelectItem>
              <SelectItem value={ProductType.MothersDay.toString()}>
                Mother's Day
              </SelectItem>
              <SelectItem value={ProductType.OtherHolidays.toString()}>
                Other Holidays
              </SelectItem>
              <SelectItem value={ProductType.Hot.toString()}>Hot</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setSortOption(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="nameAsc">Name (ASC)</SelectItem>
              <SelectItem value="nameDesc">Name (DESC)</SelectItem>
              <SelectItem value="priceLowToHigh">Price Low to High</SelectItem>
              <SelectItem value="priceHighToLow">Price High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAndSortedProducts.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
