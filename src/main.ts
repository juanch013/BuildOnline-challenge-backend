import express from 'express'
import apiRouter from './apiRouter'
import dotenv from 'dotenv'
import dataSource from "./connection/connection"
import 'reflect-metadata'
dotenv.config()

const app = express();
app.use(express.json()); 

const port = Number(process.env.APP_PORT);

app.use('/api',apiRouter);

dataSource.initialize().then(()=>{
    console.log("Successfully connected to database")
})

app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})