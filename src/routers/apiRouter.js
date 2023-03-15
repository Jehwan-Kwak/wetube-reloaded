import express from "express";
import { createComment, resisterView } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", resisterView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);

export default apiRouter;