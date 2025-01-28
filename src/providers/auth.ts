import type { AuthProvider } from "@refinedev/core";
import { API_URL, dataProvider } from "./data"; 

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        meta: {
          variables: { email, password },
          rawQuery: `
            mutation Login($email: String!, $password: String!) {
              login(email: $email, password: $password) { 
                token 
                user {
                  id 
                  email 
                }
              }
            }
          `,
        },
      });

      localStorage.setItem("token", data.login.token);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error?.response?.errors?.[0]?.message || "Login failed",
          name: "Login Error",
        },
      };
    }
  },

  register: async ({ email, password }) => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        meta: {
          variables: { email, password },
          rawQuery: `
            mutation Register($email: String!, $password: String!) {
              register(email: $email, password: $password) {
                token
                user {
                  id 
                  email 
                }
              }
            }
          `,
        },
      });

      localStorage.setItem("token", data.register.token);

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error?.response?.errors?.[0]?.message || "Register failed",
          name: "Registration Error",
        },
      };
    }
  },

  logout: async () => {
    localStorage.removeItem("token");

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem("token");
    if (token) {
      return { authenticated: true };
    } else {
      return { authenticated: false };
    }
  },

  onError: async (error) => {
    if (error?.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
      };
    }

    return { error };
  },

  getIdentity: async () => {
    try {
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        meta: {
          rawQuery: `
            query Me {
              me { 
                id
                email
              }
            }
          `,
        },
      });

      return data.me;
    } catch (error) {
      return undefined;
    }
  },

  getPermissions: async () => {
    // Implement your permission logic here if needed
    return null;
  },
};
