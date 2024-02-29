import axios from "axios"
import { authApi, refreshAccessTokenFn } from "./axios"
import { config } from "process"


export class HttpError extends Error {
  constructor(message?: string) {
    super(message) // 'Error' breaks prototype chain here
    this.name = 'HttpError'
    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain
  }
}

let retry = false;
export async function httpErrorHandler(error: any) {
  if (error === null) throw new Error('Unrecoverable error!! Error is null!')
  if (axios.isAxiosError(error)) {
    //here we have a type guard check, error inside this if will be treated as AxiosError
    const response = error?.response
    const request = error?.request
    const originalRequest = error?.config //here we have access the config used to make the api call (we can make a retry using this conf)

    if (error.code === 'ERR_NETWORK') {
      return new Error('connection problems..')
    } else if (error.code === 'ERR_CANCELED') {
      return new Error('connection canceled..')
    }

    if (response && originalRequest !== undefined) {
      //The request was made and the server responded with a status code that falls out of the range of 2xx the http status code mentioned above
      const statusCode = response?.status
      
      if (statusCode === 403 && !retry) {
        retry = true;
        const newAccessToken = await refreshAccessTokenFn();
        originalRequest.headers.set("Authorization", `Bearer ${newAccessToken.token}`)
        return authApi(originalRequest);
    }
    if (statusCode === 403) {
      document.location.href = "/login";
    }
      
      if (statusCode >= 400) {
        return new HttpError(response?.data?.msg)
      } 
      //redirect user to login
    //   else if (statusCode === 403) {
    //     return new HttpError('Please login to access this resource')
    //   }
    } else if (request) {
        return new HttpError('Server error');
      //The request was made but no response was received, `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in Node.js
    }
  }
  //Something happened in setting up the request and triggered an Error
  console.log(error.message)
}