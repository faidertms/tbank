import { Model } from "objection";
import Conta from "./conta";
import Usuario from "./Usuario";

export default class Favorecido extends Model {
    id!: number;
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
            required: ["descricao", "conta_de_origem", "conta_de_destino", "tipo_de_transacao_id"],

            properties: {
                id: { type: 'integer' },
                usuario_id: { type: "integer" },
                numero_da_conta: { type: "integer" },
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
