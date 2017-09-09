/**
 * Created by zealot on 23/7/20.
 */
import React, {PropTypes} from 'react'
import {
  Table,
  Badge,
  Menu,
  Dropdown,
  Input,
  InputNumber,
  Icon,
  Button,
  Popconfirm,
  Tooltip,
  Progress,
  Row,
  Col
} from 'antd';
import styles from './NestedDataTable.less'
import {api} from '../../utils/config'
import {getFormulationTrainingLogService} from '../../services/dataAnalysis'


const menu = (
  <Menu>
    <Menu.Item>
      Action 1
    </Menu.Item>
    <Menu.Item>
      Action 2
    </Menu.Item>
  </Menu>
);


function NestedTable({dataSource}) {
  const expandedRowRender = (record) => {
    console.log(record);
    if (record.e_prime_data && record.e_prime_data.length > 0) {
    }
    const ePrimeColumns = [
      {title: record.measure_type === 'temperature' ? 'Temperature (℃)' : 'Frequency (㎐)', dataIndex: 'x', width: 150,},
      {title: 'E\'', dataIndex: 'y'},
    ];
    const tanDeltaColumns = [
      {title: record.measure_type === 'temperature' ? 'Temperature (℃)' : 'Frequency (㎐)', dataIndex: 'x', width: 150,},
      {title: 'Tan Delta', dataIndex: 'y'},
    ];

    return (
      <Row type="flex" justify="space-between">
        <Col span={11}>
          <Table
            key="ePrime"
            columns={ePrimeColumns}
            dataSource={record.e_prime_data.map((item, index) => {
              return {...item, key: index}
            })}
            pagination={false}
            title={() => `E' Data Query Result Count: ${record.e_prime_data.length}`}
            scroll={{y: 240}}
            size="small"
            bordered={false}
          />
        </Col>
        <Col span={11}>
          <Table
            key="tanDelta"
            columns={tanDeltaColumns}
            dataSource={record.tan_delta_data.map((item, index) => {
              return {...item, key: index}
            })}
            pagination={false}
            title={() => `Tan Delta Data Query Result Count: ${record.tan_delta_data.length}`}
            scroll={{y: 240}}
            size="small"
            bordered={false}
          />
        </Col>
      </Row>
    );
  };

  const formulationTableColumns = [
    {title: 'Name', dataIndex: 'name'},
    {title: 'Thickness (㎜)', dataIndex: 'thickness'},
    {title: 'Temperature (℃)', dataIndex: 'temperatureRange'},
    {title: 'Frequency (㎐)', dataIndex: 'frequencyRange'},
    {title: 'Test Type', dataIndex: 'test_type'},
    {title: 'Upload Date', dataIndex: 'date'},
  ];

  const formulationTableList = [];
  if (dataSource && dataSource.length > 0) {
    for (let i = 0; i < dataSource.length; i++) {
      const formulation = dataSource[i];
      const fmQueryResults = formulation.fm_query_results;
      if (fmQueryResults.length > 0) {
        const ds = [];
        for (let i = 0; i < fmQueryResults.length; i++) {
          ds.push({
            ...fmQueryResults[i],
            key: fmQueryResults[i].id,
            frequencyRange: fmQueryResults[i].frequency_min === fmQueryResults[i].frequency_max ? fmQueryResults[i].frequency_min : `${fmQueryResults[i].frequency_min} ~ ${fmQueryResults[i].frequency_max}`,
            temperatureRange: fmQueryResults[i].temperature_min === fmQueryResults[i].temperature_max ? fmQueryResults[i].temperature_min : `${fmQueryResults[i].temperature_min} ~ ${fmQueryResults[i].temperature_max}`
          })
        }
        formulationTableList.push(
          <Table
            key={`formulationTable-${i}`}
            className={styles.componentsTableNested}
            columns={formulationTableColumns}
            expandedRowRender={record => expandedRowRender(record)}
            title={() => 'Formulation Name: ' + formulation.name}
            bordered
            dataSource={ds}
            pagination={false}
          />
        )
      }
    }
  } else {
    formulationTableList.push(
      <Table
        key={`formulationTable-${0}`}
        className={styles.componentsTableNested}
        columns={formulationTableColumns}
        // expandedRowRender={expandedRowRender}
        bordered
        title={() => 'No Data'}
        dataSource={[]}
        pagination={false}
      />
    )
  }

  return (
    <div>
      {formulationTableList}
    </div>
  );
}


export {NestedTable}
