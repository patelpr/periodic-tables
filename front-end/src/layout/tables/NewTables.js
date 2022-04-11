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
	const submitHandler = (e) => {
		e.preventDefault();

		const { signal, abort } = new AbortController();
		createTable(table, signal)
			.then(() => {
				history.push("/dashboard");
			})
			.catch(setError);
		return () => abort();
	};
	return (
		<div>
			{error && <ErrorAlert error={error} />}
			<form onSubmit={submitHandler}>
				<div className="form-group">
					<label htmlFor="table_name">Table name:</label>
					<input
						aria-label="table_name"
						className="form-control"
						type="text"
						placeholder="Table name"
						id="table_name"
						name="table_name"
						onChange={(e) =>
							setTable({
								table_name: e.target.value.replace(/[^A-z]/, ""),
							})
						}
					/>{" "}
				</div>
				<div className="form-group">
					<label htmlFor="capacity">Last name:</label>
					<input
						aria-label="capacity"
						className="form-control"
						type="number"
						placeholder="Capacity"
						id="capacity"
						name="capacity"
						onChange={(e) =>
							setTable({
								capacity: e.target.value.replace(/\D/, ""),
							})
						}
					/>{" "}
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
