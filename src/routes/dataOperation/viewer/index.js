/**
 * Created by zealot on 19/6/15.
 */
import React from 'react'
import {cloneDeep} from 'lodash'
import {Cascader, Row, Col, Card, Switch} from 'antd';
import {connect} from 'dva'
import createG2 from 'g2-react'
const moment = require('moment');
import {FormulationEditTable, TestDisplayTable} from '../../../components/DataTable/EditableDataTable'
import Plot2d from '../../../components/Plot/Plot2d'
import Plot3d from '../../../components/Plot/Plot3d'
import styles from './index.less'


const leftCol = {
  sm: {span: 24},
  md: {span: 6},
};

const rightCol = {
  sm: {span: 24},
  md: {span: 18},
};

const Viewer = ({dispatch, dataOperation_viewer}) => {
  const {formulationList} = dataOperation_viewer;
  const cascaderOnChange = (value, selectedOptions) => {
    // Formulation selected
    if (selectedOptions.length === 1) {
      dispatch({
        type: 'dataOperation_viewer/updateSelectedFormulationTest',
        payload: {
          selectedFormulationID: selectedOptions[0].id,
          selectedTestID: 0,
        }
      });
      // Test selected
    } else if (selectedOptions.length === 2) {
      dispatch({
        type: 'dataOperation_viewer/updateSelectedFormulationTest',
        payload: {
          selectedFormulationID: selectedOptions[0].id,
          selectedTestID: selectedOptions[1].id,
        }
      });
      dispatch({
        type: 'dataOperation_viewer/getTestDataList',
        payload: {
          id: selectedOptions[1].id,
        }
      });
      // Deselected
    } else {
      dispatch({
        type: 'dataOperation_viewer/updateSelectedFormulationTest',
        payload: {
          selectedFormulationID: 0,
          selectedTestID: 0,
        }
      });
    }
  };
  const cascaderDataLoader = (selectedOptions) => {
    dispatch({
      type: 'dataOperation_viewer/getTestList',
      payload: selectedOptions[0]
    })
  };

  const PropertyCard = () => {
    const {selectedTestID, selectedFormulationID} = dataOperation_viewer;
    // FormulationEditTable
    if (selectedFormulationID !== 0 && selectedTestID === 0) {
      let propertyList = [];
      let formulationID = 0;
      formulationID = dataOperation_viewer.selectedFormulationID;
      let selectedFormulation = dataOperation_viewer.formulationList.filter((item) => item.id === formulationID)[0];
      selectedFormulation.formulation_properties.map((item, index) => {
        let property = {key: index};
        for (let key in item) {
          property['keyName'] = key;
          property['valueName'] = item[key];
          propertyList.push(property)
        }
      });
      return (
        <Card bordered={false} bodyStyle={{padding: '24px 12px 24px 12px'}}>
          <FormulationEditTable dispatch={dispatch} formulationProperties={propertyList} formulationID={formulationID}/>
        </Card>
      )
    } else if (selectedFormulationID !== 0 && selectedTestID !== 0) {
      let propertyList = [];
      const formulationID = dataOperation_viewer.selectedFormulationID;
      const testID = dataOperation_viewer.selectedTestID;
      const selectedFormulation = dataOperation_viewer.formulationList.filter((item) => item.id === formulationID)[0];
      const selectedTest = selectedFormulation.children.filter((item) => item.id === selectedTestID)[0];
      propertyList.push({key: 0, name: <b>Test Name</b>, value: selectedTest.name});
      propertyList.push({key: 1, name: <b>Measured Variable</b>, value: selectedTest.measure_type});
      propertyList.push({key: 2, name: <b>Thickness</b>, value: selectedTest.thickness});
      propertyList.push({key: 3, name: <b>Max Temperature</b>, value: selectedTest.temperature_max});
      propertyList.push({key: 4, name: <b>Min Temperature</b>, value: selectedTest.temperature_min});
      propertyList.push({key: 5, name: <b>Max Frequency</b>, value: selectedTest.frequency_max});
      propertyList.push({key: 6, name: <b>Min Frequency</b>, value: selectedTest.frequency_min});
      propertyList.push({key: 7, name: <b>Test Type</b>, value: selectedTest.test_type});
      propertyList.push({key: 8, name: <b>Data File</b>, value: selectedTest.data_file_url});
      propertyList.push({key: 9, name: <b>Test Date</b>, value: moment(selectedTest.date).format('YYYY-MM-DD')});
      return (
        <Card bordered={false} bodyStyle={{padding: '24px 12px 24px 12px'}}>
          <TestDisplayTable dispatch={dispatch} testProperties={propertyList} formulationID={formulationID}
                            testID={testID}/>
        </Card>
      )
    } else {
      return (
        <span/>
      )
    }
  };

  return (
    <Row gutter={24}>
      <Col {...leftCol}>
        <Row>
          <Cascader style={{width: '100%', marginBottom: '16px'}}
                    options={formulationList}
                    loadData={cascaderDataLoader}
                    onChange={cascaderOnChange}
                    size="large" changeOnSelect
          />
        </Row>
        <Row>
          <PropertyCard/>
        </Row>
      </Col>
      <Col {...rightCol}>
        <Row gutter={16} type="flex" style={{padding: '5px 0px 5px 0px', margin: '0px 0px 16px 16px'}}>
          <Col>
            <span className="ant-form-text"> Display as</span>
          </Col>
          <Col>
            <Switch checkedChildren="Point" unCheckedChildren="Line"
                    disabled={dataOperation_viewer.selectedTestID === 0}
                    onChange={(checked) => {
                      dispatch({
                        type: 'dataOperation_viewer/updateG2PlotType',
                        payload: checked ? 'point' : 'line'
                      })
                    }}
            />
          </Col>
          <Col>
            <span className="ant-form-text" > E' data plot as</span>
          </Col>
          <Col>
            <Switch checkedChildren="Log" unCheckedChildren="Linear"
                    disabled={dataOperation_viewer.selectedTestID === 0}
                    onChange={(checked) => {
                      dispatch({
                        type: 'dataOperation_viewer/updateEPrimeDataPlotType',
                        payload: checked
                      })
                    }}
            />
          </Col>
        </Row>
        <Row>
          <Plot2d viewer={dataOperation_viewer}/>
        </Row>
        <Row>
          <Plot3d/>
        </Row>
      </Col>
    </Row>
  );
};

export default connect(
  ({dataOperation_viewer}) => ({dataOperation_viewer})
)(Viewer)
