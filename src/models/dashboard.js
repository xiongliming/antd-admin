import { cloneDeep } from 'lodash'
import { getDashboardDataService } from '../services/dashboard'
import { color } from '../utils/theme'


export default {
  namespace: 'dashboard',
  state: {
    formulationSummary: {
      icon: 'book',
      color: color.green,
      title: 'Formulations',
      number: 0,
    },
    testSummary: {
      icon: 'solution',
      color: color.blue,
      title: 'Tests',
      number: 0,
    },
    dataSummary: {
      icon: 'dot-chart',
      color: color.purple,
      title: 'Data Points',
      number: 0,
    },
    attachmentSummary: {
      icon: 'copy',
      color: color.red,
      title: 'Attachments',
      number: 0,
    },
    formulationTimeLine: {},
    testTimeLine: {},
    dataTimeLine: {},
    attachmentTimeLine: {},
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/dashboard/' || pathname === '/') {
          dispatch({ type: 'getDashboardData' });
        }
      });
    },
  },
  effects: {
    *getDashboardData ({ payload }, { put, call, select }) {
      const data = yield call(getDashboardDataService);
      // console.log(data);
      yield put({ type: 'updateDashboardData', payload: data })
    },
  },
  reducers: {
    updateDashboardData (state, { payload }) {
      let newState = cloneDeep(state);
      newState.formulationSummary.number = payload.formulationNumber;
      newState.testSummary.number = payload.testNumber;
      newState.dataSummary.number = payload.dataNumber;
      newState.attachmentSummary.number = payload.attachmentNumber;
      return newState
    },
  },
}
