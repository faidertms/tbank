exports.seed = async function (knex) {
  await knex('transacoes').del();
  await knex('favorecidos').del();
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
  await knex('contas').insert([
    {
      numero_identificador: 1,
      saldo: 1000,
      limite: 500,
      usuario_id: 1,
    },
  ]);

  await knex.raw('ALTER SEQUENCE usuarios_id_seq RESTART WITH 2');
};
