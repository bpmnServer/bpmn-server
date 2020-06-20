const duration = require('iso8601-duration');
const parse = duration.parse;
const end = duration.end;
const toSeconds = duration.toSeconds;
console.log(parse('P1Y2M4DT20H44M12.67S'));
/* outputs =>
{
    years: 1,
    months: 2,
    days: 4,
    hours: 20,
    minutes: 44,
    seconds: 12.67
}
*/
let startDate = new Date();
console.log(startDate);
//startDate -= 100;
console.log(startDate);
console.log(toSeconds(parse('PT1H30M10.5S'),startDate));
// outputs => 5410.5

console.log(end(parse('P1D')));
// outputs => DateObj 2017-10-04T10:14:50.190Z
