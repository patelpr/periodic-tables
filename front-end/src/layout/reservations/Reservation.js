import React from "react";
import { useHistory } from "react-router-dom";
import { changeStatus } from "../../utils/api";
function Reservation({
	reservation: {
		reservation_id,
		first_name,
		last_name,
		mobile_number,
		reservation_date,
		reservation_time,
		people,
		status = "booked",
	},
	loadDashboard,
	setError,
}) {
	const history = useHistory();
	const color = {
		booked: "success",
		seated: "primary",
		finished: "secondary",
		cancelled: "danger",
	};
	function handleCancel(e) {
		e.preventDefault();

		if (window.confirm(`Cancel reservation?`)) {
			const abortController = new AbortController();
			setError(null);
			changeStatus(reservation_id, "cancelled", abortController.signal)
				.then(loadDashboard)
				.catch(setError);
			return () => abortController.abort();
		}
	}

	return (
		<>
			<tr className={`table-${color[status]}`}>
				<th scope="row">{status}</th>
				<td>{`${first_name} ${last_name}`}</td>
				<td>{people}</td>
				<td>{mobile_number}</td>
				<td>{reservation_date}</td>
				<td>{reservation_time}</td>
				<td>
					<button
						disabled={status !== "booked"}
						type="button"
						onClick={() => history.push(`/reservations/${reservation_id}/seat`)}
						className="btn btn-info m-1"
					>
						Seat
					</button>
					<button
						disabled={status !== "booked"}
						type="button"
						onClick={() => history.push(`/reservations/${reservation_id}/edit`)}
						className="btn btn-secondary m-1"
					>
						Edit
					</button>
					<button
						disabled={status !== "booked"}
						type="button"
						onClick={(e) => handleCancel(e)}
						className="btn btn-danger m-1"
					>
						Cancel
					</button>
				</td>
			</tr>
		</>
	);
}
export default Reservation;
