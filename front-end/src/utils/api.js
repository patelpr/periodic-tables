/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL = "http://localhost:5000";
//"https://periodic-tables-back.herokuapp.com" process.env.REACT_APP_API_BASE_URL || ;

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}
/** ************RESERVATION API ************** */
/**
 * Retrieves all existing reservations.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */
export async function listReservations(params, signal) {
  try {
    const url = new URL(`${API_BASE_URL}/reservations`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value.replace(/\D/g, ""));
    });
    return await fetchJson(url, { headers, signal }, [])
      .then(formatReservationDate)
      .then(formatReservationTime);
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return 
  }
}
/** ADDED TO API */
/**CREATE RESERVATION */

export async function createReservation(reservation, signal) {
  try {

  reservation.people = Number(reservation.people);

  return await fetchJson(
    new URL(`${API_BASE_URL}/reservations`),
    {
      method: "POST",
      headers,
      body: JSON.stringify({ data: reservation }),
      signal,
    },
    {}
  );
}catch(error){
			if (error.name !== "AbortError") {
				console.error(error.stack);
				throw error;
			}
			return 
		}
}
/**RESERVATION BY ID */
export async function readReservation(id, signal) {
  try {

  const url = `${API_BASE_URL}/reservations/${id}`;
  return await fetchJson(url, { signal }, {});
}catch(error){
			if (error.name !== "AbortError") {
				console.error(error.stack);
				throw error;
			}
			return 
		}
}
/**RESERVATION STATUS CHANGE */
export async function changeStatus(id, status, signal) {
  try {

  const url = `${API_BASE_URL}/reservations/${id}/status`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status } }),
    signal,
  };
  return await fetchJson(url, options, { status });
}catch(error){
			if (error.name !== "AbortError") {
				console.error(error.stack);
				throw error;
			}
			return 
		}
}

/**RESERVATION DETAIL CHANGE */
export async function updateReservation(reservation, reservation_id, signal) {
  try {

  let { people } = reservation;
  reservation.people = Number(people);
  return await fetchJson(
    `${API_BASE_URL}/reservations/${reservation_id}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ data: { ...reservation } }),
      signal,
    },
    { ...reservation }
  );
}catch(error){
			if (error.name !== "AbortError") {
				console.error(error.stack);
				throw error;
			}
			return 
		}
}

/** ************RESERVATION API ENDS HERE ************** */

/** ************TABLE API ************** */

/**CREATE TABLE */
export async function createTable(table, signal) {
  try {

  const url = new URL(`${API_BASE_URL}/tables`);
  table.capacity = Number(table.capacity);
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  };
  return await fetchJson(url, options, {});
}catch(error){
			if (error.name !== "AbortError") {
				console.error(error.stack);
				throw error;
			}
			return 
		}
}
/**LIST TABLES */
export async function listTables(signal) {
  try {

  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { signal }, []);
}catch(error){
			if (error.name !== "AbortError") {
				console.error(error.stack);
				throw error;
			}
			return 
		}
}
/**TABLES AVAILABLE */
export async function listTablesAvailable(params, signal) {
  try {

  const url = new URL(`${API_BASE_URL}/tables/free`);
  return await fetchJson(url, { headers, signal }, []);
}catch(error){
			if (error.name !== "AbortError") {
				console.error(error.stack);
				throw error;
			}
			return 
		}
}
/** TABLE ASSIGNMENT BY RESERVATION ID AND TABLE ID */
export async function assignTable(reservation_id, table_id, signal) {
  try {

  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  };
  return await fetchJson(url, options, { reservation_id });
}catch(error){
			if (error.name !== "AbortError") {
				console.error(error.stack);
				throw error;
			}
			return 
		}
}

/**TABLE ASSIGNMENT REMOVAL */
export async function removeTable(table_id, signal) {
  try {

  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  const options = {
    method: "DELETE",
    signal,
  };
  return await fetchJson(url, options);
}catch(error){
	if (error.name !== "AbortError") {
		console.error(error.stack);
		throw error;
	}
	return 
}
}
/** ************TABLE API ENDS HERE************** */
