import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, registerUser, verifyCode } from "@/store/userSlice";
import DOMPurify from "dompurify";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  const [activeForm, setActiveForm] = useState<"login" | "register" | "verify">(
    "login"
  );
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const dispatch = useAppDispatch();
  const { isLoading, error, userId } = useAppSelector((state) => state.user);

  const validateInput = (
    input: string,
    type: "username" | "password" | "email" | "fullName"
  ) => {
    const patterns = {
      username: /^[a-zA-Z0-9_]{3,50}$/,
      password: /.{8,}/,
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      fullName: /.{1,100}/,
    };
    return patterns[type].test(input);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaValue) {
      alert("Please complete the reCAPTCHA");
      return;
    }

    let result;
    switch (activeForm) {
      case "login":
        if (
          !validateInput(loginData.username, "username") ||
          !validateInput(loginData.password, "password")
        ) {
          alert("Invalid input. Please check your username and password.");
          return;
        }
        result = await dispatch(loginUser(loginData));
        break;
      case "register":
        if (
          !Object.entries(registerData).every(([key, value]) =>
            key === "confirmPassword" ? true : validateInput(value, key as any)
          ) ||
          registerData.password !== registerData.confirmPassword
        ) {
          alert("Invalid input. Please check your registration details.");
          return;
        }
        result = await dispatch(registerUser(registerData));
        break;
      case "verify":
        if (userId) {
          const sanitizedCode = DOMPurify.sanitize(verificationCode);
          result = await dispatch(verifyCode({ userId, code: sanitizedCode }));
        } else {
          console.error("userId is null, cannot verify code.");
          return;
        }
        break;
    }

    if (result?.meta.requestStatus === "fulfilled") {
      if (activeForm === "login" && result.payload.requiresVerification) {
        setActiveForm("verify");
      } else {
        alert(
          activeForm === "verify"
            ? "Verification successful!"
            : "Action successful!"
        );
      }
    } else if (result?.meta.requestStatus === "rejected") {
      alert(result.payload);
    }
  };

  const renderForm = () => {
    const formFields = {
      login: [
        { label: "Username", name: "username", type: "text" },
        { label: "Password", name: "password", type: "password" },
      ],
      register: [
        { label: "Username", name: "username", type: "text" },
        { label: "Email", name: "email", type: "email" },
        { label: "Full Name", name: "fullName", type: "text" },
        { label: "Password", name: "password", type: "password" },
        {
          label: "Confirm Password",
          name: "confirmPassword",
          type: "password",
        },
      ],
      verify: [
        { label: "Verification Code", name: "verificationCode", type: "text" },
      ],
    };

    return (
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          {activeForm === "login"
            ? "Login"
            : activeForm === "register"
            ? "Register"
            : "Verify Code"}
        </h2>
        {formFields[activeForm].map((field) => (
          <div key={field.name} className="space-y-2">
            <label
              htmlFor={field.name}
              className="text-sm font-medium text-gray-700"
            >
              {field.label}
            </label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              value={
                activeForm === "login"
                  ? loginData[field.name as keyof typeof loginData]
                  : activeForm === "register"
                  ? registerData[field.name as keyof typeof registerData]
                  : verificationCode
              }
              onChange={(e) => {
                const value = e.target.value;
                if (activeForm === "login") {
                  setLoginData((prev) => ({ ...prev, [field.name]: value }));
                } else if (activeForm === "register") {
                  setRegisterData((prev) => ({ ...prev, [field.name]: value }));
                } else {
                  setVerificationCode(value);
                }
              }}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        ))}
        {activeForm !== "verify" && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6LfIFjkqAAAAAKd0tlyWVHBv5De3Knb0htSMJu6w"
            onChange={(value) => setCaptchaValue(value)}
            className="flex justify-center"
          />
        )}
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          disabled={isLoading || (!captchaValue && activeForm !== "verify")}
        >
          {isLoading
            ? "Processing..."
            : activeForm === "login"
            ? "Login"
            : activeForm === "register"
            ? "Register"
            : "Verify"}
        </Button>
      </motion.form>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {renderForm()}
      {activeForm !== "verify" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-4"
        >
          <Button
            variant="link"
            onClick={() =>
              setActiveForm(activeForm === "login" ? "register" : "login")
            }
            className="text-orange-500 hover:text-orange-600 transition duration-300"
          >
            {activeForm === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
