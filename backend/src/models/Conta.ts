import { Model } from "objection";
import Usuario from "./Usuario";

export default class Conta extends Model {
    numero_identificador!: string;
    saldo!: string;
    limite!: string;
    usuario?: Usuario
    criado_em?: Date | string;

    $beforeInsert(): void {
        this.criado_em = new Date().toISOString();
    }

    static get tableName(): string {
        return "usuarios";
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
