require("dotenv").config({
    path:
        process.env.NODE_ENV === "production"
            ? ".env.production"
            : ".env.local",
});
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./app/router";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import admin from "firebase-admin";

const app = express();

var serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Specify the allowed origin(s) for CORS
const allowedOrigins = ["localhost:3000", "http://localhost:3000"];
app.use(
    cors({
        credentials: true,
        origin: allowedOrigins,
    })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json());
// Use JSON parser for all non-webhook routes
app.use(
    (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ): void => {
        if (req.originalUrl === "/webhook") {
            next();
        } else {
            express.json()(req, res, next);
        }
    }
);

// Error Handling Middleware
app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        console.error(err.stack);
        res.status(500).send("Something went wrong!");
    }
);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log("Connected to MongoDB!");
        const server = http.createServer(app);

        server.listen(8080, () => {
            console.log("Server running on http://localhost:8080/");
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

app.use("/", router());
