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
  saveFormulationModelGridToDBService,
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
    selectedFormulationTrainedResult: {},
    plot3dPlotTarget: 'Tan Delta',  // Tan Delta | E'
    plot3dIsShowGrid: true,
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
      yield put({type: 'updateSelectedFormulationTrainedResult', payload: data});
    },
    *saveFormulationModelGridToDB ({payload}, {put, call, select}) {
      const modelName = yield select(state => state.dataAnalysis.selectedFormulationTrainedResult['model_name']);
      const data = yield call(saveFormulationModelGridToDBService, {...payload, modelName});
    },
  },
  reducers: {
    resetTrainingStatus(state) {
      return {
        ...state,
        trainFlag: 'preTrain', // preTrain | training | trained
        trainingLoss: 1,
        redisTrainingTaskID: '',
        redisLoggingTaskID: '',
        selectedFormulationTrainedResult: {},
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
    updateSelectedFormulationTrainedResult(state, {payload}) {
      return {
        ...state,
        selectedFormulationTrainedResult: payload,
      }
    },
  },
};

export default uploader

