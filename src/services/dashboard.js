import { request, config } from '../utils'
const { api } = config;


export async function getDashboardDataService () {
  return request({
    url: api.dashboard.getDashboardDataUrl,
    method: 'get',
  })
}
