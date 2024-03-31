import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Mongoose schema
const DailyFormSchema = new Schema({
    formId: { type: String, required: true },
    formCreatedBy: { type: String, required: true },
    lastUpdatedBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    UpdatedAt: { type: Date, default: Date.now },
    formContent: {
        eventName: { type: String, required: true },
        crew: { type: [String], required: true },
        lengthOfEvent: { type: Number, required: true },
        dayOfEvent: { type: Number, required: true },
        showHours: {
            from: { type: String, required: true }, // You may need to parse this string into a time format
            to: { type: String, required: true },
        },
        cashOnHand: {
            cash1: { type: Number, required: true },
            cash5: { type: Number, required: true },
            cash10: { type: Number, required: true },
            cash20: { type: Number, required: true },
            totalCashInBag: { type: Number, required: true },
        },
        cashInRegister: { type: Number, required: true },
        beginningOfDay: {
            typeOfMugs: {
                type: String,
                enum: [
                    "PLASTIC_JAR",
                    "REGULAR_MUG",
                    "BARREL_MUG",
                    "DOUBLE_WALL",
                    "STAINLESS_JAR",
                ],
                required: true,
            },
            inventoryCount: { type: Number, required: true },
        },
        endOfDay: {
            typeOfMugs: {
                type: [String],
                enum: [
                    "PLASTIC_JAR",
                    "REGULAR_MUG",
                    "BARREL_MUG",
                    "DOUBLE_WALL",
                    "STAINLESS_JAR",
                ],
                required: true,
            },
            inventory: { type: Number, required: true },
            damagedDefectiveCount: { type: Number, required: true },
            giveawaysCount: { type: Number, required: true },
            endOfDayTotal: { type: Number, required: true },
        },
        totalMugsSold: {
            typeOfMugs: {
                type: [String],
                enum: [
                    "PLASTIC_JAR",
                    "REGULAR_MUG",
                    "BARREL_MUG",
                    "DOUBLE_WALL",
                    "STAINLESS_JAR",
                ],
                required: true,
            },
            quantitySold: { type: [Number], required: true },
            totalCost: { type: Number, required: true },
        },
        merchSold: {
            typeOfMerch: {
                type: String,
                enum: [
                    "STAINLESS_STRAW",
                    "LIDS",
                    "COMBO_LIDS_STRAW",
                    "CLIPS",
                    "REFILLS",
                ],
                required: true,
            },
            countSold: { type: Number, required: true },
            totalSales: { type: Number, required: true },
        },
        estimatedSales: {
            totalMugsSales: { type: Number, required: true },
            totalMerchSales: { type: Number, required: true },
            discounts: { type: Number, required: true },
            totalEstimatedSales: { type: Number, required: true },
        },
        expenses: {
            parking: { type: Number, required: true },
            ice: { type: Number, required: true },
            meals: { type: Number, required: true },
            labor: { type: Number, required: true },
            other: { type: Number, required: true },
            totalExpenses: { type: Number, required: true },
        },
        totalDailySales: {
            cashInRegisterAtEOD: { type: Number },
            totalDailySalesSummed: { type: Number, required: true },
        },
        eventNotes: { type: String, required: true },
    },
});

// Create and export the mongoose model
const DailyFormModel = mongoose.model("DailyForm", DailyFormSchema);

export const getForm = () => DailyFormModel.find();

export const getFormId = (formId: string) => {
    DailyFormModel.findById(formId);
};

export const createNewForm = (values: Record<string, any>) =>
    new DailyFormModel(values).save().then((form) => form.toObject());

export const deleteFormById = (formId: string) => {
    DailyFormModel.findOneAndDelete({ formId: formId });
};

//create a updateFormById function
export const updateFormById = (formId: string, values: Record<string, any>) => {
    DailyFormModel.findByIdAndUpdate(formId, values);
};
