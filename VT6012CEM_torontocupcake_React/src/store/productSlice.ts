import { createSlice } from "@reduxjs/toolkit";

export interface Product {
  id: string;
  image: string;
  image2: string | null;
  name: string;
  price: number;
  types: ProductType[];
  description: string | null;
}
export enum ProductType {
  AlwaysAvailable = 1,
  MothersDay = 2,
  OtherHolidays = 3,
  Hot = 4,
}
interface ProductState {
  products: Product[];
}

const initialState: ProductState = {
  products: [
    {
      id: "1",
      image:
        "https://www.torontocupcake.com/images/cupcakes_flavours/chocolatepeanutbutter.webp",
      image2:
        "https://www.torontocupcake.com/images/cupcakes_flavours/chocolatepeanutbuttertop.webp",
      name: "Chocolate Peanut Butter cupcake",
      price: 3.75,
      types: [ProductType.AlwaysAvailable, ProductType.Hot],
      description:
        "A rich chocolate cupcake topped with creamy peanut butter frosting and a chocolate piece, perfect for peanut butter lovers.",
    },
    {
      id: "2",
      image:
        "https://www.torontocupcake.com/images/cupcakes_flavours/chocolatehazelnut.webp",
      image2:
        "https://www.torontocupcake.com/images/cupcakes_flavours/chocolatehazelnuttop.webp",
      name: "Chocolate Hazelnut cupcake",
      price: 3.75,
      types: [ProductType.AlwaysAvailable, ProductType.Hot],
      description:
        "Decadent chocolate cupcake coated with crushed hazelnuts, offering a delightful crunch with every bite.",
    },
    {
      id: "3",
      image:
        "https://www.torontocupcake.com/images/cupcakes_flavours/vanillacoconut.webp",
      image2:
        "https://www.torontocupcake.com/images/cupcakes_flavours/vanillacoconuttop.webp",
      name: "Vanilla Coconut cupcake",
      price: 3.75,
      types: [ProductType.AlwaysAvailable, ProductType.Hot],
      description:
        "Light and fluffy vanilla cupcake topped with coconut flakes, bringing a tropical twist to a classic favorite.",
    },
    {
      id: "4",
      image:
        "https://www.torontocupcake.com/images/cupcakes_flavours/chocolatechocolate.webp",
      image2:
        "https://www.torontocupcake.com/images/cupcakes_flavours/chocolatechocolatetop.webp",
      name: "Chocolate Chocolate cupcake",
      price: 3.75,
      types: [ProductType.AlwaysAvailable],
      description:
        "Double the chocolate, double the indulgence. A chocolate cupcake with chocolate frosting, topped with a chocolate ball for the ultimate chocolate experience.",
    },
    {
      id: "5",
      image:
        "https://www.torontocupcake.com/images/cupcakes_flavours/chocolatecoconut.webp",
      image2:
        "https://www.torontocupcake.com/images/cupcakes_flavours/chocolatecoconuttop.webp",
      name: "Chocolate Coconut cupcake",
      price: 3.75,
      types: [ProductType.AlwaysAvailable],
      description:
        "A chocolate lover's dream cupcake, generously sprinkled with shredded coconut for an extra layer of texture and flavor.",
    },
    {
      id: "6",
      image:
        "https://www.torontocupcake.com/images/cupcakes_flavours/stpattysday.webp",
      image2:
        "https://www.torontocupcake.com/images/cupcakes_flavours/stpattysdaytopview.webp",
      name: "St Patty's Day",
      price: 3,
      types: [ProductType.OtherHolidays],
      description:
        "The best of both worlds: a chocolate cupcake base with smooth vanilla frosting, adorned with a delicate pink flower.",
    },
    {
      id: "7",
      image:
        "https://www.torontocupcake.com/images/cupcakes_flavours/toronto_12_valentines.webp",
      image2: null,
      name: "Valentine's Day",
      price: 3.75,
      types: [ProductType.OtherHolidays],
      description:
        "We have designed and packaged a delicious selection of a dozen Valentine's Day Cupcakes including one topped with a heart shaped chocolate truffle.",
    },
    {
      id: "8",
      image:
        "https://www.torontocupcake.com/images/cupcakes_flavours/Toronto_Mothers_Day_Dozen.webp",
      name: "Mother's Day Dozen",
      price: 48.0,
      types: [ProductType.MothersDay, ProductType.OtherHolidays],
      image2: null,
      description: null,
    },
    {
      id: "9",
      image:
        "https://www.torontocupcake.com/images/cupcakes_flavours/Toronto_Mothers_Day_Half_Dozen.webp",
      name: "Mother's Day Half Dozen",
      price: 24.0,
      types: [ProductType.MothersDay],
      image2: null,
      description: null,
    },
  ],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
});

export const {} = productSlice.actions;
export default productSlice.reducer;
