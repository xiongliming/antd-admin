import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom';
import createG2 from 'g2-react';
import {Stat} from 'g2';

import {connect} from 'dva'
import {Row, Col, Card} from 'antd'
import {NumberCard} from './components'
import styles from './index.less'
import {color} from '../../utils'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
};

const colCardLayout = {
  lg: 6,
  md: 12,
};

const Line = createG2(chart => {
  chart.line().position('time*price').color('name').shape('spline').size(2);
  chart.render();
});

let data = [
  {
    "time": "9/1",
    "price": 10,
    "name": "A"
  },
  {
    "time": "9/1",
    "price": 30,
    "name": "B"
  },
  {
    "time": "9/2",
    "price": 12,
    "name": "A"
  },
  {
    "time": "9/2",
    "price": 32,
    "name": "B"
  },
  {
    "time": "9/3",
    "price": 11,
    "name": "A"
  },
  {
    "time": "9/3",
    "price": 35,
    "name": "B"
  },
  {
    "time": "9/4",
    "price": 15,
    "name": "A"
  },
  {
    "time": "9/4",
    "price": 40,
    "name": "B"
  },
  {
    "time": "9/5",
    "price": 20,
    "name": "A"
  },
  {
    "time": "9/5",
    "price": 42,
    "name": "B"
  },
  {
    "time": "9/6",
    "price": 22,
    "name": "A"
  },
  {
    "time": "9/6",
    "price": 35,
    "name": "B"
  },
  {
    "time": "9/7",
    "price": 21,
    "name": "A"
  },
  {
    "time": "9/7",
    "price": 36,
    "name": "B"
  },
  {
    "time": "9/8",
    "price": 25,
    "name": "A"
  },
  {
    "time": "9/8",
    "price": 31,
    "name": "B"
  },
  {
    "time": "9/9",
    "price": 31,
    "name": "A"
  },
  {
    "time": "9/9",
    "price": 35,
    "name": "B"
  },
  {
    "time": "9/10",
    "price": 32,
    "name": "A"
  },
  {
    "time": "9/10",
    "price": 36,
    "name": "B"
  },
  {
    "time": "9/11",
    "price": 28,
    "name": "A"
  },
  {
    "time": "9/11",
    "price": 40,
    "name": "B"
  },
  {
    "time": "9/12",
    "price": 29,
    "name": "A"
  },
  {
    "time": "9/12",
    "price": 42,
    "name": "B"
  },
  {
    "time": "9/13",
    "price": 40,
    "name": "A"
  },
  {
    "time": "9/13",
    "price": 40,
    "name": "B"
  },
  {
    "time": "9/14",
    "price": 41,
    "name": "A"
  },
  {
    "time": "9/14",
    "price": 38,
    "name": "B"
  },
  {
    "time": "9/15",
    "price": 45,
    "name": "A"
  },
  {
    "time": "9/15",
    "price": 40,
    "name": "B"
  },
  {
    "time": "9/16",
    "price": 50,
    "name": "A"
  },
  {
    "time": "9/16",
    "price": 40,
    "name": "B"
  },
  {
    "time": "9/17",
    "price": 65,
    "name": "A"
  },
  {
    "time": "9/17",
    "price": 38,
    "name": "B"
  },
  {
    "time": "9/18",
    "price": 45,
    "name": "A"
  },
  {
    "time": "9/18",
    "price": 36,
    "name": "B"
  },
  {
    "time": "9/19",
    "price": 50,
    "name": "A"
  },
  {
    "time": "9/19",
    "price": 30,
    "name": "B"
  },
  {
    "time": "9/20",
    "price": 51,
    "name": "A"
  },
  {
    "time": "9/20",
    "price": 29,
    "name": "B"
  },
  {
    "time": "9/21",
    "price": 65,
    "name": "A"
  },
  {
    "time": "9/21",
    "price": 28,
    "name": "B"
  },
  {
    "time": "9/22",
    "price": 60,
    "name": "A"
  },
  {
    "time": "9/22",
    "price": 25,
    "name": "B"
  },
  {
    "time": "9/23",
    "price": 62,
    "name": "A"
  },
  {
    "time": "9/23",
    "price": 28,
    "name": "B"
  },
  {
    "time": "9/24",
    "price": 65,
    "name": "A"
  },
  {
    "time": "9/24",
    "price": 29,
    "name": "B"
  },
  {
    "time": "9/25",
    "price": 45,
    "name": "A"
  },
  {
    "time": "9/25",
    "price": 30,
    "name": "B"
  },
  {
    "time": "9/26",
    "price": 55,
    "name": "A"
  },
  {
    "time": "9/26",
    "price": 40,
    "name": "B"
  },
  {
    "time": "9/27",
    "price": 59,
    "name": "A"
  },
  {
    "time": "9/27",
    "price": 32,
    "name": "B"
  },
  {
    "time": "9/28",
    "price": 52,
    "name": "A"
  },
  {
    "time": "9/28",
    "price": 33,
    "name": "B"
  },
  {
    "time": "9/29",
    "price": 53,
    "name": "A"
  },
  {
    "time": "9/29",
    "price": 34,
    "name": "B"
  },
  {
    "time": "9/30",
    "price": 40,
    "name": "A"
  },
  {
    "time": "9/30",
    "price": 30,
    "name": "B"
  },
  {
    "time": "9/31",
    "price": 45,
    "name": "A"
  },
  {
    "time": "9/31",
    "price": 35,
    "name": "B"
  }
];

function Dashboard({dashboard}) {
  const {formulationSummary, testSummary, dataSummary, attachmentSummary} = dashboard;
  const dashboardSummary = (
    <Row gutter={24} key="dashboard-summary">
      <Col {...colCardLayout}>
        <NumberCard {...formulationSummary} />
      </Col>
      <Col {...colCardLayout}>
        <NumberCard {...testSummary} />
      </Col>
      <Col {...colCardLayout}>
        <NumberCard {...dataSummary} />
      </Col>
      <Col {...colCardLayout}>
        <NumberCard {...attachmentSummary} />
      </Col>
    </Row>
  );

  let changeHandler = () => {
    const { chart } = myChart;
    chart.clear();
    chart.intervalStack().position(Stat.summary.proportion()).color('clarity');      // operation
    chart.render();
  };

  return (
    <div>
      {dashboardSummary}
      <Row key="dashboard-graph">
        <Col>
          <Card bordered={false} bodyStyle={{padding: '24px 36px 24px 0'}}>
            <Line
              data={data.slice(0, data.length / 2 - 1)}
              width={1024}
              height={256}
              forceFit={true}
              plotCfg={{
                  margin: [10, 100, 50, 120],
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
};

export default connect(({dashboard}) => ({dashboard}))(Dashboard)
