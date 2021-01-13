exports.up = function(knex) {
    return knex.schema.createTable('chat', function (table) {
        table.string('author').primary();
        table.string('message').notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('chat');
  };