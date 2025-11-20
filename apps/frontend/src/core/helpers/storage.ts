export const getAuthToken = (): string | null => {
  return localStorage.getItem("AUTH_TOKEN") ?? sessionStorage.getItem("AUTH_TOKEN");
};

export const setAuthToken = (token: string, remember = true) => {
  remember
    ? localStorage.setItem("AUTH_TOKEN", token)
    : sessionStorage.setItem("AUTH_TOKEN", token);
};

export const clearAuth = () => {
  localStorage.removeItem("AUTH_TOKEN");
  sessionStorage.removeItem("AUTH_TOKEN");
};
