import { Model } from "objection";
import Conta from "./Conta";
import Usuario from "./Usuario";

export default class Favorecido extends Model {
    id!: number;
    nome!: string;
    cpf!: string;
    telefone_celular!: string;
    usuario_id!: number;
    numero_da_conta!: number;
    criado_em?: Date | string;

    $beforeInsert(): void {
        this.criado_em = new Date().toISOString();
    }

    static get tableName(): string {
        return "favorecidos";
    }

    static get jsonSchema(): object {
        return {
            type: "object",
            required: ["usuario_id", "numero_da_conta"],

            properties: {
                id: { type: 'integer' },
                usuario_id: { type: "integer" },
                telefone_celular: { type: "string" },
                numero_da_conta: { type: "integer" },
                cpf: { type: "string", minLength: 1, maxLength: 11 },
                nome: { type: "string", minLength: 1, maxLength: 500 },
            }
        };
    }

    static relationMappings = () => ({
        usuario: {
            relation: Model.BelongsToOneRelation,
            modelClass: Usuario,

            join: {
                from: 'favorecidos.usuario_id',
                to: 'usuarios.id',
            },
        },
        conta: {
            relation: Model.BelongsToOneRelation,
            modelClass: Conta,

            join: {
                from: 'favorecidos.numero_da_conta',
                to: 'contas.numero_identificador',
            },
        },
    })
}
