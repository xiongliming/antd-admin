/**
 * Created by zealot on 17/4/24.
 */
import React, { PropTypes } from 'react'
import { Row, Col, Form, Input, Upload, message, Button, Icon, Collapse, Select } from 'antd'
import { api } from '../../utils/config'
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { Option, OptGroup } = Select;
import styles from './UploadForm.less'

// import { cloneDeep } from 'lodash'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};

const dynamicFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};

const dynamicFormItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 6, offset: 6 },
  },
};

const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
};

const Dragger = Upload.Dragger;
const uploadProps = {
  name: 'file',
  action: api.dataOperation_uploader.addNewTestInstance,
  showUploadList: true,
  headers: {
    authorization: 'authorization-text',
    'Access-Control-Allow-Origin': '*',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

const formulationSelect = (formulationList) => {
  const fl = formulationList.map((formulation) => {
    return <Option key={formulation.id.toString()} value={formulation.id.toString()}>{formulation.name}</Option>
  });
  return (
    <Select
      showSearch
      placeholder="Select a person"
      optionFilterProp="children"
      onChange={handleChange}
      filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
})( ({ form, step }) => {
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields } = form;

  // step: uploader_configure_formulation
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

  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  getFieldDecorator('properties', { initialValue: [] });
  const properties = getFieldValue('properties');
  const createFormItems = properties.map((k, index) => {
    return (
        <Row type={'flex'} key={`Row-${k}`}>
          <Col span={4} offset={1}>
            <FormItem
              required={false}
              key={`keyItem-${k}`}
            >
              {getFieldDecorator(`key-${k}`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: "Please input passenger's name or delete this field.",
                }],
              })(
                <Input placeholder="passenger name" size={'large'} />
              )}
            </FormItem>
          </Col>
          <Col span={6} offset={1}>
            <FormItem
              required={false}
              key={`valueItem-${k}`}
            >
              {getFieldDecorator(`value-${k}`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{
                  required: true,
                  whitespace: true,
                  message: "Please input passenger's name or delete this field.",
                }],
              })(
                <Input placeholder="passenger name" size={'large'}/>
              )}
            </FormItem>
          </Col>
          <Col span={2}>
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
            {getFieldDecorator('formulationSelect', {
              rules: [{
                required: true, message: 'Please select a formulation OR Create a new formulation',
              }],
            })( formulationSelect(formulationList) )}
          </FormItem>
          <div style={ step.isCreateNewFormulation ? { display: 'block' } : {display: 'none'} }>
            {createFormItems}
            <FormItem {...dynamicFormItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={add} style={{ width: '100%' }}>
                <Icon type="plus" /> Add field
              </Button>
            </FormItem>
          </div>
          {
            selectedFormulation.length!==0 && selectedFormulation[0].hasOwnProperty('formulation_properties') ?
              selectedFormulation[0].formulation_properties.map((fp, index) => {
                console.log(fp);
                for (let key in fp) {
                  return (
                    <FormItem
                      {...formItemLayout}
                      label={key}
                      key={index}
                    >
                      {getFieldDecorator(`formulation_properties-${index}`, { initialValue: fp[key] })(<Input readOnly/>)}
                    </FormItem>
                  )
                }
              })
              :
              ''
          }

        </Form>
      );
    case 'uploader_configure_test':
      return (
        <Form key={step.key}></Form>
      );
    case 'uploader_upload_data':
      return (
        <Form key={step.key}></Form>
      );
    case 'uploader_upload_attachments':
      return (
        <Form key={step.key}></Form>
      );
    default:
      return (
        <Form key={step.key}></Form>
      );
  }

});

export default UploadForm
