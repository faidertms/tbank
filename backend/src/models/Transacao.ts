import { Model } from "objection";
import Conta from "./Conta";
import Favorecido from "./Favorecido";
import TipoDeTransacao from "./TipoDeTransacao";

export default class Transacao extends Model {
    id!: number;
    valor!: number;
    num_conta_de_origem!: number;
    num_conta_de_destino!: number;
    tipo_de_transacao_id!: number;
    numero_autenticacao!: string;
    data_hora?: Date | string;

    $beforeInsert(): void {
        this.data_hora = new Date().toISOString();
    }

    static get tableName(): string {
        return "transacoes";
    }

    static get jsonSchema(): object {
        return {
            type: "object",
            required: ["numero_autenticacao", "valor", "num_conta_de_origem", "num_conta_de_destino", "tipo_de_transacao_id"],

            properties: {
                id: { type: 'integer' },
                valor: { type: "number" },
                num_conta_de_origem: { type: "integer" },
                num_conta_de_destino: { type: "integer" },
                numero_autenticacao: { type: "string" },
                tipo_de_transacao_id: { type: "integer" },
            }
        };
    }

    static relationMappings = () => ({
        conta_de_destino: {
            relation: Model.BelongsToOneRelation,
            modelClass: Conta,

            join: {
                from: 'transacoes.num_conta_de_destino',
                to: 'contas.numero_identificador',
            },
        },
        conta_de_origem: {
            relation: Model.BelongsToOneRelation,
            modelClass: Conta,

            join: {
                from: 'transacoes.num_conta_de_origem',
                to: 'contas.numero_identificador',
            },
        },
        favorecido: {
            relation: Model.HasOneRelation,
            modelClass: Favorecido,
            join: {
                from: 'transacoes.num_conta_de_destino',
                to: 'favorecidos.numero_da_conta',
            },
        },
        tipo_de_transacao: {
            relation: Model.BelongsToOneRelation,
            modelClass: TipoDeTransacao,

            join: {
                from: 'transacoes.tipo_de_transacao_id',
                to: 'tipo_de_transacoes.id',
            },
        },
    })
}
