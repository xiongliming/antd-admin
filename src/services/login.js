import { request, config } from '../utils'
const { api } = config;
const { userLogin } = api;

export async function loginService (data) {
  return request({
    url: api.user.loginUrl,
    // url: userLogin,
    method: 'post',
    data,
  })
}
