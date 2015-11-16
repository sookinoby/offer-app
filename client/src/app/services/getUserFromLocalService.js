(function() {
angular.module('client').factory('userDetailsLocalService', UserDetailsLocalService )

function UserDetailsLocalService(UserData,$window)  {
	var userDetail = {};
	//console.log("factory executed");

	userDetail.getUserDetailFromLocal = function () {
	console.log("get UserDetail From Local executed");
	if( UserData && UserData.userName && UserData.userName != null && UserData.userName != "" ) {
		console.log("UserData is not null");
     	return UserData;
      }
      else if($window.localStorage.currentUser && $window.localStorage.currentUser != null && $window.localStorage.currentUser != "") {
        UserData.userName = $window.localStorage.currentUser;
        return UserData;
   		}
   			console.log("window is not null");
   			return null;
	};

	userDetail.deletetUserDetailFromLocal = function () {
		console.log("deleting all UserDetails");
		UserData.userName = null;
        $window.localStorage.removeItem("currentUser");
	};
	return userDetail;

};
})();
