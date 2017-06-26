/**
 * Created by zealot on 17/6/23.
 */
import React, {PropTypes} from 'react'
import createG2 from 'g2-react'
import {Card} from 'antd';


const Plot2d = ({testData, measureType, plot2dType, plot2dEPrimeDataType}) => {
  const Line = createG2(chart => {
    chart.legend({position: 'bottom', dx: 180, dy: 8});

    const view1 = chart.createView();
    view1.source(testData['tan_delta'], {
      x: {type: 'linear', alias: measureType === 'temperature' ? 'X - Temperature (℃)' : 'X - Frequency (㎐)'},
      y: {type: 'linear', alias: "Y - Tan Delta"}
    });
    view1.axis('y', {position: 'left'});

    const view2 = chart.createView();
    view2.source(testData['e_prime'], {
      y: {type: plot2dEPrimeDataType, alias: "Y - E' (MPa)"}
    });
    view2.axis('y', {position: 'right', grid: null});
    view2.axis('x', false);

    if (plot2dType === 'line') {
      view1.line().position('x*y').color('#9AD681');
      view2.line().position('x*y').color('#4FAAEB');
    } else {
      view1.point().position('x*y').color('#9AD681').shape('circle').size(1);
      view2.point().position('x*y').color('#4FAAEB').shape('circle').size(1);
    }


    chart.render();
  });
  return (
    <Line data={[]}
          width={400}
          height={600}
          forceFit={true}
    />
  )
};

Plot2d.propTypes = {
  testData: PropTypes.object.isRequired,
  measureType: PropTypes.string.isRequired,
  plot2dType: PropTypes.string.isRequired,
  plot2dEPrimeDataType: PropTypes.string.isRequired,
};


export default Plot2d
