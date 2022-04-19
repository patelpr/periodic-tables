import React from "react";
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
	const color = {
		booked: "success",
		seated: "info",
		finished: "dark",
		cancelled: "danger",
	};
	function handleCancel(e) {
		e.preventDefault();

		if (window.confirm("Do you want to cancel this reservation?")) {
			const abortController = new AbortController();
			changeStatus(reservation_id, "cancelled", abortController.signal)
				.then(loadDashboard)
				.catch(setError);
			return () => abortController.abort();
		}
	}

	return (
		<>
			<tr className={`table-${color[status]}`}>
				<th scope="row" data-reservation-id-status={reservation_id}>
					{status}
				</th>










				<td>{first_name + " " + last_name}</td>
				<td>{people}</td>
				<td>{mobile_number}</td>
				<td>{reservation_date}</td>
				<td>{reservation_time}</td>













				<td>
					{status === "seated" || (
						<a
							className="btn btn-info m-1"
							href={`/reservations/${reservation_id}/seat`}
						>
							Seat
						</a>
					)}

					<a
						href={`/reservations/${reservation_id}/edit`}
						className="btn btn-secondary m-1"
					>
						Edit
					</a>
					{status === "cancelled" || (
						<button
							data-reservation-id-cancel={reservation_id}
							disabled={status !== "booked"}
							onClick={handleCancel}
							className="btn btn-danger m-1"
						>
							Cancel
						</button>
					)}
				</td>
			</tr>
		</>
	);
}
export default Reservation;
