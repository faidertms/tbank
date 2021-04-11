import Usuario from "../models/Usuario"
import { ICriarUsuario, IEditarUsuario } from "../types";
import { criarConta } from "./contaService";

export async function getUsuarioPorId(id: number): Promise<Usuario> {
    const usuario = await Usuario.query().findById(id).throwIfNotFound({
        message: `Usuário não encontrado: ${id}`
    });
    return usuario;
}

export async function criarUsuario({
    nome,
    cpf,
    telefone_celular,
    numero_da_conta,
}: ICriarUsuario): Promise<Usuario> {
    //Como um usuario sempre terá uma conta basta chamar o "criarUsuario" para ser criado a conta ao mesmo tempo
    const usuario = await Usuario.query().insert({
        nome,
        cpf,
        telefone_celular,
    });

    const contaModel = await criarConta({
        numero_identificador: numero_da_conta,
        usuario_id: usuario.id
    });

    return usuario;
};

export async function editarUsuario({
    id,
    nome,
    cpf,
    telefone_celular,
}: IEditarUsuario): Promise<Usuario> {
    //Como um usuario sempre terá uma conta basta chamar o "criarUsuario" para ser criado a conta
    const usuario = await Usuario.query().patchAndFetchById(id, {
        nome,
        cpf,
        telefone_celular,
    });

    return usuario;
};



