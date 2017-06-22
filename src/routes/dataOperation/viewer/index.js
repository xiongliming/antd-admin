/**
 * Created by zealot on 19/6/15.
 */
import React from 'react'
import {cloneDeep} from 'lodash'
import {Cascader, Row, Col, Card} from 'antd';
import {connect} from 'dva'
import FormulationEditTable from '../../../components/DataTable/EditableDataTable'
import styles from './index.less'


const Viewer = ({dispatch, dataOperation_viewer}) => {
  const {formulationList} = dataOperation_viewer;
  const cascaderOnChange = (value, selectedOptions) => {
    if (selectedOptions.length === 1) {
      dispatch({
        type: 'dataOperation_viewer/updateSelectedFormulation',
        payload: {
          selectedFormulationID: selectedOptions[0].id
        }
      });
    } else if (selectedOptions.length === 2) {
      dispatch({
        type: 'dataOperation_viewer/updateSelectedFormulationTest',
        payload: {
          selectedFormulationID: selectedOptions[0].id,
          selectedTestID: selectedOptions[1].id,
        }
      });
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
      payload: {selectedOptions}
    })
  };
  // FormulationEditTable Properties
  const PropertyCard = () => {
    const {selectedTestID, selectedFormulationID} = dataOperation_viewer;
    if (selectedFormulationID!==0 && selectedTestID===0) {
      let propertyList = [];
      let formulationID = 0;
      if (dataOperation_viewer.selectedFormulationID !== 0) {
        formulationID = dataOperation_viewer.selectedFormulationID;
        let selectedFormulation = dataOperation_viewer.formulationList.filter((item) => {
          return item.id === formulationID
        })[0];
        selectedFormulation.formulation_properties.map((item, index) => {
          let property = {key: index};
          for (let key in item) {
            property['keyName'] = key;
            property['valueName'] = item[key];
            propertyList.push(property)
          }
        });
      }
      return (
        <Card bordered={false} bodyStyle={{padding: '24px 12px 24px 12px'}}>
          <FormulationEditTable dispatch={dispatch} formulationProperties={propertyList} formulationID={formulationID}/>
        </Card>
      )
    } else if (selectedFormulationID!==0 && selectedTestID!==0) {
      return (
        <Card bordered={false} bodyStyle={{padding: '24px 12px 24px 12px'}}>
          <span>test</span>
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
      <Col span={6}>
        <Row>
          <Cascader style={{width: '100%', marginBottom: '200px'}}
                    options={formulationList}
                    loadData={cascaderDataLoader}
                    onChange={cascaderOnChange}
                    size="large" changeOnSelect/>
        </Row>
        <Row>
          <PropertyCard/>
        </Row>
      </Col>
      <Col span={18}>
      </Col>
    </Row>
  );
};

export default connect(
  ({dataOperation_viewer}) => ({dataOperation_viewer})
)(Viewer)
