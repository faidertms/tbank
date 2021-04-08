exports.up = function (knex) {
    return knex.schema.createTable('usuarios', function (table) {
        table.increments();
        table.string('nome', 500).notNullable();
        table.string('cpf', 11).notNullable();
        table.string('telefone_celular').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('usuarios');
};