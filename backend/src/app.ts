import express from "express";
import cors from 'cors';
import dbInit from './config/database';

import contaController from "./controllers/contaController";
import favorecidoController from "./controllers/favorecidoController";
import transacaoController from "./controllers/transacaoController";
import usuarioController from "./controllers/usuarioController";

const app = express();
const PORT = process.env.API_PORT || 3000;
//Configs
dbInit();
//Middlewares
app.use(cors())
app.use(express.json());
//Rotas
app.use(contaController);
app.use(usuarioController);
app.use(transacaoController);
app.use(favorecidoController);

const server = app.listen(PORT, () => {
    console.log(`⚡️ Server(${process.env.NODE_ENV}) is running`);
});

export default server;