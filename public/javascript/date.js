const getDate = () => {

  //get date
  let today = new Date();
  // set options to show date options dynamically.
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  // set day to return string portion of date
  let day = today.toLocaleDateString("en-US", options)
  return day;
}

module.exports = getDate;
