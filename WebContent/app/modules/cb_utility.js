var cb_utility = angular.module('cb_utility',[]);

cb_utility.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, 
        		function(txt){
					return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
				}) : '';
    }
});

cb_utility.filter('replace', function() {
    return function(input,target,update) {
        return (!!input) ? input.replace(new RegExp(target,"g"), update) : '';
    }
});

cb_utility.service('remote', ['$http','$rootScope','notify',function($http, $rootScope, notify){
	this.load = function(service, success, data, method, error, hide_loader, do_not_notify){
		if(!hide_loader){
			$('#loading').show();
		}
		var config = {
			method: method,
			url: $rootScope.serviceURL + service,
			data: data
		}
		$http(config).then( function(response){
			if(!hide_loader){
				$('#loading').hide();
			}
			if(response.data.status === 'error' || response.data.status === 'fail' ){
				if(response.data.message){
					notify.error(response.data.message);
				}
				if(typeof error === 'function' ){
					error(response.data);
				}
			}else if(response.data.status === 'success' ){
				if(response.data.message && !do_not_notify){
					notify.success(response.data.message);
				}
				success(response.data);
			}else if(response.data.status === 'info' ){
				if(response.data.message && !do_not_notify){
					notify.info(response.data.message);
				}
				success(response.data);
			}
		}, function(response){
			if(!hide_loader){
				$('#loading').hide();
			}
			if(response.message){
				notify.error(response.message);
			}else if(response.data.status === 'fail' || response.data.status === 'failure'){
				if(response.data.message){
					notify.error(response.data.message);
				}
			}
		});
	}
}]);

cb_utility.service('notify', [function(){
	this.clear = function(){
		$('#notification').removeClass('alert-dismissible alert-info alert-success alert-danger alert-warning');
	}
	this.success = function(message){
		this.clear();
		$('#notification').addClass('alert-success');
		var content = '<strong>Success!</strong> '+ message;
		$('#notification').html(content);
		$('#notification').fadeIn( 800 ).delay( 2000 ).fadeOut( 800 );
	}
	this.error = function(message){
		this.clear();
		$('#notification').addClass('alert-dismissible alert-danger');
		var content = '<button type="button" class="close"><span aria-hidden="true">&times;</span></button>';
			content += '<strong>Error!</strong> '+ message;
		$('#notification').html(content);
		$('#notification').fadeIn( 800 ,function(){
			$('#notification').find('.close').off('click').on('click',function(){
				$('#notification').fadeOut( 800 );
			});
		});
	}
	this.info = function(message){
		this.clear();
		$('#notification').addClass('alert-info');
		var content = '<strong>Info!</strong> '+ message;
		$('#notification').html(content);
		$('#notification').fadeIn( 800 ).delay( 2000 ).fadeOut( 800 );
	}
	this.warn = function(message){
		this.clear();
		$('#notification').addClass('alert-warning');
		var content = '<strong>Warning!</strong> '+ message;
		$('#notification').html(content);
		$('#notification').fadeIn( 800 ).delay( 2000 ).fadeOut( 800 );
	}
}]);

cb_utility.service('cookie', [function(){
	this.set = function(cname, cvalue, exhours) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exhours*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	}
	this.get = function(cname) {
	    var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
	    }
	    return "";
	}
	this.check = function(cname) {
	    var isCookieAvailable = (this.get(cname) === "")? false : true;
	    return isCookieAvailable;
	}
	this.remove = function(cname) {
	    var d = new Date();
	    d.setTime(d.getTime() - 1);
	    document.cookie = cname + "=; " + "expires=" + d.toUTCString();
	}
}]);