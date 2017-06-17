/**
 * Created by zealot on 17/4/15.
 */
import React from 'react'
import { cloneDeep } from 'lodash'
import { Steps, Button, message, Form, Tabs } from 'antd';
const Step = Steps.Step;
import { connect } from 'dva'
import UploadForm from '../../../components/Form/UploadForm'
import styles from './index.less'
const TabPane = Tabs.TabPane;


const Uploader = ({ dispatch, dataOperation_uploader }) => {
  const { currentStepNum, steps } = dataOperation_uploader;
  const handleFormChange = (changedField) => {
    dispatch({
      type: 'dataOperation_uploader/updateForm',
      payload: { currentStepNum, changedField }
    })
  };
  // update current formulation list from db.Formulation
  return (
    <div>
      <Steps current={currentStepNum}>
        { steps.map(item => <Step key={item.title} title={item.title} />) }
      </Steps>
      <div className={styles.content}>
        <UploadForm key={ steps[currentStepNum].key } step={ steps[currentStepNum] } onChange={ handleFormChange } dispatch={dispatch}/>
      </div>
      <div className={styles.action}>
        {
          currentStepNum < steps.length - 1
          &&
          <Button type="primary" onClick={ () => {
            switch (currentStepNum) {
              case 0:
                if ( steps[0].isCreateFormulation ) {
                  dispatch({
                    type: 'dataOperation_uploader/createFormulation',
                    payload: steps[0].newFormulation
                  });
                }
                break;
              case 1:
                dispatch({
                  type: 'dataOperation_uploader/createTest',
                  payload: {
                    ...steps[1],
                    selectedFormulationID: steps[0].selectedFormulationID
                  }
                });
                break;
              case 2:
                break;
              case 3:
                break;
              default:
            }
            dispatch({ type: 'dataOperation_uploader/next' });
          } }>Next</Button>
        }
        {
          currentStepNum === steps.length - 1
          &&
          <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
        }
        {
          currentStepNum > 0
          &&
          <Button style={{ marginLeft: 8 }} onClick={() => {
            dispatch({ type: 'dataOperation_uploader/prev' });
            switch (currentStepNum) {
              case 0:

              case 1:
                dispatch({ type: 'dataOperation_uploader/getFormulationList' });
              case 2:
              case 3:
              default:
            }
          }}>
            Previous
          </Button>
        }
      </div>
    </div>
  );
};

export default connect(
  ({ dataOperation_uploader }) => ({ dataOperation_uploader })
)(Uploader)
