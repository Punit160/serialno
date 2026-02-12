import mongoose from "mongoose";

const PanelNumberSchema = new mongoose.Schema(
  {
  unique_id: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
    panel_lot_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PanelSerialLot",
      required: true,
    },

    panel_unique_no: {
      type: String,
      required: true,
      unique: true,
    },
    panel_no: {
      type: String,
      required: true,
      unique: true,
    },
    panel_lot_count: {
      type: Number,
      required: true,
    },

    panel_capacity: {
    type: String,
    required: true,
    trim: true,
    },

    state: {
      type: String,
      trim: true,
      uppercase: true,
    },

    panel_category: {
      type: Number,
      enum: [1, 2],
      trim: true,
      default: 0,
    },

    // 🧩 Assignment
    production_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductionPanel",
    },
    production_lot_size: {
      type: Number,
    },
    production_status: {
      type: Number,
      enum: [0, 1], // 0 = pending, 1 = assigned
      default: 0,
    },

    // 🚚 Dispatch
   dispatch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DispatchPanel"
     },
 
    dispatch_status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
   dispatch_panel_type: {
      type: Number,
      enum: [1, 2], // 1 = DCR, 2 = NON DCR
      default: null,
    },

    // 🚚 Dispatch
    damage_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DamagePanel"
     },

    // ❌ Damage
    damage_status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    // 🔄 Collection
    collect_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DamagePanel"
    },
    collect_status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    collect_damage_status: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes for performance
PanelNumberSchema.index({ panel_lot_id: 1 });
PanelNumberSchema.index({ assign_status: 1 });
PanelNumberSchema.index({ dispatch_status: 1 });


export default mongoose.model("PanelNumber", PanelNumberSchema);
