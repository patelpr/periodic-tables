import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { changeStatus } from "../../utils/api";
import { formatAsDate, formatAsTime } from "../../utils/date-time";
import ErrorAlert from "../ErrorAlert";
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
	loadReservations,
}) {
	const history = useHistory();
	const [error, setError] = useState(null);
	const color = {
		booked: "success",
		seated: "primary",
		finished: "secondary",
		cancelled: "danger",
	};
	const handleCancel = (event) => {
		event.preventDefault();
		const message = `Do you want to cancel this reservation? This cannot be undone.`;
		if (window.confirm(message)) {
			const abortController = new AbortController();
			setError(null);
			changeStatus(reservation_id, "cancelled", abortController.signal)
				.then(() => {
					loadReservations();
				})
				.catch(setError);
			return () => abortController.abort();
		}
	};

	return (
		<>
			{error && <ErrorAlert error={error} />}

			<div className={`card border-${color[status]} mb-3 p-1`}>
				<div className="card-horizontal row">
					<span className="cols col-1">
						<button
							type="button"
							className={`btn disabled btn-${color[status]}`}
							style={{ width: "100%" }}
						>
							{status}
						</button>
					</span>
					<span className="cols col-1 btn btn-text">
						Party of-
						<span className={`badge badge-info`}>{people} </span>
					</span>
					<span className="cols col-5 btn btn-text ">
						{first_name} {last_name}
					</span>
					<span className="cols col-1 btn btn-text ">{mobile_number}</span>
					<span className="cols col-1 btn btn-text ">
						{formatAsDate(reservation_date)}
					</span>
					<span className="cols col-1 btn btn-text">
						{formatAsTime(reservation_time)}
					</span>
					<span
						className="cols col-1 btn-group"
						role="group"
						aria-label="Basic example"
					>
						<button
							type="button"
							onClick={() =>
								history.push(`/reservations/${reservation_id}/seat`)
							}
							className="btn btn-info"
						>
							Seat
						</button>
						<button
							type="button"
							onClick={() =>
								history.push(`/reservations/${reservation_id}/edit`)
							}
							className="btn btn-secondary"
						>
							Edit
						</button>
						<button
							type="button"
							onClick={() => handleCancel()}
							className="btn btn-danger"
						>
							Cancel
						</button>
					</span>
				</div>
			</div>
		</>
	);
}
export default Reservation;
