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
async function list(date) {
	return knex("reservations")
		.select("*")
		.where({ status: "booked", reservation_date: date })
		.orWhere({ status: "seated", reservation_date: date });
	// .orderBy("reservation_time");
}

// list of reservations that match search criteria (phone number)
async function searchList(mobile_number) {
	return knex("reservations")
		.where({ mobile_number })
		.orderBy("reservation_date");
}
/**UPDATE */


function update(updated) {
	return knex("reservations")
		.select("*")
		.where({ reservation_id: updated.reservation_id })
		.update(updated, "*")
		.returning("*")
		.then((updatedRecord) => updatedRecord[0]);
}
function updateStatus(reservation) {
	return knex("reservations")
		.select("*")
		.where({ reservation_id: reservation.reservation_id })
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
