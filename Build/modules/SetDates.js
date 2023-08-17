var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
setCopticDates();
/**
 * a function that runs at the beginning and sets some global dates like the coptic date (as a string), today's Gregorian date (as a Date), the day of the week (as a number), the Season (a string), etc.
 * @param {Date} today  - a Gregorian date provided by the user or set automatically to the date of today if missing
 */
function setCopticDates(today) {
    return __awaiter(this, void 0, void 0, function* () {
        today ? (todayDate = today) : (todayDate = new Date());
        weekDay = todayDate.getDay();
        copticDate = convertGregorianDateToCopticDate(todayDate);
        Season = copticDate; //this will be its default value unless it is changed by another function;
        copticMonth = copticDate.slice(2, 4);
        copticReadingsDate = setSeasonAndCopticReadingsDate(copticDate);
        copticDay = copticDate.slice(0, 2);
        isFast = (() => {
            if (copticFasts.indexOf(Season) > -1 || (Season != Seasons.PentecostalDays && weekDay == (3 || 5))) {
                //i.e. if we are in a fasting day 
                return true;
            }
            else {
                return false;
            }
            ;
        })();
        showDates();
    });
}
;
/**
 * Converts the Gregorian date to a string expressing the coptic date (e.g.: "0207")
 * @param {Date} date  - a date value expressing any Gregorian calendar date
 * @returns {string} - a string expressing the coptic date
 */
function convertGregorianDateToCopticDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; //we add one because the months count starts at 0
    let coptMonth, coptDay, dm;
    if (month == 1) {
        day < 9 ? (dm = [22, 4]) : (dm = [-8, 5]);
    }
    else if (month == 2) {
        day < 7 ? (dm = [23, 5]) : (dm = [-7, 6]);
    }
    else if (month == 3) {
        day < 10 ? (dm = [21, 6]) : (dm = [-9, 7]);
        //console.log("march ", day + dm[0]);
    }
    else if (month == 4) {
        day < 9 ? (dm = [23, 7]) : (dm = [-8, 8]);
    }
    else if (month == 5) {
        day < 9 ? (dm = [23, 8]) : (dm = [-8, 9]);
    }
    else if (month == 6) {
        day < 8 ? (dm = [23, 9]) : (dm = [-7, 10]);
    }
    else if (month == 7) {
        day < 8 ? (dm = [23, 10]) : (dm = [-7, 11]);
    }
    else if (month == 8) {
        day < 7 ? (dm = [5, 11]) : (dm = [-6, 12]);
    }
    else if (month == 9) {
        if (day < 6) {
            dm = [25, 12];
        }
        else if ((day > 5 && day < 11) ||
            (day == 11 && date.getFullYear() % 4 == 3)) {
            //the 13th coptic month gets an additional 6th day every 4 years. It falls 1 year before the leap year of the Gregorian calendar. When we divide by 4, the remainder is 3
            dm = [-5, 13];
        }
        else {
            dm = [-10, 1];
        }
    }
    else if (month == 10) {
        day < 11 ? (dm = [20, 1]) : (dm = [-10, 2]);
    }
    else if (month == 11) {
        day < 11 ? (dm = [21, 2]) : (dm = [-9, 3]);
    }
    else if (month == 12) {
        day < 10 ? (dm = [21, 3]) : (dm = [-9, 4]);
    }
    setCopticDayAndMonth(dm);
    function setCopticDayAndMonth(daysMonth) {
        coptDay = day + daysMonth[0];
        coptMonth = daysMonth[1];
    }
    if (coptDay > 30) {
        console.log("copt day > 30", coptDay, coptMonth);
        coptDay = 1;
        coptMonth = coptMonth + 1;
    }
    if (date.getFullYear() % 4 == 0) {
        console.log("we are in a leap year");
        // we first check that we are in a leap year. Then we check that the day is after Feb 28th. If this is the case, we add 1 to the coptDay
        console.log("original coptic day and mont are ", coptDay, coptMonth);
        date > new Date(date.getFullYear().toString() + "-02-28") &&
            month == 2
            ? (coptDay = coptDay - 1)
            : coptDay;
        if (coptDay == 0) {
            coptDay = 30;
            coptMonth = coptMonth - 1;
        }
    }
    ;
    function getTwoDigitsStringFromNumber(n) {
        if (n < 10) {
            return "0" + n.toString();
        }
        else {
            return n.toString();
        }
    }
    ;
    return (getTwoDigitsStringFromNumber(coptDay) +
        getTwoDigitsStringFromNumber(coptMonth));
}
;
/**
 * Sets the coptic readings date according to the Katamaras
 * @param {string} coptDate  - a string expressing the coptic day and month (e.g.: "0306")
 * @returns {string} - a string expressing the coptic reading date (e.g.: "0512", "GreatLent20", "JonahFeast2", etc.)
 */
