import { apiPOST } from "./firebase"
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

  // Calculate the future time by adding the specified offsets
  const futureTime =
    now.getTime() + hoursToAdd * 60 * 60 * 1000 + minutesToAdd * 60 * 1000 + secondsToAdd * 1000

  // Create a new Date object with the calculated future time
  const futureDate = new Date(futureTime)

  // Handle midnight (12 AM) by checking if the current hour is 0
  const hours = futureDate.getUTCHours() === 0 ? 12 : futureDate.getUTCHours()

  // Format the result as an object with date and time properties
  const futureObject = {
    date: futureDate.toISOString().split('T')[0],
    time: `${hours.toString().padStart(2, '0')}:${futureDate
      .getUTCMinutes()
      .toString()
      .padStart(2, '0')}:${futureDate.getUTCSeconds().toString().padStart(2, '0')}`
  }

  // Return the future time object
  return futureObject
}

/**
 *
 * @param {Object} diff
 * @returns
 */
function differenceToString(diff) {
  try{

    if (isNaN(diff.hours) && isNaN(diff.minutes) && isNaN(diff.seconds)) return 'Off'
    
    const hrs = diff.hours.toString().padStart(2, '0')
    const min = diff.minutes.toString().padStart(2, '0')
    const sec = diff.seconds.toString().padStart(2, '0')
    
    const out = `${hrs}:${min}:${sec}`
    return out === '00:00:00' ? 'Off' : out
  }catch(err){
    // 
    return 'Off'
  }
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
function getTimeDifference(futureDate, futureTime, info) {
  try {
    const now = new Date()

    const [futureYear, futureMonth, futureDay] = futureDate.split('-').map(Number)
    const [futureHour, futureMinute, futureSecond] = futureTime.split(':').map(Number)

    // Create a new Date object using UTC to avoid timezone discrepancies
    const futureTimestamp = new Date(
      Date.UTC(futureYear, futureMonth - 1, futureDay, futureHour, futureMinute, futureSecond)
    ).getTime()

    // Check if the future time is in the past
    if (futureTimestamp <= now.getTime()) {

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
    
    apiPOST(true, `/Controllers/${info.id}/componentButtonList/${info.name}/reference/active/`)

    return {
      hours: remainingHours,
      minutes: remainingMinutes,
      seconds: remainingSeconds
    }
  } catch (err) {
    apiPOST(false, `/Controllers/${info.id}/componentButtonList/${info.name}/reference/active/`)
    return {
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  }
}

function stringToDate(dateString) {
  const date = new Date()
  if (!dateString) return false

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
