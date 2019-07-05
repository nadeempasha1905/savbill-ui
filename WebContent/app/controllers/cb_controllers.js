var cb_controllers = angular.module('cb_controllers',[
                                                      'login_controller',
                                                      'master_controller',
                                                      'customer_controller',
                                                      'deposits_controller',
                                                      'cash_section_controller',
                                                      'accounts_controller',
                                                      'infrastructure_controller',
                                                      'energy_audit_controller',
                                                      'user_controller',
                                                      'main_controller',
                                                      'report_controller'
                                                      ]);

cb_controllers.controller('home_controller',function($scope,$rootScope,remote,$filter){
	
	$scope.search = {};
	
	$scope.ZONEUSER = false;
	$scope.CIRCLEUSER = false;
	$scope.DIVISIONUSER = false;
	$scope.SUBDIVISIONUSER = false;
	$scope.OMSECTIONUSER = false;
	
	var LOCATION_CODE = $rootScope.user.location_code;
	var loc_zone= "",loc_circle= "",loc_division= "",loc_subdivision= "",loc_omsection = "";
	var loc_usertype = 0;
	var loc_arr = [];
	
	$scope.initialize = function(){
		if(LOCATION_CODE.length == 2){loc_zone=LOCATION_CODE.substr(0,2);loc_usertype=1;}
		if(LOCATION_CODE.length == 3){loc_zone=LOCATION_CODE.substr(0,2);loc_circle=LOCATION_CODE.substr(0,3);loc_usertype=2;}
		if(LOCATION_CODE.length == 5){loc_zone=LOCATION_CODE.substr(0,2);loc_circle=LOCATION_CODE.substr(0,3);loc_division=LOCATION_CODE.substr(0,5);loc_usertype=3;}
		if(LOCATION_CODE.length == 7){loc_zone=LOCATION_CODE.substr(0,2);loc_circle=LOCATION_CODE.substr(0,3);loc_division=LOCATION_CODE.substr(0,5);loc_subdivision=LOCATION_CODE.substr(0,7);loc_usertype=4;}
		if(LOCATION_CODE.length == 9){loc_zone=LOCATION_CODE.substr(0,2);loc_circle=LOCATION_CODE.substr(0,3);loc_division=LOCATION_CODE.substr(0,5);loc_subdivision=LOCATION_CODE.substr(0,7);loc_omsection=LOCATION_CODE.substr(0,9);loc_usertype=5;}
		

		if (loc_usertype == 1) {
			var loc_arr = [ loc_zone ];
			$scope.ZONEUSER = true;
			$scope.CIRCLEUSER = false;
			$scope.DIVISIONUSER = false;
			$scope.SUBDIVISIONUSER = false;
			$scope.OMSECTIONUSER = false;
			$scope.getzonelist(loc_arr, loc_usertype, 'search');
		}
		if (loc_usertype == 2) {
			var loc_arr = [ loc_zone, loc_circle ];
			$scope.ZONEUSER = false;
			$scope.CIRCLEUSER = true;
			$scope.DIVISIONUSER = false;
			$scope.SUBDIVISIONUSER = false;
			$scope.OMSECTIONUSER = false;
			$scope.getzonelist(loc_arr, loc_usertype, 'search');
		}
		if (loc_usertype == 3) {
			var loc_arr = [ loc_zone, loc_circle, loc_division ];
			$scope.ZONEUSER = false;
			$scope.CIRCLEUSER = false;
			$scope.DIVISIONUSER = true;
			$scope.SUBDIVISIONUSER = false;
			$scope.OMSECTIONUSER = false;
			$scope.getzonelist(loc_arr, loc_usertype, 'search');
		}
		if (loc_usertype == 4) {
			var loc_arr = [ loc_zone, loc_circle, loc_division,
					loc_subdivision ];
			$scope.ZONEUSER = false;
			$scope.CIRCLEUSER = false;
			$scope.DIVISIONUSER = false;
			$scope.SUBDIVISIONUSER = true;
			$scope.OMSECTIONUSER = false;
			$scope.getzonelist(loc_arr, loc_usertype, 'search');
		}
		if (loc_usertype == 5) {
			var loc_arr = [ loc_zone, loc_circle, loc_division,
					loc_subdivision, loc_omsection ];
			$scope.ZONEUSER = false;
			$scope.CIRCLEUSER = false;
			$scope.DIVISIONUSER = false;
			$scope.SUBDIVISIONUSER = false;
			$scope.OMSECTIONUSER = true;
			$scope.getzonelist(loc_arr, loc_usertype, 'search');
		}
	};
	
	
	
	$scope.getzonelist = function(arr,usertype,searchtype){
		$scope.searchzonelist=[];$scope.searchcirclelist=[];$scope.searchdivisionlist=[];$scope.searchsubdivisionlist=[];$scope.searchomsectionlist=[];
		remote.load("getzonelist", function(response){
			$scope.searchzonelist = response.ZONE_LIST;
			if(arr.length > 0){
				$scope.search.zone = $filter('filter')($scope.searchzonelist,{ZONE_CODE:arr[0]},true)[0];
				if(usertype > 1){
					$scope.getcircleList(arr,usertype,'search');
				}else{
					remote.load("getcirclelist", function(response){
						$scope.searchcirclelist = response.CIRCLE_LIST;
					},{
						//location_code:($scope.search.zone === undefined || $scope.search.zone === null ? '' : $scope.search.zone.key),
						"LOCATION_CODE": ($scope.search.zone === undefined || $scope.search.zone === null ? '' : $scope.search.zone.ZONE_CODE),
						"CONN_TYPE": $rootScope.user.connection_type
					}, 'POST');
				}
		}
		},{
			"LOCATION_CODE": $rootScope.user.location_code,
			"CONN_TYPE": $rootScope.user.connection_type
		}, 'POST');
	
};

$scope.getcircleList = function(arr,usertype,searchtype){
		$scope.searchcirclelist=[];$scope.searchdivisionlist=[];$scope.searchsubdivisionlist=[];$scope.searchomsectionlist=[];
		if($scope.search.zone === undefined || $scope.search.zone === null){
			return;
		}
		remote.load("getcirclelist", function(response){
			$scope.searchcirclelist = response.CIRCLE_LIST;
			if(arr.length > 0){
				$scope.search.circle = $filter('filter')($scope.searchcirclelist,{CIRCLE_CODE:arr[1]},true)[0];
				if(usertype > 2){
					$scope.getdivisionList(arr,usertype,'search');
				}else{
					remote.load("getdivisionlist", function(response){
						$scope.searchdivisionlist = response.DIVISION_LIST;
					},{
						//location_code:($scope.search.circle === undefined || $scope.search.circle === null ? '' : $scope.search.circle.key),
						"LOCATION_CODE": ($scope.search.circle === undefined || $scope.search.circle === null ? '' : $scope.search.circle.CIRCLE_CODE),
						"CONN_TYPE": $rootScope.user.connection_type
					}, 'POST');
				}
		}
		},{
			//location_code:($scope.search.zone === undefined || $scope.search.zone === null ? '' : $scope.search.zone.key)
			"LOCATION_CODE": ($scope.search.zone === undefined || $scope.search.zone === null ? '' : $scope.search.zone.ZONE_CODE),
			"CONN_TYPE": $rootScope.user.connection_type
		}, 'POST');
	
	
};

$scope.getdivisionList = function(arr,usertype,searchtype){
		$scope.searchdivisionlist=[];$scope.searchsubdivisionlist=[];$scope.searchomsectionlist=[];
		if($scope.search.circle === undefined || $scope.search.circle === null){
			return;
		}
		remote.load("getdivisionlist", function(response){
			$scope.searchdivisionlist = response.DIVISION_LIST;
			if(arr.length > 0){
				$scope.search.division = $filter('filter')($scope.searchdivisionlist,{DIVISION_CODE:arr[2]},true)[0];
				if(usertype > 3){
					$scope.getsubdivisionList(arr,usertype,'search');
				}else{
						remote.load("getlocationlist", function(response){
						$scope.searchsubdivisionlist = response.SUBDIVISION_LIST;
					},{							
						location_code:($scope.search.division === undefined || $scope.search.division === null ? '' : $scope.search.division.key),
						"LOCATION_CODE": ($scope.search.division === undefined || $scope.search.division === null ? '' : $scope.search.division.DIVISION_CODE),
						"CONN_TYPE": $rootScope.user.connection_type
					
					}, 'POST');
				}
		}
		},{
			//location_code:($scope.search.circle === undefined || $scope.search.circle === null ? '' : $scope.search.circle.key),
			"LOCATION_CODE": ($scope.search.circle === undefined || $scope.search.circle === null ? '' : $scope.search.circle.CIRCLE_CODE),
			"CONN_TYPE": $rootScope.user.connection_type
		}, 'POST');
};

$scope.getsubdivisionList = function(arr,usertype,searchtype){
		$scope.searchsubdivisionlist=[];$scope.searchomsectionlist=[];$scope.searchstationlist=[];$scope.searchfeederlist=[];
		if($scope.search.division === undefined || $scope.search.division === null){
			return;
		}
		remote.load("getlocationlist", function(response){
			$scope.searchsubdivisionlist = response.LOCATION_CODE_LIST;
			if(arr.length > 0){
				$scope.search.subdivision = $filter('filter')($scope.searchsubdivisionlist,{LOCATION_CODES:arr[3]},true)[0];
				
				if(usertype > 4){
					$scope.getomsectionList(arr,usertype,'search');
				}else{
						remote.load("getomunitlist", function(response){
						$scope.searchomsectionlist = response.OM_LIST;
					},{
						//location_code:($scope.search.subdivision === undefined || $scope.search.subdivision === null ? '' : $scope.search.subdivision.key),
						"Location_Code": ($scope.search.subdivision === undefined || $scope.search.subdivision === null ? '' : $scope.search.subdivision.LOCATION_CODES),
						"Conn_Type": $rootScope.user.connection_type
					}, 'POST');
				}
		}
		},{
			//location_code:($scope.search.division === undefined || $scope.search.division === null ? '' : $scope.search.division.key),
			"LOCATION_CODE": ($scope.search.division === undefined || $scope.search.division === null ? '' : $scope.search.division.DIVISION_CODE),
			"CONN_TYPE": $rootScope.user.connection_type
		}, 'POST');

	
};

$scope.getomsectionList = function(arr,usertype,searchtype){
		if(searchtype === 'search'){
			$scope.searchomsectionlist=[];
			if($scope.search.subdivision === undefined || $scope.search.subdivision === null){
				return;
			}
			remote.load("getomunitlist", function(response){
				$scope.searchomsectionlist = response.OM_LIST;
				if(arr.length > 0){
					$scope.search.omsection = $filter('filter')($scope.searchomsectionlist,{key:arr[4]},true)[0];
			}
			},{
				location_code:($scope.search.subdivision === undefined || $scope.search.subdivision === null ? '' : $scope.search.subdivision.key),
				"Location_Code": ($scope.search.subdivision === undefined || $scope.search.subdivision === null ? '' : $scope.search.subdivision.LOCATION_CODES),
				"Conn_Type": $rootScope.user.connection_type
			}, 'POST');
		}
};

$scope.getfinancialyears = function(){
	
	remote.load("getfinancialyears", function(response){
		$scope.FIN_YEARS = response.FINANCIAL_YEARS;
	},{
		"Conn_Type": $rootScope.user.connection_type
	}, 'POST');
	
};

$scope.initialize();
$scope.getfinancialyears();


var chart_dashboardlist ;
$scope.dmonthyear = moment(new Date()).format("MMM-YYYY").toString();
var billeff_piechart;
$scope.grouptype = null;

    $scope.refreshchart_tab1 = function(type){
    	
    	$scope.createmaindashboard();
    	
    	$scope.grouptype = type;
    	
    	
    	var search_location = "",zone="",circle="",division="",subdivision="",omsection="",station="",feeder="",transformer="",village="";
		if($scope.search.zone != undefined || $scope.search.zone != null){zone = $scope.search.zone.key; search_location = $scope.search.zone.ZONE_CODE;}
		if($scope.search.circle != undefined || $scope.search.circle != null){circle = $scope.search.circle.key; search_location = $scope.search.circle.CIRCLE_CODE;}
		if($scope.search.division != undefined || $scope.search.division != null){division = $scope.search.division.key; search_location = $scope.search.division.DIVISION_CODE;}
		if($scope.search.subdivision != undefined || $scope.search.subdivision != null){subdivision = $scope.search.subdivision.key; search_location = $scope.search.subdivision.LOCATION_CODES;}
		if($scope.search.omsection != undefined || $scope.search.omsection != null){omsection = $scope.search.omsection.key; search_location = $scope.search.omsection.key;}
		
		remote.load("dashboard_billingefficiency_comparision", function(response){
				console.log("response",response);
				$scope.BILLING_EFFICIENCY_DASHBOARD = response.BILLING_EFFICIENCY_DASHBOARD;
				
				chart_dashboardlist = c3.generate({
		            bindto: '#linechart',
		            data: {
		                x: 'x',
		                columns: [],
		                type: 'spline',
		            },
		            zoom: {
		                enabled: true
		            },
		    		tooltip : {
		    			grouped : false
		    		},
		            axis: {
		               /* x: {
		                    type: 'category',
		                    tick: {
		                        rotate: 75,
		                        multiline: false
		                    },
		                    height: 130
		                }*/
		            	 x: {
		                     type: 'category',
		                     tick: {
		                       //  count:35,
		                         multiline: true
		                     }
		                 },
		    		        y: {
		    		        	
		    		        	min:0,
		    		        	max:100,
			                    label: { // ADD
			                      text: 'Comparision Month Wise',
			                      position: 'outer-middle'
			                    },
			                    padding : {
			                        bottom : 0
			                      }
		    		        }
		            }/*,
		            grid: {
		                y: {
		                    lines: [{value: 0}]
		                }
		            }*/,
		            legend: {
		                position: 'right'
		            }
		        });
				
				$scope.filldatatochart();
				$scope.createdashboardcards();
				
		},{
			"Location_Code": $rootScope.user.location_code,
			"Conn_Type": $rootScope.user.connection_type,
			//"financial_year" : $scope.search.financial_years.year,
			"financial_year" : '2009-2010',
			"search_location" : search_location,
			/*"displaywise":'TRF',*/
			"displaywise":$scope.grouptype,
			"inputtype":'LINE'
		}, 'POST');
		
    	billeff_piechart = c3.generate({
    		bindto: '#billeff_piechart',
    	    data: {
    	        // iris data from R
    	        columns: [
    	            ['Billed', 130],
    	            ['Not Billed', 120]
    	        ],
    	        type : 'pie',
    	        onclick: function (d, i) {
    	        	console.log("onclick", d, i);
    	        	},
    	        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
    	        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    	    }/*,
    	    pie: {
    	        label: {
    	            format: function (value, ratio, id) {
    	                return d3.format('$')(value);
    	            }
    	        }
    	    }*/
    	});
    	
    };
    
    $scope.filldatatochart = function(){
    	
    	/*var DATES = ['x','Jan-2019','Feb-2019','Mar-2019','Apr-2019','May-2019','Jun-2019','Jul-2019','Aug-2019','Sep-2019','Oct-2019','Nov-2019','Dec-2019'];
    	var CHART_DATA_RECEIVED = ['LT1',100,122,145,323,11,34,434,544,322,232,111,434];
    	var CHART_DATA_RESOLVED = ['LT2',40,192,15,212,333,343,433,34,343,232,112,222];*/
    	
    	var dates_temp = $scope.BILLING_EFFICIENCY_DASHBOARD[0].dates.split(',');
    	var DATES = ['x'];
    	dates_temp.map(function(e,index){
    		DATES.push(e);
    	});
    	
    	console.log(DATES);
    	
    	$scope.BILLING_EFFICIENCY_DASHBOARD.map(function(e,index){
    		
    		var data_values = [e.trf];
    		var bill_eff_temp = e.billeff.split(',');
    		bill_eff_temp.map(function(e1,index1){
    			data_values.push(e1);
        	});
    		setTimeout(function () {
            	chart_dashboardlist.load({
        	        columns: [
        	        	DATES,data_values
        	        ]
        	    });
        	}, 200);
    		
    	});
        
       /* setTimeout(function () {
        	chart_dashboardlist.load({
    	        columns: [
    	        	DATES,CHART_DATA_RECEIVED
    	        ]
    	    });
    	}, 200);
        setTimeout(function () {
        	chart_dashboardlist.load({
    	        columns: [
    	        	DATES,CHART_DATA_RESOLVED
    	        ]
    	    });
    	}, 200);*/
    	
    	
    };
    
    $scope.createdashboardcards = function(){
    	
    	var search_location = "",zone="",circle="",division="",subdivision="",omsection="",station="",feeder="",transformer="",village="";
		if($scope.search.zone != undefined || $scope.search.zone != null){zone = $scope.search.zone.key; search_location = $scope.search.zone.ZONE_CODE;}
		if($scope.search.circle != undefined || $scope.search.circle != null){circle = $scope.search.circle.key; search_location = $scope.search.circle.CIRCLE_CODE;}
		if($scope.search.division != undefined || $scope.search.division != null){division = $scope.search.division.key; search_location = $scope.search.division.DIVISION_CODE;}
		if($scope.search.subdivision != undefined || $scope.search.subdivision != null){subdivision = $scope.search.subdivision.key; search_location = $scope.search.subdivision.LOCATION_CODES;}
		if($scope.search.omsection != undefined || $scope.search.omsection != null){omsection = $scope.search.omsection.key; search_location = $scope.search.omsection.key;}
		
    	var request = {
    			"Location_Code": $rootScope.user.location_code,
    			"Conn_Type": $rootScope.user.connection_type,
    			//"financial_year" : $scope.dmonthyear,
    			"financial_year" : 'Jun-2013',
    			"search_location" : search_location,
    			/*"displaywise":'TRF',*/
    			"displaywise":$scope.grouptype ,
    			"inputtype":'CARD'
			};
    	$scope.grouptypex
    	remote.load("dashboard_billingefficiency_comparision", function(response){
			console.log(response);
			
			$scope.BILL_EFF_CARDS = response.BILLING_EFFICIENCY_DASHBOARD;
			$scope.bill_eff_card_overall = response.BILLING_EFFICIENCY_DASHBOARD[0];
			
			$scope.fillpie_onclick_card($scope.bill_eff_card_overall.billed,$scope.bill_eff_card_overall.notbilled,$scope.bill_eff_card_overall.trf);
			
		}, request , 'POST', false, false, true);
    	
    };
    
    $scope.createmaindashboard = function(){
    	
    	var search_location = "",zone="",circle="",division="",subdivision="",omsection="",station="",feeder="",transformer="",village="";
		if($scope.search.zone != undefined || $scope.search.zone != null){zone = $scope.search.zone.key; search_location = $scope.search.zone.ZONE_CODE;}
		if($scope.search.circle != undefined || $scope.search.circle != null){circle = $scope.search.circle.key; search_location = $scope.search.circle.CIRCLE_CODE;}
		if($scope.search.division != undefined || $scope.search.division != null){division = $scope.search.division.key; search_location = $scope.search.division.DIVISION_CODE;}
		if($scope.search.subdivision != undefined || $scope.search.subdivision != null){subdivision = $scope.search.subdivision.key; search_location = $scope.search.subdivision.LOCATION_CODES;}
		if($scope.search.omsection != undefined || $scope.search.omsection != null){omsection = $scope.search.omsection.key; search_location = $scope.search.omsection.key;}
		
    	var request = {
    			"Location_Code": $rootScope.user.location_code,
    			"Conn_Type": $rootScope.user.connection_type,
    			"month_year" : 'Jun-2013' //$scope.dmonthyear,
			};

    	remote.load("maindashboard", function(response){
			console.log(response);
			
			$scope.maindashboard = response.MAINDASHBOARD[0];
			
			 var MAX_VLAUE = Math.max($scope.maindashboard.bill_eff, $scope.maindashboard.coll_eff);
			 $scope.create_guage_charts('guage1','Billing Efficiency',$scope.maindashboard.bill_eff,MAX_VLAUE);
			 $scope.create_guage_charts('guage2','Collection Efficiency',$scope.maindashboard.coll_eff,MAX_VLAUE);
			
			 $scope.draw_guage_chart($scope.maindashboard.bill_eff,$scope.maindashboard.coll_eff);
		}, request , 'POST', false, false, true);
    	
    };
    
    $scope.create_guage_charts = function(id,key,value,MAX_VLAUE){
    	
		c3.generate({
			bindto: '#'+id,
		    data: {
		        columns: [
		            [key, value]
		        ],
		        type: 'gauge',
		        onclick: function (d, i) { console.log("onclick", d, i); },
		        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
		        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
		    },
		    gauge: {
//		        label: {
//		            format: function(value, ratio) {
//		                return value;
//		            },
//		            show: false // to turn off the min/max labels.
//		        },
		    min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
		    max:  Math.ceil(MAX_VLAUE / 10) * 10,
//		    max: (value > 100 ? Math.ceil(value / 10) * 10 : 100),
//		    max: 100, // 100 is default
//		    units: ' %',
//		    width: 39 // for adjusting arc thickness
		    },
		    color: {
		        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
		        threshold: {
//		            unit: 'value', // percentage is default
//		            max: 200, // 100 is default
		            values: [30, 60, 90, 100]
		        }
		    }/*,
		    size: {
		        height: 180
		    }*/
		});
		
		
		//Math.ceil(MAX_RANGE / 10) * 10;
    	
    };
    
    $scope.fillpie_onclick_card = function(billed_cnt,notbilled_cnt,heading){
		
    	$scope.bill_pie_chart_heading = heading+" Efficiency";
    	billeff_piechart.load({
	        columns: [
	            ['Billed', billed_cnt],
	            ['Not Billed', notbilled_cnt]
	        ]
	    });
		
	};
    
    $scope.refreshchart_tab2 = function(){
    	
    	
    	
    	setTimeout(function () {
    		var chart1 = c3.generate({
        	    bindto: '#chart1',
        	    data: {
        	      columns: [
        	        ['data1', 30, 200, 100, 400, 150, 250],
        	        ['data2', 50, 20, 10, 40, 15, 25]
        	      ]
        	    }
        	});
    	}, 200);
    	
    	var chart2 = c3.generate({
    		bindto: '#chart2',
    	    data: {
    	        columns: [
    	            ['data1', -30, 200, 200, 400, -150, 250],
    	            ['data2', 130, 100, -100, 200, -150, 50],
    	            ['data3', -230, 200, 200, -300, 250, 250]
    	        ],
    	        type: 'bar',
    	        groups: [
    	            ['data1', 'data2']
    	        ]
    	    },
    	    grid: {
    	        y: {
    	            lines: [{value:0}]
    	        }
    	    }
    	});

    	setTimeout(function () {
    	    chart2.groups([['data1', 'data2', 'data3']])
    	}, 1000);

    	setTimeout(function () {
    	    chart2.load({
    	        columns: [['data4', 100, -50, 150, 200, -300, -100]]
    	    });
    	}, 1500);

    	setTimeout(function () {
    	    chart2.groups([['data1', 'data2', 'data3', 'data4']])
    	}, 2000);
    	
    };
    
    $scope.refreshchart_tab3 = function(){
    	
    	setTimeout(function () {
    	
    	var chart3 = c3.generate({
    		bindto: '#chart3',
    	    data: {
    	        // iris data from R
    	        columns: [
    	            ['data1', 30],
    	            ['data2', 120],
    	        ],
    	        type : 'pie',
    	        onclick: function (d, i) { console.log("onclick", d, i); },
    	        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
    	        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
    	    }
    	});

    	setTimeout(function () {
    	    chart3.load({
    	        columns: [
    	            ["Tariff-1", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
    	            ["Tariff-2", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
    	            ["Tariff-3", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
    	        ]
    	    });
    	}, 1500);

    	setTimeout(function () {
    	    chart3.unload({
    	        ids: 'data1'
    	    });
    	    chart3.unload({
    	        ids: 'data2'
    	    });
    	}, 2500);
    	
    	var chart4 = c3.generate({
    		bindto: '#chart4',
    	    data: {
    	        columns: [
    	            ['data1', 30, 200, 100, 400, 150, 250],
    	            ['data2', 130, 100, 140, 200, 150, 50]
    	        ],
    	        type: 'bar'
    	    }
    	});

    	setTimeout(function () {
    	    chart4.load({
    	        columns: [
    	            ['data3', 130, -150, 200, 300, -200, 100]
    	        ]
    	    });
    	}, 1000);
    	
    	}, 200);
    	
    };
    
    setTimeout(function () {
    	$scope.refreshchart_tab1('TRF');
    }, 500);
    
    $scope.activaTab = function(tab){
    	console.log(tab);
    	  $('.nav-tabs a[href="#' + tab + '"]').tab('show');
    	  if(tab === 'bill_eff_tab'){
    		  $scope.refreshchart_tab1();
    	  }else if(tab === 'coll_eff_tab'){
    		  $scope.refreshchart_tab2();
    	  }
    	};
    	
    	
    	
    	am4core.ready(function() {

    		// Themes begin
    		am4core.useTheme(am4themes_animated);
    		// Themes end




    		}); // end am4core.ready()
    	
    	
    	$scope.draw_guage_chart = function(bill_eff_value,coll_eff_value){
    		
    		
    		// create chart
    		var chart = am4core.create("chartdiv", am4charts.GaugeChart);
    		chart.hiddenState.properties.opacity = 0;

    		var axis = chart.xAxes.push(new am4charts.ValueAxis());
    		axis.min = 0;
    		axis.max = 200;
    		axis.strictMinMax = true;
    		axis.renderer.inside = true;
    		//axis.renderer.ticks.template.inside = true;
    		//axis.stroke = chart.colors.getIndex(3);
    		axis.renderer.radius = am4core.percent(97);
    		//axis.renderer.radius = 80;
    		axis.renderer.line.strokeOpacity = 1;
    		axis.renderer.line.strokeWidth = 5;
    		axis.renderer.line.stroke = chart.colors.getIndex(0);
    		axis.renderer.ticks.template.stroke = chart.colors.getIndex(0);
    		axis.renderer.labels.template.radius = 35;
    		axis.renderer.ticks.template.strokeOpacity = 1;
    		axis.renderer.grid.template.disabled = true;
    		axis.renderer.ticks.template.length = 10;
    		axis.hiddenState.properties.opacity = 1;
    		axis.hiddenState.properties.visible = true;
    		axis.setStateOnChildren = true;
    		axis.renderer.hiddenState.properties.endAngle = 180;

    		var axis2 = chart.xAxes.push(new am4charts.ValueAxis());
    		axis2.min = 0;
    		axis2.max = 200;
    		axis2.strictMinMax = true;

    		axis2.renderer.line.strokeOpacity = 1;
    		axis2.renderer.line.strokeWidth = 5;
    		axis2.renderer.line.stroke = chart.colors.getIndex(15);
    		axis2.renderer.ticks.template.stroke = chart.colors.getIndex(15);

    		axis2.renderer.ticks.template.strokeOpacity = 1;
    		axis2.renderer.grid.template.disabled = true;
    		axis2.renderer.ticks.template.length = 10;
    		axis2.hiddenState.properties.opacity = 1;
    		axis2.hiddenState.properties.visible = true;
    		axis2.setStateOnChildren = true;
    		axis2.renderer.hiddenState.properties.endAngle = 180;

    		var hand = chart.hands.push(new am4charts.ClockHand());
    		hand.fill = axis.renderer.line.stroke;
    		hand.stroke = axis.renderer.line.stroke;
    		hand.axis = axis;
    		hand.pin.radius = 14;
    		hand.startWidth = 10;
    		

    		var hand2 = chart.hands.push(new am4charts.ClockHand());
    		hand2.fill = axis2.renderer.line.stroke;
    		hand2.stroke = axis2.renderer.line.stroke;
    		hand2.axis = axis2;
    		hand2.pin.radius = 10;
    		hand2.startWidth = 10;
    		

/*    		setInterval(() => {
    		  hand.showValue(Math.random() * 160, 1000, am4core.ease.cubicOut);
    		  label.text = Math.round(hand.value).toString();
    		  hand2.showValue(Math.random() * 160, 1000, am4core.ease.cubicOut);
    		  label2.text = Math.round(hand2.value).toString();
    		}, 2000);*/
    		
    		console.log(bill_eff_value,coll_eff_value);
    		
    		setInterval(() => {
    			hand.showValue(parseInt(bill_eff_value), am4core.ease.cubicOut);
    			label.text = bill_eff_value+' %';
    			hand2.showValue(parseInt(coll_eff_value), am4core.ease.cubicOut);
    			 label2.text = coll_eff_value+' %';
    		},1000);

    		var legend = new am4charts.Legend();
    		legend.isMeasured = false;
    		legend.y = am4core.percent(100);
    		legend.verticalCenter = "bottom";
    		legend.parent = chart.chartContainer;
    		legend.data = [{
    		  "name": "Billing Efficiency",
    		  "fill": chart.colors.getIndex(0)
    		}, {
    		  "name": "Collection Efficiency",
    		  "fill": chart.colors.getIndex(15)
    		}];

    		legend.itemContainers.template.events.on("hit", function(ev) {
    		  var index = ev.target.dataItem.index;

    		  if (!ev.target.isActive) {
    		    chart.hands.getIndex(index).hide();
    		    chart.xAxes.getIndex(index).hide();
    		    labelList.getIndex(index).hide();
    		  }
    		  else {
    		    chart.hands.getIndex(index).show();
    		    chart.xAxes.getIndex(index).show();
    		    labelList.getIndex(index).show();
    		  }
    		});

    		var labelList = new am4core.ListTemplate(new am4core.Label());
    		labelList.template.isMeasured = false;
    		labelList.template.background.strokeWidth = 2;
    		labelList.template.fontSize = 25;
    		labelList.template.padding(10, 20, 10, 20);
    		labelList.template.y = am4core.percent(50);
    		labelList.template.horizontalCenter = "middle";

    		var label = labelList.create();
    		label.parent = chart.chartContainer;
    		label.x = am4core.percent(40);
    		label.background.stroke = chart.colors.getIndex(0);
    		label.fill = chart.colors.getIndex(0);
    		label.text = "0";

    		var label2 = labelList.create();
    		label2.parent = chart.chartContainer;
    		label2.x = am4core.percent(60);
    		label2.background.stroke = chart.colors.getIndex(15);
    		label2.fill = chart.colors.getIndex(15);
    		label2.text = "0";
    		
    	}
    	
});