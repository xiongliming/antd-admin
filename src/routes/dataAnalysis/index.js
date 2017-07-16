/**
 * Created by zealot on 19/6/15.
 */
import React from 'react'
import {isEmpty} from 'lodash'
import {Select, Row, Col, Card, Switch, Icon, Spin} from 'antd';
import {connect} from 'dva'
const moment = require('moment');
import {FormulationFitTable, TestDisplayTable} from '../../components/DataTable/EditableDataTable'
import {Plot3d, Plot3dTrained} from '../../components/Plot/Plot3d'
import styles from './index.less'
const Option = Select.Option;


const leftCol = {
  sm: {span: 24},
  md: {span: 6},
};

const rightCol = {
  sm: {span: 24},
  md: {span: 18},
};

const Analyser = ({dispatch, dataAnalysis, loading}) => {
  const selectOnSelect = (value, option) => {
    dispatch({
      type: 'dataAnalysis/resetTrainingStatus',
    });
    dispatch({
      type: 'dataAnalysis/updateSelectedFormulation',
      payload: {
        selectedFormulationID: value,
      }
    });
    dispatch({
      type: 'dataAnalysis/getFormulationDataList',
      payload: {
        id: value,
      }
    });
  };

  const PropertyCard = () => {
    const {selectedFormulationID, formulationList} = dataAnalysis;
    // FormulationEditTable
    if (selectedFormulationID !== 0) {
      const propertyList = [];
      const selectedFormulation = formulationList.filter((item) => item.id === selectedFormulationID)[0];
      selectedFormulation['formulation_properties'].map((item, index) => {
        let property = {key: index};
        for (let key in item) {
          property['keyName'] = key;
          property['valueName'] = item[key];
          propertyList.push(property)
        }
      });
      return (
        <Card bordered={false} bodyStyle={{padding: '24px 12px 24px 12px'}}>
          <FormulationFitTable dispatch={dispatch}
                               formulationID={selectedFormulationID}
                               formulationProperties={propertyList}
                               trainFlag={dataAnalysis.trainFlag}
                               trainingLoss={dataAnalysis.trainingLoss}
                               redisTrainingTaskID={dataAnalysis.redisTrainingTaskID}
                               redisLoggingTaskID={dataAnalysis.redisLoggingTaskID}
          />
        </Card>
      )
      // TestDisplayTable
    } else {
      return (
        <div/>
      )
    }
  };

  const PlotConfigRow = () => {
    const {selectedFormulationID, selectedFormulationTrainedResult, plot3dPlotTarget, plot3dIsShowGrid} = dataAnalysis;
    // FormulationEditTable
    if (selectedFormulationID !== 0 && isEmpty(selectedFormulationTrainedResult)) {
      return (
        <Row gutter={16} type="flex" style={{padding: '5px 0px 5px 0px', margin: '0px 0px 16px 16px'}}>
          <Col>
            <label>Plot data: </label>
            <Switch checkedChildren="Tan Delta" unCheckedChildren="E'"
                    checked={plot3dPlotTarget === 'Tan Delta'}
                    disabled={selectedFormulationTrainedResult === {}}
                    onChange={(checked) => {
                      dispatch({
                        type: 'dataAnalysis/updatePlot3dPlotTarget',
                        payload: checked ? 'Tan Delta' : "E'"
                      })
                    }}
            />
          </Col>
        </Row>
      )
    } else if (selectedFormulationID !== 0 && !isEmpty(selectedFormulationTrainedResult)) {
      return (
        <Row gutter={16} type="flex" style={{padding: '5px 0px 5px 0px', margin: '0px 0px 16px 16px'}}>
          <Col>
            <label>Show Trained Grid: </label>
            <Switch checkedChildren={<div><Icon type="check"/>Grid</div>}
                    unCheckedChildren={<div><Icon type="cross"/>Grid</div>}
                    checked={plot3dIsShowGrid}
                    onChange={(checked) => {
                      dispatch({
                        type: 'dataAnalysis/updateIsShowPlot3dGrid',
                        payload: checked
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

  const Plot3dCard = () => {
    const {selectedFormulationID, selectedFormulationTrainedResult, plot3dPlotTarget, plot3dIsShowGrid, formulationList} = dataAnalysis;
    if (selectedFormulationID !== 0 && isEmpty(selectedFormulationTrainedResult)) {
      const currentFormulation = formulationList.filter((item) => item.id === selectedFormulationID)[0];
      if (currentFormulation['lines'] && currentFormulation['lines'].length !== 0 && isEmpty(selectedFormulationTrainedResult)) {
        return (
          <Card bordered={false} bodyStyle={{padding: '8px 8px 8px 8px'}}>
            <Plot3d lines={currentFormulation['lines']} plotTarget={plot3dPlotTarget}/>
          </Card>
        )
      }
    } else if (selectedFormulationID !== 0 && !isEmpty(selectedFormulationTrainedResult)) {
      return (
        <Card bordered={false} bodyStyle={{padding: '8px 8px 8px 8px'}}>
          <Plot3dTrained gridLines={selectedFormulationTrainedResult} isShowGrid={plot3dIsShowGrid}/>
        </Card>
      )
    }
    return <div/>
  };

  const FormulationSelect = () => {
    return (
      <Select style={{width: '100%', marginBottom: '16px'}} showSearch placeholder="Select a Formulation"
              optionFilterProp="children" onSelect={selectOnSelect} size="large"
              value={dataAnalysis.selectedFormulationID !== 0 ? dataAnalysis.selectedFormulationID.toString() : undefined}>
        {
          dataAnalysis.formulationList.map((item) => {
            return (
              <Option key={item.id.toString()} value={item.id.toString()} disabled={item.test_count === 0}>
                {item.name}
              </Option>
            )
          })
        }
      </Select>
    )
  };

  return (
    <Spin spinning={loading} tip="loading...">
      <Row gutter={24}>
        <Col {...leftCol}>
          <Row>
            <FormulationSelect/>
          </Row>
          <Row>
            <PropertyCard/>
          </Row>
        </Col>
        <Col {...rightCol}>
          <PlotConfigRow/>
          <Row>
            <Plot3dCard/>
          </Row>
        </Col>
      </Row>
    </Spin>
  );
};

const mapStateToProps = (state) => {
  return {
    dataAnalysis: state.dataAnalysis,
    loading: state.loading.models.dataAnalysis
  }
};

export default connect(
  (mapStateToProps)
)(Analyser)
