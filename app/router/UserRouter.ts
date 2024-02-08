import express from "express";

import {
    getAllUsers,
    deleteUser,
    updateUser,
    getUser,
    getUserBySessionTokenController,
    getUserRole,
    getUsernameAvailability,
    getEmailAvailability,
    createUser,
} from "../controllers/UserController";
// import { isAuthenticated, isOwner, isAdmin } from "../middlewares";

export default (router: express.Router) => {
    router.get("/users/", getAllUsers);
    router.get("/users/:id", getUser);
    router.get("/users/:id/role", getUserRole); // New route to get user role and check if admin
    router.get("/users/session/:sessionToken", getUserBySessionTokenController); // Route for the new controller function
    router.post("/check-username-availability", getUsernameAvailability);
    router.post("/check-email-availability", getEmailAvailability);
    router.post("/users/", createUser);
    router.delete("/users/:id", deleteUser);
    router.patch("/users/:id", updateUser);
};
