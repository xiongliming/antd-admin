/**
 * Created by zealot on 17/4/20.
 */
import { upload } from '../../services/dataOperation'
import { routerRedux } from 'dva/router'
import { cloneDeep } from 'lodash'
import { parse } from 'qs'
import { apiPrefix, api } from '../../utils/config'
import { addNewTestInstanceService, getFormulationListService } from '../../services/dataOperation'


const uploader = {
  namespace: 'dataOperation_uploader',
  state: {
    currentStepNum: 0,
    steps: [{
      key: 'uploader_configure_formulation',
      title: 'Configure Formulation',
      content: 'First-content',
      formulationList: [],
      selectedFormulationID: '0',
      isCreateNewFormulation: false,
      newFormulation: {},
      // { {key-1: key}, {value-1: value}, {key-2: key}, {value-2: value} }
    }, {
      key: 'uploader_configure_test',
      title: 'Add New Test',
      content: 'Second-content',
      test_name: '',
      thickness: 0,
      temperatureMin: 0,
      temperatureMax: 0,
      frequency: 0,
    }, {
      key: 'uploader_upload_data',
      title: 'Upload Data',
      content: 'Last-content',
      dataFile: '',
    }, {
      key: 'uploader_upload_attachments',
      title: 'Upload Attachments',
      content: 'Last-content',
      attachments: []
    }],
  },
  subscriptions: {
    setup({ history, dispatch }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/dataOperation/uploader/') {
          dispatch({ type: 'getFormulationList' });
        }
      });
    },
  },
  effects: {
    *addNewTestInstance ({ payload }, { put, call, select }) {
      const data = yield call(addNewTestInstanceService, payload);
      console.log(data)
    },
    *getFormulationList ({ payload }, { put, call, select }) {
      const data = yield call(getFormulationListService);
      yield put({ type: 'updateFormulations', payload: data.formulations });
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
    updateFormulations(state, { payload }) {
      let newState = cloneDeep(state);
      newState.steps[0].formulationList = payload;
      return newState
    },
    updateForm (state, { payload }) {
      let newState = cloneDeep(state);
      const currentStepNum = payload.currentStepNum;
      const changedField = payload.changedField;
      switch (currentStepNum) {
        case 0:
          if (changedField.hasOwnProperty('formulationSelect')) {
            let selectedID = changedField.formulationSelect.value;
            newState.steps[currentStepNum].selectedFormulationID = selectedID;
            newState.steps[currentStepNum].isCreateNewFormulation = selectedID === '0';
          } else if(changedField.hasOwnProperty('properties')) {
            for (let i in newState.steps[currentStepNum].newFormulation) {
              let index = Number(i.split('-', 2)[1]);
              if ( !changedField.properties.value.includes(index) ) {
                delete newState.steps[currentStepNum].newFormulation[`key-${index}`];
                delete newState.steps[currentStepNum].newFormulation[`value-${index}`]
              }
            }
            console.log("properties>>> ", newState.steps[currentStepNum].newFormulation);
          } else {
            for (let i in changedField) {
              newState.steps[currentStepNum].newFormulation[changedField[i].name] = changedField[i].value;
              console.log("key_value>>> ", newState.steps[currentStepNum].newFormulation);
              break;
            }
          }
        case 1:
        case 2:
        case 3:
        default:

      }
      // newState.steps[currentStepNum].formElements = newState.steps[currentStepNum].formElements.map((item) => {
      //   const fieldKey = Object.keys(changedField)[0];
      //   if (item.key === fieldKey) {
      //     return {...item, value: changedField[fieldKey].value}
      //   } else {
      //     return item
      //   }
      // });
      return newState
    },
  },
};

export default uploader
