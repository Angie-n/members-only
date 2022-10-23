const convertDate = date => {
    const dateObj = new Date(date);
    
    const hours = dateObj.getHours();
    let hourString = hours % 12;
    if(hourString === 0) hourString = 12;

    const minutes = dateObj.getMinutes();
    let minuteString = "";
    if(minutes < 10) minuteString += "0";
    minuteString += minutes;

    let hmString = hourString + ":" + minuteString;
    if(hours < 12) hmString += "AM";
    else hmString += "PM";

    const mdyString = dateObj.getMonth() + 1 + "/" + dateObj.getDate() + "/" + String(dateObj.getFullYear()).substring(2);

    return hmString + " " + mdyString;
}

[...document.getElementsByClassName("message-date")].forEach(date => {
    if(date.textContent !== 'Unknown Date') date.textContent = convertDate(date.textContent);
});