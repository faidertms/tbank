import { Model } from "objection";
import Usuario from "./usuario";

export default class Conta extends Model {
    numero_identificador!: string;
    saldo!: string;
    limite!: string;
    usuario?: Usuario
    created_at?: Date | string;
    updated_at?: Date | string;

    $beforeInsert(): void {
        this.created_at = new Date().toISOString();
        this.updated_at = new Date().toISOString();
    }

    $beforeUpdate(): void {
        this.updated_at = new Date().toISOString();
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
