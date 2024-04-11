import express from "express";
import { 
    getAllProfiles, 
    getProfile,
    addProfile, 
    updateProfile 
    // deleteProfile, 
} from "../controllers/profile.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllProfiles);
router.get("/:id", getProfile);
router.post("/", verifyToken, addProfile);
router.put("/:id", verifyToken, updateProfile);
// router.delete("/:id", deleteProfile);

export default router;