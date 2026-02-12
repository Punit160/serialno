import DispatchPanel from "../models/dispatchpanel.model.js"
import PanelNumber from "../models/PanelNumber.model.js";
import session from "express-session";

// ✅ CREATE DISPATCH
export const createDispatch = async (req, res) => {
  try {
    /* ===============================
       1️⃣ Create dispatch
    =============================== */
    const dispatch = await DispatchPanel.create({
      ...req.body,
    });

    /* ===============================
       2️⃣ Save in SESSION
    =============================== */
    req.session.dispatch_id = dispatch._id;

    /* ===============================
       3️⃣ Response
    =============================== */
    res.status(201).json({
      success: true,
      message: "Dispatch created & session started",
      data: {
        dispatch_id: dispatch._id,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ GET ALL DISPATCHES
export const getAllDispatches = async (req, res) => {
  try {
    const dispatches = await DispatchPanel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: dispatches.length,
      data: dispatches,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ GET SINGLE DISPATCH
export const getDispatchById = async (req, res) => {
  try {
    const dispatch = await DispatchPanel.findById(req.params.id);

    if (!dispatch) {
      return res.status(404).json({
        success: false,
        message: "Dispatch not found",
      });
    }

    res.status(200).json({
      success: true,
      data: dispatch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ UPDATE DISPATCH
export const updateDispatch = async (req, res) => {
  try {
    const dispatch = await DispatchPanel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!dispatch) {
      return res.status(404).json({
        success: false,
        message: "Dispatch not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dispatch updated",
      data: dispatch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ DELETE DISPATCH
export const deleteDispatch = async (req, res) => {
  try {
    const dispatch = await DispatchPanel.findByIdAndDelete(req.params.id);

    if (!dispatch) {
      return res.status(404).json({
        success: false,
        message: "Dispatch not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Dispatch deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const scanPanel = async (req, res) => {
  try {
    const { panel_no, dispatch_id, panel_type } = req.body;

    const panel = await PanelNumber.findOne({ panel_unique_no: panel_no });

    if (!panel) {
      return res.status(404).json({ message: "Panel not found" });
    }

    if (panel.dispatch_status === 1) {
      return res.status(400).json({
        message: "Panel already dispatched",
      });
    }

    panel.dispatch_id = dispatch_id;
    panel.dispatch_status = 1;
    panel.dispatch_panel_type = panel_type;

    await panel.save();

    res.json({
      message: "Panel dispatched successfully",
      panel_no,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getPanelsByDispatchUniqueId = async (req, res) => {
  try {
    const { unique_id } = req.params;

    /* ===============================
       1️⃣ Validate input
    =============================== */
    if (!unique_id) {
      return res.status(400).json({
        success: false,
        message: "Dispatch unique_id is required",
      });
    }

    /* ===============================
       2️⃣ Fetch panels from PanelNumber
    =============================== */
    const panels = await PanelNumber.find({
      dispatch_id: Number(unique_id),
      dispatch_status: 1,
    }).sort({ panel_no: 1 });

    /* ===============================
       3️⃣ Check if panels exist
    =============================== */
    if (!panels.length) {
      return res.status(404).json({
        success: false,
        message: "No panels found for this dispatch",
      });
    }

    /* ===============================
       4️⃣ Response
    =============================== */
    res.status(200).json({
      success: true,
      total_panels: panels.length,
      data: panels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

