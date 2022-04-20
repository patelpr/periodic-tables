import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
export const NewTables = () => {
	const [error, setError] = useState();
	const [table, setTable] = useState({
		table_name: "",
		capacity: 0,
	});
	let history = useHistory();
	function submitHandler(e) {
		e.preventDefault();
		const abortController = new AbortController();
		createTable(table, abortController.signal)
			.then(() => {
				console.log(table);

				history.push("/dashboard");
			})
			.catch(setError);
		return () => abortController.abort();
	}
	return (
		<div>
			<form onSubmit={submitHandler} className="container">
				{error && <ErrorAlert error={error} />}
				<h1>New Table</h1>
				<div className="form-group  input-group">
					<div className="input-group-prepend">
						<span className="input-group-text" id="basic-addon1">
							Table Name
						</span>
					</div>
					<input
						aria-label="table_name"
						className="form-control"
						type="text"
						placeholder="Table name"
						id="table_name"
						name="table_name"
						onChange={(e) =>
							setTable({
								...table,
								table_name: e.target.value,
							})
						}
					/>
				</div>
				<div className="form-group  input-group">
					<div className="input-group-prepend">
						<span className="input-group-text" id="basic-addon1">
							Number of Seats
						</span>
					</div>
					<input
						aria-label="capacity"
						className="form-control"
						type="number"
						placeholder="Capacity"
						id="capacity"
						name="capacity"
						onChange={(e) => setTable({ ...table, capacity: e.target.value })}
					/>
				</div>
				<button className="btn btn-primary" type="submit">
					Submit
				</button>
				<button className="btn btn-text" onClick={() => history.goBack()}>
					Cancel
				</button>
			</form>
		</div>
	);
};
