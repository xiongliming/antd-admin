/**
 * Created by zealot on 17/4/15.
 */
import React from 'react'
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
        <UploadForm key={ steps[currentStepNum].key } step={ steps[currentStepNum] } onChange={ handleFormChange } />
      </div>
      <div className={styles.action}>
        {
          currentStepNum < steps.length - 1
          &&
          <Button type="primary" onClick={ () => {
            dispatch({ type: 'dataOperation_uploader/next' });
            switch (currentStepNum) {
              case 0:

              case 1:
              case 2:
              case 3:
              default:
            }
            // if (currentStepNum === 0) {
            //   dispatch({ type: 'dataOperation_uploader/addNewTestInstance', payload: steps[currentStepNum]})
            // }
            // console.log(steps[currentStepNum])
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
          <Button style={{ marginLeft: 8 }} onClick={() => dispatch({ type: 'dataOperation_uploader/prev' })}>
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
