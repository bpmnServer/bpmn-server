'use strict';


function dateDiff(dateStr) {

    if (dateStr == null)
        return '';
    var endDate = new Date();
    var startTime = new Date(dateStr);
    var time1 = endDate.getTime();
    var time2 = startTime as unknown as number;

    var seconds = Math.abs(time1- time2) / 1000;


    // get total seconds between the times
    var delta = seconds; //Math.abs(date_future - date_now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = Math.floor(delta % 60);  // in theory the modulus is not required
    if (days > 0)
        return (days + " days");
    if (hours > 0)
        return (hours + " hours");
    if (minutes > 0)
        return (minutes + " minutes");
    return (seconds + " seconds");
}

export { dateDiff }
