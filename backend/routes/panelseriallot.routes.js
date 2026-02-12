import express from "express";
import {
  createPanelSerialLot,
  getAllPanelSerialLots,
  deletePanelSerialLot,
} from "../controllers/panelseriallot.controller.js";

const router = express.Router();

// CREATE
router.post("/create-panel-serial", createPanelSerialLot);

// VIEW (all rows)
router.get("/all-panel-serial", getAllPanelSerialLots);

// DELETE
router.delete("/delete-panel-serial/:id", deletePanelSerialLot);

export default router;
