import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    formId: { type: String, required: true },
    formLabel: { type: String, required: true },
    content: {
        inputId: { type: String, required: true },
        inputType: { type: String, required: true },
        inputLabel: { type: String, required: true },
        inputPlaceholder: { type: String, required: true },
        inputRequired: { type: Boolean, required: true },
    },
    createdAt: { type: Date, default: Date.now },
    lastUpdateAt: { type: Date, default: Date.now },
    visible: { type: Boolean, default: true },
    deleted: { type: Boolean, default: false },
});
