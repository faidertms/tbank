import { Request, Response, Router } from "express";
import * as usuarioService from "../services/usuarioService";
import { errorHandler, sendResponse } from "./coreController";

const router = Router();

router.get('/usuarios/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id) ?? 0;
        const usuario = await usuarioService.getUsuarioPorId(id);
        sendResponse({
            data: usuario,
            code: 200,
            res
        })
    } catch (error) {
        errorHandler({ error, res });
    }
});

export default router;