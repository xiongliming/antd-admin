/**
 * Created by zealot on 17/4/20.
 */
import { upload } from '../services/dataOperation'
import { routerRedux } from 'dva/router'
import { cloneDeep } from 'lodash'


const uploader = {
  namespace: 'dataOperation_uploader',
  state: {
    currentStepNum: 0,
    steps: [{
      key: 'upload_form_1',
      title: 'First',
      content: 'First-content',
      formElements:[
        { name: 'p11', value: '', type: 'input', message:'!!!' },
        { name: 'p12', value: '', type: 'input' },
        { name: 'p13', value: '', type: 'input' },
        { name: 'p14', value: '', type: 'input' },
        { name: 'p15', value: '', type: 'input' },
        { name: 'p16', value: '', type: 'input' },
      ],
    }, {
      key: 'upload_form_2',
      title: 'Second',
      content: 'Second-content',
      formElements: [
        { name: 'p21', value: '', type: 'upload' },
      ],
    }, {
      key: 'upload_form_3',
      title: 'Last',
      content: 'Last-content',
      formElements: [
        { name: 'p31', value: '', type: 'uploader' },
      ],
    }],
  },
  effects: {},
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
        const fieldName = Object.keys(changedField)[0];
        if (item.name === fieldName) {
          return {...item, value: changedField[fieldName].value}
        } else {
          return item
        }
      });
      console.log("reducers.updateForm>>> ", newState, changedField);
      return newState
    },
  },
};

export default uploader
