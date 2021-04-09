import { Model } from "objection";

export default class TipoDeTransacao extends Model {
    id!: number;
    descricao!: string;

    static get tableName(): string {
        return "tipo_de_transacoes";
    }

    static get jsonSchema(): object {
        return {
            type: "object",
            required: ["descricao", "conta_de_origem", "conta_de_destino", "tipo_de_transacao_id"],

            properties: {
                descricao: { type: "string" },
            }
        };
    }
}
