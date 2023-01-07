import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
  getTodosByUser,
  getTodoByID,
  createNewTodoForUser,
  updateTodoForUser,
  deleteTodoForUser,
} from "./dbfiles/dbOperations.js";
import { login } from "./src/services/auth.js";
import cookieParser from "cookie-parser";
import env from "./src/services/env.js";
import { reqLogin } from "./src/middleware/auth.js";

env();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.use(bodyParser.json());

app.get("/todos", reqLogin, async (req, resl) => {
  const payload = req.user;
  const userTodos = await getTodosByUser(payload.id);
  resl.json(userTodos);
});

app.post("/todo", reqLogin, async (req, res) => {
  const data = req.body;
  const payload = req.user;
  data.Member_ID = payload.id;
  let ID;
  if (data.ID_todo === undefined) {
    const result = await createNewTodoForUser(data);
    ID = result.insertId;
  } else {
    const result = await updateTodoForUser(data);
    ID = data.ID_todo;
  }
  if (!!ID) {
    const todo = await getTodoByID(ID);
    return res.json(todo);
  }
  return res.status(500).json({ message: "error occured" });
});

app.delete("/todo", reqLogin, async (req, res) => {
  const data = req.body;
  const payload = req.user;
  data.Member_ID = payload.id;
  const result = await deleteTodoForUser(data);
  res.json(result);
});

app.post("/login", async (req, res) => {
  const email = req.body.user;
  const passwd = req.body.pwd;
  if (email === undefined || passwd === undefined) {
    return res.status(400).json({ message: "unfound credentials" });
  }
  const token = await login(email, passwd);
  if (token === null) {
    return res.sendStatus(401);
  }
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });
  return res.json(token);
});

app.post("/logout", async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "logged out" });
});

app.get("/validate", reqLogin, async (req, res) => {
  const payload = req.user;
  if (payload === null) {
    return res.status(401).json({ message: "invalid token" });
  }
  return res.json(payload);
});

app.listen(5000, () => {
  console.log("server started on port 5000");
});
