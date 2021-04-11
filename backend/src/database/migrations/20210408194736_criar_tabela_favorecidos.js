exports.up = function (knex) {
    return knex.schema.createTable('favorecidos', function (table) {
        table.increments();
        table.string('nome', 500).notNullable();
        table.string('cpf', 11).notNullable().unique();
        table.string('telefone_celular').notNullable();
        table.integer('usuario_id').references('id').inTable('usuarios').notNullable();
        table.integer('numero_da_conta').references('numero_identificador').inTable('contas').notNullable();
        table.timestamp('criado_em').defaultTo(knex.fn.now());
        table.unique(['usuario_id', 'numero_da_conta']);
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('favorecidos');
};