module.exports.currentDate = () => {

  //get date
  const today = new Date();
  // set options to show date options dynamically.
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  // set day to return string portion of date
  return today.toLocaleDateString("en-US", options)
}


module.exports.dayOfWeek = () => {

  //get date
  const today = new Date();
  // set options to show date options dynamically.
  const options = {
    weekday: "long",
  };
  // set day to return string portion of date
  return today.toLocaleDateString("en-US", options)
}
