const qs = require('qs');
const Mock = require('mockjs');
const config = require('../utils/config');
const {apiPrefix} = config;

let usersListData = Mock.mock({
  'data|100': [
    {
      'id|+1': 1,
      name: '@cname',
      nickName: '@last',
      phone: /^1[34578]\d{9}$/,
      'age|11-99': 1,
      address: '@county(true)',
      isMale: '@boolean',
      email: '@email',
      createTime: '@datetime',
      avatar () {
        return Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', this.nickName.substr(0, 1))
      },
    },
  ],
  page: {
    total: 100,
    current: 1,
  },
});

const userPermission = {
  DEFAULT: [
    'dashboard', 'chart',
  ],
  ADMIN: [
    'dashboard', 'dataOperation', 'dataOperation/uploader', 'dataOperation/viewer', 'dataOperation/searcher', 'dataAnalysis', 'users',
    // 'request',
    // 'UIElement', 'UIElement/iconfont', 'UIElement/dataTable', 'UIElement/dropOption', 'UIElement/search', 'UIElement/editor', 'UIElement/layer',
    // 'chart', 'chart/lineChart', 'chart/barChart', 'chart/areaChart',
    // 'navigation', 'navigation/navigation1', 'navigation/navigation2', 'navigation/navigation2/navigation21', 'navigation/navigation2/navigation22'
  ],
  DEVELOPER: [
    'dashboard', 'users', 'UIElement', 'UIElement/iconfont', 'chart'
  ],
};

const adminUsers = [
  {
    id: 0,
    username: 'admin',
    password: 'admin',
    permissions: userPermission.ADMIN,
  }, {
    id: 1,
    username: 'guest',
    password: 'guest',
    permissions: userPermission.DEFAULT,
  }, {
    id: 2,
    username: '吴彦祖',
    password: '123456',
    permissions: userPermission.DEVELOPER,
  },
];

module.exports = {

  [`POST ${apiPrefix}/user/login`] (req, res) {
    const {username, password} = req.body;
    const user = adminUsers.filter((item) => item.username === username);

    if (user[0] && user[0].password === password) {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      res.cookie('token', JSON.stringify({id: user[0].id, deadline: now.getTime()}), {
        maxAge: 7200000,
        httpOnly: true,
      });
      res.json({success: true})
    } else {
      res.json({success: false, loginError: '用户名或密码错误'})
    }
  },

  [`GET ${apiPrefix}/user/logout`] (req, res) {
    res.clearCookie('token');
    res.json({success: true, loginError: ''})
  },

  [`GET ${apiPrefix}/userInfo`] (req, res) {
    const cookies = qs.parse(req.headers.cookie, {delimiter: ';'});
    const response = {};
    const user = {};
    if (!cookies.token) {
      res.json({loginError: '未登录'});
      return
    }
    const token = JSON.parse(cookies.token);
    if (token) {
      response.success = token.deadline > new Date().getTime()
    }
    if (response.success) {
      const userItem = adminUsers.filter(_ => _.id === token.id);
      if (userItem.length > 0) {
        user.permissions = userItem[0].permissions;
        user.username = userItem[0].username;
        user.id = userItem[0].id
      }
    } else {
      res.json({loginError: '会话过期'});
      return
    }
    response.user = user;
    res.json(response)
  },

  [`GET ${apiPrefix}/users`] (req, res) {
    const page = req.query;
    const pageSize = page.pageSize || 10;
    const currentPage = page.page || 1;

    let data;
    let newPage;

    let newData = usersListData.data.concat();

    if (page.field) {
      const d = newData.filter((item) => {
        return item[page.field].indexOf(decodeURI(page.keyword)) > -1
      });

      data = d.slice((currentPage - 1) * pageSize, currentPage * pageSize);

      newPage = {
        current: currentPage * 1,
        total: d.length,
      }
    } else {
      data = usersListData.data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
      usersListData.page.current = currentPage * 1;
      newPage = usersListData.page
    }
    res.json({
      success: true,
      data,
      page: {
        ...newPage,
        pageSize: Number(pageSize),
      },
    })
  },

  [`POST ${apiPrefix}/users`] (req, res) {
    const newData = req.body;
    newData.createTime = Mock.mock('@now');
    newData.avatar = Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', newData.nickName.substr(0, 1));

    newData.id = usersListData.data.length + 1;
    usersListData.data.unshift(newData);

    usersListData.page.total = usersListData.data.length;
    usersListData.page.current = 1;

    res.json({success: true, data: usersListData.data, page: usersListData.page})
  },

  [`DELETE ${apiPrefix}/users`] (req, res) {
    const deleteItem = req.body;

    usersListData.data = usersListData.data.filter((item) => {
      if (item.id === deleteItem.id) {
        return false
      }
      return true
    });

    usersListData.page.total = usersListData.data.length;

    res.json({success: true, data: usersListData.data, page: usersListData.page})
  },

  [`PUT ${apiPrefix}/users`] (req, res) {
    const editItem = req.body;

    editItem.createTime = Mock.mock('@now');
    editItem.avatar = Mock.Random.image('100x100', Mock.Random.color(), '#757575', 'png', editItem.nickName.substr(0, 1));

    usersListData.data = usersListData.data.map((item) => {
      if (item.id === editItem.id) {
        return editItem
      }
      return item
    });

    res.json({success: true, data: usersListData.data, page: usersListData.page})
  },
};
