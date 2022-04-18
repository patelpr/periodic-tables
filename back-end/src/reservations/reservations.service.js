const knex = require("../db/connection");

/**CREATE */
function create(reservation) {
	return knex("reservations")
		.insert(reservation)
		.returning("*")
		.then((createdRecords) => createdRecords[0]);
}
/** READ */
function read(reservation_id) {
	return knex("reservations").select("*").where({ reservation_id }).first();
}
async function list(reservation_date) {
	return knex("reservations")
		.select("*")
		.where({ reservation_date })
		.whereNot({ status: "finished" })
		.orderBy("reservation_time");
}
async function searchList(mobile_number) {
	return knex("reservations")
		.where("mobile_number", "like", `%${mobile_number}%`)
}
/**UPDATE */

function update(updated) {
	const { reservation_id } = updated;

	return knex("reservations")
		.select("*")
		.where({ reservation_id })
		.update(updated, "*")
		.returning("*")
		.then((updatedRecord) => updatedRecord[0]);
}
function updateStatus(reservation) {
	const { reservation_id } = reservation;
	return knex("reservations")
		.select("*")
		.where({ reservation_id })
		.update(reservation, "*")
		.returning("*")
		.then((updatedRecord) => updatedRecord[0]);
}

module.exports = {
	list,
	searchList,
	create,
	read,
	updateStatus,
	update,
};
