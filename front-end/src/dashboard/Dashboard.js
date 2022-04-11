import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../layout/reservations/Reservation";
// import Table from "../tables/Table";
import { useHistory } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { previous, next, formatAsDate } from "../utils/date-time";

function Dashboard({ date }) {
	let query = useQuery();
	date = query.get("date") || date;
	const history = useHistory();
	const [reservations, setReservations] = useState([]);
	const [error, setError] = useState(null);
	useEffect(
		function loadDashboard() {
			const abortController = new AbortController();
			setError(null);
			listReservations({ date }, abortController.signal)
				.then(setReservations)
				.then(console.log(reservations))
				.catch(setError);
			return () => abortController.abort();
		},
		[date]
	);

	return (
		<main>
			<h1>Dashboard</h1>
			<div className="d-md-flex mb-3">
				<h4 className="mb-0">Reservations for {formatAsDate(date)}</h4>
			</div>
			<div
				className="btn-toolbar"
				role="toolbar"
				aria-label="Toolbar with button groups"
			>
				<div className="btn-group mr-2" role="group" aria-label="First group">
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() =>
							history.push(`/dashboard?date=${previous(formatAsDate(date))}`)
						}
					>
						Day Before
					</button>
					<input
						type="date"
						style={{ textAlign: "center" }}
						value={date}
						onChange={({ target }) =>
							history.push(`/dashboard?date=${target.value}`)
						}
					/>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() =>
							history.push(`/dashboard?date=${next(formatAsDate(date))}`)
						}
					>
						Day After
					</button>
				</div>
			</div>

			{error && <ErrorAlert error={error} />}
			<div className="container-fluid">
				<div className="row">
					<h1>Reservations</h1>
					<div className="col-12 mt-3">
						{reservations ? (
							reservations.map((reservation, i) => {
								return <Reservation key={i} reservation={reservation} />;
							})
						) : (
							<div>
								<h1>No Reservations Found</h1>
							</div>
						)}
					</div>
					<h1>Tables</h1>
				</div>
			</div>
		</main>
	);
}

export default Dashboard;
