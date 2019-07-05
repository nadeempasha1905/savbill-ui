var cb_config = angular.module('cb_config',[]);
		
cb_config.config(['$routeProvider', '$locationProvider', '$uibTooltipProvider', function($routeProvider, $locationProvider, $uibTooltipProvider) {
		$routeProvider.
			when( '/login', {
				templateUrl: templates.login,
				controller: 'login_controller'
			}).
			when( '/home', {
				templateUrl: templates.home,
				controller: 'home_controller'
			}).
			when( '/see_all_categories', {
				templateUrl: templates.see_all_categories,
				controller: 'see_all_categories_controller'
			}).
			when( '/master/:sub_menu', {
				templateUrl: function(urlattr){
	                return templates.master[(urlattr.sub_menu)];
	            },
				controller: 'master_controller'
			}).
			when( '/customer/:sub_menu', {
				templateUrl: function(urlattr){
	                return templates.customer[(urlattr.sub_menu)];
	            },
				controller: 'customer_controller'
			}).
			when( '/customer/:sub_menu/:micro_menu', {
				templateUrl: function(urlattr){
	                return templates.customer[(urlattr.sub_menu)][(urlattr.micro_menu)];
	            },
				controller: 'customer_controller'
			}).
			when( '/deposits/:sub_menu', {
				templateUrl: function(urlattr){
	                return templates.deposits[(urlattr.sub_menu)];
	            },
				controller: 'deposits_controller'
			}).
			when( '/deposits/:sub_menu/:micro_menu', {
				templateUrl: function(urlattr){
	                return templates.deposits[(urlattr.sub_menu)][(urlattr.micro_menu)];
	            },
				controller: 'deposits_controller'
			}).
			when( '/cash_section/:sub_menu', {
				templateUrl: function(urlattr){
	                return templates.cash_section[(urlattr.sub_menu)];
	            },
				controller: 'cash_section_controller'
			}).
			when( '/cash_section/:sub_menu/:micro_menu', {
				templateUrl: function(urlattr){
	                return templates.cash_section[(urlattr.sub_menu)][(urlattr.micro_menu)];
	            },
				controller: 'cash_section_controller'
			}).
			when( '/accounts/:sub_menu', {
				templateUrl: function(urlattr){
	                return templates.accounts[(urlattr.sub_menu)];
	            },
				controller: 'accounts_controller'
			}).
			when( '/accounts/:sub_menu/:micro_menu', {
				templateUrl: function(urlattr){
	                return templates.accounts[(urlattr.sub_menu)][(urlattr.micro_menu)];
	            },
				controller: 'accounts_controller'
			}).
			when( '/infrastructure/:sub_menu', {
				templateUrl: function(urlattr){
	                return templates.infrastructure[(urlattr.sub_menu)];
	            },
				controller: 'infrastructure_controller'
			}).
			when( '/energy_audit/:sub_menu', {
				templateUrl: function(urlattr){
	                return templates.energy_audit[(urlattr.sub_menu)];
	            },
				controller: 'energy_audit_controller'
			}).
			when( '/user/:sub_menu', {
				templateUrl: function(urlattr){
	                return templates.user[(urlattr.sub_menu)];
	            },
				controller: 'user_controller'
			}).
			when( '/main/:sub_menu', {
				templateUrl: function(urlattr){
	                return templates.main[(urlattr.sub_menu)];
	            },
				controller: 'main_controller'
			}).
			when( '/main/:sub_menu/:micro_menu', {
				templateUrl: function(urlattr){
	                return templates.main[(urlattr.sub_menu)][(urlattr.micro_menu)];
	            },
				controller: 'main_controller'
			}).
			when( '/reports/:sub_menu', {
				templateUrl: function(urlattr){
	                return templates.reports[(urlattr.sub_menu)];
	            },
				controller: 'report_controller'
			}).
			otherwise({
				redirectTo: '/login'
			});
		
		$uibTooltipProvider.setTriggers({
			'show': 'hide'
		});
}]);