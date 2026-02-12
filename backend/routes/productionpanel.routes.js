import express from "express"
import {createProductionPanel, fetchAllProductionPanels, fetchProductionPanelById, deleteProductionPanel} from '../controllers/productionpanel.controller.js'
const router = express.Router()

router.post("/create-production-panel", createProductionPanel);
router.get("/production-panel", fetchAllProductionPanels);
router.get("/production-panel/:id", fetchProductionPanelById);
router.delete("/delete-production-panel/:id", deleteProductionPanel);



export default router
