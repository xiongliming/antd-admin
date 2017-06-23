/* global Plotly */
/**
 * Created by zealot on 17/6/23.
 */
import React, {PropTypes} from 'react'
import createG2 from 'g2-react'
import {Card} from 'antd';
import Plotly from '../../utils/custom-plotly'

class Plot3d extends React.Component {
  componentDidMount() {
    Plotly.newPlot('plot');
  }

  render() {
    return (
      <div id="plot"></div>
    );
  }
}

export default Plot3d;
