/**
 * Created by zealot on 17/4/18.
 */
import { request, config } from '../utils'
const { api } = config;


export async function getFormulationListService () {
  return request({
    url: api.dataOperation_uploader.getFormulationListUrl,
    method: 'get',
  })
}

export async function createFormulationService (data) {
  return request({
    url: api.dataOperation_uploader.createFormulationUrl,
    method: 'post',
    data,
  })
}

export async function modifyFormulationService (data) {
  return request({
    url: api.dataOperation_uploader.modifyFormulationUrl(data.id),
    method: 'put',
    data,
  })
}

export async function getTestListService (data) {
  return request({
    url: api.dataOperation_uploader.getTestListUrl,
    method: 'get',
    data,
  })
}

export async function createTestService (data) {
  return request({
    url: api.dataOperation_uploader.createTestUrl,
    method: 'post',
    data,
  })
}

export async function removeDataFileService (data) {
  console.log(removedFile);
  return request({
    url: api.dataOperation_uploader.removeTestDataUrl(data.id),
    method: 'delete',
    data,
  })
}

export async function removeAttachmentService (data) {
  const {id, removedFile} = data;
  console.log('services>>> ', data);
  return request({
    url: api.dataOperation_uploader.removeTestAttachmentUrl(id),
    method: 'delete',
    data,
  })
}
