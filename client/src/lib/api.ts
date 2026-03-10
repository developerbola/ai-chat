import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const api_url = import.meta.env.VITE_API_URL;

const api = async (
  method: string = "get",
  data: any = {},
  path: string = "",
  contentType: string = "application/json",
): Promise<AxiosResponse | any> => {
  try {
    if (!path?.includes("undefined")) {
      const url = `${api_url}${path}`;

      const userString = sessionStorage.getItem("user");

      let token: string | undefined = undefined;

      if (userString) {
        const user = JSON.parse(userString) as { access_token?: string };
        token = user.access_token;
      }

      const headers: Record<string, string> = {
        "Content-Type": contentType,
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const config: AxiosRequestConfig = {
        method,
        url,
        headers,
      };

      if (method.toLowerCase() === "get") {
        config.params = data;
      } else {
        config.data = data;
      }

      const response = await axios(config);
      return response;
    }
  } catch (error: any) {
    if (error.response && error.response.status === 403) {
      sessionStorage.removeItem("user");
    }
    return error.response || error;
  }
};

export { api };
