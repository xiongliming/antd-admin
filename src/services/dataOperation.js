/**
 * Created by zealot on 17/4/18.
 */
import { request, config } from '../utils'
const { api } = config;


export async function createTestService (data) {
  return request({
    url: api.dataOperation_uploader.createTestUrl,
    method: 'post',
    data,
  })
}

export async function getFormulationListService (data) {
  return request({
    url: api.dataOperation_uploader.getFormulationListUrl,
    method: 'get',
    data,
  })
}

export async function createFormulationService (data) {
  return request({
    url: api.dataOperation_uploader.createFormulationUrl,
    method: 'post',
    data,
  })
}

export async function removeDataFileService (data) {
  return request({
    url: api.dataOperation_uploader.removeTestDataUrl,
    method: 'delete',
    data,
  })
}

export async function removeAttachmentService (data) {
  return request({
    url: api.dataOperation_uploader.removeTestAttachmentUrl,
    method: 'delete',
    data,
  })
}
