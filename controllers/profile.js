import db from "../db.js";

export const getAllProfiles = (req, res) => {
    const q = "SELECT * FROM profiles";
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const getProfile = (req, res) => {
    const q =
      "SELECT p.id, `username`, `email`, `phone`, `dob`, `city`, `about`, `uid`, `profile_pic` FROM users u JOIN profiles p ON u.id = p.uid WHERE p.id = ? ";
  
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
  
      return res.status(200).json(data[0]);
    });
};

export const addProfile = (req, res) => {
    const userId = req.userId;
    const { phone, dob, city, about } = req.body;
    const profile_pic = req.file ? req.file.filename : null;

    const q =
    "INSERT INTO profiles(`phone`, `dob`, `city`, `about`, `profile_pic`, `uid`) VALUES (?, ?, ?, ?, ?, ?)";

    const values = [phone, dob, city, about, profile_pic, userId];

    db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        const profileId = data.insertId;
        const fetchQuery = "SELECT * FROM profiles WHERE id = ?";
        db.query(fetchQuery, [profileId], (fetchErr, fetchData) => {
            if (fetchErr) return res.status(500).json(fetchErr);
            const createdProfile = fetchData[0];
            return res.json({
                data: createdProfile,
                message: "Profile has been created.",
            });
        });
    });
};

export const updateProfile = (req, res) => {
    const userId = req.userId;
    const profileId = req.params.id;
    const { email, phone, dob, city, about } = req.body;
    let profile_pic = null;

    // Check if profile_pic is included in the form data
    if (req.file) {
        profile_pic = req.file.filename;
    }

    const q = "UPDATE profiles p JOIN users u ON p.uid = u.id SET u.email=?, p.phone=?, p.dob=?, p.city=?, p.about=?, p.profile_pic=? WHERE p.id = ? AND p.uid = ?";

    const values = [email, phone, dob, city, about, profile_pic, profileId, userId];

    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, emailData) => {
      if (err) {
        return res.status(500).json(err);
      }
      const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
     if (!emailRegex.test(email)) {
        return res.status(400).json("Invalid email address!");
      }
      if (emailData.length > 0 && emailData[0].id !== userId) {
        return res.status(400).json("Email already exists!");
      }
   
   
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);

       // Fetch the updated profile
        const fetchQuery = "SELECT * FROM profiles WHERE id = ?";
        db.query(fetchQuery, [profileId], (fetchErr, fetchData) => {
            if (fetchErr) return res.status(500).json(fetchErr);
            const updatedProfile = fetchData[0];
            return res.json({
                data: updatedProfile,
                message: "Profile has been updated.",
            });
        });
    });
}















// export const updateProfile = (req, res) => {
//     const userId = req.userId;
//     const profileId = req.params.id;
    
//     if (!profileId) {
//         const q = "INSERT INTO profiles (`uid`, `phone`, `dob`, `city`, `about`) VALUES (?, ?, ?, ?, ?)";
//         const values = [userId, req.body.phone, req.body.dob, req.body.city, req.body.about];

//         db.query(q, values, (err, data) => {
//             if (err) return res.status(500).json(err);
//             return res.json("New profile created.");
//         });
//     } else {
//         const q = "UPDATE profiles SET `phone`=?, `dob`=?, `city`=?, `about`=? WHERE `id` = ? AND `uid` = ?";
//         const values = [req.body.phone, req.body.dob, req.body.city, req.body.about, profileId, userId];

//         db.query(q, values, (err, data) => {
//             if (err) return res.status(500).json(err);
//             return res.json("Profile has been updated.");
//         });
//     }
// };


//   export const deleteProfile = (req, res) => {
//     const token = req.cookies.access_token;
//     if (!token) return res.status(401).json("Not authenticated!");
  
//     jwt.verify(token, "jwtkey", (err, userInfo) => {
//       if (err) return res.status(403).json("Token is not valid!");
  
//       const profileId = req.params.id;
//       const q = "DELETE FROM profiles WHERE `id` = ? AND `uid` = ?";
  
//       db.query(q, [profileId, userInfo.id], (err, data) => {
//         if (err) return res.status(403).json("You can delete only your profiles!");
  
//         return res.json("Profile has been deleted!");
//       });
//     });
)}