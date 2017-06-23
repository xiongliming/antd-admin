/**
 * Created by zealot on 17/6/23.
 */
import React, {PropTypes} from 'react'
import createG2 from 'g2-react'
import {Card} from 'antd';


const Plot2d = ({viewer}) => {
  const {selectedTestID, selectedFormulationID, isEPrimeLog} = viewer;
  if (selectedFormulationID !== 0 && selectedTestID !== 0) {
    const formulationID = viewer.selectedFormulationID;
    const testID = viewer.selectedTestID;
    const selectedFormulation = viewer.formulationList.filter((item) => item.id === formulationID)[0];
    const selectedTest = selectedFormulation.children.filter((item) => item.id === selectedTestID)[0];
    if (selectedTest.testData) {
      const Line = createG2(chart => {
        chart.legend({position: 'bottom', dx: 128, dy: 8});

        const view1 = chart.createView();
        view1.source(selectedTest.testData.tan_delta, {
          x: {type: 'linear', alias: selectedTest.measure_type === 'temperature' ? 'Temperature' : 'Frequency'},
          y: {type: 'linear', alias: "Tan Delta"}
        });
        view1.axis('y', {position: 'left'});

        const view2 = chart.createView();
        view2.source(selectedTest.testData.e_prime, {
          y: {type: isEPrimeLog ? 'log' : 'linear', alias: "E'"}
        });
        view2.axis('y', {position: 'right', grid: null});
        view2.axis('x', false);

        if (viewer.g2plotType === 'line') {
          view1.line().position('x*y').color('#4FAAEB');
          view2.line().position('x*y').color('#9AD681');
        } else {
          view1.point().position('x*y').color('#4FAAEB').shape('circle').size(1);
          view2.point().position('x*y').color('#9AD681').shape('circle').size(1);
        }


        chart.render();
      });
      return (
        <Card bordered={false} bodyStyle={{padding: '8px 8px 8px 8px'}}>
          <Line data={[]}
                width={400}
                height={400}
                forceFit={true}
          />
        </Card>
      )
    } else {
      return <div/>
    }
  } else {
    return <div/>
  }
};

Plot2d.propTypes = {
  viewer: PropTypes.object.isRequired,
};


export default Plot2d
