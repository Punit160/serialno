import express from "express";
import mongoose from "mongoose";

const ConnectDb = async() => {
    try {
        mongoose.connect(process.env.MONGO_URL);
        console.log('Database Connected Successfully !!');
    } catch (error) {
        console.log(`Database Not Connected ${error}`);
    }
}

export default ConnectDb