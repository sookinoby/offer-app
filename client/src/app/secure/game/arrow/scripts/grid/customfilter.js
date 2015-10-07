// Setup the filter
angular.module('arrowGameGrid').filter('ordinal', function() {

  // Create the return function
  // set the required parameter name to **number**
  return function(inputString) {
   
    if(inputString)
    {
      replace_start = "<i class='title_highlight'>";
      replace_end = "</i>";
    // Ensure that the passed in data is a number
      inputString =  inputString.replace(/\^/g, replace_start);
      inputString =  inputString.replace(/\?/g, replace_end);
      console.log(inputString);
     // inputString =  inputString.replace(new RegExp("?", 'g'), replace_end);
    }
   /* if(isNaN(number) || number < 1) {
      console.log("test");
      var string_to_return;
      for(var i=0;i<number.length;i++)
      {
        var a = myString.charAt(i)
        if(a == "^")
        {
          console.log(a);
          for(var j=i+1; j <number.length;j++)
          {
             var b = myString.charAt(j);
              if( b == "^")
              {
                console.log("b" + b);
                string_to_return = myString.substring(i+1,j)
              }
          }
        }
        i=j;
        // If the data is not a number or is less than one (thus not having a cardinal value) return it unmodified.
      }  */
      return inputString;

    } 
  }
);
