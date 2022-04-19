import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservation from "../layout/reservations/Reservation";
import Table from "../layout/tables/Tables";
import { useHistory } from "react-router-dom";
import useQuery from "../utils/useQuery";
import { previous, next } from "../utils/date-time";

function Dashboard({ date }) {
	let query = useQuery();
	date = query.get("date") || date;
	const history = useHistory();

	const [reservations, setReservations] = useState([]);
	const [tables, setTables] = useState([]);
	const [error, setError] = useState(null);

	useEffect(loadDashboard, [date]);
	useEffect(loadTables, []);

	function loadDashboard() {
		let abortController = new AbortController();
		setError(null);
		listReservations({ date }, abortController.signal)
			.then(setReservations)
			.catch(setError);
		return () => abortController.abort();
	}
	function loadTables() {
		let abortController = new AbortController();
		listTables(abortController.signal).then(setTables).catch(setError);
		return () => abortController.abort();
	}

	return (
		<main>
			{error && <ErrorAlert error={error} />}
			<div className="row mt-2">
				<div
					className="btn-toolbar mb-3 cols col-4"
					role="toolbar"
					aria-label="Toolbar with button groups"
				>
					<div className="btn-group mr-2" role="group" aria-label="First group">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
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
							onClick={() => history.push(`/dashboard?date=${next(date)}`)}
						>
							Day After
						</button>
					</div>
				</div>
				<h1 className="cols col-4">Dashboard</h1>
			</div>
			<div>
				<div className="row">
					<h2>Reservations for {date}</h2>

					<table className="table table-hover text-center">
						<thead className="thead-dark">
							<tr>
								<th scope="col">Status</th>
								<th scope="col">Name</th>
								<th scope="col">Party Size</th>
								<th scope="col">Phone</th>
								<th scope="col">Date</th>
								<th scope="col">Time</th>
								<th scope="col">Actions</th>
							</tr>
						</thead>
						<tbody>
							{reservations.length ? (
								reservations.map((reservation, i) => {
									return (
										<Reservation
											key={i}
											reservation={reservation}
											loadDashboard={loadDashboard}
											setError={setError}
										/>
									);
								})
							) : (
								<tr className="table-warning">
									<td>SORRY</td>
									<td>NO</td>
									<td>RESERVATIONS</td>
									<td>FOR</td>
									<td>THIS</td>
									<td>DATE</td>
									<td>YET</td>
								</tr>
							)}
						</tbody>
					</table>
					<h1>Tables</h1>

					<table className="table table-hover text-center">
						<thead className="thead-dark">
							<tr>
								<th scope="col">Status</th>
								<th scope="col">Capacity</th>
								<th scope="col">Name</th>
								<th scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							{tables ? (
								tables.map((table, i) => {
									return (
										<Table
											key={i}
											table={table}
											loadDashboard={loadDashboard}
											loadTables={loadTables}
										/>
									);
								})
							) : (
								<tr>
									<td>PLEASE</td>
									<td>CREATE</td>
									<td>MORE</td>
									<td>TABLES</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</main>
	);
}

export default Dashboard;
