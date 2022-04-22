const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

/**
 * Formats a Date object as YYYY-MM-DD.
 *
 * This function is *not* exported because the UI should generally avoid working directly with Date instance.
 * You may export this function if you need it.
 *
 * @param date
 *  an instance of a date object
 * @returns {string}
 *  the specified Date formatted as YYYY-MM-DD
 */
function asDateString(date) {
	return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
		.toString(10)
		.padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

/**
 * Format a date string in ISO-8601 format (which is what is returned from PostgreSQL) as YYYY-MM-DD.
 * @param dateString
 *  ISO-8601 date string
 * @returns {*}
 *  the specified date string formatted as YYYY-MM-DD
 */
export function formatAsDate(dateString) {
	return dateString.match(dateFormat)[0];
}

/**
 * Format a time string in HH:MM:SS format (which is what is returned from PostgreSQL) as HH:MM.
 * @param timeString
 *  HH:MM:SS time string
 * @returns {*}
 *  the specified time string formatted as YHH:MM.
 */
export function formatAsTime(timeString) {
	return timeString.match(timeFormat)[0];
}

/**
 * Today's date as YYYY-MM-DD.
 * @returns {*}
 *  the today's date formatted as YYYY-MM-DD
 */
export function today() {
	return asDateString(new Date());
}

/**
 * Subtracts one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day prior to currentDate, formatted as YYYY-MM-DD
 */
export function previous(currentDate) {
	let [year, month, day] = currentDate.split("-");
	month -= 1;
	const date = new Date(year, month, day);
	date.setMonth(date.getMonth());
	date.setDate(date.getDate() - 1);
	return asDateString(date);
}

/**
 * Adds one day to the specified date and return it in as YYYY-MM-DD.
 * @param currentDate
 *  a date string in YYYY-MM-DD format (this is also ISO-8601 format)
 * @returns {*}
 *  the date one day after currentDate, formatted as YYYY-MM-DD
 */
export function next(currentDate) {
	let [year, month, day] = currentDate.split("-");
	month -= 1;
	const date = new Date(year, month, day);
	date.setMonth(date.getMonth());
	date.setDate(date.getDate() + 1);
	return asDateString(date);
}

export function valiDate(res) {
	const { reservation_date, reservation_time } = res;
	let year, month, day;
	let [hour, min] = reservation_time.split(":");
	if (reservation_date.includes("-")) {
		[year, month, day] = reservation_date.split("-");
	} else {
		let flat = reservation_date.split(/\d\d/);
		year = `${flat[2]}${flat[3]}`;
		month = flat[0];
		day = flat[1];
	}
	let resDate = new Date(Date.UTC(year, month - 1, day, hour, min));
	let constraint = {
		opening: new Date(
			Date.UTC(
				resDate.getUTCFullYear(),
				resDate.getUTCMonth(),
				resDate.getUTCDate(),
				10,
				30
			)
		).getTime(),
		closing: new Date(
			Date.UTC(
				resDate.getUTCFullYear(),
				resDate.getUTCMonth(),
				resDate.getUTCDate(),
				21,
				30
			)
		).getTime(),
		now: new Date().getTime(),
	};
	res = { ...res, reservation_date: resDate.toISOString().split("T")[0] };
	
	return constraint.closing <= resDate.getTime() ||
		constraint.opening >= resDate.getTime() ||
		resDate.getUTCDay() === 2 ||
		resDate.getTime() <= constraint.now
		? null
		: res;
}
