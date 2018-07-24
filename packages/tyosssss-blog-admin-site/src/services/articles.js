import request from "../utils/request";

export function fetch({ pageIndex = 0, pageSize }) {
  return request(
    `http://localhost:3000/api/articles?page_index=${pageIndex}&page_size=${pageSize}`
  );
}
