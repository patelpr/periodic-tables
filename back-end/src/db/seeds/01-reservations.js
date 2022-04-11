const reservationsSeed = require("./00-reservations.json");
exports.seed = function (knex) {
	return knex("reservations").insert(reservationsSeed);
};