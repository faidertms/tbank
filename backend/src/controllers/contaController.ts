import { Request, Response, Router } from "express";
import { errorHandler, sendResponse } from "./coreController";
import * as contaService from "../services/contaService";

const router = Router();

router.get('/usuarios/:usuario_id/conta', async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.params.usuario_id) ?? 0;
        const conta = await contaService.getContaDoUsuario(usuario_id);

        sendResponse({
            data: conta,
            code: 200,
            res
        })
    } catch (error) {
        errorHandler({ error, res });
    }
});

export default router;