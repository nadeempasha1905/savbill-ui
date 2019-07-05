var cb_validations = angular.module('cb_validations',[]);

cb_validations.directive('webRequired',['webValidations', function(webValidations){
	return {
		require: 'ngModel',
		priority: 10000,
		link: webValidations.required
	}
}]);

cb_validations.directive('webNumeric',['webValidations',function(webValidations){
	return {
        require: 'ngModel',
        priority: 10000,
        link: webValidations.numeric
    }
}]);

cb_validations.directive('webTrim',['webValidations',function(webValidations){
	return {
        require: 'ngModel',
        priority: 10000,
        link: webValidations.trim
    }
}]);

cb_validations.directive('webAlphanumeric',['webValidations',function(webValidations){
	return {
        require: 'ngModel',
        priority: 10000,
        link: webValidations.alphanumeric
    }
}]);

cb_validations.directive('webAlpha',['webValidations',function(webValidations){
	return {
        require: 'ngModel',
        priority: 10000,
        link: webValidations.alpha
    }
}]);

cb_validations.directive('webEmail',['webValidations',function(webValidations){
	return {
        require: 'ngModel',
        priority: 10000,
        link: webValidations.email
    }
}]);

cb_validations.directive('webLimit',['webValidations',function(webValidations){
	return {
        require: 'ngModel',
        priority: 10000,
        link: webValidations.limit
    }
}]);

cb_validations.directive('webFloat',['webValidations',function(webValidations){
	return {
        require: 'ngModel',
        priority: 10000,
        link: webValidations.float
    }
}]);

cb_validations.directive('webIsvalidrr',['webValidations',function(webValidations){
	return {
        require: 'ngModel',
        priority: 10000,
        link: webValidations.isvalidrr
    }
}]);

