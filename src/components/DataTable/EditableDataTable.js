/**
 * Created by zealot on 17/6/20.
 */
import React, {PropTypes} from 'react'
import {Table, Input, Icon, Button, Popconfirm, Tooltip} from 'antd';
import styles from './EditableDataTable.less'

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
                <Button shape="circle" type="danger" icon='minus' size='small' className={styles.editableAddBtn} />
              </Popconfirm>
            ) : null
        );
      },
    }];

    this.state = {
      id: this.props.formulationID,
      dataSource: this.props.formulationProperties,
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
  // componentDidMount() {
  //   this.setState({id: this.props.formulationID, dataSource: this.props.formulationProperties});
  // }
  componentWillReceiveProps(nextProps) {
    this.setState({id: nextProps.formulationID, dataSource: nextProps.formulationProperties});
  }

  render() {
    const {dataSource} = this.state;
    const columns = this.columns;
    return (
      <div>
        <Tooltip title="Insert a new line" placement="topLeft" arrowPointAtCenter>
          <Button shape="circle" type="primary" icon='plus' size='small' className={styles.editableAddBtn} onClick={this.handleAdd}/>
        </Tooltip>
        <Table bordered dataSource={dataSource} columns={columns} pagination={false} size="small"/>
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
    }];

    this.state = {
      formulationID: this.props.formulationID,
      dataSource: this.props.testProperties,
    };
  }
  // componentDidMount() {
  //   this.setState({formulationID: this.props.formulationID, dataSource: this.props.testProperties});
  // }
  componentWillReceiveProps(nextProps) {
    this.setState({formulationID: nextProps.formulationID, dataSource: nextProps.testProperties});
  }

  render() {
    const {dataSource} = this.state;
    const columns = this.columns;
    return (
      <div>
        <Table bordered dataSource={dataSource} columns={columns} pagination={false} size="small"/>
      </div>
    );
  }
}


export {FormulationEditTable, TestDisplayTable}
