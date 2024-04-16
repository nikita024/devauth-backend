import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  if (!req.body.username) {
    return res.status(400).json("Username is required!");
  }
  if (!req.body.email) {
    return res.status(400).json("Email is required!");
  }
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(req.body.email)) {
      return res.status(400).json("Invalid email address!" );
  }
  if (!req.body.password) {
    return res.status(400).json("Password is required!");
  }

  if (req.body.password.length < 8 || req.body.password.length > 15) {
    return res.status(400).json("Password must be between 8 and 15 characters!");
  }

  const validPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  if (!validPassword.test(req.body.password)) {
    return res.status(400).json("Password must contain at least one uppercase, one lowercase, one number and one special character!");
  }

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    //Hash the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users(`username`,`email`,`password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {

  const q = "SELECT * FROM users WHERE email = ?";

  if (!req.body.email) {
    return res.status(400).json("Email is required!");
  }

  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(req.body.email)) {
      return res.status(400).json("Invalid email address!");
  }

  if (!req.body.password) {
    return res.status(400).json("Password is required!");
  }

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password!");

    const token = jwt.sign({ id: data[0].id }, "jwtkey", {
      expiresIn: "1d",
    });
    const { password, ...other } = data[0];

    res.status(200).json({
      message : "Login successful",
      ...other,
      token
    })
  });
}


export const updateUserEmail = (req, res) => {
  const userId = req.params.userId;
  const newEmail = req.body.newEmail;

  // Check if userId and newEmail are provided
  if (!userId) {
    return res.status(400).json("User ID is required!");
  }
  if (!newEmail) {
    return res.status(400).json("New email is required!");
  }

  // Validate the new email format
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  if (!emailRegex.test(newEmail)) {
    return res.status(400).json("Invalid email address!");
  }

  // Check if the user with the given ID exists
  const getUserQuery = "SELECT * FROM users WHERE id = ?";
  db.query(getUserQuery, [userId], (err, userData) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (userData.length === 0) {
      return res.status(404).json("User not found!");
    }

    // Check if the new email already exists in the users table
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [newEmail], (err, emailData) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (emailData.length > 0) {
        return res.status(400).json("Email already exists!");
      }

      // Update the user's email
      const updateEmailQuery = "UPDATE users SET email = ? WHERE id = ?";
      db.query(updateEmailQuery, [newEmail, userId], (err, result) => {
        if (err) {
          return res.status(500).json(err);
        }
        if (result.affectedRows === 0) {
          return res.status(500).json("Failed to update email!");
        }
        return res.status(200).json("Email updated successfully!");
      });
    });
  });
};

