import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../../utils/api";
import { today } from "../../utils/date-time";
import ErrorAlert from "../ErrorAlert";

export const NewReservation = () => {
	const valiDate = (reservation_date) => {
		if (reservation_date.getDay() === 2 || reservation_date < Date.now()) {
			return false;
		}
		let constraint = {
			opening: new Date(
				reservation_date.getFullYear(),
				reservation_date.getMonth(),
				reservation_date.getDate(),
				10,
				30
			),
			closing: new Date(
				reservation_date.getFullYear(),
				reservation_date.getMonth(),
				reservation_date.getDate(),
				21,
				30
			),
		};
		return constraint.closing >= reservation_date ||
			constraint.opening <= reservation_date
			? true
			: false;
	};

	const [error, setError] = useState();
	const [reservation, setReservation] = useState({
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_time: "",
		reservation_date: "",
		people: 0,
	});
	let history = useHistory();
	const submitHandler = async (e) => {
		e.preventDefault();
		console.log(e);
		console.log(reservation);
		if (
			!valiDate(
				new Date(
					(reservation.reservation_date + " ").concat(
						reservation.reservation_time
					)
				)
			)
		) {
			reservation.date = "";
			reservation.time = "";
			setError("Only business hours of future dates available.");
		} else {
			const { signal, abort } = new AbortController();
			await createReservation(reservation, signal)
				.then(() => {
					history.push(`/dashboard?date=${reservation.reservation_date}`);
				})
				.catch(setError);
			return () => abort();
		}

		history.go("/dashboard/" + e.target.reservation_date);
		console.log(e);
	};
	return (
		<div>
			{error && <ErrorAlert error={error} />}

			<h2>New Reservation</h2>

			<form onSubmit={submitHandler}>
				<div className="form-group">
					<label htmlFor="first_name">First name:</label>

					<input
						aria-label="first_name"
						className="form-control"
						type="text"
						placeholder="First name"
						id="first_name"
						name="first_name"
						// value={reservation.first_name}
						onChange={(e) =>
							setReservation({
								...reservation,
								first_name: e.target.value.replace(/[^A-z]/, ""),
							})
						}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="last_name">Last name:</label>

					<input
						aria-label="last_name"
						className="form-control"
						type="text"
						placeholder="Last name"
						id="last_name"
						name="last_name"
						// value={reservation.last_name}

						onChange={(e) =>
							setReservation({
								...reservation,
								last_name: e.target.value.replace(/[^A-z]/, ""),
							})
						}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="mobile_number">Mobile number:</label>

					<input
						aria-label="mobile_number"
						className="form-control"
						type="tel"
						placeholder="Mobile number"
						id="mobile_number"
						name="mobile_number"
						// value={reservation.mobile_number}

						onChange={(e) =>
							setReservation({
								...reservation,
								mobile_number: e.target.value.replace(/[^\d]/, ""),
							})
						}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="reservation_date">Date of reservation:</label>
					<input
						aria-label="reservation_date"
						className="form-control"
						min={today()}
						id="reservation_date"
						name="reservation_date"
						// value={reservation.reservation_date}
						type="date"
						onChange={(e) =>
							setReservation({
								...reservation,
								reservation_date: e.target.value,
							})
						}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="reservation_time">Time of reservation:</label>
					<input
						aria-label="reservation_time"
						className="form-control"
						min="10:30"
						max="21:30"
						id="reservation_time"
						name="reservation_time"
						type="time"
						onChange={(e) =>
							setReservation({
								...reservation,
								reservation_time: e.target.value,
							})
						}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="people">Number of people</label>
					<input
						aria-label="people"
						className="form-control"
						type="text"
						placeholder="Number of people"
						id="people"
						name="people"
						onChange={(e) =>
							setReservation({
								...reservation,
								people: e.target.value.replace(/[^\d]/, ""),
							})
						}
					/>
				</div>
				<button className="btn btn-primary" type="submit">
					Submit
				</button>
				<button
					className="btn btn-text"
					onClick={() => history.go("/dashboard")}
				>
					Cancel
				</button>
			</form>
		</div>
	);
};
