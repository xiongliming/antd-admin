const remoteURL = 'http://localhost:5000';
const localURL = 'http://localhost:8000';
const apiPrefix = '/api/v1';
module.exports = {
  name: 'Lab5 Admin',
  prefix: 'antdAdmin',
  footerText: 'Ant Design Admin 版权所有 © 2016 由 zuiidea 支持',
  logo: 'https://t.alipayobjects.com/images/T1QUBfXo4fXXXXXXXX.png',
  iconFontUrl: '//at.alicdn.com/t/font_c4y7asse3q1cq5mi.js',
  baseURL: localURL + apiPrefix,
  remoteURL: remoteURL,
  YQL: ['http://www.zuimeitianqi.com'],
  CORS: ['http://localhost:7001', 'http://localhost:5000'],
  openPages: ['/login'],
  apiPrefix: apiPrefix,
  api: {
    userLogin: '/user/login',
    userLogout: '/user/logout',
    userInfo: '/userInfo',
    users: '/users',
    dashboard: '/dashboard',
    dataOperation_uploader: {
      uploadTestAttachmentUrl: remoteURL + apiPrefix + '/dataOperation/tests/attachments',  // POST, xhr
      removeTestAttachmentUrl: remoteURL + apiPrefix + '/dataOperation/tests/attachments',  // DELETE, xhr
      uploadTestDataUrl: remoteURL + apiPrefix + '/dataOperation/tests/data',               // POST, xhr
      removeTestDataUrl: remoteURL + apiPrefix + '/dataOperation/tests/data',               // DELETE, json
      createTestUrl: remoteURL + apiPrefix + '/dataOperation/tests',                        // POST, json
      getFormulationListUrl: remoteURL + apiPrefix + '/dataOperation/formulations',         // GET
      createFormulationUrl: remoteURL + apiPrefix + '/dataOperation/formulations',          // POST, json
    }
  },
}
