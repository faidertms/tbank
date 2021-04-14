import request from "supertest";
import app from "../app";
import Conta from "../models/Conta";
import { TiposDeTransacoesEnum } from "../types";

//Simple Test
describe("Testando usuario API", () => {
    let usuarioId = 1;
    let contaDoUsuario: Conta;
    let numeroDaContaFavorecido = 555952245;
    let favorecidoId = 0;
    test("Buscar dados do Usuario", async () => {
        const response = await request(app).get(`/usuarios/${usuarioId}`);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('nome');
        expect(response.body).toHaveProperty('cpf');
        expect(response.body).toHaveProperty('telefone_celular');
        expect(response.body).toHaveProperty('criado_em');
        expect(response.status).toBe(200);
    });

    test("Buscar dados do Usuario que não existe", async () => {
        const response = await request(app).get(`/usuarios/-1`);
        expect(response.status).toBe(404);
    });

    test("Buscar dados da Conta", async () => {
        const response = await request(app).get(`/usuarios/1/conta`);
        contaDoUsuario = response.body;
        expect(response.body).toHaveProperty('numero_identificador');
        expect(response.body).toHaveProperty('saldo'); // Poderia botar 1000, porém se o banco de dados não for novo vai gerar erro
        expect(response.body).toHaveProperty('limite'); // Poderia botar 500, porém se o banco de dados não for novo vai gerar erro
        expect(response.body).toHaveProperty('usuario_id', usuarioId);
        expect(response.body).toHaveProperty('criado_em');
        expect(response.status).toBe(200);
    });

    test("Buscar dados da Conta de um Usuario que não existe", async () => {
        const response = await request(app).get(`/usuarios/-1/conta`);
        expect(response.status).toBe(404);
    });


    test("Criar Favorecido", async () => {
        const response = await request(app).post(`/usuarios/${usuarioId}/favorecidos`).send({
            nome: 'Teste',
            cpf: '1531536322',
            telefone_celular: '85999999999',
            numero_da_conta: numeroDaContaFavorecido,
        });
        favorecidoId = response.body.id;
        expect(response.status).toBe(201);
    });

    test("Criar Favorecido que já existe para o usuario", async () => {
        const response = await request(app).post(`/usuarios/${usuarioId}/favorecidos`).send({
            nome: 'Teste',
            cpf: '1531536322',
            telefone_celular: '85999999999',
            numero_da_conta: numeroDaContaFavorecido,
        });
        expect(response.status).toBe(409);
    });

    test("Editar Favorecidos", async () => {
        const response = await request(app).put(`/usuarios/${usuarioId}/favorecidos/${favorecidoId}`).send({
            nome: 'Testees',
            telefone_celular: '85989999999',
        });

        expect(response.status).toBe(200);
    });

    test("Buscar Favorecidos", async () => {
        const response = await request(app).put(`/usuarios/${usuarioId}/favorecidos/${favorecidoId}`);

        expect(response.status).toBe(200);
    });

    test("Deleta Favorecidos", async () => {
        const response = await request(app).delete(`/usuarios/${usuarioId}/favorecidos/${favorecidoId}`);
        expect(response.status).toBe(200);
    });


    test("Transferir para Conta do Favorecido", async () => {
        const response = await request(app).post(`/transacoes/transferencia-entre-contas`).send({
            valor: 50.00,
            num_conta_de_origem: contaDoUsuario.numero_identificador,
            num_conta_de_destino: numeroDaContaFavorecido
        });

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('data_hora');
        expect(response.body).toHaveProperty('valor', 50.00); // Poderia botar 1000, porém se o banco de dados não for novo vai gerar erro
        expect(response.body).toHaveProperty('num_conta_de_origem', contaDoUsuario.numero_identificador);
        expect(response.body).toHaveProperty('num_conta_de_destino', numeroDaContaFavorecido);
        expect(response.body).toHaveProperty('tipo_de_transacao_id', TiposDeTransacoesEnum.EnviarTransferencia);
        expect(response.status).toBe(201);
    });

    test("Verificar saldo da Conta após transferência ", async () => {
        const response = await request(app).get(`/usuarios/1/conta`);
        expect(response.body.saldo).toBe(contaDoUsuario.saldo - 50); // Saldo antigo subtraido da transferência
        expect(response.status).toBe(200);
    });

    test("Transferir para Conta do Favorecido com o mesmo valor em menos de 2 minutos", async () => {
        // vai cancelar transferência a antiga e deixa a mais recente logo vai ter o mesmo saldo
        const response = await request(app).post(`/transacoes/transferencia-entre-contas`).send({
            valor: 50.00,
            num_conta_de_origem: contaDoUsuario.numero_identificador,
            num_conta_de_destino: numeroDaContaFavorecido
        });

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('data_hora');
        expect(response.body).toHaveProperty('valor', 50.00); // Poderia botar 1000, porém se o banco de dados não for novo vai gerar erro
        expect(response.body).toHaveProperty('num_conta_de_origem', contaDoUsuario.numero_identificador);
        expect(response.body).toHaveProperty('num_conta_de_destino', numeroDaContaFavorecido);
        expect(response.body).toHaveProperty('tipo_de_transacao_id', TiposDeTransacoesEnum.EnviarTransferencia);
        expect(response.status).toBe(201);
    });

    test("Verificar saldo da Conta após transferência igual em menos de 2 minutos", async () => {
        const response = await request(app).get(`/usuarios/1/conta`);
        expect(response.body.saldo).toBe(contaDoUsuario.saldo - 50); // vai cancelar transferência a antiga e deixa a mais recente logo vai ter o mesmo saldo
        expect(response.status).toBe(200);
    });

    test("Favorecido transferir de volta o mesmo valor", async () => {
        // vai cancelar transferência a antiga e deixa a mais recente logo vai ter o mesmo saldo
        const response = await request(app).post(`/transacoes/transferencia-entre-contas`).send({
            valor: 50.00,
            num_conta_de_origem: numeroDaContaFavorecido,
            num_conta_de_destino: contaDoUsuario.numero_identificador,
        });

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('data_hora');
        expect(response.body).toHaveProperty('valor', 50.00); // Poderia botar 1000, porém se o banco de dados não for novo vai gerar erro
        expect(response.body).toHaveProperty('num_conta_de_origem', numeroDaContaFavorecido);
        expect(response.body).toHaveProperty('num_conta_de_destino', contaDoUsuario.numero_identificador);
        expect(response.body).toHaveProperty('tipo_de_transacao_id', TiposDeTransacoesEnum.EnviarTransferencia);
        expect(response.status).toBe(201);
    });

    test("Verificar saldo da Conta após transferência do favorecido com valor igual", async () => {
        const response = await request(app).get(`/usuarios/1/conta`);
        expect(response.body.saldo).toBe(contaDoUsuario.saldo); // favorecido vai voltar o mesmo valor via transferencia
        expect(response.status).toBe(200);
    });

    test("Transferir valor acima do limite + saldo", async () => {
        // vai verificar se o valor é maior que o limite + saldo se sim deve voltar erro.
        const response = await request(app).post(`/transacoes/transferencia-entre-contas`).send({
            valor: 500000000000.00,
            num_conta_de_origem: numeroDaContaFavorecido,
            num_conta_de_destino: contaDoUsuario.numero_identificador,
        });
        expect(response.status).toBe(402);
    });

});

afterAll(async (done: any) => {
    app.close();
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    done();
})
