import ProductionPanel from "../models/ProductionPanel.model.js"
import PanelNumber from "../models/PanelNumber.model.js";


export const createProductionPanel = async (req, res) => {
  try {
    const {
      company_id,
      panel_capacity,
      panel_count,
      panel_type,
      project,
      state,
      date,
      created_by,
    } = req.body;

    const count = Number(panel_count);

    if (!company_id || !panel_capacity || !panel_type || !project || !state || !date) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    /* FETCH PANELS FIRST */
    const panels = await PanelNumber.find({
      production_status: 0,
      panel_capacity: panel_capacity,
      panel_category : panel_type
    })
      .sort({ createdAt: 1 })
      .limit(count);

    console.log("Panels Found:", panels.length);

    if (panels.length < count) {
      return res.status(400).json({
        success: false,
        message: "Not enough panels available",
      });
    }

    /* CREATE PRODUCTION */
    const productionPanel = await ProductionPanel.create({
      company_id,
      panel_capacity,
      panel_count: count,
      panel_type,
      project,
      state,
      date,
      created_by,
    });

    const panelIds = panels.map((p) => p._id);

    /* UPDATE PANELS */
    const result = await PanelNumber.updateMany(
      { _id: { $in: panelIds } },
      {
        $set: {
          production_id: productionPanel._id,
          production_lot_size: count,
          production_status: 1,
        },
      }
    );

    console.log("Updated Panels:", result.modifiedCount);

    res.status(201).json({
      success: true,
      message: "Production panel created successfully",
      data: {
        production_id: productionPanel._id,
        assigned_panels: result.modifiedCount,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const fetchAllProductionPanels = async (req, res) => {
  try {
    const productionPanels = await ProductionPanel.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: productionPanels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetchProductionPanelById = async (req, res) => {
  try {
    const { id } = req.params;

    const productionPanel = await ProductionPanel.findById(id);

    if (!productionPanel) {
      return res.status(404).json({
        success: false,
        message: "Production panel not found",
      });
    }

    res.status(200).json({
      success: true,
      data: productionPanel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteProductionPanel = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Check production panel exists
    const productionPanel = await ProductionPanel.findById(id);

    if (!productionPanel) {
      return res.status(404).json({
        success: false,
        message: "Production panel not found",
      });
    }

    // 2️⃣ Reset assigned panels
    await PanelNumber.updateMany(
      { production_id: productionPanel._id },
      {
        $set: {
          production_id: null,
          production_lot_size: null,
          production_status: 0,
        },
      }
    );

    // 3️⃣ Delete production panel
    await ProductionPanel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Production panel deleted and panels released",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const scanAndDispatchPanel = async (req, res) => {
  try {
    const { panel_no, dispatch_panel_type } = req.body;

    /* ===============================
       1️⃣ Get dispatch from session
    =============================== */
    const dispatchUniqueId = req.session.dispatch_unique_id;

    if (!dispatchUniqueId) {
      return res.status(400).json({
        success: false,
        message: "Dispatch session not found. Create dispatch first.",
      });
    }

    /* ===============================
       2️⃣ Find panel by QR / panel_no
    =============================== */
    const panel = await PanelNumber.findOne({ panel_no });

    if (!panel) {
      return res.status(404).json({
        success: false,
        message: "Panel not found",
      });
    }

    /* ===============================
       3️⃣ Validate conditions
    =============================== */
    if (panel.production_status !== 1) {
      return res.status(400).json({
        success: false,
        message: "Panel not ready for dispatch",
      });
    }

    if (panel.dispatch_status === 1) {
      return res.status(400).json({
        success: false,
        message: "Panel already dispatched",
      });
    }

    /* ===============================
       4️⃣ Update panel
    =============================== */
    panel.dispatch_id = dispatchUniqueId;
    panel.dispatch_status = 1;
    panel.dispatch_panel_type = dispatch_panel_type;

    await panel.save();

    /* ===============================
       5️⃣ Response
    =============================== */
    res.status(200).json({
      success: true,
      message: "Panel dispatched successfully",
      data: {
        panel_no: panel.panel_no,
        dispatch_id: dispatchUniqueId,
        dispatch_panel_type,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};








