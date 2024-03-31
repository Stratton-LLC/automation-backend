import mongoose from "mongoose";

const FormSchema = new mongoose.Schema({
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

export const FormModel = mongoose.model("Form", FormSchema);

export const getForm = () => FormModel.find();

export const getFormId = (formId: string) => {
    FormModel.findById(formId);
};

export const createNewForm = (values: Record<string, any>) =>
    new FormModel(values).save().then((form) => form.toObject());

export const deleteFormById = (formId: string) => {
    FormModel.findOneAndDelete({ formId: formId });
};

//create a updateFormById function
export const updateFormById = (formId: string, values: Record<string, any>) => {
    FormModel.findByIdAndUpdate(formId, values);
};
