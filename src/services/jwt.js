import jwt from "jsonwebtoken";
import env from "./env.js";
env();

const secret = process.env.JWT_SECRET;

export const generateToken = (ID, email) => {
  const token = jwt.sign(
    {
      id: ID,
      email: email,
    },
    secret,
    { expiresIn: "1h" }
  );
  return token;
};

export const verify = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (e) {
    return null;
  }
};
