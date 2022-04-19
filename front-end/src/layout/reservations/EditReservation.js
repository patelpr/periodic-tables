import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { readReservation, updateReservation } from "../../utils/api";
import { today, valiDate } from "../../utils/date-time";
import ErrorAlert from "../ErrorAlert";

export const EditReservation = () => {
	const history = useHistory();
	const { reservationId } = useParams();

	/**state */
	const [error, setError] = useState();
	const [reservation, setReservation] = useState({
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_time: "",
		reservation_date: "",
		people: 0,
	});
	/** end state */

	useEffect(
		function loadReservation() {
			const abortController = new AbortController();
			readReservation(reservationId, abortController.signal)
				.then(setReservation)
				.catch(setError);

			return () => abortController.abort();
		},
		[reservationId]
	);

	/**submit form */
	async function submitHandler(e) {
		e.preventDefault();
		let dateCheck = valiDate(reservation, setError);
		if (dateCheck) {
			setReservation(dateCheck);
		} else {
			setError("Only business hours of future dates available.");
		}

		const abortController = new AbortController();
		await updateReservation(reservation, reservationId, abortController.signal)
			.then(() => {
				history.push(`/dashboard?date=${reservation.reservation_date}`);
			})
			.catch(setError);
		return () => abortController.abort();
	}
	return (
		<div className="container">
			<h1>Edit reservation</h1>
			{error && <ErrorAlert error={error} />}

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
						value={reservation.first_name}
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
						value={reservation.last_name}
						name="last_name"
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
						value={reservation.mobile_number}
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
						value={reservation.reservation_date}
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
						value={reservation.reservation_time}
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
						value={reservation.people}
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
					onClick={() => history.push("/dashboard")}
				>
					Cancel
				</button>
			</form>
		</div>
	);
};
