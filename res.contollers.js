const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
function checkErrors(req, res, next) {
	if (res.locals.errorsArray) {
		next({
			status: 400,
			message: res.locals.errorsArray.join(" "),
		});
	}
	next();
}
function init(req, res, next) {
	res.locals.errorsArray = [];
	next();
}
function newErr(message) {
	newErr(message);
}
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
function validProps(req, res, next) {
	const { data = {} } = req.body;
	const notInTable = Object.keys(data).filter(
		(column) =>
			![
				"reservation_id",
				"first_name",
				"last_name",
				"people",
				"mobile_number",
				"status",
				"reservation_date",
				"reservation_time",
				"created_at",
				"updated_at",
			].includes(column)
	);
	notInTable.length &&
		newErr(`Column(s) dont exist on table: ${notInTable.join(", ")}`);
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
	people < 1 && Number(people) && newErr(`Can't have a party of 0.`);
	next();
}
function valiDate(req, res, next) {
	const { reservation_time, reservation_date } = req.body.data;
	let resDate = new Date((reservation_date + " ").concat(reservation_time));
	if (!resDate.getMonth() || resDate == "Invalid Date") {
		newErr(`reservation_date or reservation_time is invalid`);
		next();
	} else {
		res.locals.reservation_date = resDate;
		next();
	}
}
function futureDate(req, res, next) {
	const { reservation_date } = res.locals;
	Date.now() >= reservation_date && newErr(`Must be a future date.`);
	next();
}
function closedTuesday(req, { locals }, next) {
	if (!locals.reservation_date) {
		newErr(`Reservations are available from 10:30am to 9:30pm`);
	}
	locals.reservation_date.getDay() === 2 && newErr(`Sorry, closed on Tuesdays`);
	next();
}
function withinHours(req, { locals }, next) {
	if (!locals.reservation_date) {
		newErr(`Reservations are available from 10:30am to 9:30pm`);
	}
	let constraint = {
		opening: new Date(
			locals.reservation_date.getFullYear(),
			locals.reservation_date.getMonth(),
			locals.reservation_date.getDate(),
			10,
			30
		),
		closing: new Date(
			locals.reservation_date.getFullYear(),
			locals.reservation_date.getMonth(),
			locals.reservation_date.getDate(),
			21,
			30
		),
	};
	constraint.closing <= locals.reservation_date ||
		(constraint.opening >= locals.reservation_date &&
			newErr(`Reservations are available from 10:30am to 9:30pm`));
	next();
}
function isAvailable(req, res, next) {
	const { status } = req.body.data;
	status !== "booked" &&
		status &&
		newErr(`New reservations must be marked as booked.`);
	next();
}
async function reservationExists(req, res, next) {
	const { reservation_id } = req.params;

	const reservation = reservation_id && (await service.read(reservation_id));
	if (reservation) {
		res.locals.reservation = reservation;
		next();
	} else {
		newErr(`Reservation ${reservation_id} cannot be found.`);
		next();
	}
}
function getDate(date) {
	return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
		.toString(10)
		.padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}
async function read(req, res) {
	const { reservation } = res.locals;
	const data = {
		...reservation,
		reservation_date: getDate(reservation.reservation_date),
	};
	res.json({ data });
}

function hasStatus(req, res, next) {
	const { data = {} } = req.body;
	if (data.status) {
		next();
	} else {
		newErr(`status is a required field`);
		next();
	}
}
function validStatus(req, res, next) {
	const { status } = req.body.data;
	const validStatus = ["booked", "seated", "finished", "cancelled"];

	if (validStatus.includes(status)) {
		res.locals.status = status;
		next();
	} else {
		newErr(
			`Status must be booked, seated, or finished${status} is not a valid status.`
		);
		next();
	}
}
function unfinishedReservationOnly(req, res, next) {
	res.locals.reservation.status === "finished" &&
		newErr("This reservation is already complete.");
	next();
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
	list: [queryDate, queryMobile, checkErrors, asyncErrorBoundary(listAll)],
	create: [
		init,
		validProps,
		checkReqProps,
		valiDate,
		closedTuesday,
		futureDate,
		partySize,
		withinHours,
		isAvailable,
		checkErrors,
		asyncErrorBoundary(createReservation),
	],
	read: [init, asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
	updateStatus: [
		init,
		hasStatus,
		validStatus,
		asyncErrorBoundary(reservationExists),
		unfinishedReservationOnly,
		checkErrors,
		asyncErrorBoundary(updateStatus),
	],
	update: [
		init,
		asyncErrorBoundary(reservationExists),
		validProps,
		checkReqProps,
		valiDate,
		closedTuesday,
		futureDate,
		withinHours,
		partySize,
		isAvailable,
		checkErrors,
		asyncErrorBoundary(update),
	],
};
