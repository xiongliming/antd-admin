/**
 * Created by zealot on 17/4/20.
 */
import {cloneDeep} from 'lodash'
import {
  createTestService,
  getFormulationListService,
  createFormulationService,
  removeDataFileService,
  removeAttachmentService
} from '../../services/dataOperation'
const moment = require('moment');

const uploader = {
  namespace: 'dataOperation_uploader',
  state: {
    currentStepNum: 0,
    steps: [{
      key: 'uploader_configure_formulation',
      title: 'Configure Formulation',
      formulationList: [],
      selectedFormulationID: '0',
      isCreateFormulation: false,
      newFormulation: {
        formulationDate: moment().unix(),
      },
      // { {name: 'name'} {key-1: 'key1'}, {value-1: 'value1'}, {key-2: 'key2'}, {value-2: 'value2'} }
    }, {
      selectedFormulationName: '',
      key: 'uploader_configure_test',
      title: 'Add New Test',
      name: '',
      thickness: 0,
      measureType: 'temperature',
      temperatureMin: 0,
      temperatureMax: 0,
      frequencyMin: 0,
      frequencyMax: 0,
      testType: 'structure',
      testID: '0',
      date: moment().unix(),
    }, {
      key: 'uploader_upload_data',
      title: 'Upload Data',
      testID: '0',
      testName: '',
      fileList: [],
      removeFileList: [],
      dataDate: '',
    }, {
      key: 'uploader_upload_attachments',
      title: 'Upload Attachments',
      testID: '0',
      testName: '',
      fileList: [],
      attachmentDate: '',
    }],
  },
  subscriptions: {
    setup({history, dispatch}) {
      return history.listen(({pathname}) => {
        if (pathname === '/dataOperation/uploader/') {
          dispatch({type: 'getFormulationList'});
        }
      });
    },
  },
  effects: {
    *getFormulationList ({payload}, {put, call, select}) {
      const data = yield call(getFormulationListService);
      yield put({type: 'updateFormulations', payload: data.formulations});
    },
    *createFormulation ({payload}, {put, call, select}) {
      const data = yield call(createFormulationService, payload);
      yield put({type: 'updateFormulationAfterCreated', payload: data});
    },
    *createTest ({payload}, {put, call, select}) {
      const data = yield call(createTestService, payload);
      yield put({type: 'updateTestAfterCreated', payload: data});
    },
    *removeDataFile ({payload}, {put, call, select}) {
      const data = yield call(removeDataFileService, payload);
    },
    *removeAttachment ({payload}, {put, call, select}) {
      console.log('models>>> ', payload);
      const data = yield call(removeAttachmentService, payload);
    },
  },
  reducers: {
    renew (state) {
      return {
        currentStepNum: 0,
        steps: [{
          key: 'uploader_configure_formulation',
          title: 'Configure Formulation',
          formulationList: [],
          selectedFormulationID: '0',
          isCreateFormulation: false,
          newFormulation: {
            formulationDate: moment().unix(),
          },
          // { {name: 'name'} {key-1: 'key1'}, {value-1: 'value1'}, {key-2: 'key2'}, {value-2: 'value2'} }
        }, {
          selectedFormulationName: '',
          key: 'uploader_configure_test',
          title: 'Add New Test',
          name: '',
          thickness: 0,
          measureType: 'temperature',
          temperatureMin: 0,
          temperatureMax: 0,
          frequencyMin: 0,
          frequencyMax: 0,
          testType: 'structure',
          testID: '0',
          date: moment().unix(),
        }, {
          key: 'uploader_upload_data',
          title: 'Upload Data',
          testID: '0',
          testName: '',
          fileList: [],
          removeFileList: [],
          dataDate: '',
        }, {
          key: 'uploader_upload_attachments',
          title: 'Upload Attachments',
          testID: '0',
          testName: '',
          fileList: [],
          attachmentDate: '',
        }],
      }
    },
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
    updateFormulations(state, {payload}) {
      let newState = cloneDeep(state);
      newState.steps[0].formulationList = payload;
      return newState
    },
    updateFormulationAfterCreated(state, {payload}) {
      let newState = cloneDeep(state);
      newState.steps[0].selectedFormulationID = payload.new_formulation_id.toString();
      newState.steps[1].selectedFormulationName = payload.new_formulation_name.toString();
      return newState
    },
    updateTestAfterCreated(state, {payload}) {
      let newState = cloneDeep(state);
      newState.steps[1].testID = payload.test_id.toString();
      newState.steps[2].testID = payload.test_id.toString();
      newState.steps[2].testName = payload.test_name;
      newState.steps[3].testID = payload.test_id.toString();
      newState.steps[3].testName = payload.test_name;
      return newState
    },
    updateForm (state, {payload}) {
      let newState = cloneDeep(state);
      const currentStepNum = payload.currentStepNum;
      const changedField = payload.changedField;
      if (changedField === undefined) return;
      switch (currentStepNum) {
        case 0:
          // update selected formulation
          if (changedField.hasOwnProperty('formulationSelect')) {
            let selectedID = changedField.formulationSelect.value;
            newState.steps[0].selectedFormulationID = selectedID;
            if (selectedID !== '0') {
              newState.steps[1].selectedFormulationName = newState.steps[0].formulationList.filter((f) => {
                return f.id === Number(selectedID)
              })[0].name;
            }
            newState.steps[0].isCreateFormulation = selectedID === '0';
            // update formulation properties, delete items has already removed by user
          } else if (changedField.hasOwnProperty('properties')) {
            for (let i in newState.steps[0].newFormulation) {
              let index = Number(i.split('-', 2)[1]);
              if (!changedField.properties.value.includes(index)) {
                delete newState.steps[0].newFormulation[`key-${index}`];
                delete newState.steps[0].newFormulation[`value-${index}`]
              }
            }
            console.log("properties>>> ", newState.steps[0].newFormulation);
            // update formulation name
          } else if (changedField.hasOwnProperty('formulationName')) {
            for (let i in changedField) {
              newState.steps[0].newFormulation[changedField[i].name] = changedField[i].value;
              break;
            }
            // update formulation date
          } else if (changedField.hasOwnProperty('formulationDate')) {
            for (let i in changedField) {
              newState.steps[0].newFormulation[changedField[i].name] = moment(changedField[i].value).unix();
              break;
            }
          } else {
            for (let i in changedField) {
              newState.steps[0].newFormulation[changedField[i].name] = changedField[i].value;
              console.log("key_value>>> ", newState.steps[0].newFormulation);
              break;
            }
          }
          break;
        case 1:
          if (changedField.hasOwnProperty('name')) {
            newState.steps[1].name = changedField.name.value;
          } else if (changedField.hasOwnProperty('date')) {
            newState.steps[1].date = moment(changedField.date.value).unix();
          } else if (changedField.hasOwnProperty('measureType')) {
            newState.steps[1].measureType = changedField.measureType.value;
          } else if (changedField.hasOwnProperty('thickness')) {
            newState.steps[1].thickness = changedField.thickness.value;
          } else if (changedField.hasOwnProperty('temperatureMin')) {
            newState.steps[1].temperatureMin = changedField.temperatureMin.value;
          } else if (changedField.hasOwnProperty('temperatureMax')) {
            newState.steps[1].temperatureMax = changedField.temperatureMax.value;
          } else if (changedField.hasOwnProperty('frequencyMin')) {
            newState.steps[1].frequencyMin = changedField.frequencyMin.value;
          } else if (changedField.hasOwnProperty('frequencyMax')) {
            newState.steps[1].frequencyMax = changedField.frequencyMax.value;
          } else if (changedField.hasOwnProperty('testType')) {
            newState.steps[1].testType = changedField.testType.value;
          }
          break;
        case 2:
          newState.steps[2].fileList = changedField.uploadData.value;
          break;
        case 3:
          newState.steps[3].fileList = changedField.uploadAttachment.value;
          break;
        default:

      }
      return newState
    },
  },
};

export default uploader
