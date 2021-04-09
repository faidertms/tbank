exports.up = function (knex) {
    return knex.schema.createTable('favorecidos', function (table) {
        table.increments();
        table.integer('usuario_id').references('id').inTable('usuarios').notNullable();
        table.integer('numero_da_conta').references('numero_identificador').inTable('contas').notNullable();
        table.timestamp('criado_em').defaultTo(knex.fn.now());
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('favorecidos');
};