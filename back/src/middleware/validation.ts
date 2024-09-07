import { Request, Response, NextFunction } from "express";

export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password, email, fullName } = req.body;

  if (!username || !password || !email || !fullName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (username.length < 3 || username.length > 50) {
    return res
      .status(400)
      .json({ message: "Username must be between 3 and 50 characters long" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (fullName.length < 2 || fullName.length > 100) {
    return res
      .status(400)
      .json({ message: "Full name must be between 2 and 100 characters long" });
  }

  next();
};
