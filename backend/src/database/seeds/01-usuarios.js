
exports.seed = function (knex) {
  return knex('usuarios').del()
    .then(function () {
      return knex('usuarios').insert([
        {
          id: 1,
          nome: 'Thiago',
          cpf: 11155577735,
          telefone_celular: 85988888888
        },
      ]);
    });
};
