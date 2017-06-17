/**
 * Created by zealot on 17/4/24.
 */
import React, { PropTypes } from 'react'
import { Row, Col, Form, Input, InputNumber, Upload, message, Button, Icon, Collapse, Select, Radio } from 'antd'
import { api } from '../../utils/config'
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const Dragger = Upload.Dragger;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { Option, OptGroup } = Select;
import styles from './UploadForm.less'

// import { cloneDeep } from 'lodash'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6, offset: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6, offset: 0 },
  },
};

const rowPropertyItemLayout = {
  gutter: 16
};

const colPropertyNameItemLayout = {
  span: 3,
  offset: 7,
};

const colPropertyValueItemLayout = {
  span: 6,
  offset: 0,
};

const colPropertyDelButtonItemLayout = {
  span: 1,
};

const dynamicFormItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 6, offset: 10 },
  },
};

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
};


const formulationSelect = (formulationList) => {
  const fl = formulationList.map((formulation) => {
    return <Option key={formulation.id.toString()} value={formulation.id.toString()}>{formulation.name}</Option>
  });
  return (
    <Select
      showSearch
      placeholder="Select a Formulation"
      optionFilterProp="children"
    >
      {formulationList.map((formulation) => {
        return <Option key={formulation.id.toString()} value={formulation.id.toString()}>{formulation.name}</Option>
      })}
      <Option key="-1" value="-1" disabled>-----</Option>
      <Option key="0" value="0"><i>Create a New Formulation...</i></Option>
    </Select>
  )
};

let uuid = 0;

