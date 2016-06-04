var _ = require('lodash');

var array = [
    { passpercentage: '80', id: '2009b805-1479-4d40-966f-a002f63796e6', harness: 'regression', date: 'Fri, 03 Jun 2016 12:59:52 GMT' },
    { passpercentage: '60', id: '0d279ba9-ca72-45b5-b8fa-31973f828974', harness: 'regression', date: 'Fri, 03 Jun 2016 19:06:51 GMT' },
    { passpercentage: '60', id: '0d279ba9-ca72-45b5-b8fa-31973f828974', harness: 'regression', date: 'Fri, 04 Jun 2016 19:06:51 GMT' },
    { passpercentage: '80', id: '0d279ba9-ca72-45b5-b8fa-31973f828973', harness: 'regression', date: 'Fri, 03 Jun 2016 18:06:51 GMT' },
    { passpercentage: '55', id: '0d279ba9-ca72-45b5-b8fa-31973f828976', harness: 'regression', date: 'Fri, 07 Jun 2016 18:09:51 GMT' },
    { passpercentage: '98', id: '0d279ba9-ca72-45b5-b8fa-31973f828773', harness: 'regression', date: 'Fri, 03 Jun 2016 18:10:51 GMT' } ];

var a = _.maxBy(array, function(o){return o.date});
console.log(a);
console.log(a.date);


