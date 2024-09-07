import React from "react";
import googlemap from "@/assets/googlemap.png";
const ContactUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <img
          src="https://www.torontocupcake.com/images/toronto001.jpg"
          alt="Toronto Skyline"
          className="w-full h-auto rounded-lg"
        />
        <img
          src={googlemap}
          alt="Location Map"
          className="w-full h-auto rounded-lg"
        />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">HOURS OF OPERATION</h2>
        <p>Monday - Saturday: 7am - 10pm</p>
        <p>Sunday: 7am - 10pm (no pick ups, deliveries for 2doz or more)</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Phone Call</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium">North America:</h3>
            <p>+1-877-334-9468</p>
          </div>
          <div>
            <h3 className="font-medium">Outside of North Am:</h3>
            <p>+001-647-478-9464</p>
          </div>
          <div>
            <h3 className="font-medium">Local Toronto and GTA:</h3>
            <p>647-478-9464</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-2">Email</h2>
        <a
          href="mailto:inquiry@torontocupcake.com"
          className="text-blue-600 hover:underline"
        >
          inquiry@torontocupcake.com
        </a>
      </div>
    </div>
  );
};

export default ContactUs;
