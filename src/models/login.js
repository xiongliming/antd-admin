import { login } from '../services/login'
import { routerRedux } from 'dva/router'
import { queryURL } from '../utils'

export default {
  namespace: 'login',
  state: {
    loginLoading: false,
    loginError: '',
  },

  effects: {
    *login ({
      payload,
    }, { put, call }) {
      yield put({ type: 'showLoginLoading' })
      const data = yield call(login, payload)
      yield put({ type: 'hideLoginLoading' })
      if (data.success) {
        const from = queryURL('from')
        yield put({ type: 'loginSuccess' })
        yield put({ type: 'app/queryUser' })
        if (from) {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        yield put({ type: 'loginFail', payload: data.loginError })
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
    loginFail (state, { payload: message }) {
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
