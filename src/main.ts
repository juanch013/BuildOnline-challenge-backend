import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const port = Number(process.env.APP_PORT)

app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})