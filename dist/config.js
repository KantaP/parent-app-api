'use strict';

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crypto = require('crypto');
var PARENT_APP_KEY = 'parent_voova_' + (0, _moment2.default)().utc().format('x');
var PARENT_APP_TOKEN = crypto.createHash('md5').update(PARENT_APP_KEY).digest('hex');

module.exports = {
    // JWT_SECRET: 'keyboardgodzilla',
    PARENT_APP_TOKEN: PARENT_APP_TOKEN
};
//# sourceMappingURL=config.js.map