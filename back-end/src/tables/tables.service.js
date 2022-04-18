let knex = require("../db/connection");

async function create(table) {
	return knex("tables")
		.insert(table)
		.returning("*")
		.then((createdRecords) => createdRecords[0]);
}

async function read(table_id) {
	return knex("tables").select("*").where({ table_id }).first();
}
async function allTables() {
	return knex("tables").select("*").orderBy("table_name");
}

async function availableTables() {
	return knex("tables")
		.select("*")
		.where({ reservation_id: null })
		.orderBy("table_name");
}
async function update(updatedTable, updatedReservation) {
	let trx = await knex.transaction();
	return knex("tables")
		.select("*")
		.where({ table_id: updatedTable.table_id })
		.update(updatedTable, "*")
		.then(function () {
			return trx("reservations")
				.select("*")
				.where({ reservation_id: updatedReservation.reservation_id })
				.update(updatedReservation, "*");
		})
		.then(trx.commit)
		.catch(trx.rollback);
}

module.exports = {
	list: allTables,
	create,
	listFree: availableTables,
	read,
	update,
};
