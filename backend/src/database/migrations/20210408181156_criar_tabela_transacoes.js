exports.up = function (knex) {
    return knex.schema.createTable('transacoes', function (table) {
        table.increments();
        table.decimal('valor', 12, 2).notNullable();
        table.timestamp('data_hora').defaultTo(knex.fn.now()).notNullable();
        table.integer('num_conta_de_origem').references('numero_identificador').inTable('contas').notNullable();
        table.integer('num_conta_de_destino').references('numero_identificador').inTable('contas').notNullable();
        table.integer('tipo_de_transacao_id').references('id').inTable('tipo_de_transacoes').notNullable();
        
        
    });
};

exports.down = function (knex) {
    return knex.schema.dropTable('transacoes');
};