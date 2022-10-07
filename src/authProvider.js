// import inMemoryJWT from "./inMemoryJWT";
import inMemoryJWT from "ra-in-memory-jwt";

const authProvider = {
  login: ({ username, password }) => {
    const request = new Request("http://localhost:3000/api/v1/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: username, password }),
      headers: new Headers({ "Content-Type": "application/json" }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(({ token }) => {
        inMemoryJWT.setToken(token);
      });
  },
  logout: () => {
    inMemoryJWT.ereaseToken();
    return Promise.resolve();
  },

  checkAuth: () => {
    return inMemoryJWT.getToken() ? Promise.resolve() : Promise.reject();
  },

  checkError: (error) => {
    const status = error?.status;
    if (status === 401 || status === 403) {
      inMemoryJWT.ereaseToken();
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    return inMemoryJWT.getToken() ? Promise.resolve() : Promise.reject();
  },
};

export default authProvider;
