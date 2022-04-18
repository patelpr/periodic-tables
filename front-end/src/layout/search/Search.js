import React, { useEffect, useState } from "react";
import Reservation from "../reservations/Reservation";
import { listReservations } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

export default function Search() {
	const [error, setError] = useState(null);
	const [reservations, setReservations] = useState("");
	const [mobile_number, setMobileNumber] = useState("");
	useEffect(loadReservations, [mobile_number]);

	function loadReservations() {
		const abortController = new AbortController();
		listReservations({ mobile_number }, abortController.signal)
			.then(setReservations)
			.catch(setError);
		return () => abortController.abort();
	}

	return (
		<div className="container text-center">
			{error && <ErrorAlert error={error} />}
			<h1 className="mt-3">Search</h1>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					loadReservations();
				}}
			>
				<div className="input-group mb-3">
					<label className="sr-only input-group-prepend" htmlFor="searchInput">
						Mobile Number
					</label>

					<input
						className="form-control"
						id="searchInput"
						type="text"
						name="mobile_number"
						onChange={(e) => setMobileNumber(e.target.value)}
						maxLength="50"
						required
						placeholder="Enter a customer's phone number"
					/>
					<div className="input-group-append">
						<button type="submit" className="btn btn-primary mb-3">
							Search
						</button>
					</div>
				</div>
			</form>

			<div>
				<h1>Reservations</h1>
				<table className="table table-hover text-center">
					<thead className="thead-dark">
						<tr>
							<th scope="col">Status</th>
							<th scope="col">Name</th>
							<th scope="col">Party Size</th>
							<th scope="col">Mobile</th>
							<th scope="col">Date</th>
							<th scope="col">Time</th>
							<th scope="col">Actions</th>
						</tr>
					</thead>
					<tbody>
						{reservations ? (
							reservations.map((reservation, i) => {
								return (
									<Reservation
										key={i}
										reservation={reservation}
										loadDashboard={loadReservations}
										setError={setError}
									/>
								);
							})
						) : (
							<tr>
								<td>N/A</td>
								<td>N/A</td>
								<td>N/A</td>
								<td>N/A</td>
								<td>N/A</td>
								<td>N/A</td>
								<td>N/A</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
