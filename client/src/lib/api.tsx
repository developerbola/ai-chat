import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const api_url = import.meta.env.VITE_API_URL;

const api = async (
  method: string = "get",
  path: string = "",
  data: any = {},
  contentType: string = "application/json",
): Promise<AxiosResponse | any> => {
  const userString = sessionStorage.getItem("user");
  try {
    if (!path?.includes("undefined")) {
      const url = `${api_url}${path}`;

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
      return response.data;
    }
  } catch (error: any) {
    if (error.response && error.response.status === 403) {
      sessionStorage.removeItem("user");
    }
    if (error.status == 401 && userString) {
      sessionStorage.removeItem("user");
      window.location.pathname = "/auth";
    }
    return error.response || error;
  }
};

export { api };
