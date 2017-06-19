import React, { PropTypes } from 'react'
import { connect } from 'dva'
import { Row, Col, Card } from 'antd'
import { NumberCard, Quote, Sales, Weather, RecentSales, Comments, Completed, Browser, Cpu, User } from './components'
import styles from './index.less'
import { color } from '../../utils'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
};

function Dashboard ({ dashboard }) {
  const { formulationSummary, testSummary, dataSummary, attachmentSummary } = dashboard;

  return (
    <Row gutter={24} key="dashboard-key">
      <Col lg={6} md={12}>
        <NumberCard {...formulationSummary} />
      </Col>
      <Col lg={6} md={12}>
        <NumberCard {...testSummary} />
      </Col>
      <Col lg={6} md={12}>
        <NumberCard {...dataSummary} />
      </Col>
      <Col lg={6} md={12}>
        <NumberCard {...attachmentSummary} />
      </Col>
    </Row>
  )
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
};

export default connect(({ dashboard }) => ({ dashboard }))(Dashboard)
