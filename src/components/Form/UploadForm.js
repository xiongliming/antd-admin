/**
 * Created by zealot on 17/4/24.
 */
import React, { PropTypes } from 'react'
import { Form, Input } from 'antd'
const FormItem = Form.Item;
import { cloneDeep } from 'lodash'

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

const UploadForm = Form.create({
  onFieldsChange(props, changedFields) {
    console.log("onFieldsChange>>> ", props, changedFields);
    props.onChange(changedFields)
  },
  mapPropsToFields(props) {
    let newProps = props;

    console.log("mapPropsToFields>>> ", props);
    return props.step
  },
  onValuesChange(props, values) {
    console.log("onValuesChange>>> ", props, values);
  },
})(({ form, step }) => {
  const { getFieldDecorator } = form;
  return (
    <Form>
      {
        step.formElements.map((elem, index) => {
          return (
            <FormItem {...formItemLayout}  label={elem.name} key={elem.name} >
              {
                getFieldDecorator(elem.name, {
                  initialValue: elem.value,
                  rules: [{required: true, message: elem.message}],
                })(<Input />)
              }
            </FormItem>
          );
        })
      }
    </Form>
  );
});

export default UploadForm
