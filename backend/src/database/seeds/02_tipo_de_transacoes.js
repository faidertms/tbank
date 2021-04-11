
exports.seed = function (knex) {

  return knex('tipo_de_transacoes').insert([
    { id: 1, descricao: 'Transferência enviada' },
    { id: 2, descricao: 'Transferência recebida' },
    { id: 3, descricao: 'Transferência cancelada' },
  ]).onConflict('id')
    .ignore();

};
