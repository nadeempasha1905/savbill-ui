var initiate_ui = angular.module('initiate_ui',[]);
initiate_ui.factory('load_ui',function($route){
	return {
		
		//smooth scroll
		scroll : function(){
			$.srSmoothscroll({
				step: 150,
				speed: 800
			});
		},
		//initialize show when visible
		wow : function(){
			//new WOW().init();
		},
		// home page main slider
		camera : function(element){
			if($(element).length > 0){
				switch(element){
					case "#partner_wrap":
						$("#partner_wrap").each(function(){
							var t = $(this);
							var s = 0;
							t.camera({
								height: '30%',
								loader: false,
								pagination: false,
								thumbnails: false,
								hover: false,
								easing: 'easeInOutExpo',
								fx: 'simpleFade',
								time: 2000,
								transition: 200
							});
						});
						break;
					case "#slider_wrap":
						$("#slider_wrap").each(function(){
							var t = $(this);
							var s = 0;
							t.camera({
								height: '45%',
								loader: 'bar',
								pagination: false,
								thumbnails: false,
								hover: false,
								time: 4500
							});
						});
						break;
				};				
			};
		},
		// notification background image
		parallax : function(element){
			if($(element).length > 0){
				$(element).parallax();
			}
		},
		// routing update after successful login
		routing : function(){
			$route.routes['/login'] = {
		    	redirectTo: '/home'
		    };
		    $route.routes[null] = {
		    	redirectTo: '/home'
		    };
		},
		// routing update after successful logout if needed
		loginRouting : function(){
			$route.routes['/login'] = {
				templateUrl: templates.login,
				controller: 'login_controller',
				reloadOnSearch: true
		    };
		    $route.routes[null] = {
		    	redirectTo: '/login'
		    };
		}
	}
});