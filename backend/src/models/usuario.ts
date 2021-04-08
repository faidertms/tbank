import { Model } from "objection";

export default class Usuario extends Model {
    id!: number;
    nome!: string;
    cpf!: string;
    telefone_celular!: string;
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
            required: ["nome", "cpf", "telefone_celular"],

            properties: {
                id: { type: "number" },
                nome: { type: "string", minLength: 1, maxLength: 500 },
                cpf: { type: "string" , minLength: 1, maxLength: 11 },
                telefone_celular: { type: "string" },
            }
        };
    }
}
