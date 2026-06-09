import { Router } from "express";

import { chatController } from "../controllers/controllers.ts";

const router = Router();
router.post(
    "/",
    chatController
);
export default router;