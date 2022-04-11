const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

async function list(req, res) {
	const { date, mobileNumber } = res.locals;
	const data = !mobileNumber
		? await service.list(date)
		: await service.searchList(mobileNumber);
	res.json({ data });
}

async function create(req, res) {
	let reservation = req.body.data;
	reservation = { ...reservation, status: "booked" };
	const data = await service.create(reservation);
	res.status(201).json({ data });
}

function getDateFromQuery(req, res, next) {
	let today = new Date();
	today = `${today.getFullYear().toString(10)}-${(today.getMonth() + 1)
		.toString(10)
		.padStart(2, "0")}-${today.getDate().toString(10).padStart(2, "0")}`;
	const date = req.query.date || today;
	res.locals.date = date;
	next();
}

function getMobileNumberFromQuery(req, res, next) {
	const mobileNumber = req.query.mobile_number;
	if (mobileNumber) {
		res.locals.mobileNumber = mobileNumber;
	}
	next();
}

function validProperties(req, res, next) {
	const { data = {} } = req.body;
	const notColumn = Object.values(data).filter(
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
			].includes(column[0])
	);
	return notFields.length
		? next({
				status: 400,
				message: `No column for inputs: ${notColumn.join(", ")}`,
		  })
		: next();
}

const REQUIRED_PROPERTIES = [
	"first_name",
	"last_name",
	"people",
	"reservation_date",
	"reservation_time",
	"mobile_number",
];
const requiredProperties = () => hasProperties(...REQUIRED_PROPERTIES);

function numberOfAttendees(req, res, next) {
	let { people } = req.body.data;
	return people < 1 && Number(people)
		? next({
				status: 400,
				message: `You have nobody in your party, please add the number of attendees to continue.`,
		  })
		: next();
}


function validDateandTime(req, res, next) {
	const { reservation_time, reservation_date } = req.body.data;
	let resDate = new Date((reservation_date + " ").concat(reservation_time));
	return !resDate.getMonth() || resDate == "Invalid Date"
		? next({
				status: 400,
				message: `That doesn't seem to be a valid date or time.`,
		  })
		: ((res.locals.reservation_date = resDate), next());
}

function futureDate(req, res, next) {
	const { reservation_date } = res.locals;
	return Date.now() >= reservation_date
		? next({
				status: 400,
				message: `Must be a future date.`,
		  })
		: next();
}

function closedTuesday(req, res, next) {
	const { reservation_date } = res.locals;
	return reservation_date.getDay() !== 2
		? next({
				status: 400,
				message: `Sorry, closed on Tuesdays`,
		  })
		: next();
}
function withinHours(req, res, next) {
	const { reservation_date } = res.locals;
	let constraint = {
		opening: new Date(
			resDate.getFullYear(),
			resDate.getMonth(),
			resDate.getDate(),
			10,
			30
		),
		closing: new Date(
			resDate.getFullYear(),
			resDate.getMonth(),
			resDate.getDate(),
			21,
			30
		),
	};
	return constraint.closing >= reservation_date ||
		constraint.opening <= reservation_date
		? next({
				status: 400,
				message: `Reservations are available from 10:30am to 9:30pm`,
		  })
		: next();
}
function isAvailable(req, res, next) {
	const { status } = req.body.data;
	return status !== "booked"
		? next({
				status: 400,
				message: `This reservation is not booked yet. Please book it first and try again.`,
		  })
		: next();
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

async function read(req, res) {
	const { reservation } = res.locals;
	let date = reservation.reservation_date;
	date = `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
		.toString(10)
		.padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
	const data = {
		...reservation,
		reservation_date: date,
	};
	res.json({ data });
}

function hasOnlyStatusProperty(req, res, next) {
	const { data = {} } = req.body;
	const invalidFields = Object.keys(data).filter(
		(field) => !["status"].includes(field)
	);
	if (invalidFields.length) {
		return next({
			status: 400,
			message: `Invalid field(s): ${invalidFields.join(", ")}`,
		});
	}
	next();
}

function hasStatus(req, res, next) {
	const { data = {} } = req.body;
	if (data.status) {
		return next();
	}
	next({
		status: 400,
		message: `status is a required field`,
	});
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
	const { status } = res.locals.reservation;
	if (status === "finished") {
		return next({
			status: 400,
			message: `Finished reservations cannot be updated.`,
		});
	}
	next();
}

async function updateStatus(req, res) {
	const { status, reservation } = res.locals;
	const updatedReservation = {
		...reservation,
		status,
	};
	const result = await service.updateStatus(updatedReservation);
	const data = result[0];
	res.json({ data });
}

async function update(req, res) {
	const updatedReservation = {
		...res.locals.reservation,
		...req.body.data,
	};
	const result = await service.update(updatedReservation);
	const data = result[0];
	res.json({ data });
}

module.exports = {
	list: [getDateFromQuery, getMobileNumberFromQuery, asyncErrorBoundary(list)],
	create: [
		validProperties,
		requiredProperties,
		validDateandTime,
		closedTuesday,
		futureDate,
		numberOfAttendees,
		withinHours,
		isAvailable,
		asyncErrorBoundary(create),
	],
	read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
	updateStatus: [
		hasOnlyStatusProperty,
		hasStatus,
		validStatus,
		asyncErrorBoundary(reservationExists),
		unfinishedReservationOnly,
		asyncErrorBoundary(updateStatus),
	],
	update: [
		asyncErrorBoundary(reservationExists),
		validProperties,
		requiredProperties,
		validDateandTime,
		closedTuesday,
		futureDate,
		withinHours,
		numberOfAttendees,
		isAvailable,
		asyncErrorBoundary(update),
	],
};
