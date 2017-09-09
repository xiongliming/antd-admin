import { loginService } from '../services/login'
import { routerRedux } from 'dva/router'
import { queryURL } from '../utils'

export default {
  namespace: 'login',
  state: {
    userID: -1,
    loginLoading: false,
    loginError: '',
  },

  effects: {
    *login ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' });
      const data = yield call(loginService, payload);
      yield put({ type: 'hideLoginLoading' });
      if (data.success) {
        const from = queryURL('from');
        yield put({ type: 'updateUserID', payload: data.userID });
        yield put({ type: 'loginSuccess' });
        yield put({ type: 'app/queryUser' });
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        yield put({ type: 'loginFailed', payload: data.loginError })
        // throw data
      }
    },
  },
  reducers: {
    loginSuccess (state) {
      return {
        ...state,
        loginError: '',
      }
    },
    updateUserID (state, { payload: userID }) {
      return {
        ...state,
        userID: userID,
      }
    },
    loginFailed (state, { payload: message }) {
      return {
        ...state,
        loginError: message,
      }
    },
    showLoginLoading (state) {
      return {
        ...state,
        loginLoading: true,
      }
    },
    hideLoginLoading (state) {
      return {
        ...state,
        loginLoading: false,
      }
    },
  },
}
