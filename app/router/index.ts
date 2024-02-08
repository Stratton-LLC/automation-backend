import express from "express";
import users from "./UserRouter";
const router = express.Router();

export default (): express.Router => {
    users(router);
    return router;
};
