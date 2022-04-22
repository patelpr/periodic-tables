const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
function queryDate(req, res, next) {
	let today = new Date();
	today = today && today.toISOString().split("T")[0];
	res.locals.date = req.query.date || today;
	next();
}
function queryMobile({ query }, { locals }, next) {
	locals.mobileNumber = query.mobile_number
		? query.mobile_number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
		: null;
	next();
}

const checkReqProps = hasProperties(
	...[
		"first_name",
		"last_name",
		"people",
		"reservation_date",
		"reservation_time",
		"mobile_number",
	]
);

function partySize(req, res, next) {
	let { people } = req.body.data;
	return typeof people !== "number" || people < 1
		? next({ status: 400, message: `Not enough people in your party` })
		: next();
}
function valiDate(req, { locals }, next) {
	const { reservation_time, reservation_date } = req.body.data;
	let [hour, min] = reservation_time.split(":");
	let [year, month, day] = reservation_date.split("-");
	let resDate = new Date(Date.UTC(year, month - 1, day, hour, min));

	if (resDate == "Invalid Date" || !resDate) {
		next({
			status: 400,
			message: `reservation_date or reservation_time is invalid/missing`,
		});
	} else {
        locals.resDate = resDate
		locals.reservation_date = locals.resDate.toISOString().split("T")[0];
		locals.reservation_time = reservation_time;
		next();
	}
}
function futureDate(req, { locals }, next) {
	return new Date().getTime() >= locals.resDate.getTime()
		? next({ status: 400, message: `Must be a future date.` })
		: next();
}
function closedTuesday(req, { locals }, next) {
	return locals.resDate.getDay() === 2
		? next({ status: 400, message: `We are closed on Tuesdays` })
		: next();
}
function withinHours(req, { locals }, next) {
	let constraint = {
		opening: new Date(
			Date.UTC(
				locals.resDate.getUTCFullYear(),
				locals.resDate.getUTCMonth(),
				locals.resDate.getUTCDate(),
				10,
				30
			)
		).getTime(),
		closing: new Date(
			Date.UTC(
				locals.resDate.getUTCFullYear(),
				locals.resDate.getUTCMonth(),
				locals.resDate.getUTCDate(),
				21,
				30
			)
		).getTime(),
	};
	return constraint.closing <= locals.resDate.getTime() ||
		constraint.opening >= locals.resDate.getTime()
		? next({
				status: 400,
				message: `Reservations are available from 10:30am to 9:30pm`,
		  })
		: next();
}
function isAvailable(req, res, next) {
	const { status } = req.body.data;
	return status !== "booked" && status
		? next({
				status: 400,
				message: `New reservations cannot be finished, seated, or cancelled.`,
		  })
		: next();
}
function hasStatus(req, res, next) {
	const { data = {} } = req.body;
	if (data.status) {
		return next();
	}
	next({ status: 400, message: `status is a required field` });
}
function validStatus(req, res, next) {
	const { status } = req.body.data;
	const validStatus = ["booked", "seated", "finished", "cancelled"];

	if (validStatus.includes(status)) {
		res.locals.status = status;
		return next();
	}
	next({
		status: 400,
		message: `Status must be booked, seated, or finished${status} is not a valid status.`,
	});
}
function unfinishedReservationOnly(req, res, next) {
	return res.locals.reservation.status === "finished"
		? next({ status: 400, message: "This reservation is already finished." })
		: next();
}
function read(req, res) {
	const { reservation } = res.locals;
	const { reservation_date } = reservation;
	const data = {
		...reservation,
		reservation_date: reservation_date.toISOString().split("T")[0],
	};
	res.json({ data });
}

/**All below must be wrapped in asyncBoundary */
async function listAll(req, res) {
	const { date, mobileNumber } = res.locals;
	const data = !mobileNumber
		? await service.list(date)
		: await service.searchList(mobileNumber);
	res.json({ data });
}

async function createReservation(req, res) {
	let reservation = req.body.data;
	reservation = { ...reservation, status: "booked" };
	const data = await service.create(reservation);
	res.status(201).json({ data });
}
async function reservationExists(req, res, next) {
	const { reservation_id } = req.params;

	const reservation = await service.read(reservation_id);
	if (reservation) {
		res.locals.reservation = reservation;
		return next();
	}
	next({
		status: 404,
		message: `Reservation ${reservation_id} cannot be found.`,
	});
}

async function updateStatus(req, res) {
	const { status, reservation } = res.locals;
	const updatedReservation = {
		...reservation,
		status,
	};
	const data = await service.updateStatus(updatedReservation);
	res.json({ data });
}
async function update(req, res) {
	const data = await service.update({
		...res.locals.reservation,
		...req.body.data,
	});

	res.json({ data });
}

module.exports = {
	list: [queryDate, queryMobile, asyncErrorBoundary(listAll)],
	create: [
		checkReqProps,
		partySize,
		valiDate,
		closedTuesday,
		futureDate,
		withinHours,
		isAvailable,
		asyncErrorBoundary(createReservation),
	],
	read: [asyncErrorBoundary(reservationExists), read],
	updateStatus: [
		hasStatus,
		validStatus,
		asyncErrorBoundary(reservationExists),
		unfinishedReservationOnly,
		asyncErrorBoundary(updateStatus),
	],
	update: [
		asyncErrorBoundary(reservationExists),
		checkReqProps,
		partySize,
		valiDate,
		closedTuesday,
		futureDate,
		withinHours,
		isAvailable,
		asyncErrorBoundary(update),
	],
};
