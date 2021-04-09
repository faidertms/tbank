exports.up = function (knex) {
    return knex.schema.createTable('tipo_de_transacoes', function (table) {
        table.increments();
        table.string('descricao').notNullable();
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('tipo_de_transacoes');
};
