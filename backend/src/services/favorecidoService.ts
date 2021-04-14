import Favorecido from "../models/Favorecido";
import { ICriarFavorecido, IEditarFavorecido } from "../types";
import { criarUsuario } from "./usuarioService";
import { verificarSeContaExiste } from "./contaService";

export async function getFavorecidoDoUsuarioPorId(id: number, usuario_id: number): Promise<Favorecido> {
    const favorecido = await Favorecido.query().findOne({ id, usuario_id }).throwIfNotFound({
        message: `Favorecido não encontrado: ${id}`
    });
    return favorecido;
};

export async function deletarFavorecidoDoUsuario(id: number, usuario_id: number): Promise<number> {
    const qtdRemovidos = await Favorecido.query().where({ id, usuario_id }).delete().throwIfNotFound({
        message: `Favorecido não encontrado do Usuário: ${usuario_id}`
    });
    return qtdRemovidos;
};

export async function editarFavorecidoDoUsuario({
    id,
    nome,
    telefone_celular,
    usuario_id
}: IEditarFavorecido): Promise<Favorecido> {
    const favorecido = await Favorecido.query().findOne({ id, usuario_id });
    const novoFavorecido = await favorecido.$query().patchAndFetch({
        nome,
        telefone_celular,
    });
    return novoFavorecido;
};

export async function getFavorecidosDoUsuario(
    usuario_id: number,
    offset: number = 0,
    limit: number = 50
): Promise<Favorecido[]> {
    const favorecidos = await Favorecido.query().where({ usuario_id }).limit(limit).offset(offset);
    return favorecidos;
};

export async function criarFavorecido({
    nome,
    cpf,
    telefone_celular,
    numero_da_conta,
    usuario_id
}: ICriarFavorecido): Promise<Favorecido> {
    //Como um favorecido vai ter uma conta basta chamar o "criarUsuario" para ser criado o usuario e a conta caso não exista
    const existeConta = await verificarSeContaExiste(numero_da_conta);
    if (!existeConta)
        await criarUsuario({
            nome,
            cpf,
            telefone_celular,
            numero_da_conta,
        });

    const favorecido = await Favorecido.query().insert({
        nome,
        cpf,
        telefone_celular,
        usuario_id: usuario_id,
        numero_da_conta: numero_da_conta,
    });

    return favorecido;
};
