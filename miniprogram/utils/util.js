const getRandomArrayElements = (arr, count) => {
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

const getDate = () => {
  var date = new Date()
  return new Date(date.getFullYear(), date.getMonth() + 1, date.getDate())
}

const getExpire = () => {
  return new Date(new Date().getTime() + 3 * 3600 * 1000)
}


const uuid = () => {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  console.log(uuid);
  return uuid;
}

module.exports = {
  getRandomArrayElements,
  getDate,
  getExpire,
  uuid
}