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
	const [selectedTable, setSelectedTable] = useState("");
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
			.then((tables) =>
				setTables(
					tables.filter((table) => table.capacity >= reservation.people)
				)
			)
			.catch(setError);
		return () => abortController.abort();
	}
	function handleSubmit(e) {
		e.preventDefault();
		assignTable(reservation.reservation_id, selectedTable)
			.then(history.push("/dashboard"))
			.catch(setError);
	}
	return (
		<div>
			{error && <ErrorAlert error={error} />}
			<h2>Seat Selection</h2>
			<form onSubmit={(e) => handleSubmit(e)}>
				<div className="form-group col-md-4 form-row align-items-center">
					<label for="inputState">Table Selection:</label>
					<select
						name="tableselect"
						onChange={({ target: { value } }) => setSelectedTable(value)}
						id="inputState"
						value={selectedTable}
						className="form-control"
					>
						<option selected>Pick available Table</option>

						{tables.map((option, i) => {
							return (
								<option key={i} value={option.table_id}>
									{option.table_name} - {option.capacity}
								</option>
							);
						})}
					</select>
					<button className="btn btn-dark mt-3" type="submit">
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}
export default Seat;
