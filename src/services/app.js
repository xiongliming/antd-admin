import { request, config } from '../utils'
const { api } = config;
const { userInfo, userLogout } = api;

export async function login (params) {
  return request({
    url: '/api/login',
    method: 'post',
    data: params,
  })
}

export async function logout (params) {
  return request({
    url: userLogout,
    method: 'get',
    data: params,
  })
}

export async function getUserInfo (data) {
  return request({
    // url: userInfo,
    url: api.user.queryInfoUrl,
    method: 'get',
    data: data,
  })
}
