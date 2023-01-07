import { getUserByEmail } from "../../dbFiles/dbOperations.js";
import bcrypt from "bcrypt";
import { generateToken, verify } from "./jwt.js";

export const login = async (email, password) => {
  const users = await getUserByEmail(email);

  if (users.length !== 1) {
    return null;
  }

  const user = users[0];
  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    return null;
  }

  const token = generateToken(user.ID_member, user.email);

  return token;
};

export const isAuthenticated = async (req) => {
  const token = req.cookies.token;

  if (token === undefined) {
    return null;
  }

  const payload = verify(token);
  if (payload === null) {
    return null;
  }

  const users = await getUserByEmail(payload.email);
  if (users.length !== 1) {
    return null;
  }
  const user = users[0];
  if (user.ID_member !== payload.id) {
    return null;
  }

  return {
    id: user.ID_member,
    email: user.email,
  };
};
