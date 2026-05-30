import { baseUrl } from "./constants";

const headers = { "Content-Type": "application/json" };

export const handleServerResponse = async (res) => {
  if (res.ok) return res.json();

  const friendlyStatusMessage = {
    401: "Incorrect email or password",
    409: "That email is already in use",
  };

  const defaultMessage = res.statusText || `Error: ${res.status}`;
  let serverMessage = defaultMessage;

  try {
    const data = await res.json();
    if (typeof data === "string") {
      serverMessage = data;
    } else if (data) {
      serverMessage =
        data.message ||
        data.error ||
        data?.errors?.[0]?.message ||
        defaultMessage;
    }
  } catch {
    serverMessage = defaultMessage;
  }

  if (friendlyStatusMessage[res.status]) {
    return Promise.reject(friendlyStatusMessage[res.status]);
  }
  return Promise.reject(serverMessage);
};

export const getItems = () =>
  fetch(`${baseUrl}/items`, { headers }).then(handleServerResponse);

export const addItem = ({ name, imageUrl, weather }, token) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: requestHeaders,

    body: JSON.stringify({
      name,
      imageUrl,
      weather,
    }),
  }).then(handleServerResponse);
};

export const deleteItem = (itemId, token) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };
  return fetch(`${baseUrl}/items/${itemId}`, {
    method: "DELETE",
    headers: requestHeaders,
  }).then(handleServerResponse);
};

export const addCardLike = (itemId, token) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };
  return fetch(`${baseUrl}/items/${itemId}/likes`, {
    method: "PUT",
    headers: requestHeaders,
  }).then(handleServerResponse);
};

export const removeCardLike = (itemId, token) => {
  const requestHeaders = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };
  return fetch(`${baseUrl}/items/${itemId}/likes`, {
    method: "DELETE",
    headers: requestHeaders,
  }).then(handleServerResponse);
};
