import Cookies from 'js-cookie'

const TokenKey = 'swpu_token'

export function getToken(): string | undefined {
  return Cookies.get(TokenKey)
}

export function setToken(token: string): string | undefined {
  // 设置cookie过期时间为7天，这样刷新页面后token也不会丢失
  return Cookies.set(TokenKey, token, { expires: 7 })
}

export function removeToken(): void {
  return Cookies.remove(TokenKey)
}
