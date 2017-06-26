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

// {
//   type: 'scatter3d',
//     mode: 'lines+markers',
//   x: x,
//   y: y,
//   z: z,
//   line: {
//   width: 6,
//     color: c,
//     colorscale: "Viridis"
// },
//   marker: {
//     size: 3.5,
//       color: c,
//       colorscale: "Greens",
//       cmin: -20,
//       cmax: 50
//   }
// },

export default Plot3d;
