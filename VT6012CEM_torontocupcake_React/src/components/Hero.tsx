import React from "react";
import logo2 from "@/assets/logo2.png";
const Hero: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold">TORONTO CUPCAKE</h1>
        <div className="inline-block">
          <img
            src={logo2}
            alt="Toronto Cupcake Logo"
            className="w-30 h-30 mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
