var login_controller = angular.module('login_controller',[]);

login_controller.controller('login_controller',function($scope,$rootScope,$location,$timeout,load_ui,remote,cookie){
	load_ui.camera('#slider_wrap');
	load_ui.camera('#partner_wrap');
	load_ui.scroll();
	load_ui.wow();
	load_ui.parallax('#contact');
	$('#userID').focus();
	$scope.submitLogin = function(e){
		e.preventDefault();
		if($rootScope.password_mode){
			if($('#password').val() == '') {
				$('#password').focus();
				return false;
			}
			remote.load("validateuser", function(response){
				$rootScope.user = JSON.parse(cookie.get('cb_user'));
				cookie.remove('cb_user');
				angular.extend($rootScope.user,response.session_details);
				cookie.set('cb_user',JSON.stringify($rootScope.user),9);
				$rootScope.menu = response.menus;
				load_ui.routing();
				$location.path('/home');
			}, {
				userID : $('#userID').val().trim(),
				password : $('#password').val().trim(),
				userRole : $rootScope.user.role,
				connType : $rootScope.user.connection_type
			}, 'POST');
		}else{
			if($('#userID').val() == '') {
				$('#userID').focus();
				return false;
			}
			remote.load("validateuserid", function(response){
				$rootScope.user = response.user_details;
				cookie.set('cb_user',JSON.stringify(response.user_details),9);
				$rootScope.password_mode = true;
				$timeout(function(){
					$('#password').focus();
				});
			}, {
				userID : $('#userID').val().trim()
			}, 'POST');
		}
	};
	$scope.notMe = function(){
		$rootScope.password_mode = false;
		cookie.remove('cb_user');
		$rootScope.$apply();
		$('#userID').select();
	};
	$('#footer .social a i').off('mouseenter mouseleave').on('mouseenter mouseleave',function(e){
		$('#footer').toggleClass($(e.currentTarget).data('class'));
	});
});