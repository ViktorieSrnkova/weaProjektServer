import { isAuthenticated } from "../services/auth.js";

export const reqLogin = async (req, res, next) => {
  const payload = await isAuthenticated(req);
  if (payload === null) {
    return res.status(401).json({
      message:
        "You are not Authenticated to view this content please log in and try again.",
    });
  }
  req.user = payload;
  next();
};
