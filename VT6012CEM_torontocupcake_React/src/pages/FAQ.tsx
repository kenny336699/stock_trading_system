import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How much time for a custom order?",
      answer:
        "It would be very helpful if you could give a minimum of 48 hours notice when ordering something special. For personalised stamping such as initials or logos please call or email us.",
    },
    {
      question: "What is the smallest order I can make?",
      answer: "Minimum order is 1/2 dozen assorted cupcakes.",
    },
    {
      question: "Does Toronto Cupcake deliver?",
      answer:
        "Yes! Toronto Cupcake delivers to all locations in the GTA and surrounding areas. The minimum order for delivery is 1/2 dozen. Delivery to most downtown Toronto postal codes is $13.00. We deliver to a radius of approximately 80KM from downtown Toronto. If you need a delivery outside of this area please contact us. Delivery windows are 8-noon and noon-6 within Toronto. Outside of Toronto is noon-6.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">FAQS</h1>

      <p className="mb-6">
        Welcome to Toronto Cupcake's FAQ page. Here you'll find answers to our
        most commonly asked questions about ordering, delivery, ingredients, and
        more. We hope this information helps you quickly find what you need and
        enjoy a smooth cupcake experience!
      </p>

      <Accordion type="multiple" className="w-full mb-6 space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-2 border-[#F6A6C1] rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="text-left px-4 py-2 hover:bg-[#F6A6C1]/10">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2 border-t border-[#F6A6C1]">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Didn't Find Your Answer?</h2>
        <Link to={"/contact"}>
          <p>
            If your question wasn't addressed in our FAQ, please don't hesitate
            to reach out to our customer service team. We're here to help!
          </p>
        </Link>
      </div>
    </div>
  );
};

export default FAQ;
