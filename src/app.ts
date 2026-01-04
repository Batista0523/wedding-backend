import express, { Request, Response } from "express";
import cors from "cors";
import Guests from "./controllers/guests.controller";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/guests", Guests);
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to wedding 🚀");
});

export default app;
