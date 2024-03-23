import express from "express";
import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import {
    getUserByEmail,
    getUserByEmployeeId,
    getUserBySessionToken,
    updateUser,
    updateUserAuthToken,
    updateUserSessionToken,
} from "../models/UserModel";

export const getUserVerification = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { idToken } = req.body;
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const email = decodedToken.email;

        let user = await getUserByEmail(email);
        if (!user) {
            return res
                .status(404)
                .json({ message: "Account with that email not found" });
        }
        await updateUserAuthToken(email, idToken);
        await updateUserSessionToken(email);

        user = await getUserByEmail(email);

        res.cookie("sessionToken", user.authentication.sessionToken, {
            httpOnly: true,
            secure: false,
        });
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getUserInfo = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        // Assuming the cookie where the ID token is stored is named 'idToken'
        const sessionToken = req.cookies["sessionToken"];

        if (!sessionToken) {
            return res
                .status(401)
                .json({ message: "No valid session token found." });
        }

        let user = await getUserBySessionToken(sessionToken);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Consider what information you want to return about the user
        // Ensure not to expose sensitive information
        return (
            //send both user.info and user.employeeId
            res.status(200).json({
                info: user.info,
                employeeId: user.employeeId,
            })
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default (router: express.Router) => {
    router.patch("/auth", getUserVerification);
    router.get("/auth/status", getUserInfo);
};
