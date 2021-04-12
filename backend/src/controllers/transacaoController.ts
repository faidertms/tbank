import { Request, Response, Router } from "express";
import { ITransferirDinheiroEntreContas } from "../types";
import { errorHandler, sendResponse } from "./coreController";
import * as transacaoService from "../services/transacaoService";

const router = Router();

router.get('/contas/:numero_da_conta/transacoes', async (req: Request, res: Response) => {
    try {
        const numero_da_conta = parseInt(req.params.numero_da_conta) ?? 0;
        const transacoes = await transacaoService.getTransacoesDaConta(numero_da_conta);
        return sendResponse({
            data: transacoes,
            code: 200,
            res
        });
    } catch (error) {
        return errorHandler({ error, res });
    }
});


router.post('/transacoes/transfencia-entre-contas', async (req: Request, res: Response) => {
    try {
        const dados: ITransferirDinheiroEntreContas = req.body;
        const transacao = await transacaoService.transferirDinheiroEntreContas(dados);
        return sendResponse({
            data: transacao,
            code: 201,
            res
        });
    } catch (error) {
        return errorHandler({ error, res });
    }
});

export default router;