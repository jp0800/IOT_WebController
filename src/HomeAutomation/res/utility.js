/**
 *
 * @param {String} text string to be tested
 * @return {Boolean} if the text value is empty
 */
function isInputValueEmpty(text) {
  return text.length === 0
}
/**
 *
 * @param {Number} hoursToAdd
 * @param {Number} minutesToAdd
 * @param {Number} secondsToAdd
 * @return {Object}
 */
function getFutureTime(hoursToAdd, minutesToAdd, secondsToAdd) {
  const now = new Date()

  const futureTime =
    now.getTime() + hoursToAdd * 60 * 60 * 1000 + minutesToAdd * 60 * 1000 + secondsToAdd * 1000

  const futureDate = new Date(futureTime)
  const futureObject = {
    date: futureDate.toISOString().split('T')[0],
    time: `${futureDate.getHours().toString().padStart(2, '0')}:${futureDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${futureDate.getSeconds().toString().padStart(2, '0')}`
  }

  return futureObject
}

/**
 *
 * @param {Object} diff
 * @returns
 */
function differenceToString(diff) {

  if (isNaN(diff.hours) && isNaN(diff.minutes) && isNaN(diff.seconds)) return 'Off'

  const hrs = diff.hours.toString().padStart(2, '0')
  const min = diff.minutes.toString().padStart(2, '0')
  const sec = diff.seconds.toString().padStart(2, '0')

  const out = `${hrs}:${min}:${sec}`
  return out === '00:00:00' ? 'Off' : out
}

/**
 *
 * @param {Date} timeObject
 * @returns
 */
function timeObjectToString(timeObject) {
  const futureHours = timeObject.getHours().toString().padStart(2, '0')
  const futureMinutes = timeObject.getMinutes().toString().padStart(2, '0')
  const futureSeconds = timeObject.getSeconds().toString().padStart(2, '0')

  return `${futureHours}:${futureMinutes}:${futureSeconds}`
}

/**
 *
 * @param {String} futureDate
 * @param {String} futureTime
 * @returns
 */
function getTimeDifference(futureDate, futureTime) {
  const now = new Date()

  const [futureYear, futureMonth, futureDay] = futureDate.split('-').map(Number)
  const [futureHour, futureMinute, futureSecond] = futureTime.split(':').map(Number)

  const futureTimestamp = new Date(
    futureYear,
    futureMonth - 1,
    futureDay,
    futureHour,
    futureMinute,
    futureSecond
  ).getTime()

  if (futureTimestamp <= now.getTime()) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  }

  if (futureTimestamp - now.getTime() < 0) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  }

  const timeDifference = futureTimestamp - now.getTime()

  const remainingHours = Math.floor(timeDifference / (60 * 60 * 1000))
  const remainingMinutes = Math.floor((timeDifference % (60 * 60 * 1000)) / (60 * 1000))
  const remainingSeconds = Math.floor((timeDifference % (60 * 1000)) / 1000)

  return {
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSeconds
  }
}

function stringToDate(dateString) {
  const date = new Date()
  if (!dateString)  return false
  
  if (dateString === '00:00:00') {
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)

    return date
  }
  const timeString = dateString
  const [hours, minutes, seconds] = timeString.split(':')

  date.setHours(parseInt(hours, 10))
  date.setMinutes(parseInt(minutes, 10))
  date.setSeconds(parseInt(seconds, 10))

  return date
}

export {
  isInputValueEmpty,
  getFutureTime,
  getTimeDifference,
  differenceToString,
  stringToDate,
  timeObjectToString
}