const UploadForm = Form.create({
  onFieldsChange(props, changedFields) {
    // console.log("onFieldsChange>>> ", props, changedFields);
    props.onChange(changedFields)
  },
  // mapPropsToFields(props) {
  //   console.log("mapPropsToFields>>> ", props);
  //   return props.step
  // },
  // onValuesChange(props, values) {
  //   console.log("onValuesChange>>> ", props, values);
  // },
})( ({ form, step, dispatch }) => {
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = form;

  // step1: uploader_configure_formulation
  const remove = (k) => {
    // can use data-binding to get
    const properties = getFieldValue('properties');
    // We need at least one passenger
    if (properties.length === 1) {
      return;
    }

    // can use data-binding to set
    setFieldsValue({
      properties: properties.filter(key => key !== k),
    });
  };

  const add = () => {
    uuid++;
    // can use data-binding to get
    const properties = getFieldValue('properties');
    const nextproperties = properties.concat(uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    setFieldsValue({
      properties: nextproperties,
    });
  };

  getFieldDecorator('properties', { initialValue: [] });
  const properties = getFieldValue('properties');
  const createFormulationFormItems = properties.map((k, index) => {
    return (
        <Row type={'flex'} key={`Row-${k}`} {...rowPropertyItemLayout}>
          <Col {...colPropertyNameItemLayout}>
            <FormItem
              required={false}
              key={`keyItem-${k}`}
            >
              {
                getFieldDecorator(`key-${k}`, {
                  validateTrigger: ['onChange', ],
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: "Please input formulation property name or delete this field. ",
                  }],
                })( <Input placeholder="Property Name" size={'large'} /> )
              }
            </FormItem>
          </Col>
          <Col {...colPropertyValueItemLayout}>
            <FormItem
              required={false}
              key={`valueItem-${k}`}
            >
              {
                getFieldDecorator(`value-${k}`, {
                  validateTrigger: ['onChange', ],
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: "Please input formulation property value or delete this field. ",
                  }],
                })( <Input placeholder="Property Value" size={'large'}/> )
              }
            </FormItem>
          </Col>
          <Col {...colPropertyDelButtonItemLayout}>
            <Icon
              className={styles.dynamicDeleteButton}
              type="minus-circle-o"
              disabled={properties.length === 1}
              onClick={() => remove(k)}
            />
          </Col>
        </Row>
    );
  });

  // step2: uploader_configure_test
  const createTestForm = (
    <Form key={step.key}>
      <FormItem {...formItemLayout} label='Selected Formulation'>
        {
          getFieldDecorator('formulation_of_test', {
            initialValue: step.selectedFormulationName,
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "The formulation you selected in first step. ",
            }],
          })( <Input size={'large'} disabled/> )
        }
      </FormItem>
      <FormItem {...formItemLayout} label='Test Name'>
        {
          getFieldDecorator('name', {
            initialValue: '',
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "Please input the name of the test. ",
            }],
          })( <Input placeholder="Test Name" size={'large'} /> )
        }
      </FormItem>
      <FormItem {...formItemLayout} label='Test Thickness'>
        {
          getFieldDecorator('thickness', {
            initialValue: 0,
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "Please input the thickness of the test. ",
            }],
          })( <InputNumber size={'large'}/> )
        }<span className="ant-form-text"> ㎜</span>
      </FormItem>
      <FormItem {...formItemLayout} label='Measured Variable'>
        {
          getFieldDecorator('measureType', {
            initialValue: 'temperature',
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "Please input the name of the test. ",
            }],
          })(
            <RadioGroup size="large">
              <RadioButton value="temperature">Temperature</RadioButton>
              <RadioButton value="frequency">Frequency</RadioButton>
            </RadioGroup>
          )
        }
      </FormItem>
      <FormItem {...formItemLayout} label='Temperature' style={ step.measureType==='temperature' ? {display: "none"}  : {display: "block"} }>
        {
          getFieldDecorator('temperatureMin', {
            initialValue: 0,
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "Please input the temperature of the test. ",
            }],
          })( <InputNumber size={'large'}/> )
        }<span className="ant-form-text"> ℃</span>
      </FormItem>
      <FormItem {...formItemLayout} label='Minimum Temperature' style={ step.measureType==='temperature' ? {display: "block"}  : {display: "none"} }>
        {
          getFieldDecorator('temperatureMin', {
            initialValue: 0,
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "Please input the minimum temperature of the test. ",
            }],
          })( <InputNumber size={'large'}/> )
        }<span className="ant-form-text"> ℃</span>
      </FormItem>
      <FormItem {...formItemLayout} label='Maximum Temperature' style={ step.measureType==='temperature' ? {display: "block"}  : {display: "none"} }>
        {
          getFieldDecorator('temperatureMax', {
            initialValue: 0,
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "Please input the maximum temperature of the test. ",
            }],
          })( <InputNumber size={'large'}/> )
        }<span className="ant-form-text"> ℃</span>
      </FormItem>
      <FormItem {...formItemLayout} label='Frequency' style={ step.measureType==='frequency' ? {display: "none"}  : {display: "block"} }>
        {
          getFieldDecorator('frequencyMin', {
            initialValue: 0,
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "Please input the frequency of the test. ",
            }],
          })( <InputNumber size={'large'}/> )
        }<span className="ant-form-text"> ㎐</span>
      </FormItem>
      <FormItem {...formItemLayout} label='Minimum Frequency' style={ step.measureType==='frequency' ? {display: "block"}  : {display: "none"} }>
        {
          getFieldDecorator('frequencyMin', {
            initialValue: 0,
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "Please input the minimum frequency of the test. ",
            }],
          })( <InputNumber size={'large'}/> )
        }<span className="ant-form-text"> ㎐</span>
      </FormItem>
      <FormItem {...formItemLayout} label='Maximum Frequency' style={ step.measureType==='frequency' ? {display: "block"}  : {display: "none"} }>
        {
          getFieldDecorator('frequencyMax', {
            initialValue: 0,
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "Please input the Maximum frequency of the test. ",
            }],
          })( <InputNumber size={'large'}/> )
        }<span className="ant-form-text"> ㎐</span>
      </FormItem>
      <FormItem {...formItemLayout} label='Test Type'>
        {
          getFieldDecorator('testType', {
            initialValue: 'structure',
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "Please select the type of the test. ",
            }],
          })(
            <Select size={'large'}>
              <Option value="structure">Structure Test</Option>
              <Option value="material">Material Test</Option>
            </Select>
          )
        }
      </FormItem>
    </Form>
  );

  // step3: uploader_upload_data
  const dataUploaderProps = {
    name: 'datafile',
    accept: '.txt',
    action: api.dataOperation_uploader.uploadTestDataUrl,
    data: { testID: step.testID },
    showUploadList: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
  // step4: uploader_upload_attachments
  const attachmentUploaderProps = {
    name: 'datafile',
    accept: '.txt,.doc',
    action: api.dataOperation_uploader.uploadTestAttachmentUrl,
    data: { testID: step.testID },
    showUploadList: true,
    multiple: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };

  const uploadDataForm = (
    <Form key={step.key}>
      <FormItem {...formItemLayout} label='Test Name'>
        {
          getFieldDecorator('testName', {
            initialValue: step.testName,
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "The test you created in second step. ",
            }],
          })( <Input size={'large'} disabled/> )
        }
      </FormItem>
      <FormItem {...formItemLayout} label='Upload Data'>
        <div className={styles.dropbox}>
          {
            getFieldDecorator('uploadData', {
              initialValue: step.fileList,
              valuePropName: 'fileList',
              getValueFromEvent: (e) => {
                let removeList = [];

                if (Array.isArray(e)) {
                  removeList = e.slice(0, -1);
                  return e.slice(-1);
                }

                let { file, fileList } = e;
                let resultList = fileList;
                if (fileList.length > 1) {
                  removeList = fileList.slice(0, -1);
                  resultList = fileList.slice(-1);
                }
                if (removeList.length > 0) {
                  console.log('replace>>> ', removeList);
                  for (let r of removeList) {
                    dispatch({
                      type: 'dataOperation_uploader/removeDataFile',
                      payload: { removedFile: r.name, testID: step.testID }
                    })
                  }
                }
                if (file.status === 'removed') {
                  console.log('remove>>> ', file.name);
                  dispatch({
                    type: 'dataOperation_uploader/removeDataFile',
                    payload: { removedFile: file.name, testID: step.testID }
                  })
                }

                return e && resultList
              },
              rules: [{
                required: true,
                message: "Upload the data file for the test",
              }],
            })(
              <Dragger {...dataUploaderProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single file upload. <br/>Please upload the data file for this test.</p>
              </Dragger>
            )
          }
        </div>
      </FormItem>
    </Form>
  );

  const uploadAttachmentForm = (
    <Form key={step.key}>
      <FormItem {...formItemLayout} label='Test Name'>
        {
          getFieldDecorator('testName', {
            initialValue: step.testName,
            validateTrigger: ['onChange', ],
            rules: [{
              required: true,
              message: "The test you created in second step. ",
            }],
          })( <Input size={'large'} disabled/> )
        }
      </FormItem>
      <FormItem {...formItemLayout} label='Upload Attachments'>
        <div className={styles.dropbox}>
          {
            getFieldDecorator('uploadAttachment', {
              initialValue: step.fileList,
              valuePropName: 'fileList',
              getValueFromEvent: (e) => {
                let removeList = [];

                if (Array.isArray(e)) {
                  return e;
                }

                let { file, fileList } = e;
                if ( file.status === 'removed' ) {
                  console.log('remove>>> ', file);
                  dispatch({
                    type: 'dataOperation_uploader/removeAttachment',
                    payload: { removedFile: file.name, testID: step.testID }
                  })
                }
                return e && fileList
              },
              rules: [{
                required: true,
                message: "Upload the attachments for the test",
              }],
            })(
              <Dragger {...attachmentUploaderProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single file upload. <br/>Please upload attachment files for this test.</p>
              </Dragger>
            )
          }
        </div>
      </FormItem>
    </Form>
  );

  switch (step.key) {
    case 'uploader_configure_formulation':
      const { formulationList, selectedFormulationID } = step;
      const selectedFormulation = formulationList.filter((formulation) => {
        return formulation.id.toString() === selectedFormulationID.toString()
      });

      return (
        <Form key={step.key}>
          <FormItem
            {...formItemLayout}
            label="Select a Formulation"
          >
            {
              getFieldDecorator('formulationSelect', {
                rules: [{
                  required: true,
                  message: 'Please select a formulation OR Create a new formulation. ',
                }],
              })( formulationSelect(formulationList) )
            }
          </FormItem>
          <div style={ step.isCreateFormulation ? { display: 'block' } : { display: 'none' } }>
            <FormItem
              {...formItemLayout}
              label='Formulation Name'
            >
              {
                getFieldDecorator('name', {
                  validateTrigger: ['onChange', ],
                  rules: [{
                    required: true,
                    whitespace: true,
                    message: 'Please input the name of the formulation. ',
                  }],
                })( <Input placeholder="Formulation Name" size={'large'} /> )
              }
            </FormItem>
            { createFormulationFormItems }
            <FormItem {...dynamicFormItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={add} style={{ width: '100%' }}>
                <Icon type="plus" /> Add field
              </Button>
            </FormItem>
          </div>
          {
            selectedFormulation.length!==0 && selectedFormulation[0].hasOwnProperty('formulation_properties') ?
              selectedFormulation[0].formulation_properties.map((fp, index) => {
                for (let key in fp) {
                  return (
                    <FormItem
                      {...formItemLayout}
                      label={key}
                      key={index}
                    >
                      {
                        getFieldDecorator(`formulation_properties-${index}`, {
                        initialValue: fp[key],
                        validateTrigger: ['onChange', ],
                        rules: [{
                          required: true,
                          whitespace: true,
                        }],
                      })(<Input disabled/>)}
                    </FormItem>
                  )
                }
              })
              :
              ''
          }
        </Form>
      );
      break;
    case 'uploader_configure_test':
      return createTestForm;
      break;
    case 'uploader_upload_data':
      return uploadDataForm;
      break;
    case 'uploader_upload_attachments':
      return uploadAttachmentForm;
      break;
    default:
      return (
        <Form key={step.key}></Form>
      );
  }

});

export default UploadForm
