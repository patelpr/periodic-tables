import React, { useEffect, useState } from "react";
import {
	listTablesAvailable,
	readReservation,
	assignTable,
} from "../../utils/api";
import { useParams, useHistory } from "react-router";
import ErrorAlert from "../ErrorAlert";

function Seat() {
	const history = useHistory();
	const { reservationId } = useParams();
	const [reservation, setReservations] = useState({});
	const [selectedTable, setSelectedTable] = useState(1);
	const [tables, setTables] = useState([]);
	const [error, setError] = useState(null);
	useEffect(
		function getReservations() {
			const abortController = new AbortController();
			readReservation(reservationId, abortController.signal)
				.then(setReservations)
				.catch(setError);
			return () => abortController.abort();
		},
		[reservationId]
	);
	useEffect(getAvailableTables, [reservation.people]);
	function getAvailableTables() {
		const abortController = new AbortController();
		listTablesAvailable(
			{ capacity: reservation.people },
			abortController.signal
		)
			.then(setTables)
			.catch(setError);
		return () => abortController.abort();
	}
	function handleSubmit(e) {
		e.preventDefault();
		
		const abortController = new AbortController();

		assignTable(
			reservation.reservation_id,
			selectedTable,
			abortController.signal
		)
			.then(() => {
				history.push(`/dashboard`);
			})
			.catch(setError);
		return () => abortController.abort();
	}
	return (
		<div>
			{error && <ErrorAlert error={error} />}
			<h2>Seat Selection</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group col-md-4 form-row align-items-center">
					<h3>Table Selection:</h3>
					<select
						name="table_id"
						onChange={({ target: { value } }) => {
							
							setSelectedTable(value);
						}}
						id="inputState"
						value={selectedTable}
						className="form-control"
					>
						{tables.map((table, i) => (
							<option key={i} value={table.table_id}>
								{table.table_name} - {table.capacity}
							</option>
						))}
					</select>
					<button className="btn btn-dark mt-3" type="submit">
						Submit
					</button>
					<button
						className="btn btn-text mt-3"
						onClick={() => history.goBack()}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
}
export default Seat;
