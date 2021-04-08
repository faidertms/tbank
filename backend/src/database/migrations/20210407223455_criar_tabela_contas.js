
exports.up = function (knex) {
    return knex.schema.createTable('contas', function (table) {
        table.integer('numero_identificador').notNullable().primary();
        table.decimal('saldo', 12, 2).notNullable().default(0); 
        table.decimal('limite', 12, 2).notNullable().default(0);
        table.integer('usuario_id').references('id').inTable('usuarios');
        table.timestamp('created_at').defaultTo(knex.fn.now())
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('usuarios');
};
