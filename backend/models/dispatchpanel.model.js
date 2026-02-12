import mongoose from "mongoose";

const DispatchPanelSchema = new mongoose.Schema(
  {
    dispatch_id: {
      type: String,
      required: true,
      unique: true,
    },
    truck_no: {
      type: String,
      required: true,
      unique: true,
    },
    challan_no: {
      type: String,
      required: true,
      unique: true,
    },
    driver_name: {
      type: String,
      required: true,
    },
    driver_no: {
      type: String,
      required: true,
    },
    dispatch_panel_count: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DispatchPanel", DispatchPanelSchema);
