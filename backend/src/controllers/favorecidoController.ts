import { Request, Response, Router } from "express";
import { ICriarFavorecido, IEditarFavorecido } from "../types";
import { errorHandler, sendResponse } from "./coreController";
import * as favorecidoService from "../services/favorecidoService";

const router = Router();

router.get('/usuarios/:usuario_id/favorecidos', async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.params.usuario_id) ?? 0;
        const favorecidos = await favorecidoService.getFavorecidosDoUsuario(usuario_id);
        sendResponse({
            data: favorecidos,
            code: 200,
            res
        });
    } catch (error) {
        errorHandler({ error, res });
    }
});

router.post('/usuarios/:usuario_id/favorecidos', async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.params.usuario_id) ?? 0;
        const dados = { ...req.body, usuario_id, };
        const favorecido = await favorecidoService.criarFavorecido(dados);
        sendResponse({
            data: favorecido,
            code: 201,
            res
        });
    } catch (error) {
        errorHandler({ error, res });
    }
});

router.get('/usuarios/:usuario_id/favorecidos/:favorecido_id', async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.params.usuario_id) ?? 0;
        const favorecido_id = parseInt(req.params.favorecido_id) ?? 0;
        const favorecido = await favorecidoService.getFavorecidoDoUsuarioPorId(favorecido_id, usuario_id);
        sendResponse({
            data: favorecido,
            code: 201,
            res
        });
    } catch (error) {
        errorHandler({ error, res });
    }
});

router.put('/usuarios/:usuario_id/favorecidos/:favorecido_id', async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.params.usuario_id) ?? 0;
        const favorecido_id = parseInt(req.params.favorecido_id) ?? 0;
        const dados: IEditarFavorecido = { ...req.body, usuario_id, id: favorecido_id };
        await favorecidoService.editarFavorecidoDoUsuario(dados);
        sendResponse({
            code: 200,
            res
        });
    } catch (error) {
        errorHandler({ error, res });
    }
});


router.delete('/usuarios/:usuario_id/favorecidos/:favorecido_id', async (req: Request, res: Response) => {
    try {
        const usuario_id = parseInt(req.params.usuario_id) ?? 0;
        const favorecido_id = parseInt(req.params.favorecido_id) ?? 0;
        await favorecidoService.deletarFavorecidoDoUsuario(favorecido_id, usuario_id);
        sendResponse({
            code: 200,
            res
        });
    } catch (error) {
        errorHandler({ error, res });
    }
});



export default router;