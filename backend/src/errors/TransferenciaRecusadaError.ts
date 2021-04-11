export default class TransferenciaRecusadaError extends Error {
    private numero_da_conta: number;

    constructor(mensagem: string, numero_da_conta: number) {
        super(mensagem)
        this.numero_da_conta = numero_da_conta;
        this.name = this.constructor.name;
    }

    public getNumeroDaConta() {
        return this.numero_da_conta;
    }
}
