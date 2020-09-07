const helpers = {

    timestamp: _ => { 
        let newDate = new Date()
        
        let month = newDate.getMonth() + 1;
        let dateToday = newDate.getDate();
        let year = newDate.getFullYear();
        let hour = newDate.getHours();
        let mins = newDate.getMinutes();
        let sec = newDate.getSeconds();

        return (month < 10 ? (year + '-' + '0' + month) : year + '-' + month) + "-" + (dateToday < 10 ? ('0' + dateToday) : dateToday) + " " + (hour < 10 ? ('0' + hour) : hour) + ":" + (mins < 10 ? ('0' + mins) : mins) + ":" + (sec < 10 ? ('0' + sec) : sec)
    }

}

export default helpers