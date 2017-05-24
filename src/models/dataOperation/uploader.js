/**
 * Created by zealot on 17/4/20.
 */
import { upload } from '../../services/dataOperation'
import { routerRedux } from 'dva/router'
import { cloneDeep } from 'lodash'
import { parse } from 'qs'
import { apiPrefix, api } from '../../utils/config'
import { addNewTestInstance } from '../../services/dataOperation'


const uploader = {
  namespace: 'dataOperation_uploader',
  state: {
    currentStepNum: 0,
    steps: [{
      key: 'upload_form_1',
      title: 'First',
      content: 'First-content',
      formElements:[
        { key:'input_1', name: 'p11', value: '', type: 'input', message:'!!!' },
        { key:'input_2', name: 'p12', value: '', type: 'input' },
        { key:'input_3', name: 'p13', value: '', type: 'input' },
        { key:'input_4', name: 'p14', value: '', type: 'input' },
        { key:'input_5', name: 'p15', value: '', type: 'input' },
        { key:'input_6', name: 'p16', value: '', type: 'input' },
      ],
    }, {
      key: 'upload_form_2',
      title: 'Second',
      content: 'Second-content',
      formElements: [
        { key: 'upload_datafiles', name: 'p21', value: '', type: 'upload' },
      ],
    }, {
      key: 'upload_form_3',
      title: 'Last',
      content: 'Last-content',
      formElements: [
        { key:'upload_attachments', name: 'p31', value: '', type: 'upload' },
      ],
    }],
  },
  effects: {
    *addNewTestInstance ({ payload }, { put, call, select }) {
      const data = yield call(addNewTestInstance, payload);
      console.log(data)
    },
  },
  reducers: {
    next (state) {
      return {
        ...state,
        currentStepNum: state.currentStepNum + 1,
      }
    },
    prev (state) {
      return {
        ...state,
        currentStepNum: state.currentStepNum - 1,
      }
    },
    updateForm (state, { payload }) {
      let newState = cloneDeep(state);
      let currentStepNum = payload.currentStepNum;
      let changedField = payload.changedField;
      newState.steps[currentStepNum].formElements = newState.steps[currentStepNum].formElements.map((item) => {
        const fieldKey = Object.keys(changedField)[0];
        if (item.key === fieldKey) {
          return {...item, value: changedField[fieldKey].value}
        } else {
          return item
        }
      });
      // console.log("reducers.updateForm>>> ", newState, changedField);
      return newState
    },
  },
};

export default uploader
