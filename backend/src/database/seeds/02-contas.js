
exports.seed = function (knex) {
  return knex('contas').del()
    .then(function () {
      return knex('contas').insert([
        {
          numero_identificador: 1,
          saldo: 1000,
          limite: 500,
          usuario_id: 1,
        },
      ]);
    });
};
