// Setup the filter
(function(){
angular.module('arrowGameCommonService').filter('titleHighlighter', function() {

  // Create the return function
  // set the required parameter name to **number**
  return function(inputString) {
   
    if(inputString)
    {
      var replace_start = "<i class='title_highlight'>";
      var replace_end = "</i>";
    // Ensure that the passed in data is a number
      inputString =  inputString.replace(/\^/g, replace_start);
      inputString =  inputString.replace(/\?/g, replace_end);
    } 
     return inputString;

    } 
  }
);
})();
