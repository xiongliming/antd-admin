/**
 * Created by zealot on 19/6/20.
 */
import {cloneDeep} from 'lodash'
import {
  modifyFormulationService,
  getFormulationListService,
  getTestListService,
} from '../../services/dataOperation'
const moment = require('moment');

const uploader = {
  namespace: 'dataOperation_viewer',
  state: {
    selectedFormulationID: 0,
    selectedTestID: 0,
    formulationList: [],
  },
  subscriptions: {
    setup({history, dispatch}) {
      return history.listen(({pathname}) => {
        if (pathname === '/dataOperation/viewer/') {
          dispatch({type: 'getFormulationList'});
        }
      });
    },
  },
  effects: {
    *getFormulationList ({payload}, {put, call, select}) {
      const data = yield call(getFormulationListService);
      yield put({type: 'updateFormulationList', payload: data.formulations});
    },
    *getTestList ({payload}, {put, call, select}) {
      const data = yield call(getTestListService, {formulationID: payload.selectedOptions[0].id});
      yield put({
        type: 'updateFormulationTestList',
        payload: {
          testList: data.test_list,
          formulationID: payload.selectedOptions[0].id
        }
      });
    },
    *modifyFormulation ({payload}, {put, call, select}) {
      const data = yield call(modifyFormulationService, payload);
      yield put({type: 'updateFormulation', payload: data})
    },
  },
  reducers: {
    updateFormulationList(state, {payload}) {
      let newState = cloneDeep(state);
      newState.formulationList = payload.map((item) => {
        item['id'] = item.id;
        item['name'] = item.name;
        item['date'] = moment.unix(item.date);

        item['value'] = item.id;
        item['label'] = item.name;
        item['isLeaf'] = false;
        return item
      });
      return newState
    },
    updateFormulation(state, {payload}) {
      let newState = cloneDeep(state);
      let modifiedFormulation = newState.formulationList.filter((item) => {
        return item.id === payload['formulation_id']
      })[0];
      modifiedFormulation['formulation_properties'] = payload['formulation_properties'];
      return newState
    },
    updateSelectedFormulation(state, {payload}) {
      return {
        ...state,
        selectedFormulationID: payload.selectedFormulationID
      }
    },
    updateSelectedFormulationTest(state, {payload}) {
      return {
        ...state,
        selectedFormulationID: payload.selectedFormulationID,
        selectedTestID: payload.selectedTestID
      }
    },
    updateFormulationTestList(state, {payload}) {
      let newState = cloneDeep(state);
      const {testList, formulationID} = payload;
      let currentFormulation = newState.formulationList.filter((item) => {
        return item.id === formulationID
      })[0];
      currentFormulation['children'] = [];
      testList.map((item) => {
        currentFormulation['children'].push({
          id: item.id,
          name: item.name,
          measure_type: item.measure_type,
          thickness: item.thickness,
          temperature_max: item.temperature_max,
          temperature_min: item.temperature_min,
          frequency_max: item.frequency_max,
          frequency_min: item.frequency_min,
          test_type: item.test_type,
          data_file_url: item.data_file_url,
          date: moment.unix(item.date),
          formulation_id: item.formulation_id,

          value: item.id,
          label: item.name,
          isLeaf: true
        })
      });
      return newState
    },
  },
};

export default uploader

