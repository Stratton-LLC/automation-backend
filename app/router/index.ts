import express from "express";
import users from "./UserRouter";
import auth from "./AuthRouter";
const router = express.Router();

export default (): express.Router => {
    users(router);
    auth(router);
    return router;
};
