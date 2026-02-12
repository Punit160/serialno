import mongoose from "mongoose";


const TaskSchema = new mongoose.Schema({
    unique_id : {
        type:String,
        required : true,
        trim : true,
        unique: true
    },
    company_id : {
        type : String,
        required : true,
        trim : true,
    },
    task_id : {
        type : String,
        required : true,
        trim : true,
    },
    state : {
        type : String,
        required : true,
        trim : true,
    },
    subject : {
        type : String,
        required : true,
        trim : true,
    },
    message : {
        type : String,
        required : true,
        trim : true,
    },
    assigned_to : {
        type : String,
        required: true,
        trim : true,
    },
    assigned_by : {
        type : String,
        required : true,
        trim : true,
    },
    deadline_date : {
        type : String,
        trim : true,
    },
    document : {
       type : String, 
    },
    created_by: {
      type: String,
      trim: true,
    },

    updated_by: {
      type: String,
      trim: true,
    },     
},
  { timestamps: true }
)

export default mongoose.model("Task", TaskSchema)