import React, { PropTypes } from 'react'
import { Icon, Switch } from 'antd'
import styles from './Layout.less'
import { config } from '../../utils'
import Menus from './Menu'

function Sider ({ user, siderFold, darkTheme, location, changeTheme, navOpenKeys, changeOpenKeys }) {
  const menusProps = {
    user,
    siderFold,
    darkTheme,
    location,
    navOpenKeys,
    changeOpenKeys,
  }
  return (
    <div>
      <div className={styles.logo}>
        <img alt={'logo'} src={config.logo} />
        {siderFold ? '' : <span>{config.name}</span>}
      </div>
      <Menus {...menusProps} />
      {!siderFold ? <div className={styles.switchtheme}>
        <span><Icon type="bulb" />Change Theme</span>
        <Switch onChange={changeTheme} defaultChecked={darkTheme} checkedChildren="Black" unCheckedChildren="White" />
      </div> : ''}
    </div>
  )
}

Sider.propTypes = {
  siderFold: PropTypes.bool,
  darkTheme: PropTypes.bool,
  location: PropTypes.object,
  changeTheme: PropTypes.func,
  navOpenKeys: PropTypes.array,
  changeOpenKeys: PropTypes.func,
}

export default Sider
