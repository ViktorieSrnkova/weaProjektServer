import conn from "./dbConfig.js";

/////////////////////// vysledky z databaze ///////////////////////
export const getUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Member WHERE email = ?";

    conn.query(sql, [email], function (err, result) {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const getTodosByUser = async (Member_ID) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Todos WHERE Member_ID = ?";

    conn.query(sql, [Member_ID], function (err, result) {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const getTodoByID = async (ID) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Todos WHERE ID_todo = ?";
    conn.query(sql, [ID], function (err, result) {
      if (err) return reject(err);
      return resolve(result[0]);
    });
  });
};

/////////////////////// ukladani do databaze ///////////////////////
export const createNewTodoForUser = async (object) => {
  return new Promise((resolve, reject) => {
    const sql =
      "INSERT INTO Todos (todo_text,priority,completed,created_at,Member_ID) VALUES (?,?,?,curdate(),?)";
    conn.query(
      sql,
      [object.todo_text, object.priority, object.completed, object.Member_ID],
      function (err, result) {
        if (err) return reject(err);
        return resolve(result);
      }
    );
  });
};

export const updateTodoForUser = async (object) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE Todos SET todo_text=?,priority=?,completed=? WHERE ID_todo=? AND Member_ID=?";
    conn.query(
      sql,
      [
        object.todo_text,
        object.priority,
        object.completed,
        object.ID_todo,
        object.Member_ID,
      ],
      function (err, result) {
        if (err) return reject(err);
        return resolve(result);
      }
    );
  });
};

export const deleteTodoForUser = async (object) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Todos WHERE ID_todo=? AND Member_ID=?";
    conn.query(sql, [object.ID_todo, object.Member_ID], function (err, result) {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};
