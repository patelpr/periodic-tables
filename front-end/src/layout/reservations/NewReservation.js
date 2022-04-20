import React, { useState } from "react";
import { useHistory } from "react-router";
import { createReservation } from "../../utils/api";
import { valiDate } from "../../utils/date-time";
import ErrorAlert from "../ErrorAlert";

export const NewReservation = () => {
	const [error, setError] = useState();
	const [reservation, setReservation] = useState({
		first_name: "",
		last_name: "",
		mobile_number: "",
		reservation_time: "",
		reservation_date: "",
		people: 0,
		status: "booked",
	});
	let history = useHistory();
	async function submitHandler(e) {
		e.preventDefault();
		let dateCheck = valiDate(reservation, setError);
		if (dateCheck) {
			setReservation(dateCheck);
		} else {
			setError("Only business hours of future dates available.");
		}

		const { signal, abort } = new AbortController();
		await createReservation(reservation, signal)
			.then(() =>
				history.push(`/dashboard?date=${reservation.reservation_date}`)
			)
			.catch(setError);
		return () => abort();
	}
	return (
		<div>
			{error && <ErrorAlert error={error} />}
			<div className="container ">
				<h2>New Reservation</h2>

				<form onSubmit={submitHandler} className="mt-3 ">
					<div className="form-group input-group">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								First Name
							</span>
						</div>

						<input
							aria-label="first_name"
							className="form-control"
							type="text"
							id="first_name"
							name="first_name"
							onChange={(e) =>
								setReservation({
									...reservation,
									first_name: e.target.value,
								})
							}
						/>
					</div>
					<div className="form-group input-group">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								Last Name
							</span>
						</div>
						<input
							aria-label="last_name"
							className="form-control"
							type="text"
							id="last_name"
							name="last_name"
							onChange={(e) =>
								setReservation({
									...reservation,
									last_name: e.target.value,
								})
							}
						/>
					</div>
					<div className="form-group input-group">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								Mobile Number
							</span>
						</div>
						<input
							aria-label="mobile_number"
							className="form-control"
							type="tel"
							placeholder="123-456-7890"
							id="mobile_number"
							name="mobile_number"
							onChange={(e) =>
								setReservation({
									...reservation,
									mobile_number: e.target.value,
								})
							}
						/>
					</div>
					<div className="form-group input-group">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								Date
							</span>
						</div>
						<input
							aria-label="reservation_date"
							className="form-control"
							// min={today()}
							id="reservation_date"
							name="reservation_date"
							type="date"
							onChange={(e) => {
								setReservation({
									...reservation,
									reservation_date: e.target.value,
								});
							}}
						/>
					</div>
					<div className="form-group input-group">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								Time
							</span>
						</div>
						<input
							aria-label="reservation_time"
							className="form-control"
							// min="10:30"
							// max="21:30"
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
					<div className="form-group input-group">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								Party Size
							</span>
						</div>
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
									people: e.target.value,
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
		</div>
	);
};
