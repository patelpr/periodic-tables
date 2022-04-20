const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const reservationService = require("../reservations/reservations.service");

/** MIDDLEWARE */

function validProps(req, res, next) {
	const { data = {} } = req.body;
	const notColumns = Object.keys(data).filter(
		(column) => !["table_name", "capacity", "reservation_id"].includes(column)
	);

	if (notColumns.length) {
		return next({
			status: 400,
			message: `Columns not on Table: ${notColumns.join(", ")}`,
		});
	}
	next();
}
const checkReqProps = hasProperties(...["table_name", "capacity"]);

function checkTableName(req, res, next) {
	const { table_name } = req.body.data;
	const length = table_name.length;

	if (length >= 2) {
		return next();
	}
	return next({
		status: 400,
		message: `Invalid table_name field. table_name must be at least 2 characters long`,
	});
}
function checkCapacityNum(req, res, next) {
	let { capacity } = req.body.data;

	return typeof capacity !== "number" || Number(!capacity) >= 1
		? next({
				status: 400,
				message: `Invalid capacity field. Capacity must be a positive integer greater than 0`,
		  })
		: next();
}
async function reservationToTable(req, res, next) {
	const data = await service.update(
		{
			...res.locals.table,
			...req.body.data,
		},
		{
			...res.locals.reservation,
			status: "seated",
		}
	);
	res.json({ data });
}
function isBooked(req, res, next) {
	const { status } = res.locals.reservation;
	if (status === "booked") {
		return next();
	}
	next({
		status: 400,
		message: `${status} not valid`,
	});
}
function capacityAvailable(req, res, next) {
	const { capacity } = res.locals.table || req.body.data;
	const { people } = res.locals.reservation;

	if (capacity < people) {
		return next({
			status: 400,
			message: `${people} capacity is required.`,
		});
	} else {
		return next();
	}
}
function isAvailable(req, res, next) {
	const { reservation_id } = res.locals.table;
	if (reservation_id) {
		return next({
			status: 400,
			message: `Table occupied`,
		});
	}
	return next();
}
function isNotAvailable(req, res, next) {
	const { reservation_id } = res.locals.table;
	if (!reservation_id) {
		return next({
			status: 400,
			message: `Table is not occupied.`,
		});
	}

	return next();
}
function hasReservationId(req, res, next) {
	if (!req.body.data.reservation_id) {
		return next({
			status: 400,
			message: `reservation_id cannot be found.`,
		});
	}
	return next();
}
function containsData(req, res, next) {
	if (!req.body.data) {
		return next({
			status: 400,
			message: `Data property is missing.`,
		});
	}
	return next();
}
/**END MIDDLEWARE */
/**DATABASE FUNCTIONS*/
async function checkReservationId({ body }, res, next) {
	const reservation = await reservationService.read(body.data.reservation_id);
	if (!reservation) {
		return next({
			status: 404,
			message: `Reservation ${body.data.reservation_id} cannot be found.`,
		});
	}
	res.locals.reservation = reservation;
	return next();
}
async function findReservation(req, { locals }, next) {
	const reservation = await reservationService.read(
		locals.table.reservation_id
	);
	if (reservation) {
		locals.reservation = reservation;
		return next();
	}
	next({
		status: 404,
		message: `Reservation ${locals.table.reservation_id} cannot be found.`,
	});
}
async function clearTable(req, res, next) {
	const data = await service.update(
		{
			...res.locals.table,
			reservation_id: null,
		},
		{
			...res.locals.reservation,
			status: "finished",
		}
	);
	res.json({ data });
}
async function isTable({ params }, res, next) {
	const table = await service.read(params.table_id);
	if (table) {
		res.locals.table = table;
		return next();
	}
	return next({
		status: 404,
		message: `Table ${params.table_id} cannot be found.`,
	});
}
async function createTable({ body }, res) {
	const data = await service.create(body.data);
	res.status(201).json({ data });
}
async function allTables(req, res) {
	const data = await service.list();
	res.json({ data });
}
async function availableTables(req, res) {
	res.locals.capacity = req.query.capacity;
	const data = await service.listFree();
	res.json({ data });
}
module.exports = {
	create: [
		validProps,
		checkReqProps,
		checkTableName,
		checkCapacityNum,
		asyncErrorBoundary(createTable),
	],
	list: [asyncErrorBoundary(allTables)],
	available: asyncErrorBoundary(availableTables),
	occupy: [
		containsData,
		hasReservationId,
		asyncErrorBoundary(checkReservationId),
		isBooked,
		asyncErrorBoundary(isTable),
		capacityAvailable,
		isAvailable,
		asyncErrorBoundary(reservationToTable),
	],
	remove: [
		asyncErrorBoundary(isTable),
		isNotAvailable,
		asyncErrorBoundary(findReservation),
		asyncErrorBoundary(clearTable),
	],
};
