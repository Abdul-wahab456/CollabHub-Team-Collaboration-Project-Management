import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach access token
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired access token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      const userId = localStorage.getItem("userId");

      if (!refreshToken || !userId) {
        window.location.href = "/login";
        return Promise.reject(err);
      }

      try {
        interface TokenResponse {
          access_token: string;
          refresh_token: string;
        }

        const res = await axios.post<TokenResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { userId, refreshToken }
        );
        const { access_token, refresh_token } = res.data;

        // Save new tokens
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
