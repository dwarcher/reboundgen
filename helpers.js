module.exports["debug"] = function(context, option) {
  console.log("Current Context");
  console.log("====================");
  console.log(context);

 
  if (optionalValue) {
    console.log("Value");
    console.log("====================");
    console.log(option);
  }

  return "ARRCHGH";
}