cb_validations.factory('webValidations',['$rootScope','$compile','$timeout','remote', function($rootScope, $compile, $timeout, remote){
	var setValidation = {
		load: function(formName, popupScope, validationTypes){
			if(!validationTypes){
				validationTypes = ['web-required'];
			}
			var $form = $('form[name="'+formName+'"]');
			var formScope = popupScope[formName];
			$timeout(function(){
				for(var i=0; i< validationTypes.length; i++){
					var elms = $form.find('.'+validationTypes[i]);
					for(var j=0; j< elms.length; j++){
						var name = $(elms[j]).prop('name');
						var attrs = {
							ngModel: name,
							uibTooltip: true
						};
						if(validationTypes[i] === 'web-limit'){
							attrs.extend({
								'webLimit': $(elms[j]).attr('min-limit')+'::'+$(elms[j]).attr('max-limit')
							});
						}
						var ctrl = formScope[name];
						var call = (validationTypes[i]).replace('web-','');
						setValidation[call]( popupScope, $(elms[j]), attrs, ctrl);
					}
				}
			});
		},
		required: function (scope, elm, attrs, ctrl) {
			var model = (attrs.ngModel).split('.');
			var tooltipContent = model[model.length - 1] + 'TooltipContent';
			scope.$on('required-check-validity', function() {
		    	if(typeof ctrl.$error.isBlank === 'undefined' || ctrl.$error.isBlank){
		    		var isBlank = (ctrl.$modelValue === '' || typeof ctrl.$modelValue === 'undefined');
		    		ctrl.$setValidity('isBlank', !isBlank);
		    		if(isBlank){
		    			scope[tooltipContent] = 'This field is required';
			    		elm.not('[disabled]').addClass('error');
						$timeout(function(){
							elm.not('[disabled]').triggerHandler('show');
							elm.next().find('.tooltip-inner').text(scope[tooltipContent]);
				        });
		    		}
		    	}
		    });
			ctrl.$parsers.unshift(function (viewValue) {
				var isBlank = (viewValue === '');
				ctrl.$setValidity('isBlank', !isBlank);
				if(isBlank){
					scope[tooltipContent] = 'This field is required';
				}
				if($.isEmptyObject(ctrl.$error)){
					elm.removeClass('error');
					$timeout(function(){
						elm.triggerHandler('hide');
			        });
				}else{
					elm.addClass('error');
					$timeout(function(){
						elm.triggerHandler('show');
						elm.next().find('.tooltip-inner').text(scope[tooltipContent]);
			        });
				}
				return viewValue;
			});
			elm.addClass('mandatory');
			elm.removeAttr('web-required');
			elm.removeClass('web-required');
			if(!attrs.uibTooltip){
				elm.attr({
					'uib-tooltip': '{{'+tooltipContent+'}}',
					'tooltip-class': 'error',
					'tooltip-trigger': 'show'
				});
				if(elm.is('select')){
            		elm.attr('tooltip-class','error tooltip-select');
            	}
				scope[tooltipContent] = 'This field is required';
				$compile(elm)(scope);
			}
		},
		numeric: function(scope, elm, attrs, ctrl){
			var model = (attrs.ngModel).split('.');
        	var tooltipContent = model[model.length - 1] + 'TooltipContent';
            ctrl.$parsers.unshift(function (viewValue) {
                var invalidNumber = (viewValue !== '') && !/^[0-9]+$/.test(viewValue)
                ctrl.$setValidity('invalidNumber', !invalidNumber);
                if(invalidNumber){
                	scope[tooltipContent] = 'Only numbers are allowed';
                }
                if($.isEmptyObject(ctrl.$error)){
					elm.removeClass('error');
					$timeout(function(){
						elm.triggerHandler('hide');
			        });
				}else{
					elm.addClass('error');
					$timeout(function(){
						elm.triggerHandler('show');
						elm.next().find('.tooltip-inner').text(scope[tooltipContent]);
			        });
				}
                return viewValue;
            });
            elm.removeAttr('web-numeric');
            elm.removeClass('web-numeric');
            if(!attrs.uibTooltip){
            	elm.attr({
            		'uib-tooltip': '{{'+tooltipContent+'}}',
            		'tooltip-class': 'error',
            		'tooltip-trigger': 'show'
            	});
            	scope[tooltipContent] = 'Only numbers are allowed';
            	$compile(elm)(scope);
            }
		},
		alpha: function (scope, elm, attrs, ctrl) {
	    	var model = (attrs.ngModel).split('.');
	    	var tooltipContent = model[model.length - 1] + 'TooltipContent';
	        ctrl.$parsers.unshift(function (viewValue) {
	            var invalidAlphabets = (viewValue !== '') && !/^([A-z](\s)?)+$/.test(viewValue)
	            ctrl.$setValidity('invalidAlphabets', !invalidAlphabets);
	            if(invalidAlphabets){
	            	scope[tooltipContent] = 'Only Alphabets Allowed';
	            }
	            if($.isEmptyObject(ctrl.$error)){
					elm.removeClass('error');
					$timeout(function(){
						elm.triggerHandler('hide');
			        });
				}else{
					elm.addClass('error');
					$timeout(function(){
						elm.triggerHandler('show');
						elm.next().find('.tooltip-inner').text(scope[tooltipContent]);
			        });
				}
	            return viewValue;
	        });
	        elm.removeAttr('web-alpha');
	        elm.removeClass('web-alpha');
	        if(!attrs.uibTooltip){
	        	elm.attr({
	        		'uib-tooltip': '{{'+tooltipContent+'}}',
	        		'tooltip-class': 'error',
	        		'tooltip-trigger': 'show'
	        	});
	        	scope[tooltipContent] = 'Only Alphabets Allowed';
	        	$compile(elm)(scope);
	        }
	    },
	    alphanumeric: function (scope, elm, attrs, ctrl) {
        	var model = (attrs.ngModel).split('.');
        	var tooltipContent = model[model.length - 1] + 'TooltipContent';
            ctrl.$parsers.unshift(function (viewValue) {
                var invalidChars = (viewValue !== '') && !/^([A-z0-9](\s)?)+$/.test(viewValue)
                ctrl.$setValidity('invalidChars', !invalidChars);
                if(invalidChars){
                	scope[tooltipContent] = 'Special characters are not allowed';
                }
                if($.isEmptyObject(ctrl.$error)){
					elm.removeClass('error');
					$timeout(function(){
						elm.triggerHandler('hide');
			        });
				}else{
					elm.addClass('error');
					$timeout(function(){
						elm.triggerHandler('show');
						elm.next().find('.tooltip-inner').text(scope[tooltipContent]);
			        });
				}
                return viewValue;
            });
            elm.removeAttr('web-alphanumeric');
            elm.removeClass('web-alphanumeric');
            if(!attrs.uibTooltip){
            	elm.attr({
            		'uib-tooltip': '{{'+tooltipContent+'}}',
            		'tooltip-class': 'error',
            		'tooltip-trigger': 'show'
            	});
            	scope[tooltipContent] = 'Special characters are not allowed';
            	$compile(elm)(scope);
            }
        },
        trim: function (scope, elm, attrs, ctrl) {
        	var model = (attrs.ngModel).split('.');
        	var tooltipContent = model[model.length - 1] + 'TooltipContent';
            ctrl.$parsers.unshift(function (viewValue) {
                var isTrim = (viewValue !== '') && !/^\s/.test(viewValue) && !/\s$/.test(viewValue);
                ctrl.$setValidity('isTrim', !isTrim);
                if(isTrim){
                	scope[tooltipContent] = 'Remove trailing/leading space';
                }
                if($.isEmptyObject(ctrl.$error)){
					elm.removeClass('error');
					$timeout(function(){
						elm.triggerHandler('hide');
			        });
				}else{
					elm.addClass('error');
					$timeout(function(){
						elm.triggerHandler('show');
						elm.next().find('.tooltip-inner').text(scope[tooltipContent]);
			        });
				}
                return viewValue;
            });
            elm.removeAttr('web-trim');
            elm.removeClass('web-trim');
            if(!attrs.uibTooltip){
            	elm.attr({
            		'uib-tooltip': '{{'+tooltipContent+'}}',
            		'tooltip-class': 'error',
            		'tooltip-trigger': 'show'
            	});
            	scope[tooltipContent] = 'Remove trailing/leading space';
            	$compile(elm)(scope);
            }
        },
        email: function (scope, elm, attrs, ctrl) {
        	var model = (attrs.ngModel).split('.');
        	var tooltipContent = model[model.length - 1] + 'TooltipContent';
            ctrl.$parsers.unshift(function (viewValue) {
            	var isEmail = (viewValue !== '') && !/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i.test(viewValue);
                ctrl.$setValidity('isEmail', !isEmail);
                if(isEmail){
                	scope[tooltipContent] = 'Email format is not valid';
                }
                if($.isEmptyObject(ctrl.$error)){
					elm.removeClass('error');
					$timeout(function(){
						elm.triggerHandler('hide');
			        });
				}else{
					elm.addClass('error');
					$timeout(function(){
						elm.triggerHandler('show');
						elm.next().find('.tooltip-inner').text(scope[tooltipContent]);
			        });
				}
                return viewValue;
            });
            elm.removeAttr('web-email');
            elm.removeClass('web-email');
            if(!attrs.uibTooltip){
            	elm.attr({
            		'uib-tooltip': '{{'+tooltipContent+'}}',
            		'tooltip-class': 'error',
            		'tooltip-trigger': 'show'
            	});
            	scope[tooltipContent] = 'Email format is not valid';
            	$compile(elm)(scope);
            }
        },
        limit: function (scope, elm, attrs, ctrl) {
        	var model = (attrs.ngModel).split('.');
        	var tooltipContent = model[model.length - 1] + 'TooltipContent';
        	var limit = (attrs['webLimit']).split('::');
        	var minLimit = parseInt(limit[0]);
        	var maxLimit = parseInt(limit[1]);
            ctrl.$parsers.unshift(function (viewValue) {
            	var isLimit = (viewValue !== '') && !((viewValue.length >= minLimit) && (viewValue.length <= maxLimit));
                ctrl.$setValidity('isLimit', !isLimit);
                if(isLimit){
                	scope[tooltipContent] = 'Length limit : '+ minLimit +'-'+ maxLimit;
                }
                if($.isEmptyObject(ctrl.$error)){
					elm.removeClass('error');
					$timeout(function(){
						elm.triggerHandler('hide');
			        });
				}else{
					elm.addClass('error');
					$timeout(function(){
						elm.triggerHandler('show');
						elm.next().find('.tooltip-inner').text(scope[tooltipContent]);
			        });
				}
                return viewValue;
            });
            elm.removeAttr('web-limit');
            elm.removeClass('web-limit');
            if(!attrs.uibTooltip){
            	elm.attr({
            		'uib-tooltip': '{{'+tooltipContent+'}}',
            		'tooltip-class': 'error',
            		'tooltip-trigger': 'show'
            	});
            	scope[tooltipContent] = 'Length limit : '+ minLimit +'-'+ maxLimit;
            	$compile(elm)(scope);
            }
        },
		float: function(scope, elm, attrs, ctrl){
			var model = (attrs.ngModel).split('.');
        	var tooltipContent = model[model.length - 1] + 'TooltipContent';
            ctrl.$parsers.unshift(function (viewValue) {
                var isFloat = (viewValue !== '') && !/^[0-9]*(\.)?[0-9]+$/.test(viewValue)
                ctrl.$setValidity('isFloat', !isFloat);
                if(isFloat){
                	scope[tooltipContent] = 'Only numbers are allowed';
                }
                if($.isEmptyObject(ctrl.$error)){
					elm.removeClass('error');
					$timeout(function(){
						elm.triggerHandler('hide');
			        });
				}else{
					elm.addClass('error');
					$timeout(function(){
						elm.triggerHandler('show');
						elm.next().find('.tooltip-inner').text(scope[tooltipContent]);
			        });
				}
                return viewValue;
            });
            elm.removeAttr('web-float');
            elm.removeClass('web-float');
            if(!attrs.uibTooltip){
            	elm.attr({
            		'uib-tooltip': '{{'+tooltipContent+'}}',
            		'tooltip-class': 'error',
            		'tooltip-trigger': 'show'
            	});
            	scope[tooltipContent] = 'Only numbers are allowed';
            	$compile(elm)(scope);
            }
		},
		isvalidrr: function(scope, elm, attrs, ctrl){
			var model = (attrs.ngModel).split('.');
        	var tooltipContent = model[model.length - 1] + 'TooltipContent';
        	elm.on('blur',function(){
        		if(!elm.val()){
        			return;
        		}
        		remote.load("validaterrno", function(response){}, { 'rr_no': $rootScope.user.location_code + elm.val() } ,'POST', function(response){
        			elm.addClass('error');
					$timeout(function(){
						elm.triggerHandler('show');
						elm.next().find('.tooltip-inner').text(scope[tooltipContent]);
			        });
        		}, false, true);
        	});
            ctrl.$parsers.unshift(function (viewValue) {
				elm.removeClass('error');
				$timeout(function(){
					elm.triggerHandler('hide');
		        });
                return viewValue;
            });
            elm.removeAttr('web-isvalidrr');
            elm.removeClass('web-isvalidrr');
            if(!attrs.uibTooltip){
            	elm.attr({
            		'uib-tooltip': '{{'+tooltipContent+'}}',
            		'tooltip-class': 'error',
            		'tooltip-trigger': 'show'
            	});
            	scope[tooltipContent] = "RR no entered doesn't exist in DB";
            	$compile(elm)(scope);
            }
		}
	}
	return setValidation;
}]);