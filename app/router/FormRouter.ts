import express from "express";
import {
    getForm,
    getFormId,
    createNewForm,
    deleteFormById,
    updateFormById,
} from "@/models/FormModel";

const getAllForms = async (req: express.Request, res: express.Response) => {
    try {
        const forms = await getForm();
        return res.status(200).json(forms);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

const createForm = async (req: express.Request, res: express.Response) => {
    try {
        const { formLabel, content } = req.body;
        const { formId } = req.params;
        const newForm = await createNewForm({ formId, formLabel, content });
        newForm.createdAt = new Date();
        newForm.lastUpdateAt = new Date();
        return res.status(201).json(newForm);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

const deleteForm = async (req: express.Request, res: express.Response) => {
    try {
        const { formId } = req.params;
        const deletedForm = deleteFormById(formId);
        return res.json(deletedForm);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

const updateForm = async (req: express.Request, res: express.Response) => {
    try {
        const { formId } = req.params;
        const { formLabel, content } = req.body;
        if (!formId) {
            return res.status(400).json({ message: "formId is required" });
        }
        const form = getFormId(formId);

        updateFormById(formId, { formLabel, content });
        return res.status(200).json(form);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export default (router: express.Router) => {
    router.get("/forms", getAllForms);
    router.get("/forms/:formId", getFormId);
    router.post("/forms", createForm);
    router.delete("/forms/:formId", deleteForm);
    router.patch("/forms/:formId", updateForm);
};
