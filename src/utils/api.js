const baseUrl = "http://localhost:3001";
const headers = { "Content-Type": "application/json" };

export const getItems = () =>
  fetch(`${baseUrl}/items`, { headers }).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Error: ${res.status}`);
    }
  });

export const addItem = ({ name, imageUrl, weather }) => {
  return fetch(`${baseUrl}/items`, {
    method: "POST",
    headers,

    body: JSON.stringify({
      name,
      imageUrl,
      weather,
    }),
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    Promise.reject(`Error: ${res.status}`);
  });
};

export const deleteItem = (itemId) => {
  return fetch(`${baseUrl}/items/${itemId}`, {
    method: "DELETE",
    headers,
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    Promise.reject(`Error: ${res.status}`);
  });
};
