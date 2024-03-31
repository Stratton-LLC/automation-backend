import express from "express";
import {
    getForm,
    getFormId,
    createNewForm,
    deleteFormById,
    updateFormById,
} from "../models/DailyFormModel";

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
        const newForm = await createNewForm(req.body);
        return res.status(201).json(newForm);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

const deleteForm = async (req: express.Request, res: express.Response) => {
    try {
        const { formId } = req.params;
        await deleteFormById(formId);
        return res.json({ message: "Form deleted" });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

const updateForm = async (req: express.Request, res: express.Response) => {
    try {
        const { formId } = req.params;
        const updatedForm = await updateFormById(formId, req.body);
        return res.status(200).json(updatedForm);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export default (router: express.Router) => {
    router.get("/api/dailyforms", getAllForms);
    router.get("/api/dailyforms/:formId", getFormId);
    router.post("/api/dailyforms", createForm);
    router.delete("/api/dailyforms/:formId", deleteForm);
    router.patch("/api/dailyforms/:formId", updateForm);
};
