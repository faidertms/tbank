
exports.seed = function (knex) {

  return knex('tipo_de_transacoes').insert([
    { id: 1, descricao: 'TransferĂȘncia enviada' },
    { id: 2, descricao: 'TransferĂȘncia recebida' },
    { id: 3, descricao: 'TransferĂȘncia cancelada' },
  ]).onConflict('id')
    .ignore();

};
