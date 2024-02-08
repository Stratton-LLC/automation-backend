import mongoose from "mongoose";

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
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: { type: Date, default: Date.now },
    lastUpdateAt: { type: Date, default: Date.now },
    lastLoggedIn: { type: Date, default: null },
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
    })
        .select("+role")
        .exec();

export const getUserById = (id: string) => UserModel.findById(id);

export const createNewUser = (values: Record<string, any>) =>
    new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
    UserModel.findOneAndDelete({ _id: id });

export const updateUserById = (id: string, values: Record<string, any>) =>
    UserModel.findByIdAndUpdate(id, values);
