
exports.seed = async function (knex) {
  await knex('contas').del();
  await knex('usuarios').del();
  await knex('usuarios').insert([
    {
      id: 1,
      nome: 'Thiago',
      cpf: 11155577735,
      telefone_celular: 85988888888
    },
  ]);
};
