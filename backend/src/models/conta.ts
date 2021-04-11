import { Model } from "objection";
import Usuario from "./Usuario";
export default class Conta extends Model {
    numero_identificador!: number;
    saldo!: number;
    limite!: number;
    usuario_id!: number;
    criado_em?: Date | string;

    static get tableName(): string {
        return "contas";
    }

    static get idColumn() {
        return 'numero_identificador';
    }

    static get jsonSchema(): object {
        return {
            type: "object",
            required: ["numero_identificador", "saldo", "limite", "usuario_id"],

            properties: {
                numero_identificador: { type: "integer" },
                saldo: { type: "number" },
                limite: { type: "number" },
                usuario_id: { type: "integer" },
            }
        };
    }

    static relationMappings = () => ({
        usuario: {
            relation: Model.BelongsToOneRelation,
            modelClass: Usuario,

            join: {
                from: 'contas.usuario_id',
                to: 'usuarios.id',
            },
        },
    })
}
