
exports.seed = function (knex) {
  return knex('tipo_de_transacoes').del()
    .then(function () {
      return knex('tipo_de_transacoes').insert([
        { id: 1, descricao: 'Transferência enviada' },
        { id: 2, descricao: 'Transferência recebida' },
      ]);
    });
};