function setSeasonAndCopticReadingsDate(coptDate, today = todayDate) {
    let greatLentOrPentecostal = checkIfInASpecificSeason(today);
    if (greatLentOrPentecostal != Seasons.NoSeason) {
        // it means we are either during the Great Lent period, or the Pentecostal 50 days, or any day/feast within these periods
        return greatLentOrPentecostal;
    }
    else if (today.getDay() == 0) {
        // it means we are on an ordinary  Sunday (any sunday other than Great lent and Pentecostal period Sundays)
        // console.log('We are on a sunday')
        let sunday = checkWhichSundayWeAre(Number(coptDate.slice(0, 2)));
        //the readings for the 5th sunday of any coptic month (other than the 5th sunday of the Great Lent or the Pentecostal Days) are the same. We will then retrieve the readings of the 5th sunday of the first coptic month (Tout)
        sunday == "5thSunday"
            ? (sunday = "01" + sunday)
            : (sunday = copticMonth + sunday);
        return sunday;
    }
    else {
        // it means we are in an ordinary day and we follow the ordinary readings calender, this should return a coptic date in a string of "DDMM"
        for (let i = 0; i < copticReadingsDates.length; i++) {
            if (coptDate == copticReadingsDates[i][0]) {
                return copticReadingsDates[i][1];
            }
        }
        return coptDate;
    }
}
;
/**
 * Checks which Sunday we are in the coptic month (i.e. is it the 1st Sunday? 2nd Sunday, etc.)
 * @param {number} day  - the day of the coptic month or the number of days since the beginning of a season like the Great Lent or the Pentecostal days
 * The function returns a string like "1stSunday", "2nd Sunday", etc.
 */
function checkWhichSundayWeAre(day) {
    let n = Math.ceil(day / 7);
    let sunday = n.toString();
    if (n == 1 || (n > 20 && n % 10 == 1)) {
        sunday = sunday + "stSunday";
    }
    else if (n == 2 || (n > 20 && n % 10 == 2)) {
        sunday = sunday + "ndSunday";
    }
    else if (n == 3 || (n > 20 && n % 10 == 3)) {
        sunday = sunday + "rdSunday";
    }
    else {
        sunday = sunday + "thSunday";
    }
    return sunday;
}
;
/**
 * It takes the date of today and checks whether according the Resurrection date this year, we are during an unfixed season like Great Lent, Pentecostal days or Apostles feast, etc.
 * @param {Date} today  - is the date of today according to the Gregorian calendar (it can be any day of the year if the user had manually set it)
 * @returns {string} - a string expressing the readings date . It will be added to the id of the reading in order to retrieve the coptic readings of the day
 */
function checkIfInASpecificSeason(today) {
    let readingsDate, resurrection;
    ResurrectionDates.map((d) => {
        //we convert each string in the ResurrectionDates array into a date
        resurrection = new Date(d);
        if (today.getFullYear() == resurrection.getFullYear()) {
            //if the year of any  resurrection date in the array = current calendar year, then we take this resurrection date and process it to get the floating/changing events dates
            let todayUTC = new Date(today).setUTCHours(0, 0, 0, 0); //we are creating a new date variable where the date = today's date, and the hour is UTC 0 hour. We are doing this in order to avoid getting a fraction when substracting the dates values in checkForUnfixedEvent function
            resurrection.setUTCHours(0, 0, 0, 0); //we are setting the resurrection variable at UTC 0 hour
            readingsDate = checkForUnfixedEvent(todayUTC, //this is a number reflecting the date of today at UTC 0 hour
            resurrection.getTime(), //we get a number reflecting the date value at UTC 0 hour
            today.getDay() //we get the day of the week as a number starting from 0
            );
        }
        //return readingsDate;
    });
    return readingsDate;
}
;
/**
 * Checks whether we are during the Great Lent Period, the Pentecoste days or any season
 * @param {number} today  - is a number of milliseconds equal to the date of today at UTC 0 hours
 *
 * @param {number} resDate  - is a number of milliseconds equal to date of Resurrection in current year at UTC 0 hours
 * @param {number} weekDay - is a number expressing which day of the week we are (e.g.: Sunday = 0)
 * @returns {string} - which is equal to the season: e.g.: "Resurrection", "GreatLent30", "Pentecoste20", etc.
 */
