const baseUrl = "http://localhost:3001";
const headers = { "Content-Type": "application/json" };

export const handleServerResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
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
