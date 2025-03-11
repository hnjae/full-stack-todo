export default {
  get: () => {
    return localStorage.getItem('refreshToken');
  },

  set: (token: string) => {
    localStorage.setItem('refreshToken', token);
  },

  remove: () => {
    localStorage.removeItem('refreshToken');
  },
};
