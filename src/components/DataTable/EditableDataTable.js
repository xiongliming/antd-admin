/**
 * Created by zealot on 17/6/20.
 */
import React, {PropTypes} from 'react'
import {Table, Input, InputNumber, Icon, Button, Popconfirm, Tooltip, Progress, Row, Col} from 'antd';
import styles from './EditableDataTable.less'
import {api} from '../../utils/config'
import {getFormulationTrainingLogService} from '../../services/dataAnalysis'


class EditableCell extends React.Component {
  state = {
    value: this.props.value,
    editable: false,
  };
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({value});
  };
  check = () => {
    this.setState({editable: false});
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  };
  edit = () => {
    this.setState({editable: true});
  };

  componentWillReceiveProps(nextProps) {
    this.setState({value: nextProps.value});
  }

  render() {
    const {value, editable} = this.state;
    return (
      <div className={styles.editableCell}>
        {
          editable ?
            <div className={styles.editableCellInputWrapper}>
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
                size="small"
              />
              <Icon
                type="check"
                className={styles.editableCellIconCheck}
                onClick={this.check}
              />
            </div>
            :
            <div className={styles.editableCellTextWrapper}>
              {value || ' '}
              <Icon
                type="edit"
                className={styles.editableCellIcon}
                onClick={this.edit}
              />
            </div>
        }
      </div>
    );
  }
}

class FormulationEditTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: <b>Key</b>,
      dataIndex: 'keyName',
      render: (text, record, index) => {
        return (
          <EditableCell
            value={text}
            onChange={this.onCellChange(index, 'keyName')}
          />
        )
      },
    }, {
      title: <b>value</b>,
      dataIndex: 'valueName',
      render: (text, record, index) => {
        return (
          <EditableCell
            value={text}
            onChange={this.onCellChange(index, 'valueName')}
          />
        )
      },
    }, {
      title: <b>OPs.</b>,
      dataIndex: 'operation',
      render: (text, record, index) => {
        return (
          this.state.dataSource.length > 1 ?
            (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.onDelete(index)}>
                <Button shape="circle" type="danger" icon='delete' size='small'/>
              </Popconfirm>
            )
            :
            (
              <Tooltip title="At least one property" placement="right" arrowPointAtCenter>
                <Button shape="circle" type="danger" icon='delete' size='small' disabled/>
              </Tooltip>
            )
        );
      },
    }];

    this.state = {
      id: this.props.formulationID,
      dataSource: this.props.formulationProperties,
      children: this.props.childrenCount,
    };
  }

  onStateChange = () => {
    this.props.dispatch({
      type: 'dataOperation_viewer/modifyFormulation',
      payload: {id: this.state.id, properties: this.state.dataSource}
    });
  };
  onCellChange = (index, key) => {
    return (value) => {
      const dataSource = [...this.state.dataSource];
      dataSource[index][key] = value;
      this.setState({dataSource}, this.onStateChange);
    };
  };
  onDelete = (index) => {
    const dataSource = [...this.state.dataSource];
    dataSource.splice(index, 1);
    this.setState({dataSource}, this.onStateChange);
  };
  onDeleteFormulation = (index) => {
    this.props.dispatch({
      type: 'dataOperation_viewer/deleteFormulation',
      payload: {id: index}
    })
  };
  handleAdd = () => {
    const {count, dataSource} = this.state;
    const newData = {
      key: dataSource.length,
      keyName: 'key',
      valueName: 'value',
    };
    this.setState({
      dataSource: [...dataSource, newData],
    });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      id: nextProps.formulationID,
      dataSource: nextProps.formulationProperties,
      children: nextProps.childrenCount
    });
  }

  render() {
    const {dataSource} = this.state;
    const columns = this.columns;
    return (
      <div>
        <Tooltip title="Insert a new line" placement="right" arrowPointAtCenter>
          <Button shape="circle" type="primary" icon='plus' size='small' className={styles.editableAddBtn}
                  onClick={this.handleAdd}/>
        </Tooltip>
        <Table bordered dataSource={dataSource} columns={columns} pagination={false} size="small"/>
        <Popconfirm title="Sure to delete this Formulation?" placement="bottomLeft"
                    onConfirm={() => this.onDeleteFormulation(this.state.id)} arrowPointAtCenter>
          <Button shape="circle" type="danger" icon='delete' size='small' className={styles.tableDeleteBtn}
                  disabled={Boolean(this.state.children && this.state.children !== 0)}/>
        </Popconfirm>
      </div>
    );
  }
}

class FormulationFitTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: <b>Key</b>,
      dataIndex: 'keyName',
    }, {
      title: <b>value</b>,
      dataIndex: 'valueName',
    }];
    this.timer = null;
    this.state = {
      id: this.props.formulationID,
      dataSource: this.props.formulationProperties,
      redisTrainingTaskID: this.props.redisTrainingTaskID,
      redisLoggingTaskID: this.props.redisLoggingTaskID,
      trainFlag: this.props.trainFlag,
      trainingLoss: this.props.trainingLoss,
      trainingEpochs: 10,
      trainingEpoch: 0,
      intervalID: -1,
    };
  }

  onTrainFormulation = (index) => {
    this.props.dispatch({
      type: 'dataAnalysis/trainFormulationModel',
      payload: {id: index, action: 'train', epochs: this.state.trainingEpochs}
    });
  };
  onSaveTrainedModel = (index) => {
    this.props.dispatch({
      type: 'dataAnalysis/saveFormulationModelGridToDB',
      payload: {id: index, action: 'saveToDB'}
    });
    this.setState({})
  };

  componentDidMount() {
    // console.log(this.state.trainFlag);
    // console.log('didmount>>> ');
    if (this.state.trainFlag === 'training' && this.timer === null) {
      this.timer = setInterval(() => {
        // console.log('setInterval>>> ', this.timer);
        getFormulationTrainingLogService({
          id: this.state.id,
          redisLoggingTaskID: this.state.redisLoggingTaskID
        }).then((response) => {
          if (response['model_state'] && response['model_state'] === 'training') {
            // console.log('training>>> ', response, this.timer);
            this.setState({
              trainingEpoch: response['epoch'],
              trainingEpochs: response['epochs'],
              trainingLoss: response['loss'] ? response['loss'] : this.state.trainingLoss
            })
          } else if (response['model_state'] && response['model_state'] === 'trained') {
            clearInterval(this.timer);
            this.props.dispatch({
              type: 'dataAnalysis/getFormulationModel',
              payload: {
                id: this.state.id,
                action: 'getPlotData',
                redisTrainingTaskID: this.state.redisTrainingTaskID,
                trainingLoss: this.state.trainingLoss,
              }
            });
            // console.log('trained>>> ', response, this.timer);
          }
        });
      }, 1000)
    } else {
      clearInterval(this.timer);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const {dataSource} = this.state;
    const columns = this.columns;
    return (
      <div>
        <Row type="flex" justify="center" style={{margin: '0px auto 16px auto'}} gutter={16}>
          <Col style={{margin: '8px 0px 0px 0px'}}>
            <span>Training Epoch: </span>
          </Col>
          <Col>
            <InputNumber size="large" min={10} max={1000} defaultValue={10} style={{width: '85px'}}
                         disabled={this.state.trainFlag === 'training'}
                         onChange={(value) => {
                           value > 9 ? this.setState({trainingEpochs: value}) : this.setState({trainingEpochs: 10})
                         }}
            />
          </Col>
        </Row>
        <Row type="flex" justify="center" style={{margin: '0px auto 16px auto'}} gutter={16}>
          <Col>
            <Popconfirm title={<div><p>Sure to Fit this Formulation?</p><p>This operation may take some time.</p></div>}
                        placement="bottomLeft"
                        onConfirm={() => this.onSaveTrainedModel(this.state.id)} arrowPointAtCenter>
              <Button icon='save' size='large'
                      disabled={this.state.trainFlag !== 'trained'}>
                {this.state.trainFlag !== 'training' ? 'Save' : 'Saving'}
              </Button>
            </Popconfirm>
          </Col>
          <Col>
            <Popconfirm title={<div><p>Sure to Fit this Formulation?</p><p>This operation may take some time.</p></div>}
                        placement="bottomLeft"
                        onConfirm={() => this.onTrainFormulation(this.state.id)} arrowPointAtCenter>
              <Button type="primary" icon='calculator' size='large' loading={this.state.trainFlag === 'training'}>
                {this.state.trainFlag !== 'training' ? 'Train' : 'Training'}
              </Button>
            </Popconfirm>
          </Col>
        </Row>
        <Row type="flex" justify="center" style={{margin: '0px auto 16px auto'}}>
          <Col>
            <Progress type="circle"
                      percent={this.state.trainFlag === 'trained' ? 100 : this.state.trainingEpoch * 100 / this.state.trainingEpochs}
                      format={
                        (percent) => {
                          if (percent === 100 || this.state.trainFlag === 'trained') {
                            return <div>{'Finished'}</div>

                          } else {
                            return (
                              <div>
                                <div>{'Epoch:'}</div>
                                <div>{`${this.state.trainingEpoch}/${this.state.trainingEpochs}`}</div>
                              </div>
                            )
                          }
                        }
                      }
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <span>{`Loss: ${this.state.trainingLoss}`}</span>
          </Col>
        </Row>
        <Row style={{margin: '0px auto 16px auto'}}>
          <Col>
            <Progress
              percent={this.state.trainFlag === 'trained' ? 100 : this.state.trainingEpoch * 100 / this.state.trainingEpochs}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Table bordered dataSource={dataSource} columns={columns} pagination={false} size="small"/>
          </Col>
        </Row>
      </div>
    );
  }
}

class TestDisplayTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: <b>Name</b>,
      dataIndex: 'name',
      width: '55%',
    }, {
      title: <b>Value</b>,
      dataIndex: 'value',
      render: (text, record, index) => {
        if (index === 8) {
          return <div><a href={text}>data</a></div>
        } else if (index === 10) {
          const a_list = record.value.map((item, index) =>
            <p key={`attachment-key${index}`}>
              <a href={item['attachment_url']}>{item['attachment_name']}</a>
            </p>
          );
          return (
            <div>{a_list}</div>
          )
        }
        return text;
      },
    }];

    this.state = {
      dataSource: this.props.testProperties,
      formulationID: this.props.formulationID,
      testID: this.props.testID
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: nextProps.testProperties,
      formulationID: nextProps.formulationID,
      testID: nextProps.testID
    });
  }

  onDelete(formulationID, testID) {
    this.props.dispatch({
      type: 'dataOperation_viewer/deleteTest',
      payload: {formulationID: formulationID, id: testID}
    });
  }

  render() {
    const {dataSource} = this.state;
    const columns = this.columns;
    return (
      <div>
        <Table bordered dataSource={dataSource} columns={columns} pagination={false} size="small"/>
        <Popconfirm title="Sure to delete this Test?" placement="bottomLeft"
                    onConfirm={() => this.onDelete(this.state.formulationID, this.state.testID)} arrowPointAtCenter>
          <Button shape="circle" type="danger" icon='delete' size='small' className={styles.tableDeleteBtn}/>
        </Popconfirm>
      </div>
    );
  }
}


export {FormulationEditTable, TestDisplayTable, FormulationFitTable}
