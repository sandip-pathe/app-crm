import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";

import { createClient } from "graphql-ws";
import { axiosInstance } from "./axios";

// Define the base URL and WebSocket URL
export const API_BASE_URL = "http://localhost:4000"; 
export const API_URL = `${API_BASE_URL}/graphql`; 
export const WS_URL = "ws://localhost:4000"; 

// Define the GraphQL client with a custom fetch function using axios
export const client = new GraphQLClient(API_URL, {
  fetch: async (url: string, options: any) => {
    try {
      const response = await axiosInstance.request({
        data: options.body,
        url,
        ...options,
      });

      return {
        data: response.data, // Only return the data
        status: response.status, // Axios status
        statusText: response.statusText, // Axios statusText
        headers: response.headers, // Axios headers
      };
    } catch (error: any) {
      // Axios errors are generally structured as error.response or error.request
      const errorMessage =
        error?.response?.data?.errors?.map((e: any) => e.message).join(", ") ||
        error?.response?.data?.message ||
        "An unknown error occurred";

      const statusCode = error?.response?.status || 500;

      return Promise.reject({
        message: errorMessage,
        statusCode: statusCode,
      });
    }
  },
});

// Define the WebSocket client with connection parameters
export const wsClient = createClient({
  url: WS_URL,
  connectionParams: () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.warn("No access token found in localStorage");
    }

    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  },
});

// Create data provider and live provider for real-time data
export const dataProvider = graphqlDataProvider(client);
export const liveProvider = graphqlLiveProvider(wsClient);
