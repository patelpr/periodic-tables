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
	const reservation_id = useParams().reservation_id;
	const [reservation, setReservations] = useState({});
	const [tables, setTables] = useState([]);
	const [error, setError] = useState(null);
	useEffect(
		function fetchReservations() {
			const abortController = new AbortController();
			readReservation(reservation_id, abortController.signal)
				.then(setReservations)
				.catch(setError);
			return () => abortController.abort();
		},
		[reservation_id]
	);
	useEffect(
		function fetchAvailableTables() {
			const abortController = new AbortController();
			listTablesAvailable(
				{ capacity: reservation.people },
				abortController.signal
			)
				.then((tables) =>
					setTables(
						tables.filter((table) => table.capacity >= reservation.people)
					)
				)
				.catch(setError);
			return () => abortController.abort();
		},
		[reservation.people]
	);

	function handleSubmit(e) {
		e.preventDefault();
		assignTable(e.target.tableselect);
		history.push("/dashboard");
	}
	return (
		<div>
			{error&& <ErrorAlert error={error} />} 
			<h2>Seat Selection</h2>
			<form onSubmit={handleSubmit()}>
				<select
					className="form-select form-select-lg mb-3"
					size="5"
					name="table_id"
				>
					{tables.map((table) => {
						return (
							<option
								name="table-select"
								value={`${table.table_name} - ${table.capacity}`}
							>
								{table.table_name} - {table.capacity}
							</option>
						);
					})}
				</select>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
export default Seat;
