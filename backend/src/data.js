'use strict'

import mongoose, { Schema, mongo } from 'mongoose'

const DataSchema = new Schema(
    {
        id: Number,
        message: String
    },
    { timestamps: true }
);

const Data = mongoose.model("Data", DataSchema)

export default Data;