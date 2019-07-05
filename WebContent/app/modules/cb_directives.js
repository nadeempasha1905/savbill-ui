var cb_directives = angular.module('cb_directives',[]);

cb_directives.directive('webHeader', function($timeout) {
	return {
	    restrict: 'E',
	    scope: {
	    	page : "@",
	    	user : "=userInfo"
	    },
	    templateUrl: templates.header,
	    link: function(scope, element, attrs) {
	    	$(element).find('.rhs-links').find('.accountHeaderClass').off('mouseenter mouseleave').on('mouseenter mouseleave',function(e){
    			$(e.currentTarget).find('.dropdownWrapper').toggleClass('hard-hidden');
    		});
	    	$timeout(function(){
		    	$(element).find('.menu-toggle-button').find('a').off('click').on('click',function(e){
		    		$('web-menu').toggleClass('menu-transition');
		    	});
	    	});
	    }
	};
});

cb_directives.directive('webMenu', function() {
	return {
	    restrict: 'E',
	    scope: {
	    	page : "@",
	    	menu : "=menuCollection"
	    },
	    templateUrl: templates.menu,
	    link: function(scope, element, attrs) {
	    	$(element).on('mouseleave',function(){
	    		$('web-menu').toggleClass('menu-transition');
    		});
	    }
	};
});

cb_directives.directive('webBreadCrumb', function() {
	return {
	    restrict: 'E',
	    scope: {
	    	items : "="
	    },
	    templateUrl: templates.breadcrumb
	};
});

cb_directives.directive('webTabs', function($timeout) {
	return {
	    restrict: 'E',
	    link: function(scope, element, attrs) {
	    	
	    	$(element).attr('tabindex','0');
	    	
	    	$(element).hover(function() {
	    	    this.focus();
	    	}, function() {
	    	    this.blur();
	    	}).on('keyup',function(e){
	    		if($(e.target).is('input')) return;
	    		var key = e.which;
	    		if(key === 37 || key === 39){
	    			var $headers = $(element).find('ul.tabs li'),
	    				totalHeaders = $headers.length,
	    				activeIndex = $headers.index($(element).find('ul.tabs li.active')),
	    				triggerIndex = (activeIndex - 1) % totalHeaders;
	    			if(key == 39){
		    			triggerIndex = (activeIndex + 1) % totalHeaders;
					}
		    		$headers.eq(triggerIndex).trigger('click');
	    		}
	    	}).find('ul.tabs li').on('click',function(e){
	    		var $targetHeader = $(e.currentTarget),
	    			$headers = $(element).find('ul.tabs li'),
	    			targetIndex = $headers.index($targetHeader),
	    			oldTargetIndex = $headers.index($(element).find('ul.tabs li.active')),
	    			$contents = $(element).find('.tabs-content > div');

	    		$headers.removeClass('active');
	    		$targetHeader.addClass('active');
	    		$contents.removeClass('tab-active tab-right tab-left');
	    		$contents.eq(oldTargetIndex).addClass('transition');
	    		$timeout(function(){
	    			$contents.eq(oldTargetIndex).removeClass('transition');
	    		},1000);
	    		$contents.eq(targetIndex).addClass('tab-active');
	    		$(element).find('.tabs-content > div:lt('+targetIndex+')').addClass('tab-left');
	    		$(element).find('.tabs-content > div:gt('+targetIndex+')').addClass('tab-right');
    		});
	    }
	};
});

cb_directives.directive('webDatepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
         link: function (scope, element, attrs, ngModelCtrl) {
        	element.prop('readOnly',true);
        	var datepicker_options = {
                dateFormat: 'dd/mm/yy',
                changeMonth: true,
                changeYear: true,
                onSelect: function (date) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(date);
                    });
                }
        	};
        	if(attrs.closeIcon != 'false'){
        		$('<span class="fa fa-times relative-pos clear-date"></span>').insertAfter(element);
        		element.next('span.clear-date').on('click',function(){
        			element.val('');
        			scope.$apply(function () {
                        ngModelCtrl.$setViewValue('');
                    });
        		});
        	}
        	if(attrs.icon != 'false'){
        		angular.extend(datepicker_options,{
        			showOn: "both",
                    buttonImage: "./app/img/calendarIcon.png",
                    buttonImageOnly: true,
                    buttonText: "Select date"
        		});
        	}else{
        		element.next('span.clear-date').addClass('without-calendar-icon');
        	}
        	if(attrs.minDate){
        		angular.extend(datepicker_options,{
        			minDate: attrs.minDate
        		});
        	}
        	if(attrs.maxDate){
        		angular.extend(datepicker_options,{
        			maxDate: attrs.maxDate
        		});
        	}
            element.datepicker(datepicker_options);
            element.removeAttr('web-datepicker');
        }
    };
});

