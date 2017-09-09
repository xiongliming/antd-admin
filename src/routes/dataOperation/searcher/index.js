/**
 * Created by zealot on 19/6/15.
 */
import React from 'react'
import {cloneDeep} from 'lodash'
import {Row, Col, Button, InputNumber, Form, Card} from 'antd';
import {connect} from 'dva'
import styles from './index.less'
import {NestedTable} from '../../../components/DataTable/NestedDataTable'

const FormItem = Form.Item;
const moment = require('moment');


const leftCol = {
  sm: {span: 24},
  md: {span: 6},
};

const rightCol = {
  sm: {span: 24},
  md: {span: 18},
};

const formItemLayout = {
  labelCol: {span: 16},
  wrapperCol: {span: 8},
};


const SearchForm = Form.create()(
  ({form, dispatch, initialValue}) => {
    const fieldProps = [
      {
        key: 1,
        label: 'Minimum Temperature',
        fieldName: 'temperatureMin',
        initialValue: initialValue.temperatureMin,
        message: 'Please input the minimum temperature. ',
      },
      {
        key: 2,
        label: 'Maximum Temperature',
        fieldName: 'temperatureMax',
        initialValue: initialValue.temperatureMax,
        message: 'Please input the maximum temperature. ',
      },
      {
        key: 3,
        label: 'Minimum Frequency',
        fieldName: 'frequencyMin',
        initialValue: initialValue.frequencyMin,
        message: 'Please input the minimum frequency. ',
      },
      {
        key: 4,
        label: 'Maximum Frequency',
        fieldName: 'frequencyMax',
        initialValue: initialValue.frequencyMax,
        message: 'Please input the maximum frequency. ',
      },
      {
        key: 5,
        label: 'Minimum Tan Delta',
        fieldName: 'tanDeltaMin',
        initialValue: initialValue.tanDeltaMin,
        message: 'Please input the minimum tangent delta. ',
      },
      {
        key: 6,
        label: 'Maximum Tan Delta',
        fieldName: 'tanDeltaMax',
        initialValue: initialValue.tanDeltaMax,
        message: 'Please input the maximum tangent delta. ',
      },
      {
        key: 7,
        label: 'Minimum E\'',
        fieldName: 'ePrimeMin',
        initialValue: initialValue.ePrimeMin,
        message: 'Please input the minimum E\'. ',
      },
      {
        key: 8,
        label: 'Maximum E\'',
        fieldName: 'ePrimeMax',
        initialValue: initialValue.ePrimeMax,
        message: 'Please input the maximum E\'. ',
      },
    ];
    console.log(initialValue);
    const {getFieldDecorator} = form;
    const children = [];
    const colCountOfRow = 4;
    for (let i = 0; i < fieldProps.length; i++) {
      children.push(
        <Col span={24 / colCountOfRow} key={fieldProps[i].key}>
          <FormItem {...formItemLayout} label={fieldProps[i].label}>
            {getFieldDecorator(fieldProps[i].fieldName, {
              initialValue: fieldProps[i].initialValue,
              validateTrigger: ['onChange',],
              rules: [{
                required: true,
                message: fieldProps[i].message,
              }],
            })(<InputNumber/>)}
          </FormItem>
        </Col>
      );
    }
    const handleReset = () => {
      form.resetFields();
      dispatch({
        type: 'dataOperation_searcher/updateSearchItems',
        payload: {
          temperatureMin: 0,
          temperatureMax: 0,
          frequencyMin: 0,
          frequencyMax: 0,
          tanDeltaMin: 0,
          tanDeltaMax: 0,
          ePrimeMin: 0,
          ePrimeMax: 0,
        },
      })
    };
    const handleSearch = (e) => {
      e.preventDefault();
      form.validateFields((err, values) => {
        let errorFlag = false;
        if (values.temperatureMin > values.temperatureMax) {
          errorFlag = true;
          form.setFields({
            temperatureMin: {value: 0, errors: [new Error('min must smaller than max. ')],},
            temperatureMax: {value: 0, errors: [new Error('max must bigger than min. ')],},
          });
        }
        if (values.frequencyMin > values.frequencyMax) {
          errorFlag = true;
          form.setFields({
            frequencyMin: {value: 0, errors: [new Error('min must smaller than max. ')],},
            frequencyMax: {value: 0, errors: [new Error('max must bigger than min. ')],},
          });
        }
        if (values.tanDeltaMin > values.tanDeltaMax) {
          errorFlag = true;
          form.setFields({
            tanDeltaMin: {value: 0, errors: [new Error('min must smaller than max. ')],},
            tanDeltaMax: {value: 0, errors: [new Error('max must bigger than min. ')],},
          });
        }
        if (values.ePrimeMin > values.ePrimeMax) {
          errorFlag = true;
          form.setFields({
            ePrimeMin: {value: 0, errors: [new Error('min must smaller than max. ')],},
            ePrimeMax: {value: 0, errors: [new Error('max must bigger than min. ')],},
          });
        }
        if (!errorFlag)
          dispatch({
            type: 'dataOperation_searcher/searchData',
            payload: values,
          })
      });
    };
    return (
      <div>
        <Form className={styles.content} onSubmit={handleSearch}>
          <Row type="flex" justify="start">{children}</Row>
          <Row>
            <Col span={24} style={{textAlign: 'right'}}>
              <Button type="primary" htmlType="submit">Query</Button>
              <Button style={{marginLeft: 8}} onClick={handleReset}>Clear</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
);

const Viewer = ({dispatch, dataOperation_searcher, loading}) => {
  return (
    <Col>
      <Row>
        <SearchForm dispatch={dispatch} initialValue={dataOperation_searcher}/>
      </Row>
      <Row style={{margin: '24px 0px 0px 0px'}}>
        <Card bordered={false} bodyStyle={{padding: '24px 12px 24px 12px',}}>
          <NestedTable dataSource={dataOperation_searcher.queryResult}/>
        </Card>
      </Row>
    </Col>
  )
};

const mapStateToProps = (state) => {
  return {
    dataOperation_searcher: state.dataOperation_searcher,
    loading: state.loading.models.dataOperation_searcher
  }
};

export default connect(
  (mapStateToProps)
)(Viewer)
