/**
 * Created by zealot on 17/6/26.
 */
/**
 * Created by zealot on 19/6/20.
 */
import {cloneDeep} from 'lodash'
import {
  modifyFormulationService,
  getTestListService,
  getTestDataListService,
  deleteTestService,
} from '../services/dataOperation'
import {
  trainFormulationModelService,
  getFormulationListService,
  getFormulationDataListService,
  getFormulationModelTrainedDataListService,
} from '../services/dataAnalysis'
import TimerMixin from 'react-timer-mixin'
import {api} from '../utils/config'
const moment = require('moment');

const uploader = {
  namespace: 'dataAnalysis',
  state: {
    selectedFormulationID: 0,
    formulationList: [],
    redisTrainingTaskID: '',
    redisLoggingTaskID: '',
    trainFlag: 'preTrain', // preTrain | training | trained
    trainingLoss: 1,
    selectFormulationTrainedGrid: {},
    plot3dPlotTarget: 'Tan Delta',  // Tan Delta | E'
    plot3dIsShowGrid: true,
    // trainingState: {
    //   epoch: 0,
    //   epochs: 1000,
    //   modelState: '',
    //   training_loss: 1,
    // }
  },
  subscriptions: {
    setup({history, dispatch}) {
      return history.listen(({pathname}) => {
        if (pathname === '/dataAnalysis/') {
          // dispatch({type: 'renew'});
          dispatch({type: 'getFormulationList'});
        }
      });
    },
  },
  effects: {
    *getFormulationList ({payload}, {put, call, select}) {
      const data = yield call(getFormulationListService);
      yield put({type: 'updateFormulationList', payload: data['formulation_list']});
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
    *trainFormulationModel ({payload}, {put, call, select}) {
      const data = yield call(trainFormulationModelService, payload);
      yield put({type: 'updateTrainingFlag', payload: 'training'});
      if (data.status === 'success') {
        yield put({
          type: 'updateRedisID',
          payload: {
            redisTrainingTaskID: data['training_uuid'],
            redisLoggingTaskID: data['logging_uuid']
          }
        });
      }
    },
    *getFormulationModel ({payload}, {put, call, select}) {
      yield put({type: 'updateTrainingFlag', payload: 'trained'});
      yield put({type: 'updateTrainingLoss', payload: payload.trainingLoss});
      const data = yield call(trainFormulationModelService, payload);
      yield put({type: 'updateSelectFormulationTrainedGrid', payload: data});
      // if (data.status === 'success') {
      //   yield put({type: 'updateFormulationTrainingFlag', payload: false});
      // }
    },
    // *getFormulationTrainingLog ({payload}, {put, call, select}) {
    //   const data = yield call(getFormulationTrainingLogService, payload);
    //   console.log(data);
    //   // yield put({type: 'updateFormulationTrainingLog', payload: data});
    // },
    // *getFormulationTestList ({payload}, {put, call, select}) {
    //   const data = yield call(getTestListService, payload);
    //   yield put({
    //     type: 'updateFormulationTestList',
    //     payload: {
    //       testList: data.test_list,
    //       formulationID: data.formulation_id
    //     }
    //   });
    // },
    // *getFormulationTestDataList ({payload}, {put, call, select}) {
    //   const data = yield call(getTestDataListService, payload);
    //   yield put({
    //     type: 'updateFormulationTestDataList',
    //     payload: {
    //       formulationID: data['formulation_id'],
    //       testID: data['test_id'],
    //       testData: data['test_data'],
    //     }
    //   });
    // },
    // *getFormulationDataList ({payload}, {put, call, select}) {
    //   const data = yield call(getFormulationDataListService, payload);
    //   yield put({
    //     type: 'updateFormulationDataList',
    //     payload: {
    //       formulationID: data['formulation_id'],
    //       formulationLines: data['lines'],
    //     }
    //   });
    // },
    // *modifyFormulation ({payload}, {put, call, select}) {
    //   const data = yield call(modifyFormulationService, payload);
    //   yield put({type: 'updateFormulation', payload: data})
    // },
    // *trainFormulationModel ({payload}, {put, call, select}) {
    //   yield put({type: 'updateFormulationTrainingFlag', payload: true});
    //   const data = yield call(trainFormulationModelService, payload);
    //   if (data.status === 'success') {
    //     yield put({type: 'updateRedisTrainingTaskID', payload: data['redis_fit_task_id']});
    //   }
    // },
    // *getFormulationModelTrainingResult ({payload}, {put, call, select}) {
    //   const data = yield call(trainFormulationModelService, payload);
    //   console.log(data);
    //   // if (data.status === 'success') {
    //   //   yield put({type: 'updateFormulationTrainingFlag', payload: false});
    //   // }
    // },
    // *getTrainedFormulationModel ({payload}, {put, call, select}) {
    //   // yield put({type: 'updateFormulationTrainingFlag', payload: true});
    //   const data = yield call(trainFormulationModelService, payload);
    //   if (data.status === 'success') {
    //     // yield put({type: 'updateFormulationTrainingFlag', payload: false});
    //   }
    // },
    // *getFormulationTrainingLog ({payload}, {put, call, select}) {
    //   const data = yield call(getFormulationTrainingLogService, payload);
    //   console.log(data);
    //   yield put({type: 'updateFormulationTrainingLog', payload: data});
    // },
    // *deleteTest ({payload}, {put, call, select}) {
    //   const data = yield call(deleteTestService, payload);
    //   yield put({
    //     type: 'updateFormulationTestListAfterDelete',
    //     payload: {
    //       formulationID: data['formulation_id'],
    //       testID: data['test_id'],
    //     }
    //   });
    // },
  },
  reducers: {
    // renew(state) {
    //   return {
    //     plot2dType: 'line',             // point | line
    //     plot2dEPrimeDataType: 'linear', // linear | log
    //     plot3dPlotTarget: 'Tan Delta',  // Tan Delta | E'
    //     selectedFormulationID: 0,
    //     // selectedTestID: 0,
    //     formulationList: [],
    //     isTraining: false,
    //     trainingLog: [],
    //     intervalID: 0,
    //   }
    // },
    resetTrainingStatus(state) {
      return {
        ...state,
        trainFlag: 'preTrain', // preTrain | training | trained
        trainingLoss: 1,
        redisTrainingTaskID: '',
        redisLoggingTaskID: '',
        selectFormulationTrainedGrid: {},
      }
    },
    updateFormulationList(state, {payload}) {
      let newState = cloneDeep(state);
      newState.formulationList = payload.map((item) => {
        item['date'] = moment.unix(item.date);
        return item
      });
      return newState
    },
    updateSelectedFormulation(state, {payload}) {
      return {
        ...state,
        selectedFormulationID: Number(payload.selectedFormulationID),
      }
    },
    updateFormulationDataList(state, {payload}) {
      let newState = cloneDeep(state);
      const {formulationID, formulationLines} = payload;
      const currentFormulation = newState.formulationList.filter((item) => item.id === formulationID)[0];
      currentFormulation['lines'] = formulationLines;
      return newState
    },
    updateRedisID(state, {payload}) {
      return {
        ...state,
        redisTrainingTaskID: payload.redisTrainingTaskID,
        redisLoggingTaskID: payload.redisLoggingTaskID,
      }
    },
    updateTrainingFlag(state, {payload}) {
      return {
        ...state,
        trainFlag: payload,
      }
    },
    updateTrainingLoss(state, {payload}) {
      return {
        ...state,
        trainingLoss: payload,
      }
    },
    updatePlot3dPlotTarget(state, {payload}) {
      return {
        ...state,
        plot3dPlotTarget: payload,
      }
    },
    updateIsShowPlot3dGrid(state, {payload}) {
      return {
        ...state,
        plot3dIsShowGrid: payload,
      }
    },
    updateSelectFormulationTrainedGrid(state, {payload}) {
      return {
        ...state,
        selectFormulationTrainedGrid: payload,
      }
    },
    // updateFormulation(state, {payload}) {
    //   let newState = cloneDeep(state);
    //   let modifiedFormulation = newState.formulationList.filter((item) => item.id === payload['formulation_id'])[0];
    //   modifiedFormulation['formulation_properties'] = payload['formulation_properties'];
    //   return newState
    // },
    // updateFormulationTestList(state, {payload}) {
    //   let newState = cloneDeep(state);
    //   const {testList, formulationID} = payload;
    //   let currentFormulation = newState.formulationList.filter((item) => item.id === formulationID)[0];
    //   currentFormulation['children'] = [];
    //   testList.map((item) => {
    //     currentFormulation['children'].push({
    //       id: item.id,
    //       name: item.name,
    //       measureType: item.measure_type,
    //       thickness: item.thickness,
    //       temperatureMax: item.temperature_max,
    //       temperatureMin: item.temperature_min,
    //       frequencyMax: item.frequency_max,
    //       frequencyMin: item.frequency_min,
    //       testType: item.test_type,
    //       dataFileUrl: item.data_file_url,
    //       date: moment.unix(item.date),
    //       formulationID: item.formulation_id,
    //       attachmentUrlList: item.attachment_url,
    //       data: [],
    //
    //       value: item.id,
    //       label: item.name,
    //       isLeaf: true,
    //     })
    //   });
    //   return newState
    // },
    // updateFormulationTestListAfterDelete(state, {payload}) {
    //   let newState = cloneDeep(state);
    //   const {formulationID, testID} = payload;
    //   const currentFormulation = newState.formulationList.filter((item) => item.id === formulationID)[0];
    //   // delete test from formulation children
    //   const tIndex = currentFormulation.children.findIndex((item) => item.id === testID);
    //   currentFormulation.children.splice(tIndex, 1);
    //   // delete line from formulation lines
    //   const lIndex = currentFormulation.lines.findIndex((item) => item.id === testID);
    //   currentFormulation.lines.splice(lIndex, 1);
    //   // reset selector
    //   newState.selectedTestID = 0;
    //   return newState
    // },
    // updateFormulationTestDataList(state, {payload}) {
    //   let newState = cloneDeep(state);
    //   const {formulationID, testID, testData} = payload;
    //   let currentFormulation = newState.formulationList.filter((item) => item.id === formulationID)[0];
    //   let currentTest = currentFormulation.children.filter((item) => item.id === testID)[0];
    //   currentTest['data'] = testData;
    //   return newState
    // },
    // updatePlot2dEPrimeDataType(state, {payload}) {
    //   return {
    //     ...state,
    //     plot2dEPrimeDataType: payload,
    //   }
    // },
    // updatePlot2dType(state, {payload}) {
    //   return {
    //     ...state,
    //     plot2dType: payload,
    //   }
    // },
    // updateFormulationTrainingFlag(state, {payload}) {
    //   return {
    //     ...state,
    //     isTraining: payload,
    //   }
    // },
    // updateFormulationTrainingLog(state, {payload}) {
    //   let newState = cloneDeep(state);
    //   newState.trainingLog.push(payload);
    //   return newState
    // },
    // updateIntervalID(state, {payload}) {
    //   return {
    //     ...state,
    //     intervalID: payload,
    //   }
    // },
  },
};

export default uploader

