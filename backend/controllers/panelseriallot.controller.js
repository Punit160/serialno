import mongoose from "mongoose";
import PanelSerialLot from "../models/PanelSerialLot.model.js";
import PanelNumber from "../models/PanelNumber.model.js";

export const createPanelSerialLot = async (req, res) => {
  try {
    const {
      total_panels,
      prefix,
      panel_type,
      panel_capacity,
      panel_category,
      date,
      starting_no,
      company_id,
      created_by,
      updated_by,
    } = req.body;

    /* ===============================
       1️⃣ Generate LOT unique_id
    =============================== */
    const lastLot = await PanelSerialLot.findOne()
      .sort({ unique_id: -1 })
      .select("unique_id");

    const nextLotUniqueId = lastLot ? lastLot.unique_id + 1 : 1;

    /* ===============================
       2️⃣ Generate GLOBAL panel unique_id
    =============================== */
    const lastPanel = await PanelNumber.findOne()
      .sort({ unique_id: -1 })
      .select("unique_id");

    const panelUniqueStart = lastPanel ? lastPanel.unique_id + 1 : 1;

    /* ===============================
       3️⃣ Capacity-wise serial continuation
    =============================== */
    const lastCapacityPanel = await PanelNumber.findOne({ panel_capacity })
      .sort({ panel_unique_no: -1 })
      .select("panel_unique_no");

    let actualStartingNo = starting_no;

    if (lastCapacityPanel?.panel_unique_no) {
      const lastSerial = Number(
        lastCapacityPanel.panel_unique_no.split("-").pop()
      );
      actualStartingNo = lastSerial + 1;
    }

    /* ===============================
       4️⃣ Create LOT
    =============================== */
    const lot = await PanelSerialLot.create({
      unique_id: nextLotUniqueId,
      company_id,
      prefix,
      starting_no: actualStartingNo,
      date,
      panel_capacity,
      panel_type,
      total_panels,
      created_by,
      updated_by,
    });

    /* ===============================
       5️⃣ Create PANELS (FIXED)
    =============================== */
    const panels = [];

    for (let i = 0; i < total_panels; i++) {
      const serial = actualStartingNo + i;
      const paddedSerial = String(serial).padStart(6, "0");

      panels.push({
        unique_id: panelUniqueStart + i,
        panel_lot_id: lot._id,
        panel_capacity,
        panel_category,
        panel_lot_count: total_panels, // ✅ FIX
        panel_unique_no: `${prefix}-${panel_type}-${date}-${paddedSerial}`,
        panel_no: paddedSerial,
      });
    }

    await PanelNumber.insertMany(panels);

    /* ===============================
       6️⃣ Response
    =============================== */
    res.status(201).json({
      success: true,
      message: "Panel lot and panel numbers created successfully",
      data: {
        lot_unique_id: nextLotUniqueId,
        total_panels,
        panel_unique_start: panelUniqueStart,
        panel_unique_end: panelUniqueStart + total_panels - 1,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};




export const getAllPanelSerialLots = async (req, res) => {
  try {
    const lots = await PanelSerialLot.find()
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      total_records: lots.length,
      data: lots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePanelSerialLot = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // 1️⃣ Check if lot exists
    const lot = await PanelSerialLot.findById(id);
    if (!lot) {
      return res.status(404).json({
        success: false,
        message: "Panel lot not found",
      });
    }

    // 2️⃣ Delete all panels linked to this lot
    await PanelNumber.deleteMany(
      { panel_lot_id: id },
      { session }
    );

    // 3️⃣ Delete the lot
    await PanelSerialLot.findByIdAndDelete(id, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Panel lot and related panel numbers deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


