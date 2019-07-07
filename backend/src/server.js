'use strict'

import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import logger from 'morgan'
import dotenv from 'dotenv'
import Data from './data'

dotenv.config()
const app = express()

app.use(cors());
const router = express.Router()

const dbRoute = process.env.DB_URL

mongoose.connect(dbRoute, { useNewUrlParser: true, useFindAndModify: false });

let db = mongoose.connection;

db.once('open', () => console.log(
    'connected to the database'
))

db.on('error', console.error.bind(console, 'Mongodb connection error:'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if (err)
            return res.json({success: false, error: err})
        return res.json({ success: true, data: data })
    })
})

router.put('/updateData', (req, res) => {
    console.log("call to updateData", req.body)
    const { id, update } = req.body

    Data.findByIdAndUpdate(id, update, (err) => {
        if (err)
            return res.json({ success: false, error: err })
        return res.json( { success: true})
    })
})

router.delete('/deleteData', (req, res) => {
    const { id } = req.body
    Data.findByIdAndRemove(id, (err) => {
        if (err)
            return res.send(err);
        return res.json({ success: true })
    })
})

router.post('/createData', (req, res) => {
    console.log("call to createData", req.body)
    let data = new Data();

    const { id, message } = req.body
    if ((!id && id !== 0) || !message) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS'
        })
    }

    data.message = message
    data.id = id
    data.save((err) => {
        if (err)
            return res.json({ success: false, error: err })
        return res.json({ success: true })
    })
})

const API_PORT = process.env.API_PORT

app.use('/api', router)
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`))