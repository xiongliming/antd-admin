/**
 * Created by zealot on 17/4/18.
 */
import { request, config } from '../utils'
const { api } = config
const { dataOperationUpload } = api

export async function uplaod (data) {
  return request({
    url: dataOperationUpload,
    method: 'post',
    data,
  })
}
