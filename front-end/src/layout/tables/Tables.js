import React from "react";
import { removeTable } from "../../utils/api";

function Table({ table, loadDashboard, setError, loadTables }) {
	let { table_id, table_name, capacity, reservation_id } = table;

	function handleTableSubmit(e) {
		e.preventDefault();
		if (window.confirm("Is this table ready to seat new guests?")) {
			let abortController = new AbortController();
			removeTable(table_id, abortController.signal)
				.then(loadDashboard)
				.then(loadTables)
				.catch(setError);

			return () => abortController.abort();
		}
	}
	return (
		<>
			<tr>
				<td data-table-id-status={`${table.table_id}`}>
					{reservation_id ? "Occupied" : "Free"}
				</td>
				<td>{capacity}</td>
				<td>{table_name}</td>
				<td>
					<button
						disabled={!reservation_id}
						className="btn btn-sm btn-secondary"
						data-table-id-finish={table_id}
						to={`/dashboard`}
						onClick={handleTableSubmit}
					>
						{reservation_id ? "Finish" : "Available"}
					</button>
				</td>
			</tr>
		</>
	);
}
export default Table;
/**
 *
 */
