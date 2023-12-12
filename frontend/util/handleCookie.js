const HandleCookies = {
  setCookieJson(key, value) {
    document.cookie = `${key}=${JSON.stringify(
      value
    )}; path=/; SameSite=None; Secure ; `;
  },

  removeCookie(key) {

    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  },
  getCookie(key) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name.trim() === key) {
        return decodeURIComponent(value);
      }
    }
    return null;
  },
};

export default HandleCookies;
