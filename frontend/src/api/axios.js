import axios from "axios";


const API_URL =
  import.meta.env.VITE_API_URL;


if (!API_URL) {
  throw new Error(
    "VITE_API_URL is not defined"
  );
}


const BASE_URL =
  API_URL.endsWith("/api")
    ? API_URL
    : `${API_URL}/api`;


console.log(
  "🌐 API URL:",
  BASE_URL
);



const api = axios.create({

  baseURL: BASE_URL,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },

});



/* ===========================
   REQUEST INTERCEPTOR
=========================== */

api.interceptors.request.use(

  (config) => {


    const token =
      localStorage.getItem("token");


    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }


    console.log(
      "🚀 Request:",
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`
    );


    console.log(
      "🔑 Token:",
      token ? "Present" : "Missing"
    );


    return config;

  },


  (error) => {

    return Promise.reject(error);

  }

);




/* ===========================
   RESPONSE INTERCEPTOR
=========================== */

api.interceptors.response.use(

  (response) => response,


  (error) => {


    console.error(
      "API Error:",
      error.response?.data ||
      error.message
    );


    return Promise.reject(error);

  }

);



export default api;

