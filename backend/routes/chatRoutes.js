import { chat, Delete, thread, threadId } from "../controllers/ChatControllers.js";
import express from "express"
const router=express.Router();

router.post("/chat",chat);
router.get("/thread",thread);
router.get("/thread/:threadId",threadId);
router.delete("/thread/:threadId",Delete);
export default router;