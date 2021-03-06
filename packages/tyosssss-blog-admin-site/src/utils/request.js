import fetch from "dva/fetch";

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  //
  // success:
  //   1. HTTP status [200,300)
  //   2. response.head.errcode === 0
  //
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function checkResponseStatus(responseJSON) {
  const head = responseJSON && responseJSON.head;

  if (head && head.errcode === 0) {
    return responseJSON;
  }

  const error = new Error(head.errmessage || "The request has error.");
  error.data = responseJSON;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(checkResponseStatus)
    .then(respJSON => {
      return respJSON && respJSON.data;
    });
}
