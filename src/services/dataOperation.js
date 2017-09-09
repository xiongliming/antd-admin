/**
 * Created by zealot on 17/4/18.
 */
import { request, config } from '../utils'
const { api } = config;


export async function searchDataService (data) {
  return request({
    url: api.dataOperation.searchDataUrl,
    method: 'get',
    data,
  })
}

export async function getFormulationListService () {
  return request({
    url: api.dataOperation.getFormulationListUrl,
    method: 'get',
  })
}

export async function createFormulationService (data) {
  return request({
    url: api.dataOperation.createFormulationUrl,
    method: 'post',
    data,
  })
}

export async function modifyFormulationService (data) {
  return request({
    url: api.dataOperation.modifyFormulationUrl(data.id),
    method: 'put',
    data,
  })
}

export async function deleteFormulationService (data) {
  return request({
    url: api.dataOperation.deleteFormulationUrl(data.id),
    method: 'delete',
    data,
  })
}

export async function getFormulationDataListService (data) {
  return request({
    url: api.dataOperation.getFormulationDataListUrl(data.id),
    method: 'get',
  })
}

export async function getTestListService (data) {
  return request({
    url: api.dataOperation.getFormulationTestListUrl(data.id),
    method: 'get',
  })
}

export async function createTestService (data) {
  return request({
    url: api.dataOperation.createTestUrl,
    method: 'post',
    data,
  })
}

export async function deleteTestService (data) {
  return request({
    url: api.dataOperation.deleteTestUrl(data.id),
    method: 'delete',
    data
  })
}

export async function getTestDataListService (data) {
  return request({
    url: api.dataOperation.getTestDataListUrl(data.id),
    method: 'get',
  })
}

export async function removeDataFileService (data) {
  return request({
    url: api.dataOperation.removeTestDataUrl(data.id),
    method: 'delete',
    data,
  })
}

export async function removeAttachmentService (data) {
  return request({
    url: api.dataOperation.removeTestAttachmentUrl(data.id),
    method: 'delete',
    data,
  })
}
