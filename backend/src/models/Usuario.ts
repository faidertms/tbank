import { Model } from "objection";

export default class Usuario extends Model {
    id!: number;
    nome!: string;
    cpf!: string;
    telefone_celular!: string;
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
            required: ["nome", "cpf", "telefone_celular"],

            properties: {
                id: { type: 'integer' },
                nome: { type: "string", minLength: 1, maxLength: 500 },
                cpf: { type: "string" , minLength: 1, maxLength: 11 },
                telefone_celular: { type: "string" },
            }
        };
    }
}
