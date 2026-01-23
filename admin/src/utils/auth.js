export const isAdminAuthenticated = () => {
  return !!localStorage.getItem("adminToken");
};
