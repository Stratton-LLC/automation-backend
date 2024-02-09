import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function (value: string) {
                // Simple email validation using regex
                return /\S+@\S+\.\S+/.test(value);
            },
            message: (props: any) =>
                `${props.value} is not a valid email address!`,
        },
    },
    authentication: {
        authToken: { type: String, default: null },
        sessionId: { type: String, default: null },
        sessionToken: { type: String, default: null },
    },
    info: {
        loggedIn: { type: Boolean, default: false },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        lastLoggedIn: { type: Date, default: null },
    },
    createdAt: { type: Date, default: Date.now },
    lastUpdateAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model("User", UserSchema);

export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserByEmployeeId = (employeeId: string) =>
    UserModel.findOne({
        employeeId: { $regex: new RegExp(`^${employeeId}$`, "i") },
    });

export const getUserBySessionToken = (sessionToken: string) =>
    UserModel.findOne({
        "authentication.sessionToken": sessionToken,
    });

export const getUserById = (id: string) => UserModel.findById(id);

export const createNewUser = (values: Record<string, any>) =>
    new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
    UserModel.findOneAndDelete({ _id: id });

export const updateUserById = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate(id, values);

export const updateUser = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate(id, values);

export const updateUserAuthToken = async (email: string, authToken: string) => {
    // Find the user by email
    const user = await UserModel.findOne({ email: email });

    if (!user) {
        console.log("User not found");
        return;
    }

    // Update the user's authToken
    user.authentication.authToken = authToken;
    await user.save();

    console.log("User updated successfully");
    return user;
};

const generateSessionToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

export const updateUserSessionToken = async (email: string) => {
    const sessionToken = generateSessionToken(); // Generate a new session token
    const currentDate = new Date(); // Current date and time

    try {
        // Update the user's sessionToken in the database
        const updatedUser = await UserModel.findOneAndUpdate(
            { email },
            {
                "authentication.sessionToken": sessionToken,
                "info.loggedIn": true,
                "info.lastLoggedIn": currentDate,
            },
            { new: true }
        );

        if (!updatedUser) {
            console.log("User not found");
            return null;
        }

        console.log("Session token updated successfully");
        return sessionToken; // Return the new session token
    } catch (error) {
        console.error("Error updating session token:", error);
        return null;
    }
};
