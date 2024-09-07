import Hero from "@/components/Hero";
import HotProducts from "@/components/HotProducts";
import ViewProduct from "@/components/ViewProduct";
import React from "react";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <Hero />
      <HotProducts />
      <ViewProduct />
      <p className="w-full md:w-8/12 text-center px-4 md:px-0 mt-8">
        {`Welcome! Thank you for stopping by Toronto Cupcake. Canada's and the
    GTA's favourite stop for that special treat. Order cupcakes online 24/7
    for your special event.`}
      </p>
      <p className="w-full md:w-8/12 text-center px-4 md:px-0 mt-8 mb-12">
        {`Delivery available most days between 8 and 6pm
    TO time. Celebrating our 13th year of providing Canada's most delicious
    cupcakes for business meetings, birthdays, weddings, or for no other
    reason than because.`}
      </p>
    </div>
  );
};

export default Home;
