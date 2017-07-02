/**
 * Created by zealot on 19/6/20.
 */
import {cloneDeep} from 'lodash'
import { browserHistory } from 'react-router'

import {
  modifyFormulationService,
  deleteFormulationService,
  getFormulationListService,
  getTestListService,
  getTestDataListService,
  getFormulationDataListService,
  deleteTestService,
} from '../../services/dataOperation'
const moment = require('moment');

const uploader = {
  namespace: 'dataOperation_viewer',
  state: {
    plot2dType: 'line',             // point | line
    plot2dEPrimeDataType: 'linear', // linear | log
    plot3dPlotTarget: 'Tan Delta',  // Tan Delta | E'
    selectedFormulationID: 0,
    selectedTestID: 0,
    formulationList: [],
  },
  subscriptions: {
    setup({history, dispatch}) {
      return history.listen(({pathname}) => {
        if (pathname === '/dataOperation/viewer/') {
          dispatch({type: 'renew'});
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
    *getFormulationTestList ({payload}, {put, call, select}) {
      const data = yield call(getTestListService, payload);
      yield put({
        type: 'updateFormulationTestList',
        payload: {
          testList: data.test_list,
          formulationID: data.formulation_id
        }
      });
    },
    *getFormulationTestDataList ({payload}, {put, call, select}) {
      const data = yield call(getTestDataListService, payload);
      yield put({
        type: 'updateFormulationTestDataList',
        payload: {
          formulationID: data['formulation_id'],
          testID: data['test_id'],
          testData: data['test_data'],
        }
      });
    },
    *getFormulationDataList ({payload}, {put, call, select}) {
      const data = yield call(getFormulationDataListService, payload);
      yield put({
        type: 'updateFormulationDataList',
        payload: {
          formulationID: data['formulation_id'],
          formulationLines: data['lines'],
        }
      });
    },
    *modifyFormulation ({payload}, {put, call, select}) {
      const data = yield call(modifyFormulationService, payload);
      yield put({type: 'updateFormulation', payload: data})
    },
    *deleteFormulation ({payload}, {put, call, select}) {
      const data = yield call(deleteFormulationService, payload);
      console.log(data);

      yield put({type: 'renew'});
      yield put({type: 'getFormulationList'});
    },
    *deleteTest ({payload}, {put, call, select}) {
      const data = yield call(deleteTestService, payload);
      yield put({
        type: 'updateFormulationTestListAfterDelete',
        payload: {
          formulationID: data['formulation_id'],
          testID: data['test_id'],
        }
      });
    },
  },
  reducers: {
    renew(state) {
      return {
        plot2dType: 'line',             // point | line
        plot2dEPrimeDataType: 'linear', // linear | log
        plot3dPlotTarget: 'Tan Delta',  // Tan Delta | E'
        selectedFormulationID: 0,
        selectedTestID: 0,
        formulationList: [],
      }
    },
    updateFormulationList(state, {payload}) {
      let newState = cloneDeep(state);
      newState.formulationList = payload.map((item) => {
        item['id'] = item.id;
        item['name'] = item.name;
        item['date'] = moment.unix(item.date);
        item['lines'] = [];

        item['value'] = item.id;
        item['label'] = item.name;
        item['isLeaf'] = false;
        return item
      });
      return newState
    },
    updateFormulation(state, {payload}) {
      let newState = cloneDeep(state);
      let modifiedFormulation = newState.formulationList.filter((item) => item.id === payload['formulation_id'])[0];
      modifiedFormulation['formulation_properties'] = payload['formulation_properties'];
      return newState
    },
    updateSelectedFormulationTest(state, {payload}) {
      return {
        ...state,
        selectedFormulationID: payload.selectedFormulationID,
        selectedTestID: payload.selectedTestID,
      }
    },
    updateFormulationTestList(state, {payload}) {
      let newState = cloneDeep(state);
      const {testList, formulationID} = payload;
      let currentFormulation = newState.formulationList.filter((item) => item.id === formulationID)[0];
      currentFormulation['children'] = [];
      testList.map((item) => {
        currentFormulation['children'].push({
          id: item.id,
          name: item.name,
          measureType: item.measure_type,
          thickness: item.thickness,
          temperatureMax: item.temperature_max,
          temperatureMin: item.temperature_min,
          frequencyMax: item.frequency_max,
          frequencyMin: item.frequency_min,
          testType: item.test_type,
          dataFileUrl: item.data_file_url,
          date: moment.unix(item.date),
          formulationID: item.formulation_id,
          attachmentUrlList: item.attachment_url,
          data: [],

          value: item.id,
          label: item.name,
          isLeaf: true,
        })
      });
      return newState
    },
    updateFormulationTestListAfterDelete(state, {payload}) {
      let newState = cloneDeep(state);
      const {formulationID, testID} = payload;
      const currentFormulation = newState.formulationList.filter((item) => item.id === formulationID)[0];
      // delete test from formulation children
      const tIndex = currentFormulation.children.findIndex((item) => item.id === testID);
      currentFormulation.children.splice(tIndex, 1);
      // delete line from formulation lines
      const lIndex = currentFormulation.lines.findIndex((item) => item.id === testID);
      currentFormulation.lines.splice(lIndex, 1);
      // reset selector
      newState.selectedTestID = 0;
      return newState
    },
    updateFormulationTestDataList(state, {payload}) {
      let newState = cloneDeep(state);
      const {formulationID, testID, testData} = payload;
      const currentFormulation = newState.formulationList.filter((item) => item.id === formulationID)[0];
      const currentTest = currentFormulation.children.filter((item) => item.id === testID)[0];
      currentTest['data'] = testData;
      return newState
    },
    updateFormulationDataList(state, {payload}) {
      let newState = cloneDeep(state);
      const {formulationID, formulationLines} = payload;
      const currentFormulation = newState.formulationList.filter((item) => item.id === formulationID)[0];
      currentFormulation['lines'] = formulationLines;
      return newState
    },
    updatePlot2dEPrimeDataType(state, {payload}) {
      return {
        ...state,
        plot2dEPrimeDataType: payload,
      }
    },
    updatePlot2dType(state, {payload}) {
      return {
        ...state,
        plot2dType: payload,
      }
    },
    updatePlot3dPlotTarget(state, {payload}) {
      return {
        ...state,
        plot3dPlotTarget: payload,
      }
    },
    test(state, {payload}) {
      let newState = cloneDeep(state);
      // const testIndex = newState.formulationList.findIndex((item) => item.id === 2)[0];
      newState.formulationList.splice(1, 1);
      console.log(newState);
      return newState
    },
  },
};

export default uploader

