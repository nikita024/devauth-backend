import express from "express";
import { register, login, updateUserEmail } from "../controllers/user.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/edit-email/:userId", updateUserEmail)

export default router;