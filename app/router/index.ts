import express from "express";
import users from "./UserRouter";
import auth from "./AuthRouter";
import FormRouter from "./FormRouter";
import DailyFormRouter from "./DailyFormRouter";
const router = express.Router();

export default (): express.Router => {
    users(router);
    auth(router);
    FormRouter(router);
    DailyFormRouter(router);
    return router;
};