function checkForUnfixedEvent(today, resDate, weekDay) {
    let difference = (resDate - today) / calendarDay; // we get the difference between the 2 dates in days (we are dividing the difference in milliseconds by the number of milliseconds in a day, which is a constant declared as calendarDay)
    if (difference == 0 || (difference == 1 && todayDate.getHours() > 15)) {
        //If we are Saturday (which means that difference = 1) and we are after 3 PM, we will retrieve the readings of the Resurrection because we use to celebrate the Resurrection Mass on Saturday evening not on Sunday itself
        Season = Seasons.Resurrection; //we set teh Season value
        return Seasons.Resurrection; //we get the reading of Resurrection although we are still Saturday
    }
    else if (difference >= 1 && difference < 58) {
        //We are during the Great Lent period which counts 56 days from the Saturday preceding the 1st Sunday (which is the begining of the so called "preparation week") until the Resurrection day
        Season = Seasons.GreatLent;
        return isItSundayOrWeekDay(Seasons.GreatLent, 58 - difference, weekDay);
    }
    else if (difference > 65 && difference < 70) {
        //We are in the Jonah Feast days (3 days + 1)
        //The Jonah feast starts 15 days before the begining of the Great Lent
        //I didn't find the readings for this period in the Power Point presentations
        Season = Seasons.JonahFast;
        return isItSundayOrWeekDay(Seasons.JonahFast, Math.abs(70 - difference), weekDay);
    }
    else if (difference < 0 && Math.abs(difference) < 50) {
        difference;
        // we are during the 50 Pentecostal days
        Season = Seasons.PentecostalDays;
        return isItSundayOrWeekDay(Seasons.PentecostalDays, Math.abs(difference), weekDay);
    }
    else if (difference < 0 && Math.abs(difference) > 49) {
        //We are more than 50 days after Resurrection, which means that we are potentially during the Apostles Lent
        if (Number(copticMonth) < 11 ||
            (Number(copticMonth) == 11 && Number(copticDay) < 5)) {
            // We are during the Apostles lent (i.e. the coptic date is before 05/11 which is the date of the Apostles Feast)
            //I didn't find specific readings for this period. I assume there are no specific reading and we follow the ordinary readings. This needs however to be checked that's why I kept this "else if" case
            Season = Seasons.ApostlesFast;
            return Seasons.NoSeason; //My understanding is that the readings during the Apostle fast follow the coptic calendar as any ordinary day. If not, we may activate the return value below
            return isItSundayOrWeekDay(Seasons.ApostlesFast, Math.abs(difference) - 49, weekDay);
        }
        else {
            return Seasons.NoSeason;
        }
    }
    else if (Number(copticMonth) == 12 && Number(copticDay) < 16) {
        //We are during the St Mary Fast
        Season = Seasons.StMaryFast;
        return Seasons.NoSeason;
    }
    else if ((Number(copticMonth) == 4 && Number(copticDay) > 29) || (Number(copticMonth) == 5 && Number(copticDay) < 11)) {
        //We are between the Nativity and the Baptism
        Season = Seasons.Nativity;
        return Seasons.NoSeason;
    }
    else if (Number(copticMonth) == 1 && Number(copticDay) < 17) {
        Season = Seasons.Nayrouz;
        return Seasons.NoSeason;
    }
    else if (Number(copticMonth) == 1 && Number(copticDay) > 16 && Number(copticDay) > 20) {
        Season = Seasons.CrossFeast;
        return Seasons.NoSeason;
    }
    else {
        return Seasons.NoSeason;
    }
}
;
/**
 * If we are  during a given priod or season (like Great Lent): if we are a Sunday, it checks which Sunday of the coptic month we are and adds it to the "period" string. Otherwise, it adds the number of days elapsed since the beginning of the period
 * @param {string} period  - the season or the period *@param {number} days  - the number of days elapsed since the beginning of a given season or period, e.g.:
 * @param {number} weekDay - the day of the week as a number (Sunday = 0)
 * @returns {string} - the period/season after adding either the Sunday or the number of days elapsed
 */
function isItSundayOrWeekDay(period, days, weekDay) {
    if (weekDay == 0) {
        //we are a Sunday
        return period + checkWhichSundayWeAre(days);
    }
    else {
        // we are not a sunday
        return period + days.toString();
    }
}
;
/**
 * Shows the dates (Gregorian, coptic, coptic readings etc.), in an html element in the Temporary Dev Area
 */
function showDates() {
    let showDates = document.getElementById("showCurrentDate");
    showDates.innerText =
        "Current gregorian date is " +
            todayDate.toString() +
            " and the coptic date is " +
            copticDay +
            "/" +
            copticMonth +
            ". The copticReadingsDate =" +
            copticReadingsDate +
            '. And we ' + `${isFast ? 'are ' : 'are not '}` + 'during a fast period';
}
;
