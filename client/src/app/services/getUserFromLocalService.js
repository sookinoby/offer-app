(function() {
  'use strict';
angular.module('client').factory('userDetailsLocalService', UserDetailsLocalService )

function UserDetailsLocalService(UserData,$window,$log)  {
	var userDetail = {};
	//console.log("factory executed");

	userDetail.getUserDetailFromLocal = function () {
	$log.debug("get UserDetail From Local executed");
	if( UserData && UserData.userName && UserData.userName !== null && UserData.userName !== "" ) {
		$log.debug("UserData is not null");
     	return UserData;
      }
      else if($window.localStorage.currentUser && $window.localStorage.currentUser != null && $window.localStorage.currentUser != "") {
        UserData.userName = $window.localStorage.currentUser;
        return UserData;
   		}
   			$log.debug("window is not null");
   			return null;
	};

	userDetail.deletetUserDetailFromLocal = function () {
		console.debug("deleting all UserDetails");
		UserData.userName = null;
        $window.localStorage.removeItem("currentUser");
	};
	return userDetail;

};
})();
