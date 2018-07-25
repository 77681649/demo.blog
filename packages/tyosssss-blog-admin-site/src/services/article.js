import request from "../utils/request";

export function save(article) {
  debugger;
  return request(`http://localhost:3000/api/article`, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(article)
  });
}
