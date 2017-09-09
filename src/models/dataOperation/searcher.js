/**
 * Created by zealot on 19/6/20.
 */
import {cloneDeep} from 'lodash'
import {browserHistory} from 'react-router'

import {
  modifyFormulationService,
  deleteFormulationService,
  getFormulationListService,
  getTestListService,
  getTestDataListService,
  getFormulationDataListService,
  deleteTestService,
  searchDataService,
} from '../../services/dataOperation'

const moment = require('moment');

const searcher = {
  namespace: 'dataOperation_searcher',
  state: {
    temperatureMin: -30,
    temperatureMax: 30,
    frequencyMin: 0,
    frequencyMax: 50,
    tanDeltaMin: 0,
    tanDeltaMax: 0.5,
    ePrimeMin: 0,
    ePrimeMax: 50,
    queryResult: [],
  },
  subscriptions: {
    setup({history, dispatch}) {
      return history.listen(({pathname}) => {
        if (pathname === '/dataOperation/searcher/') {
          dispatch({type: 'renew'});
        }
      });
    },
  },
  effects: {
    * searchData({payload}, {put, call, select}) {
      yield put({type: 'updateSearchItems', payload});
      const data = yield call(searchDataService, payload);
      yield put({type: 'updateQueryResult', payload: data});
    },
  },
  reducers: {
    renew(state) {
      return {
        temperatureMin: -30,
        temperatureMax: 30,
        frequencyMin: 0,
        frequencyMax: 50,
        tanDeltaMin: 0,
        tanDeltaMax: 0.5,
        ePrimeMin: 0,
        ePrimeMax: 50,
      }
    },
    updateSearchItems(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
    updateQueryResult(state, {payload}) {
      return {
        ...state,
        queryResult: payload.query_result
      }
    },
  },
};

export default searcher

