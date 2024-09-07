import logo2 from "@/assets/logo2.png";
import owner from "@/assets/owner.png";
const About = () => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">About</h1>

      <div className="flex items-center justify-center mb-4">
        <h2 className="text-xl text-pink-500 mr-2">About Toronto Cupcake</h2>
        <img src={logo2} alt="Toronto Cupcake Logo" width={50} height={50} />
      </div>

      <p className="mb-4">
        We are driven by loving what we do and what we make everyday.
      </p>

      <p className="mb-4">
        We get to use the finest ingredients to make what we believe are the
        tastiest treats around.
      </p>

      <p className="mb-4">
        And.. we love the idea that our treats are making people happy every
        time they bite into one. How much fun is that!
      </p>

      <h2 className="text-xl font-bold mt-8 mb-4">About Michelle</h2>

      <div className="flex justify-center mb-4">
        <img src={owner} alt="Michelle" width={300} height={200} />
      </div>

      <p className="mb-4">
        Toronto Cupcake was created by Michelle Harrison so she could pursue her
        love of baking. A lifelong baker, inspired by her mother, Michelle
        opened Toronto Cupcake in August 2010 as one of Canada's first gourmet
        cupcakeries.
      </p>
    </div>
  );
};

export default About;
