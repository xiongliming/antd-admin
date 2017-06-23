const remoteURL = 'http://localhost:5000';
const localURL = 'http://localhost:8000';
const apiPrefix = '/api/v1';
module.exports = {
  name: 'Lab5 Admin',
  prefix: 'antdAdmin',
  footerText: 'Lab5 Admin 版权所有 © 2017 由 秦子实 支持',
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
    dashboard: {
      getDashboardDataUrl: remoteURL + apiPrefix + '/dashboard'
    },
    dataOperation: {

      getFormulationListUrl: remoteURL + apiPrefix + '/dataOperation/formulations',                   // GET
      createFormulationUrl: remoteURL + apiPrefix + '/dataOperation/formulations',                    // POST, json
      getFormulationTestListUrl: (id) =>  remoteURL + apiPrefix + `/dataOperation/formulations/${id}/tests`,     // GET, json

      createTestUrl: remoteURL + apiPrefix + '/dataOperation/tests',                                  // POST, json

      getTestDataListUrl: (id) => remoteURL + apiPrefix + `/dataOperation/tests/${id}/data`,          // GET, xhr
      uploadTestDataUrl: (id) => remoteURL + apiPrefix + `/dataOperation/tests/${id}/data`,           // POST, xhr
      removeTestDataUrl: (id) => remoteURL + apiPrefix + `/dataOperation/tests/${id}/data`,           // DELETE, json

      uploadTestAttachmentUrl: (id) => remoteURL + apiPrefix + `/dataOperation/tests/${id}/attachments`,  // POST, xhr
      removeTestAttachmentUrl: (id) => remoteURL + apiPrefix + `/dataOperation/tests/${id}/attachments`,  // DELETE, xhr

      modifyFormulationUrl: (id) => remoteURL + apiPrefix + `/dataOperation/formulations/${id}`,          // PUT, json
    }
  },
};
