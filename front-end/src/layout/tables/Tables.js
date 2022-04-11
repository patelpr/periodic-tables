import React, { useEffect, useState } from "react";
import { unassignTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Table({
	table: { table_id, table_name, capacity, reservation_id },
	loadReservations,
}) {
	const [tableStatus, setTableStatus] = useState("Loading...");

	const [error, setError] = useState(null);

	// defines the bootstrap class names for color based on the status of the table
	const statusColor = {
		Occupied: "primary",
		Free: "success",
	};

	useEffect(() => {
		if () {
			setTableStatus("Occupied");
			setFinishButtonDisplay(
				<button
					className="btn btn-sm btn-secondary"
					data-table-id-finish={table_id}
					to={`/reservations/`}
					onClick={handleSubmit}
				>
					<span className="oi oi-check mr-2" />
					Finish
				</button>
			);
		} else {
			setTableStatus("Free");
			setFinishButtonDisplay("");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reservation_id, table_id]);

	const handleRemoval = (e) => {
		e.preventDefault();
		const message = `Is this table ready to seat new guests? This cannot be undone.`;
		if (window.confirm(message)) {
			const abortController = new AbortController();
			setError(null);
			unassignTable(table_id, abortController.signal)
				.then(() => {
					loadReservations();
				})
				.catch(setError);
			return () => abortController.abort();
		}
	};

	return (
		<>
			<ErrorAlert error={error} />
			<div className="row flex-column flex-md-row bg-light border mx-1 my-3 px-2 py-2">
				{/* status badge */}
				<div
					className={`col text-center text-md-left align-self-center`}
					style={{ maxWidth: "100px" }}
				>
					

				</div>
				<span className="col align-self-center text-center text-md-left">
					<h5 className="mb-1">{table_name}</h5>
				</span>
				<span className="col align-self-center text-center text-md-left">
					<p className="mb-0">{`${capacity} Top`}</p>
				</span>
				<span className="col align-self-center text-center text-md-right my-2">
					{
                    reservation_id?
                    <button onClick={(e)=>handleRemoval()} data-table-id-status={`${table.table_id}`} ></button>:<span className="badge badge-pillbadge-success">Available</span>}
				</span>
                <div><span
						className={`my-2 badge text-white bg-${statusColor[tableStatus]}`}
						data-table-id-status={table.table_id}
					>
						{tableStatus}
					</span></div>
			</div>
		</>
	);
}

export default Table;
