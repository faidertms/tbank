import express from "express";
import cors from 'cors';
import knex from './config/database';

const app = express();
const PORT = process.env.APP_PORT || 3000;
const PREFIX = "/api";

app.use(cors())
app.use(express.json());
// app.use(PREFIX,);

const server = app.listen(PORT, () => {
    console.log(`⚡️ Server(${process.env.NODE_ENV}) is running`);
});

export default server;