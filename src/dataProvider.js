import { fetchUtils } from "ra-core";
import inMemoryJWT from "ra-in-memory-jwt";

//import inMemoryJWT from "./inMemoryJWT";

export default (apiUrl) => {
  const httpClient = (url, options = {}) => {
    options = {
      ...options,
      headers: new Headers({ Accept: "application/json" }),
    };
    const token = inMemoryJWT.getToken();
    if (token) {
      options.headers.set("Authorization", token);
    }
    return fetchUtils.fetchJson(url, options);
  };

  return {
    getList: (resource, params) => {
      const { page, perPage } = params.pagination;
      const url = `${apiUrl}/${resource}?page=${page}&size=${perPage}`;
      return httpClient(url).then(({ headers, json }) => {
        return {
          data: json.results,
          total: headers.get("x-total-count"),
        };
      });
    },
    getOne: (resource, params) =>
      httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
        data: json,
      })),
    // getMany: () => Promise.reject(),
    // getManyReference: () => Promise.reject(),
    update: async (resource, params) => {
      const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
        method: "PUT",
        body: JSON.stringify(params.data),
      });
      return {
        data: json,
      };
    },

    // updateMany: () => Promise.reject(),
    // create: () => Promise.resolve({ data: { id: 0 } }),
    // delete: () => Promise.reject(),
    // deleteMany: () => Promise.reject(),
  };
};