cb_directives.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keypress", function($event) {
            if($event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                $event.preventDefault();
            }
        });
    };
});
cb_directives.directive('webSearch', function($timeout) {
	return {
	    restrict: 'E',
	    link: function(scope, element, attrs) {
	    	var defaultSearches = [
		    	{
		    		label: "customer master",
		    		link: "#/customer/customer_master",
		    		parent: "customer"
		    	},{
		    		label: "view bills",
		    		link: "#/accounts/view_bills",
		    		parent: "accounts"
		    	}
	    	];
	    	scope.defaultSearch = true;
	    	scope.searches = angular.copy(defaultSearches);
	    	$timeout(function(){
				element.find('.topsearch-suggestionBox').find('ul').find('li').eq(0).addClass('highlight');
			});
	    	scope.$watch('searchWord',function(new_val){
	    		if(typeof new_val !== 'undefined'){
	    			if(new_val === ''){
	    				scope.defaultSearch = true;
	    				scope.searches = angular.copy(defaultSearches);
	    			}else{
		    			scope.defaultSearch = false;
		    			scope.searches = [];
		    			$('#menu').find('[data-search]').each(function(){
		    				var searchable = $(this).data('search');
		    				if(searchable.indexOf(new_val.toLowerCase()) !== -1){
		    					var search_values = searchable.split('::');
		    					var search = {
		    						label: search_values[search_values.length - 1],
		    						link: $(this).prop('href'),
		    						parent: search_values[0]
		    					}
		    					scope.searches.push(search);
		    				}
		    			});
		    			if(!scope.searches.length){
		    				scope.defaultSearch = true;
		    		    	scope.searches = angular.copy(defaultSearches);
		    			}
	    			}
	    			$timeout(function(){
	    				element.find('.topsearch-suggestionBox').find('ul').find('li').eq(0).addClass('highlight');
	    			});
	    		}
	    	});
	    	element.find('.searchformInput').off('keyup').on('keyup',function(e){
	    		var key = e.which;
	    		if(key === 13){
	    			element.find('.topsearch-suggestionBox').find('ul').find('li.highlight').find('a').trigger('click');
	    		}
	    		if(key === 38 || key === 40){
	    			var $list = element.find('.topsearch-suggestionBox').find('ul').find('li');
		    		var highlight_index = element.find('.topsearch-suggestionBox').find('ul').find('li').index(element.find('.topsearch-suggestionBox').find('ul').find('li.highlight'));
	    			var triggerIndex = (highlight_index - 1 + $list.length) % $list.length;
	    			if(key === 40){
	    				triggerIndex = (highlight_index + 1 + $list.length) % $list.length;
	    			}
	    			$list.removeClass('highlight');
	    			$list.eq(triggerIndex).addClass('highlight');
	    		}
	    	});
	    	element.find('.searchformInput').off('focus').on('focus',function(){
	    		element.find('.searchAutoSuggstn').addClass('open');
	    	});
	    	element.find('.searchformInput').off('blur').on('blur',function(){
	    		$timeout(function(){
	    			element.find('.searchAutoSuggstn').removeClass('open');
	    		},1000);
	    	});
	    }
	};
});

/*cb_directives.directive('webPopup', function($timeout, remote) {
	return {
	    restrict: 'E',
	    scope: {
	    	element : "@",
	    	config : "="
	    },
	    templateUrl: templates.popup,
	    link: function(scope, element, attrs) {
	    	$(element).find('.rhs-links').find('.accountHeaderClass').off('mouseenter mouseleave').on('mouseenter mouseleave',function(e){
    			$(e.currentTarget).find('.dropdownWrapper').toggleClass('hard-hidden');
    		});
	    	$timeout(function(){
		    	$(element).find('.menu-toggle-button').find('a').off('click').on('click',function(e){
		    		$('web-menu').toggleClass('menu-transition');
		    	});
	    	});
	    }
	};
});*/