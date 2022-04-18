import React from "react";
import { useHistory } from "react-router";
import { removeTable } from "../../utils/api";

function Table({ table, loadDashboard, setError, loadTables }) {
	const history = useHistory();
	let { table_id, table_name, capacity, reservation_id } = table;

	function handleTableSubmit(e) {
		e.preventDefault();
		if (window.confirm(`Is this table available?`)) {
			let abortController = new AbortController();
			removeTable(table_id, abortController.signal)
				.then(loadDashboard)
				.then(loadTables)
				.then(history.push("/dashboard"))
				.catch(setError);
			return () => abortController.abort();
		}
	}
	return (
		<>
			<tr>
				<td>{capacity}</td>
				<td>{table_name}</td>
				<td>
					<button
						disabled={!reservation_id}
						className="btn btn-sm btn-secondary"
						data-table-id-finish={table_id}
						onClick={(e) => handleTableSubmit(e)}
					>
						{reservation_id ? "Clean" : "Available"}
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
