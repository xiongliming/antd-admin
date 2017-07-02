/* global Plotly */
/**
 * Created by zealot on 17/6/23.
 */
import React, {PropTypes} from 'react'
import {Card} from 'antd';
const Plotly = require('plotly.js/dist/plotly-gl3d.min');


class Plot3d extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      plotTarget: this.props.plotTarget,
      dataSource: this.props.lines,
    };
  }

  componentDidMount() {
    const data = [];
    for (let line of this.state.dataSource) {
      let trace = {
        name: line['name'],
        type: 'scatter3d',
        mode: 'lines',
        x: this.state.plotTarget === 'Tan Delta' ? line['xt'] : line['xe'],
        y: this.state.plotTarget === 'Tan Delta' ? line['yt'] : line['ye'],
        z: this.state.plotTarget === 'Tan Delta' ? line['zt'] : line['ze'],
        line: {
          width: 2,
          color: this.state.plotTarget === 'Tan Delta' ? '#9AD681' : '#4FAAEB',
          // colorscale: "Viridis"
        },
        marker: {
          size: 2,
          color: this.state.plotTarget === 'Tan Delta' ? '#9AD681' : '#4FAAEB',
          // colorscale: "Greens",
          // cmin: -20,
          // cmax: 50
        }
      };
      data.push(trace)
    }

    const layout = {
      height: 600,
      margin: {l: 0, r: 0, b: 0, t: 0},
      scene: {
        xaxis: {
          title: "X - Temperature (℃)",
        },
        yaxis: {
          title: "Y - Frequency (㎐)",
        },
        zaxis: {
          title: this.state.plotTarget === 'Tan Delta' ? "Tan Delta" : "Z - E' (M㎩)",
        },
      },
    };
    Plotly.plot('plot3d', data, layout);
  }

  render() {
    return (
      <div id="plot3d"></div>
    );
  }
}

class Plot3dTrained extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowGrid: this.props.isShowGrid,
      dataSource: this.props.gridLines,
    };
  }

  componentDidMount() {
    const data = [];
    for (let line of this.state.dataSource.data_traces) {
      let trace = {
        type: 'scatter3d',
        mode: 'lines',
        x: line.x,
        y: line.y,
        z: line.z,
        line: {
          width: 5,
          color: '#9AD681',
        },
      };
      data.push(trace)
    }
    if (this.state.isShowGrid) {
      for (let line of this.state.dataSource.grid_traces) {
        let trace = {
          type: 'scatter3d',
          mode: 'lines',
          x: line.x,
          y: line.y,
          z: line.z,
          line: {
            width: 1,
            color: '#4FAAEB',
          },
        };
        data.push(trace)
      }
    }

    const layout = {
      height: 600,
      margin: {l: 0, r: 0, b: 0, t: 0},
      scene: {
        xaxis: {
          title: "X - Temperature (℃)",
        },
        yaxis: {
          title: "Y - Frequency (㎐)",
        },
        zaxis: {
          title: 'Tan Delta' ,
        },
      },
    };
    Plotly.plot('plot3d', data, layout);
  }

  render() {
    return (
      <div id="plot3d"></div>
    );
  }
}

export {Plot3d, Plot3dTrained};
