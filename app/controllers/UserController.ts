import express from "express";

import {
    getUsers,
    deleteUserById,
    getUserById,
    getUserBySessionToken,
    getUserByEmployeeId,
    getUserByEmail,
    createNewUser,
} from "../models/UserModel";

export const getAllUsers = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(400).send("Could not get users");
    }
};

export const getUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const user = await getUserById(id);

        if (!user) {
            return res.sendStatus(404);
        }

        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getUserBySessionTokenController = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { sessionToken } = req.params;
        const user = await getUserBySessionToken(sessionToken);

        if (!user) {
            return res.sendStatus(404);
        }

        // You can manipulate the user object here if needed before sending it as a response
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};

export const createUser = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { employeeId, email } = req.body;

        if (!employeeId || !email) {
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email);

        if (user) {
            return res.status(400).send("Email already in use");
        }

        const userbyEmployeeId = await getUserByEmployeeId(employeeId);

        if (userbyEmployeeId) {
            return res.status(400).send("Username already in use");
        }

        const newUser = await createNewUser(req.body);

        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const deleteUser = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;

        const deletedUser = await deleteUserById(id);
        return res.json(deletedUser);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const updateUser = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const { employeeId } = req.body;

        if (!employeeId) {
            return res.sendStatus(400);
        }
        const user = await getUserById(id);
        user.employeeId = employeeId;
        await user.save();

        return res.status(200).json(user).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getUserRole = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);

        if (!user) {
            return res.sendStatus(404);
        }

        res.json({ role: user.role });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};

export const getUsernameAvailability = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { username } = req.body;
        const user = await getUserByEmployeeId(username);

        if (user) {
            return res.status(202).json({ available: false });
        } else {
            return res.status(200).json({ available: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error: " + error);
    }
};

export const getEmailAvailability = async (
    req: express.Request,
    res: express.Response
) => {
    try {
        const { email } = req.body;
        const userEmail = await getUserByEmail(email);

        if (userEmail) {
            return res.status(202).json({ available: false });
        } else {
            return res.status(200).json({ available: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error checking email availability" + error);
    }
};
