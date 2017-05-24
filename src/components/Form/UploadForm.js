/**
 * Created by zealot on 17/4/24.
 */
import React, { PropTypes } from 'react'
import { Form, Input, Upload, message, Button, Icon } from 'antd'
import { api } from '../../utils/config'
const FormItem = Form.Item;
// import { cloneDeep } from 'lodash'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
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
  const { getFieldDecorator } = form;
  return (
    <Form action={step.action} method={step.method} >
      {
        step.formElements.map((elem, index) => {
          return (
            <FormItem {...formItemLayout}  label={elem.name} key={elem.key} >
              {
                getFieldDecorator(elem.key, {
                  initialValue: elem.value,
                  rules: [{required: true, message: elem.message}],
                })(
                    elem.type==='input' ?
                    <Input /> :
                    <div style={{ marginTop: 16, height: 180 }}>
                      <Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                      </Dragger>
                    </div>
                  )
              }
            </FormItem>
          );
        })
      }
    </Form>
  );
});

export default UploadForm
