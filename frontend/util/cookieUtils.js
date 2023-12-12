export function setCookieJson(key, value, daysToExpire = 7) {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);

  const cookieValue = JSON.stringify(value);
  const cookieString = `${key}=${cookieValue}; expires=${expirationDate.toUTCString()}; path=/; SameSite=None; Secure`;

  document.cookie = cookieString;
}
