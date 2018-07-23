import request from "../utils/request";

export function login(username, password) {
  return request(
    `http://localhost:3000/api/user/signin?username=${username}&password=${password}`
  );
}

export function getLoginStatus() {
  return request("http://localhost:3000/api/user/status");
}
