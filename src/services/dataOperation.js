/**
 * Created by zealot on 17/4/18.
 */
import { request, config } from '../utils'
const { api } = config;
import axios from 'axios'




export async function addNewTestInstanceService (data) {
  return request({
    url: api.dataOperation_uploader.addNewTestInstance,
    method: 'post',
    data,
  })
}

export async function getFormulationListService (data) {
  return request({
    url: api.dataOperation_uploader.getFormulationList,
    method: 'get',
    data,
  })
}
