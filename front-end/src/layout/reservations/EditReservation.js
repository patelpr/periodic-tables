import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import {
  readReservation,
  updateReservation,
} from "../../utils/api";
import { valiDate } from "../../utils/date-time";
import ErrorAlert from "../ErrorAlert";
import { FormReservation } from "./FormReservation";

export const EditReservation = () => {
  const reservationId = useParams().reservationId;
  let history = useHistory();

  const [error, setError] = useState();
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_time: "",
    reservation_date: "",
    people: 0,
    status: "booked",
  });

  useEffect(
    function loadReservation() {
      if (reservationId) {
        const abortController = new AbortController();
        readReservation(reservationId, abortController.signal)
          .then(setReservation)
          .catch(setError);

        return () => abortController.abort();
      }
    },
    [reservationId]
  );
  async function submitHandler(e) {
    try {
      setError(null);
      e.preventDefault();
      let dateCheck = valiDate(reservation, setError);

      if (!dateCheck) {
        setError({ message: "Only business hours of future dates available." });
        return;
      } else {
        setReservation(dateCheck);
      }
      if (reservationId) {
        const { signal, abort } = new AbortController();
        await updateReservation(reservation, reservationId, signal);
        return () => abort();
      }
    } catch (setError) {}
  }
  return (
    <div>
      {error && <ErrorAlert error={error} />}
      <div className="container ">
        <h2>Edit Reservation</h2>

        <FormReservation
          reservation={reservation}
          setReservation={setReservation}
          submitHandler={submitHandler}
        />
      </div>
    </div>
  );
};
