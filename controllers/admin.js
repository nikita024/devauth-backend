import db from "../db.js";

// ADMIN ONLY
// export const updateUser = (req, res) => {
//   const userId = req.params.userId;
//   const email = req.body.email;
//   const username = req.body.username;
//   const is_admin = req.body.is_admin;

//   // Check if userId is provided
//   if (!userId) {
//     return res.status(400).json("User ID is required!");
//   }

//   // Validate the new email format
//   const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).json("Invalid email address!");
//   }

//   // Check if the user with the given ID exists
//   const getUserQuery = "SELECT * FROM users WHERE id = ?";
//   db.query(getUserQuery, [userId], (err, userData) => {
//     if (err) {
//       return res.status(500).json(err);
//     }
//     if (userData.length === 0) {
//       return res.status(404).json("User not found!");
//     }

    

//     // Check if the new email already exists in the users table
//     const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
//     db.query(checkEmailQuery, [email], (err, emailData) => {
//       if (err) {
//         return res.status(500).json(err);
//       }
//       if (emailData.length > 0 && emailData[0].id !== userId) {
//         return res.status(400).json("Email already exists!");
//       }

//         // Update the user's email and username
//         const updateQuery = "UPDATE users SET email = ?, username = ?, is_admin = ? WHERE id = ?";
//         db.query(updateQuery, [email, username, is_admin, userId], (err, result) => {
//           if (err) {
//             return res.status(500).json(err);
//           }
//           if (result.affectedRows === 0) {
//             return res.status(500).json("Failed to update email and username!");
//           }
//           return res.status(200).json("Email and username updated successfully!");
//         });
//       });
//   });
// };

export const updateUser = (req, res) => {
  const userId = req.params.userId;
  const { email, username, is_admin } = req.body;

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json("User ID is required!");
  }

  // Check if any fields are provided in the request body
  if (!email && !username && is_admin === undefined) {
    return res.status(400).json("At least one field (email, username, or is_admin) is required to update!");
  }

  // Validate the new email format if provided
  if (email) {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json("Invalid email address!");
    }
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
    if (email && email !== userData[0].email) {
      const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
      db.query(checkEmailQuery, [email], (err, emailData) => {
        if (err) {
          return res.status(500).json(err);
        }
        if (emailData.length > 0 && emailData[0].id !== userId) {
          return res.status(400).json("Email already exists!");
        }
        // Update the user's email, username, and is_admin
        updateUserFields();
      });
    } else {
      // Update the user's username and is_admin without checking email
      updateUserFields();
    }
  });

  // Function to update user fields
  function updateUserFields() {
    // Construct the update query based on provided fields
    let updateFields = [];
    let queryParams = [];
    if (email) {
      updateFields.push("email = ?");
      queryParams.push(email);
    }
    if (username !== undefined) {
      updateFields.push("username = ?");
      queryParams.push(username);
    }
    if (is_admin !== undefined) {
      updateFields.push("is_admin = ?");
      queryParams.push(is_admin);
    }
    queryParams.push(userId);

    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    db.query(updateQuery, queryParams, (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (result.affectedRows === 0) {
        return res.status(500).json("Failed to update user information!");
      }
      return res.status(200).json("User information updated successfully!");
    });
  }
};




export const deleteUser = (req, res) => {
  const userId = req.params.userId;

  // Check if userId is provided
  if (!userId) {
    return res.status(400).json("User ID is required!");
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
  });

  // Delete the user
  const deleteQuery = "DELETE FROM users WHERE id = ?";
  db.query(deleteQuery, [userId], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (result.affectedRows === 0) {
      return res.status(500).json("Failed to delete user!");
    }
    return res.status(200).json("User deleted successfully!");
  })
}


