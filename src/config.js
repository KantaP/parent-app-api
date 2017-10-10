import moment from 'moment';

const crypto = require('crypto');
const PARENT_APP_KEY = 'parent_voova_' + moment().utc().format('x')
const PARENT_APP_TOKEN = crypto.createHash('md5').update(PARENT_APP_KEY).digest('hex');

module.exports = {
    // JWT_SECRET: 'keyboardgodzilla',
    PARENT_APP_TOKEN
};