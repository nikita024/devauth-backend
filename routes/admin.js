import express from "express";
import { deleteUser, updateUser } from "../controllers/admin.js";

const router = express.Router();

router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;