import DamagePanel from "../models/damagepanel.model.js";
import PanelNumber from "../models/PanelNumber.model.js";
import mongoose from "mongoose";

export const createDamagePanel = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let { panel_no, remarks } = req.body;
    const damage_location_type = Number(req.body.damage_location_type);

    // Normalize panel list
    const panels = Array.isArray(panel_no) ? panel_no : [panel_no];
    if (!panels.length) {
      return res.status(400).json({
        success: false,
        message: "panel_no is required",
      });
    }

    const invalidPanels = [];
    const validPanels = [];

    // 1️⃣ Validate all panels first
    for (let pNo of panels) {
      const panel = await PanelNumber.findOne({ panel_unique_no: pNo }).session(session);

      if (!panel) {
        invalidPanels.push({ panel_no: pNo, reason: "Panel not found" });
        continue;
      }

      if (damage_location_type === 1 && panel.production_status !== 1) {
        invalidPanels.push({ panel_no: pNo, reason: "Production not completed" });
        continue;
      }

      if (damage_location_type === 2 && panel.dispatch_status !== 1) {
        invalidPanels.push({ panel_no: pNo, reason: "Panel not dispatched yet" });
        continue;
      }

      validPanels.push(panel);
    }

    if (invalidPanels.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Some panels failed validation",
        invalid_panels: invalidPanels,
      });
    }

    // 2️⃣ Handle image
    const imagePath = req.file ? req.file.path : "";

    const savedDamages = [];

    // 3️⃣ Process valid panels
    for (let panel of validPanels) {
      // First update panel table
      if (damage_location_type === 1) {
        panel.damage_status = 1;
        panel.dispatch_status = 0;
      } else if (damage_location_type === 2) {
        panel.collect_status = 1;
        panel.collect_damage_status = 1;
      }

      await panel.save({ session });

      // Now create damage panel
      const damagePanel = await DamagePanel.create(
        [
          {
            panel_no: panel.panel_unique_no,
            damage_location_type,
            image: imagePath,
            remarks,
          },
        ],
        { session }
      );

      // Link damage ID to panel
      if (damage_location_type === 1) panel.damage_id = damagePanel[0]._id;
      if (damage_location_type === 2) panel.collect_id = damagePanel[0]._id;

      await panel.save({ session });

      savedDamages.push(damagePanel[0]);
    }

    // 4️⃣ Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Damage recorded successfully",
      total_saved: savedDamages.length,
      data: savedDamages,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



/* =========================================
   ✅ GET ALL DAMAGE PANELS
========================================= */
export const getAllDamagePanels = async (req, res) => {
  try {
    const damages = await DamagePanel.find().sort({ unique_id: -1 });

    res.status(200).json({
      success: true,
      total: damages.length,
      data: damages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================
   ✅ GET DAMAGE BY PANEL NO
========================================= */
export const getDamageByPanelNo = async (req, res) => {
  try {
    const { panel_no } = req.params;

    const damages = await DamagePanel.find({ panel_no });

    if (!damages.length) {
      return res.status(404).json({
        success: false,
        message: "No damage records found for this panel",
      });
    }

    res.status(200).json({
      success: true,
      total: damages.length,
      data: damages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================
   ✅ GET SINGLE DAMAGE BY unique_id
========================================= */
export const getDamageById = async (req, res) => {
  try {
    const { unique_id } = req.params;

    const damage = await DamagePanel.findOne({ unique_id });

    if (!damage) {
      return res.status(404).json({
        success: false,
        message: "Damage record not found",
      });
    }

    res.status(200).json({
      success: true,
      data: damage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================================
   ✅ UPDATE DAMAGE PANEL
========================================= */
export const updateDamagePanel = async (req, res) => {
  try {
    const { unique_id } = req.params;

    const damage = await DamagePanel.findOneAndUpdate(
      { unique_id },
      req.body,
      { new: true }
    );

    if (!damage) {
      return res.status(404).json({
        success: false,
        message: "Damage record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Damage updated successfully",
      data: damage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDamageTypeOnePanels = async (req, res) => {
  try {
    const panels = await DamagePanel.find({
      damage_location_type: 1,
    }).sort({ createdAt: -1 });

    // Attach panel details
    const result = await Promise.all(
      panels.map(async (damage) => {
        const panelDetail = await PanelNumber.findOne({
          damage_id: damage._id,
        });

        return {
          ...damage.toObject(),
          panel_category: panelDetail?.panel_category || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      total: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getDamageTypeTwoPanels = async (req, res) => {
  try {
    const panels = await DamagePanel.find({
      damage_location_type: 2,
    }).sort({ createdAt: -1 });

    const result = await Promise.all(
      panels.map(async (damage) => {
        const panelDetail = await PanelNumber.findOne({
          collect_id: damage._id,
        });

        return {
          ...damage.toObject(),
          panel_category: panelDetail?.panel_category || null,
        };
      })
    );

    res.status(200).json({
      success: true,
      total: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



