import express from "express"
import { fetchTask, getAllTask, createTask, updateTask, deleteTask } from "../controllers/task.controller.js";
import upload from "../middleware/uploads.js";


const router = express.Router()

router.get('/task-list', getAllTask)
router.get('/fetch-task/:id', fetchTask)
router.post('/create-task',upload.single('document'),createTask)
router.put('/update-task/:id', upload.single('document'), updateTask)
router.get('/delete-task/:id',deleteTask)

export default router;