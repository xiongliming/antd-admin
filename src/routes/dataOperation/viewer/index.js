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
      dispatch({
        type: 'dataOperation_viewer/getFormulationDataList',
        payload: {
          id: selectedOptions[0].id,
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
        type: 'dataOperation_viewer/getFormulationTestDataList',
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
      type: 'dataOperation_viewer/getFormulationTestList',
      payload: {id: selectedOptions[0].id}
    })
  };

  const PropertyCard = () => {
    const {selectedTestID, selectedFormulationID, formulationList} = dataOperation_viewer;
    // FormulationEditTable
    if (selectedFormulationID !== 0 && selectedTestID === 0) {
      const propertyList = [];
      const selectedFormulation = formulationList.filter((item) => item.id === selectedFormulationID)[0];
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
          <FormulationEditTable dispatch={dispatch}
                                formulationProperties={propertyList}
                                formulationID={selectedFormulationID}
          />
        </Card>
      )
      // TestDisplayTable
    } else if (selectedFormulationID !== 0 && selectedTestID !== 0) {
      let propertyList = [];
      const selectedFormulation = formulationList.filter((item) => item.id === selectedFormulationID)[0];
      const selectedTest = selectedFormulation.children.filter((item) => item.id === selectedTestID)[0];
      propertyList.push({key: 0, name: <b>Test Name</b>, value: selectedTest.name});
      propertyList.push({key: 1, name: <b>Measured Variable</b>, value: selectedTest.measureType});
      propertyList.push({key: 2, name: <b>Thickness</b>, value: selectedTest.thickness});
      propertyList.push({key: 3, name: <b>Max Temperature</b>, value: selectedTest.temperatureMax});
      propertyList.push({key: 4, name: <b>Min Temperature</b>, value: selectedTest.temperatureMin});
      propertyList.push({key: 5, name: <b>Max Frequency</b>, value: selectedTest.frequencyMax});
      propertyList.push({key: 6, name: <b>Min Frequency</b>, value: selectedTest.frequencyMin});
      propertyList.push({key: 7, name: <b>Test Type</b>, value: selectedTest.testType});
      propertyList.push({key: 8, name: <b>Data File</b>, value: selectedTest.dataFileUrl});
      propertyList.push({key: 9, name: <b>Test Date</b>, value: moment(selectedTest.date).format('YYYY-MM-DD')});
      propertyList.push({key: 10, name: <b>Attachments</b>, value: selectedTest.attachmentUrlList});
      return (
        <Card bordered={false} bodyStyle={{padding: '24px 12px 24px 12px'}}>
          <TestDisplayTable dispatch={dispatch}
                            testProperties={propertyList}
                            testID={selectedTestID}
                            formulationID={selectedFormulationID}/>
        </Card>
      )
    } else {
      return (
        <div/>
      )
    }
  };

  const PlotConfigRow = () => {
    const {selectedTestID, selectedFormulationID} = dataOperation_viewer;
    // FormulationEditTable
    if (selectedFormulationID !== 0 && selectedTestID === 0) {
      return (
        <Row gutter={16} type="flex" style={{padding: '5px 0px 5px 0px', margin: '0px 0px 16px 16px'}}>
          <Col>
            <label>Plot data: </label>
            <Switch checkedChildren="Tan Delta" unCheckedChildren="E'"
                    checked={dataOperation_viewer.plot3dPlotTarget === 'Tan Delta'}
                    disabled={dataOperation_viewer.selectedTestID !== 0}
                    onChange={(checked) => {
                      dispatch({
                        type: 'dataOperation_viewer/updatePlot3dPlotTarget',
                        payload: checked ? 'Tan Delta' : "E'"
                      })
                    }}
            />
          </Col>
        </Row>
      )
    } else if (selectedFormulationID !== 0 && selectedTestID !== 0) {
      return (
        <Row gutter={16} type="flex" style={{padding: '5px 0px 5px 0px', margin: '0px 0px 16px 16px'}}>
          <Col>
            <label>Display as: </label>
            <Switch checkedChildren="Line" unCheckedChildren="Point"
                    checked={dataOperation_viewer.plot2dType === 'line'}
                    onChange={(checked) => {
                      dispatch({
                        type: 'dataOperation_viewer/updatePlot2dType',
                        payload: checked ? 'line' : 'point'
                      })
                    }}
            />
          </Col>
          <Col>
            <label>E' data plot as: </label>
            <Switch checkedChildren="Linear" unCheckedChildren="Log"
                    checked={dataOperation_viewer.plot2dEPrimeDataType === 'linear'}
                    onChange={(checked) => {
                      dispatch({
                        type: 'dataOperation_viewer/updatePlot2dEPrimeDataType',
                        payload: checked ? 'linear' : 'log'
                      })
                    }}
            />
          </Col>
        </Row>
      )
    } else {
      return (
        <div/>
      )
    }
  };

  const Plot2dCard = () => {
    const {selectedTestID, selectedFormulationID, formulationList, plot2dType, plot2dEPrimeDataType} = dataOperation_viewer;
    if (selectedFormulationID !== 0 && selectedTestID !== 0) {
      const selectedFormulation = formulationList.filter((item) => item.id === selectedFormulationID)[0];
      const selectedTest = selectedFormulation.children.filter((item) => item.id === selectedTestID)[0];
      if (selectedTest['data'].length !== 0) {
        return (
          <Card bordered={false} bodyStyle={{padding: '8px 8px 8px 8px'}}>
            <Plot2d testData={selectedTest['data']}
                    measureType={selectedTest['measureType']}
                    plot2dType={plot2dType}
                    plot2dEPrimeDataType={plot2dEPrimeDataType}
            />
          </Card>
        )
      }
    }
    return <div/>
  };

  const Plot3dCard = () => {
    const {selectedFormulationID, selectedTestID, formulationList} = dataOperation_viewer;
    if (selectedFormulationID !== 0 && selectedTestID === 0) {
      const currentFormulation = formulationList.filter((item) => item.id === selectedFormulationID)[0];
      if (currentFormulation['lines'].length !== 0) {
        return (
          <Card bordered={false} bodyStyle={{padding: '8px 8px 8px 8px'}}>
            <Plot3d lines={currentFormulation['lines']}
                    plotTarget={dataOperation_viewer.plot3dPlotTarget}
            />
          </Card>
        )
      }
    }
    return <div/>
  };

  return (
    <Row gutter={24}>
      <Col {...leftCol}>
        <Row>
          <Cascader style={{width: '100%', marginBottom: '16px'}}
                    options={dataOperation_viewer.formulationList}
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
        <PlotConfigRow/>
        <Row>
          <Plot2dCard/>
          <Plot3dCard/>
        </Row>
      </Col>
    </Row>
  );
};

export default connect(
  ({dataOperation_viewer}) => ({dataOperation_viewer})
)(Viewer)
