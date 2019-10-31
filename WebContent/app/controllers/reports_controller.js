/**
 * 
 */

var report_controller = angular.module('report_controller',[]);

report_controller.controller('report_controller',['$scope','$rootScope','remote','$timeout','$compile','$uibModal','notify','$filter','webValidations','$http','$window',
	function($scope,$rootScope,remote,$timeout,$compile,$uibModal,notify,$filter,webValidations,$http,$window){
	
	console.log("report controller initiated...");
	
	var report_flow = $rootScope.breadcrumb[$rootScope.breadcrumb.length-1];
	console.log("report_flow",""+report_flow);
	
	if(report_flow === 'billing_efficiency' ){
		
		$scope.billeff = {};
		
/*		$scope.get_meter_reader_info = function(){
			var request = {
				"om_code": $rootScope.user.location_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReaderCodesByOMUnit", function(response){
				$scope.MeterReaderCode = response.MeterReaderCode;
			}, request , 'POST');
		}*/
		
		$scope.get_tarifflist = function(){
		var request = {
				"Conn_Type": $rootScope.user.connection_type,
				"Location_Code": $rootScope.user.location_code 
			}
			remote.load("getConsumerMasterPickListValues", function(response){
				$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
			}, request , 'POST', false, false, true);
		
		request = {
				"Conn_Type": $rootScope.user.connection_type,
				"Location_Code": $rootScope.user.location_code
			}
		remote.load("getomunitlist", function(response){
			$scope.om_list = response.OM_LIST;
		}, request , 'POST', false, false, true);
		
		request = {
				"conn_type": $rootScope.user.connection_type,
				"location_code": $rootScope.user.location_code
			}
		remote.load("getmrcodelist", function(response){
			$scope.meter_code_list = response.MeterReaderCode;
		}, request , 'POST', false, false, true);
		};	
		
		//$scope.get_meter_reader_info();
		$scope.get_tarifflist();
		
		$scope.manageui = function(){
			
			if($scope.reporttype_selected === 'reading_day_wise'){
				$scope.disable_mrcode =  true;
				$scope.disable_tariffcode = true;
				$scope.datewise_checked = false;
				$scope.monthwise_checked = false;
			}else if($scope.billeff.reporttype === 'mr_tariff_wise'){
				$scope.disable_mrcode =  false;
				$scope.disable_tariffcode = false;
				$scope.datewise_checked = false;
				$scope.monthwise_checked = false;
			}else if($scope.billeff.reporttype === 'om_wise'){
				$scope.disable_mrcode =  true;
				$scope.disable_tariffcode = true;
				$scope.datewise_checked = false;
				$scope.monthwise_checked = true;
			}else if($scope.billeff.reporttype === 'tariff_wise'){
				$scope.disable_mrcode =  true;
				$scope.disable_tariffcode = true;
				$scope.datewise_checked = false;
				$scope.monthwise_checked = true;
				
			}else if($scope.billeff.reporttype === 'mr_wise'){
				$scope.disable_mrcode =  true;
				$scope.disable_tariffcode = true;
				$scope.datewise_checked = false;
				$scope.monthwise_checked = true;
			}
			
		};
		
		$scope.reporttype_selected = 'billing_efficiency';
		$scope.reportwise_selected = 'subtariffwise';
		$scope.dateoption_selected = 'datewise';
		$scope.billingefficiency = null;
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		
		$scope.change_ui = function(){
			
			$scope.billingefficiency = null;
			
			if($scope.reportwise_selected === 'tariffwise'){
				$scope.disable_mrcode =  true;
				$scope.disable_omsection =  true;
				$scope.show_tariff = true;
			}else if($scope.reportwise_selected === 'subtariffwise'){
				$scope.disable_mrcode =  true;
				$scope.disable_omsection =  true;
				$scope.show_tariff = true;
			}else if($scope.reportwise_selected === 'omwise'){
				$scope.disable_mrcode =  true;
				$scope.disable_omsection =  false;
				$scope.show_tariff = false;
			}else if($scope.reportwise_selected === 'meterreaderwise' ){
				$scope.disable_mrcode =  false;
				$scope.disable_omsection =  true;
				$scope.show_tariff = false;
			}else if($scope.reportwise_selected === 'daywise'){
				$scope.disable_mrcode =  true;
				$scope.disable_omsection =  true;
				$scope.show_tariff = false;
			}
		};
		
		$scope.change_ui();
		
		
		
		$scope.genereatereport = function(){
			console.log("genereatereport");
			
			
			
			console.log($scope.billeff.reporttype);
			console.log($scope.billeff.dateoption);
			
			
		};
	}
	
	if(report_flow === 'reports' ){
		
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
		
		
		$scope.get_meter_reader_info = function(){
			var request = {
				"om_code": $rootScope.user.location_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReaderCodesByOMUnit", function(response){
				$scope.MeterReaderCode = response.MeterReaderCode;
			}, request , 'POST');
		}
		
		$scope.get_tarifflist = function(){
		var request = {
				"Conn_Type": $rootScope.user.connection_type,
				"Location_Code": $rootScope.user.location_code 
			}
			remote.load("getConsumerMasterPickListValues", function(response){
				$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
			}, request , 'POST', false, false, true);
		};	
		
		
		$scope.initialize();
		$scope.get_meter_reader_info();
		$scope.get_tarifflist();
		
		$scope.dfromdate  = '';
		$scope.dtodate    = '';
		
		//$scope.dfromdate  = moment(new Date()).format("DD/MM/YYYY").toString();
		//$scope.dtodate    = moment(new Date()).format("DD/MM/YYYY").toString();
		//$scope.dmonthyear = moment(new Date()).format("MMM-YYYY").toString();
		
		$scope.set_selected_report_type = function(value){
			$scope.selected_report_type = value;
			 $('#contentLeft').hide();
		};
		
		$scope.set_selected_report_type("billing_efficiency");
		
		$scope.REPORT_DATA = null;
		$scope.report_heading = null;
		
		$scope.genereatereport = function(exportpdf){
			
			
			var search_location = "",search_location_name = "",zone="",circle="",division="",subdivision="",omsection="",station="",feeder="",transformer="",village="";
			if($scope.search.zone != undefined || $scope.search.zone != null){zone = $scope.search.zone.key; search_location = $scope.search.zone.ZONE_CODE;search_location_name = $scope.search.zone.ZONE_CODE;}
			if($scope.search.circle != undefined || $scope.search.circle != null){circle = $scope.search.circle.key; search_location = $scope.search.circle.CIRCLE_CODE;search_location_name = $scope.search.circle.CIRCLE_NAME;}
			if($scope.search.division != undefined || $scope.search.division != null){division = $scope.search.division.key; search_location = $scope.search.division.DIVISION_CODE;search_location_name = $scope.search.division.DIVISION_NAME;}
			if($scope.search.subdivision != undefined || $scope.search.subdivision != null){subdivision = $scope.search.subdivision.key; search_location = $scope.search.subdivision.LOCATION_CODES;search_location_name = $scope.search.subdivision.LOCATION_NAME;}
			if($scope.search.omsection != undefined || $scope.search.omsection != null){omsection = $scope.search.omsection.key; search_location = $scope.search.omsection.key;search_location_name = $scope.search.omsection.value;}
			
			if($scope.selected_report_type === 'billing_efficiency'){
				
				if($scope.dfromdate === null || $scope.dfromdate === undefined ){
					notify.warn("Please select from date");
					return;
				}
				
				
				if($scope.dtodate === null || $scope.dtodate === undefined ){
					notify.warn("Please select to date");
					return;
				}
				
				var $selected_tariffs = $('#reports').find('.tariffs').find('.tariff-selection').find('.selected');
				console.log($selected_tariffs);
				var request_tariffs ='';
				$selected_tariffs.each(function(key, tariff){
					//request_tariffs.push("'"+$(tariff).attr('param')+"'");
					request_tariffs = request_tariffs + "'"+$(tariff).attr('param')+"'" +"," ;
				});
				
				if(request_tariffs.length > 1){
					request_tariffs = request_tariffs.substr(0,request_tariffs.length-1);
				}
				
				var request = {
						"conn_type": $rootScope.user.connection_type,
						"Location_Code": $rootScope.user.location_code,
						"report_wise": 'SUBTRF',
						"selected_location":search_location,
						"metercode": ($scope.search.metercode != null || $scope.search.metercode != undefined ? $scope.search.metercode : '') ,
						"tariffcodes":request_tariffs,
						"fromdate": (($scope.dfromdate != null || $scope.dfromdate != undefined )? $scope.dfromdate : '') ,
						"todate":  (($scope.dtodate != null || $scope.dtodate != undefined) ? $scope.dtodate : '') ,
						"header": false
					}
				
				console.log("request",request);
				
				if(exportpdf){
					
					$('#loading').show();
					$http.get($rootScope.serviceURL+'downloadreport?conn_type='+$rootScope.user.connection_type
							+"&Location_Code="+$rootScope.user.location_code
							+"&report_wise=SUBTRF"
							+"&selected_location="+search_location
							+"&search_location_name="+search_location_name
							+"&metercode="+($scope.search.metercode != null || $scope.search.metercode != undefined ? $scope.search.metercode : '')
							+"&tariffcodes="+request_tariffs
							+"&fromdate="+(($scope.dfromdate != null || $scope.dfromdate != undefined )? $scope.dfromdate : '') 
							+"&todate="+ (($scope.dtodate != null || $scope.dtodate != undefined) ? $scope.dtodate : '')
							+"&header=false"
							+"&username="+$rootScope.user.user_id
							+"&report_type=BILLING_EFF"
							,{ responseType : 'arraybuffer'}).then(handleResponse)
					
					
				}else{
					remote.load("generateBillingEfficiency", function(response){
						console.log(response);
						
						var data = response.BILLING_EFFICIENCY;
						$scope.BILLING_EFFICIENCY = response.BILLING_EFFICIENCY;
						$scope.REPORT_DATA = response.BILLING_EFFICIENCY;
						$('.collapse').collapse("hide");
						
						$scope.report_heading = "Billing Efficiency for "+search_location_name+" for the date "+$scope.dfromdate + " to "+ $scope.dtodate;
						
					}, request , 'POST', false, false, true);
				}
			}else if ($scope.selected_report_type === 'collection_efficiency'){
				
				if($scope.dfromdate === null || $scope.dfromdate === undefined ){
					notify.warn("Please select from date");
					return;
				}
				
				
				if($scope.dtodate === null || $scope.dtodate === undefined ){
					notify.warn("Please select to date");
					return;
				}
				
				var $selected_tariffs = $('#reports').find('.tariffs').find('.tariff-selection').find('.selected');
				console.log($selected_tariffs);
				var request_tariffs ='';
				$selected_tariffs.each(function(key, tariff){
					//request_tariffs.push("'"+$(tariff).attr('param')+"'");
					request_tariffs = request_tariffs + "'"+$(tariff).attr('param')+"'" +"," ;
				});
				
				if(request_tariffs.length > 1){
					request_tariffs = request_tariffs.substr(0,request_tariffs.length-1);
				}
				
				var request = {
						"conn_type": $rootScope.user.connection_type,
						"Location_Code": $rootScope.user.location_code,
						"report_type":'TRF',
						"selected_location":search_location,
						"metercode": ($scope.search.metercode != null || $scope.search.metercode != undefined ? $scope.search.metercode : '') ,
						"tariffcodes":request_tariffs,
						"fromdate": (($scope.dfromdate != null || $scope.dfromdate != undefined )? $scope.dfromdate : '') ,
						"todate":  (($scope.dtodate != null || $scope.dtodate != undefined) ? $scope.dtodate : '') ,
						"header": false
					}
				
				console.log("request",request);
				
				if(exportpdf){
					
					$('#loading').show();
					$http.get($rootScope.serviceURL+'downloadreport?conn_type='+$rootScope.user.connection_type
							+"&Location_Code="+$rootScope.user.location_code
							+"&report_type=TRF"
							+"&selected_location="+search_location
							+"&search_location_name="+search_location_name
							+"&metercode="+($scope.search.metercode != null || $scope.search.metercode != undefined ? $scope.search.metercode : '')
							+"&tariffcodes="+request_tariffs
							+"&fromdate="+(($scope.dfromdate != null || $scope.dfromdate != undefined )? $scope.dfromdate : '') 
							+"&todate="+ (($scope.dtodate != null || $scope.dtodate != undefined) ? $scope.dtodate : '')
							+"&header=false"
							+"&username="+$rootScope.user.user_id
							+"&report_type=COLLECTION_EFF"
							,{ responseType : 'arraybuffer'}).then(handleResponse)
					
					
				}else{
					remote.load("generateCollectionEfficiency", function(response){
						console.log(response);
						
						var data = response.COLLECTION_EFFICIENCY;
						$scope.COLLECTION_EFFICIENCY = response.COLLECTION_EFFICIENCY;
						$scope.REPORT_DATA = response.COLLECTION_EFFICIENCY;
						$('.collapse').collapse("hide");
						
						$scope.report_heading = "Collection Efficiency for "+search_location_name+" for the date "+$scope.dfromdate + " to "+ $scope.dtodate;
						
					}, request , 'POST', false, false, true);
				}
			}else if ($scope.selected_report_type === 'payment_purpose_wise'){
				
				if($scope.dfromdate === null || $scope.dfromdate === undefined ){
					notify.warn("Please select from date");
					return;
				}
				
				
				if($scope.dtodate === null || $scope.dtodate === undefined ){
					notify.warn("Please select to date");
					return;
				}
				
				var $selected_tariffs = $('#reports').find('.tariffs').find('.tariff-selection').find('.selected');
				console.log($selected_tariffs);
				var request_tariffs ='';
				$selected_tariffs.each(function(key, tariff){
					//request_tariffs.push("'"+$(tariff).attr('param')+"'");
					request_tariffs = request_tariffs + "'"+$(tariff).attr('param')+"'" +"," ;
				});
				
				if(request_tariffs.length > 1){
					request_tariffs = request_tariffs.substr(0,request_tariffs.length-1);
				}
				
				var request = {
						"conn_type": $rootScope.user.connection_type,
						"Location_Code": $rootScope.user.location_code,
						"selected_location":search_location,
						"cashcounternumber":'',
						"fromdate": (($scope.dfromdate != null || $scope.dfromdate != undefined )? $scope.dfromdate : '') ,
						"todate":  (($scope.dtodate != null || $scope.dtodate != undefined) ? $scope.dtodate : '') ,
						"header": true
					}
				
				console.log("request",request);
				
				if(exportpdf){
					
					$('#loading').show();
					$http.get($rootScope.serviceURL+'downloadreport?conn_type='+$rootScope.user.connection_type
							+"&Location_Code="+$rootScope.user.location_code
							+"&selected_location="+search_location
							+"&search_location_name="+search_location_name
							+"&cashcounternumber="
							+"&fromdate="+(($scope.dfromdate != null || $scope.dfromdate != undefined )? $scope.dfromdate : '') 
							+"&todate="+ (($scope.dtodate != null || $scope.dtodate != undefined) ? $scope.dtodate : '')
							+"&header=false"
							+"&username="+$rootScope.user.user_id
							+"&report_type=PAYMENT_PURPOSE_WISE"
							,{ responseType : 'arraybuffer'}).then(handleResponse)
					
					
				}else{
					remote.load("getPaymentPurposewiseReport", function(response){
						console.log(response);
						
						var data = response.PURPOSEWISE;
						$scope.PURPOSEWISE = response.PURPOSEWISE;
						$scope.REPORT_DATA = response.PURPOSEWISE;
						$('.collapse').collapse("hide");
						
						$scope.report_heading = "Payment Purpose Wise for "+search_location_name+" for the date "+$scope.dfromdate + " to "+ $scope.dtodate;
						
					}, request , 'POST', false, false, true);
				}
			}else if($scope.selected_report_type === 'main_dcb'){
				
/*				if($scope.dfromdate === null || $scope.dfromdate === undefined ){
					notify.warn("Please select from date");
					return;
				}
				
				
				if($scope.dtodate === null || $scope.dtodate === undefined ){
					notify.warn("Please select to date");
					return;
				}*/
				
				if($scope.dmonthyear === null || $scope.dmonthyear === undefined ){
					notify.warn("Please select Month year");
					return;
				}
				
				var $selected_tariffs = $('#reports').find('.tariffs').find('.tariff-selection').find('.selected');
				console.log($selected_tariffs);
				var request_tariffs ='';
				$selected_tariffs.each(function(key, tariff){
					//request_tariffs.push("'"+$(tariff).attr('param')+"'");
					request_tariffs = request_tariffs + "'"+$(tariff).attr('param')+"'" +"," ;
				});
				
				if(request_tariffs.length > 1){
					request_tariffs = request_tariffs.substr(0,request_tariffs.length-1);
				}
				
				var request = {
						"conn_type": $rootScope.user.connection_type,
						"report_type":'MAIN_DCB',
						"Location_Code": $rootScope.user.location_code,
						"selected_location":search_location,
						"month_year": (($scope.dmonthyear != null || $scope.dmonthyear != undefined )? $scope.dmonthyear : '') ,
						"tariffcodes":request_tariffs,
						"station_code": '',
						"feeder_code":'',
						"transformer_code":'',
						"metercode": ($scope.search.metercode != null || $scope.search.metercode != undefined ? $scope.search.metercode : '') ,
						"gps":'',
						"header": true
					}
				
				console.log("request",request);
				
				if(exportpdf){
					
					$('#loading').show();
					$http.get($rootScope.serviceURL+'downloadreport?conn_type='+$rootScope.user.connection_type
							+"&report_type=MAIN_DCB"
							+"&Location_Code="+$rootScope.user.location_code
							+"&selected_location="+search_location
							+"&search_location_name="+search_location_name
							+"&month_year="+ (($scope.dmonthyear != null || $scope.dmonthyear != undefined )? $scope.dmonthyear : '')
							+"&tariffcodes="+request_tariffs
							+"&station_code="+''
							+"&feeder_code="+''
							+"&transformer_code="+''
							+"&metercode="+($scope.search.metercode != null || $scope.search.metercode != undefined ? $scope.search.metercode : '')
							+"&gps="+''
							+"&header=false"
							+"&username="+$rootScope.user.user_id
							
							,{ responseType : 'arraybuffer'}).then(handleResponse)
					
					
				}else{
					remote.load("getdcb", function(response){
						console.log(response);
						
						var data = response.DCBDATA;
						$scope.DCBDATA = response.DCBDATA;
						$scope.REPORT_DATA = response.DCBDATA;
						
						$('.collapse').collapse("hide");
						
						$scope.report_heading = "DCB for "+search_location_name+" for the month "+$scope.dmonthyear;
						
					}, request , 'POST', false, false, true);
				}
			}else if($scope.selected_report_type === 'sbd_mr_wise'){
				
				if($scope.dfromdate === null || $scope.dfromdate === undefined ){
					notify.warn("Please select from date");
					return;
				}
				
				
				if($scope.dtodate === null || $scope.dtodate === undefined ){
					notify.warn("Please select to date");
					return;
				}
				
				/*if($scope.dmonthyear === null || $scope.dmonthyear === undefined ){
					notify.warn("Please select Month year");
					return;
				}*/
				
				var $selected_tariffs = $('#reports').find('.tariffs').find('.tariff-selection').find('.selected');
				console.log($selected_tariffs);
				var request_tariffs ='';
				$selected_tariffs.each(function(key, tariff){
					//request_tariffs.push("'"+$(tariff).attr('param')+"'");
					request_tariffs = request_tariffs + "'"+$(tariff).attr('param')+"'" +"," ;
				});
				
				if(request_tariffs.length > 1){
					request_tariffs = request_tariffs.substr(0,request_tariffs.length-1);
				}
				
				var request = {
						"conn_type": $rootScope.user.connection_type,
						"report_type":'MR',
						"Location_Code": $rootScope.user.location_code,
						"selected_location":search_location,
						"metercode": ($scope.search.metercode != null || $scope.search.metercode != undefined ? $scope.search.metercode : '') ,
						"tariffcodes":request_tariffs,
						"fromdate":(($scope.dfromdate != null || $scope.dfromdate != undefined )? $scope.dfromdate : ''), 
						"todate": (($scope.dtodate != null || $scope.dtodate != undefined) ? $scope.dtodate : ''),
						"header": true
					}
				
				console.log("request",request);
				
				if(exportpdf){
					
					$('#loading').show();
					$http.get($rootScope.serviceURL+'downloadreport?conn_type='+$rootScope.user.connection_type
							+"&report_type=MR"
							+"&Location_Code="+$rootScope.user.location_code
							+"&selected_location="+search_location
							+"&search_location_name="+search_location_name
							+"&metercode="+($scope.search.metercode != null || $scope.search.metercode != undefined ? $scope.search.metercode : '')
							+"&tariffcodes="+request_tariffs
							+"&fromdate="+(($scope.dfromdate != null || $scope.dfromdate != undefined )? $scope.dfromdate : '') 
							+"&todate="+ (($scope.dtodate != null || $scope.dtodate != undefined) ? $scope.dtodate : '')
							+"&header=false"
							+"&username="+$rootScope.user.user_id
							
							,{ responseType : 'arraybuffer'}).then(handleResponse)
					
					
				}else{
					remote.load("getsbdreports", function(response){
						console.log(response);
						
						var data = response.SBDDATA;
						$scope.SBDDATA = response.SBDDATA;
						$scope.REPORT_DATA = response.SBDDATA;
						$('.collapse').collapse("hide");
						
					}, request , 'POST', false, false, true);
				}
			}
			
			
			
		};
		
        $scope.exporttoexcel = function(tableid,filename){
        	saveAsExcel(''+tableid, filename+'.xls');
      };
      
      function handleResponse(response){
	       	var pdfFile = new Blob([response.data], { type : 'application/pdf' });	
	       	var downloadURL = URL.createObjectURL(pdfFile);
	       	$('#loading').hide();
	       		$window.open(downloadURL);
	     	  };
	}
	
	if(report_flow === 'others_reports' ){
		
		$scope.others = {};
		
		$scope.others_dmd_consmp_selected = 'demand';
		$scope.others_selected = 'indetail';
		$scope.others_load_selected = 'loadhp';
		$scope.others_dateoption_selected = 'datewise';
		
		$scope.get_other_reports = function(){
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
			};
			remote.load("getotherreportstypelist", function(response){
				$scope.others_reports_list = response.OTHER_REPORT_LIST;
			}, request , 'POST', false, false, true);
			
			remote.load("getrebatetypelist", function(response){
				$scope.others_rebatecode_list = response.RebateList;
			}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.others_om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
		};
		
		$scope.get_meter_reader_info = function(){
			var request = {
				"om_code": $scope.others.omsection.key || $rootScope.user.location_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReaderCodesByOMUnit", function(response){
				$scope.others_MeterReaderCode = response.MeterReaderCode;
			}, request , 'POST');
		};
		$scope.get_meter_reading_day_list = function(){
			var request = {
				"mr_code": $scope.others.metercode.key,
				"om_code": $scope.others.omsection.key || $rootScope.user.location_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReadingDayByMrCode", function(response){
				$scope.others_MeterReadingDay = response.MeterReadingDay;
			}, request , 'POST');
		};
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			};	
			$scope.get_consumerstatuslist = function(){
				var request = {
						"conn_type": $rootScope.user.connection_type
					}
					remote.load("getcustomerstatuslist", function(response){
						$scope.customer_status_list = response.CUSTOMER_STATUS_LIST;
					}, request , 'POST', false, false, true);
				};	
		$scope.get_other_reports();
		$scope.get_tarifflist();
		$scope.get_consumerstatuslist();
		
		$scope.row_1 = true;
		$scope.row_2 = true;
		$scope.row_3 = true;
		$scope.row_4 = true;
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.date_value_1 = false;
		$scope.date_value_2 = false;
		$scope.date_value_3 = false;
		$scope.no_of_months = true;
		$scope.rrnumber = true;
		$scope.rrnumber_exclude = true;
		$scope.div_customerstatus_selection = true;
		$scope.div_tariff_selection = true;
		$scope.omsection_disable = false;
		$scope.radio_indetail = false;
		$scope.radio_inabstract = false;
		$scope.mrcode_disable = false;
		$scope.radio_indetail_show = true;
		$scope.radio_inabstract_show = true;
		
		$scope.clear_form = function(){
			
			$scope.others = null;
			$scope.dateoption_selected = 'datewise';
			$scope.adjustment_reporttype_selected = 'indetail';
			
			$scope.get_other_reports();
			$scope.get_tarifflist();
			$scope.get_consumerstatuslist();
			
			$scope.row_1 = true;
			$scope.row_2 = true;
			$scope.row_3 = true;
			$scope.row_4 = true;
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.date_value_1 = false;
			$scope.date_value_2 = false;
			$scope.date_value_3 = false;
			$scope.no_of_months = true;
			$scope.rrnumber = true;
			$scope.rrnumber_exclude = true;
			$scope.div_customerstatus_selection = true;
			$scope.div_tariff_selection = true;
			$scope.omsection_disable = false;
			$scope.radio_indetail = false;
			$scope.radio_inabstract = false;
			$scope.mrcode_disable = false;
			$scope.radio_indetail_show = true;
			$scope.radio_inabstract_show = true;
		};
		
		$scope.change_ui = function(){
			
			$scope.row_1 = true;
			$scope.row_2 = true;
			$scope.row_3 = true;
			$scope.row_4 = true;
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.date_value_1 = false;
			$scope.date_value_2 = false;
			$scope.date_value_3 = false;
			$scope.no_of_months = true;
			$scope.rrnumber = true;
			$scope.rrnumber_exclude = true;
			$scope.div_customerstatus_selection = true;
			$scope.div_tariff_selection = true;
			
			$scope.mrcode_disable = false;
			$scope.meterreadingday_disable = false;
			$scope.omsection_disable = false;
			$scope.radio_indetail_show = true;
			$scope.radio_inabstract_show = true;
			
			$scope.others_dateoption_selected = "";
			$scope.others_selected = "";
			$scope.others_load_selected = "";
			$scope.others_dmd_consmp_selected = "";
			
			if($scope.others.report_type.key === '1' || 
					$scope.others.report_type.key === '9' || 
						$scope.others.report_type.key === '8' || 
							$scope.others.report_type.key === '10' || 
								$scope.others.report_type.key === '11'){
				
				$scope.row_1 = false;
				$scope.row_2 = false;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = false;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.rrnumber_exclude = false;
				
				if($scope.others.report_type.key === '1'){
					$scope.date_1 = true;
					$scope.date_2 = false;
					$scope.date_3 = false;
					$scope.date_value_1 = false;
					$scope.date_value_2 = true;
					$scope.date_value_3 = true;
					$scope.no_of_months = true;
					$scope.rrnumber = true;
					$scope.rrnumber_exclude = false;
					$scope.others_dateoption_selected = 'datewise';
				}
				else if($scope.others.report_type.key === '8'){
					$scope.no_of_months = false;
					$scope.rrnumber = false;
					$scope.others_dateoption_selected = 'daterangewise';
				}
				else if($scope.others.report_type.key === '9'){
					$scope.date_1 = true;
					$scope.date_2 = true;
					$scope.date_3 = true;
					$scope.date_value_1 = false;
					$scope.date_value_2 = false;
					$scope.date_value_3 = false;
					$scope.others_dateoption_selected = 'datewise';
					$scope.no_of_months = false;
					$scope.rrnumber = false;
					$scope.rrnumber_exclude = false;
				}
				else if($scope.others.report_type.key === '10'){
					$scope.date_1 = true;
					$scope.date_2 = false;
					$scope.date_3 = false;
					$scope.date_value_1 = false;
					$scope.date_value_2 = true;
					$scope.date_value_3 = true;
					$scope.others_dateoption_selected = 'datewise';
					$scope.no_of_months = false;
					$scope.rrnumber = false;
					$scope.rrnumber_exclude = false;
				}
				else if($scope.others.report_type.key === '11'){
					$scope.no_of_months = false;
					$scope.rrnumber = true;
					$scope.date_1 = true;
					$scope.date_2 = true;
					$scope.date_3 = true;
					$scope.date_value_1 = false;
					$scope.date_value_2 = false;
					$scope.date_value_3 = false;
					$scope.others_dateoption_selected = 'datewise';
				}else{
					$scope.rrnumber = false;
				}
				
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = false;
			}
			else if($scope.others.report_type.key === '2'){
				$scope.row_1 = false;
				$scope.row_2 = true;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = true;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = false;
				$scope.others_dateoption_selected = 'datewise';
			}
			else if($scope.others.report_type.key === '3' || $scope.others.report_type.key === '4' || $scope.others.report_type.key === '5' ){
				$scope.row_2 = true;
				$scope.row_1 = false;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = true;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = false;
				$scope.omsection_disable = false;
				$scope.others_dateoption_selected = 'datewise';
			}
			else if($scope.others.report_type.key === '6'){
				$scope.row_1 = false;
				$scope.row_2 = false;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = true;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				 /*if($scope.others.report_type.key === '6'){
					 $scope.rrnumber_exclude = true;
				 }else  if($scope.others.report_type.key === '5'){
					 $scope.rrnumber_exclude = false;
				 }*/
				 $scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = false;
				$scope.omsection_disable = true;
				$scope.others_dateoption_selected = 'datewise';
			}
			else if($scope.others.report_type.key === '7'){
				$scope.row_1 = true;
				$scope.row_2 = false;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = true;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = true;
				$scope.omsection_disable = true;
				$scope.others_dateoption_selected = 'datewise';
			}
			else if($scope.others.report_type.key === '12'){
				$scope.row_1 = false;
				$scope.row_2 = true;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = true;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.no_of_months = false;
				$scope.rrnumber = true;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = true;
				$scope.omsection_disable = false;
				$scope.radio_indetail = true;
				$scope.others_selected = 'indetail';
				$scope.radio_inabstract = false;
				$scope.others_dateoption_selected = 'datewise';
				$scope.radio_indetail_show = false;
				$scope.radio_inabstract_show = false;
			}
			else if($scope.others.report_type.key === '13'){
				$scope.row_1 = false;
				$scope.row_2 = false;
				$scope.row_3 = true;
				$scope.row_4 = false;
				$scope.date_1 = true;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = false;
				$scope.others_dateoption_selected = 'datewise';
			}
			else if($scope.others.report_type.key === '14'){
				$scope.row_1 = false;
				$scope.row_2 = true;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = true;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = false;
				$scope.omsection_disable = false;
				$scope.mrcode_disable = false;
				$scope.others_dateoption_selected = 'datewise';
				$scope.others_selected = 'indetail';
			}
			else if($scope.others.report_type.key === '15'){
				$scope.row_1 = false;
				$scope.row_2 = false;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = true;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = false;
				$scope.omsection_disable = false;
				$scope.mrcode_disable = true;
				$scope.others_dateoption_selected = 'datewise';
			}
			else if($scope.others.report_type.key === '16'){
				$scope.row_1 = false;
				$scope.row_2 = true;
				$scope.row_3 = false;
				$scope.row_4 = true;
				$scope.date_1 = true;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = true;
				$scope.omsection_disable = false;
				$scope.mrcode_disable = false;
				$scope.meterreadingday_disable = false;
				$scope.others_dateoption_selected = 'datewise';
				$scope.others_selected = 'indetail';
			}
			else if($scope.others.report_type.key === '17'){
				$scope.row_1 = false;
				$scope.row_2 = true;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = true;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = true;
				$scope.radio_indetail_show = false;
				$scope.radio_inabstract_show = false;
				$scope.others_dateoption_selected = 'datewise';
			}			
			else if($scope.others.report_type.key === '18'){
				$scope.row_1 = false;
				$scope.row_2 = true;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = false;
				$scope.date_2 = false;
				$scope.date_3 = false;
				$scope.date_value_1 = true;
				$scope.date_value_2 = true;
				$scope.date_value_3 = true;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = true;
				$scope.div_tariff_selection = true;
				$scope.others_selected = 'indetail';
			}
			else if($scope.others.report_type.key === '19'){
				$scope.row_1 = false;
				$scope.row_2 = true;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = true;
				$scope.date_2 = false;
				$scope.date_3 = false;
				$scope.date_value_1 = false;
				$scope.date_value_2 = true;
				$scope.date_value_3 = true;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = false;
				$scope.omsection_disable = true;
				$scope.mrcode_disable = true;
				$scope.others_dateoption_selected = 'datewise';
			}
			else if($scope.others.report_type.key === '20' || $scope.others.report_type.key === '21'){
				$scope.row_1 = false;
				$scope.row_2 = true;
				$scope.row_3 = false;
				$scope.row_4 = false;
				$scope.date_1 = true;
				$scope.date_2 = true;
				$scope.date_3 = true;
				$scope.date_value_1 = false;
				$scope.date_value_2 = false;
				$scope.date_value_3 = false;
				$scope.no_of_months = false;
				$scope.rrnumber = false;
				$scope.rrnumber_exclude = false;
				$scope.div_customerstatus_selection = false;
				$scope.div_tariff_selection = false;
				$scope.omsection_disable = false;
				$scope.mrcode_disable = false;
				$scope.others_dateoption_selected = 'datewise';
				$scope.others_selected = 'indetail';
			}
		};
		
	    $scope.$watch('others.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.others_dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.others.dfromdate && $scope.others.dfromdate ) {
	        		  var date1 = moment($scope.others.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.others.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.others.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('others.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.others.dfromdate === undefined || $scope.others.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.others.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.others.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.others.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.others.dtodate = null;
	            return;
	          }
	        }
	      });
		
		$scope.generate_report = function(){
			
			if(!$scope.others.report_type){notify.warn("Please Select Report Type");}
			//if()
			
			var $selected_tariffs = $('#other_reports_2').find('.tariffs').find('.tariff-selection').find('.selected');
			console.log($selected_tariffs);
			var request_tariffs ='';
			$selected_tariffs.each(function(key, tariff){
				console.log(tariff);
				request_tariffs = request_tariffs + "'"+$(tariff).attr('param')+"'" +"," ;
			});
			if(request_tariffs.length > 1){
				request_tariffs = request_tariffs.substr(0,request_tariffs.length-1);
			}
			
			var $selected_cust_status = $('#other_reports_1').find('.cust_status').find('.customerstatus-selection').find('.selected');
			console.log($selected_cust_status);
			var request_cust_status ='';
			$selected_cust_status.each(function(key, cust){
				request_cust_status = request_cust_status + "'"+$(cust).attr('param')+"'" +"," ;
			});
			if(request_cust_status.length > 1){
				request_cust_status = request_cust_status.substr(0,request_cust_status.length-1);
			}
			
			var request = {
					report_id : $scope.others.report_type.key,
					rebate_code : ($scope.others.rebate_code_type ? $scope.others.rebate_code_type.key : ''),
					report_view_selected : ($scope.others_selected ? $scope.others_selected : ''),
					om_section : ($scope.others.omsection ? $scope.others.omsection.key : ''),
					meter_code : ($scope.others.metercode ? $scope.others.metercode.key : ''),
					reading_day : ($scope.others.reading_day ? $scope.others.reading_day.key : ''),
					load_type_selected : ($scope.others_load_selected ? $scope.others_load_selected : ''),
					from_load_hp_kw : ($scope.others.from_load_hp_kw ? $scope.others.from_load_hp_kw : ''),
					to_load_hp_kw : ($scope.others.to_load_hp_kw ? $scope.others.to_load_hp_kw : ''),
					dmd_consmp_selected : ($scope.others_dmd_consmp_selected ? $scope.others_dmd_consmp_selected : ''),
					dmd_consmp_from_value : ($scope.others.dmd_consmp_from_value ? $scope.others.dmd_consmp_from_value : ''),
					dmd_consmp_to_value : ($scope.others.dmd_consmp_to_value ? $scope.others.dmd_consmp_to_value : ''),
					dateoption_selected : ($scope.others_dateoption_selected ? $scope.others_dateoption_selected : ''),
					from_date : ($scope.others.dfromdate ? $scope.others.dfromdate : ''),
					to_date : ($scope.others.dtodate ? $scope.others.dtodate : ''),
					month_year : ($scope.others.dmonthyear ? $scope.others.dmonthyear : ''),
					no_of_months : ($scope.others.numberofmonths ? $scope.others.numberofmonths : ''),
					rrnumber : ($scope.others.rrnumber ? $rootScope.user.location_code+$scope.others.rrnumber : ''),
					rrnumber_expressions : ($scope.others.rrnumber_expressions ? $scope.others.rrnumber_expressions : ''),
					tariffs : request_tariffs,
					customer_status : request_cust_status,
					location_code : $rootScope.user.location_code,
					company : $rootScope.user.company
			};
			
			/*remote.load("generate_other_reports", function(response){

			}, request , 'POST');*/
			var filename = $scope.others.report_type.filename;
			
			if($scope.others.report_type.key === '2' || 
					$scope.others.report_type.key === '3' ||
					$scope.others.report_type.key === '4' ||
					$scope.others.report_type.key === '5' ||
							$scope.others.report_type.key === '14' || 
							$scope.others.report_type.key === '16' || 
								$scope.others.report_type.key === '18' || 
									$scope.others.report_type.key === '19' || 
										$scope.others.report_type.key === '20' || 
											$scope.others.report_type.key === '21'){
				if(!$scope.others_selected){notify.warn("Please Select In-Detail or In-Abstract view type");return;}
				filename = filename+'_'+$scope.others_selected ; 
			}
			
			if($scope.others_dateoption_selected){
				if($scope.others_dateoption_selected === 'datewise'){
					if(!$scope.others.dfromdate){notify.warn("Please Select Date");return;}
				}else if($scope.others_dateoption_selected === 'daterangewise'){
					if(!$scope.others.dfromdate){notify.warn("Please Select From Date");return;}
					if(!$scope.others.dtodate){notify.warn("Please Select To Date");return;}
				}else if($scope.others_dateoption_selected === 'monthwise'){
					if(!$scope.others.dmonthyear){notify.warn("Please Select month");return;}
				}
			}
			
			if($scope.load_type_selected){
				if(!$scope.others.from_load_hp_kw){notify.warn("Please Enter Load From Value");return;}
				if(!$scope.others.to_load_hp_kw){notify.warn("Please Enter Load To Value");return;}
			}
			
			if($scope.others.report_type.key === '16'){
				if($scope.dmd_consmp_selected){
					if(!$scope.others.dmd_consmp_from_value){notify.warn("Please Enter Demand/Consumption From Value");return;}
					if(!$scope.others.dmd_consmp_to_value){notify.warn("Please Enter Demand/Consumption To Value");return;}
				}
			}
			
			$('#loading').show();
			$http.get($rootScope.serviceURL+'generate_other_reports?conn_type='+$rootScope.user.connection_type
					+"&report_id="+$scope.others.report_type.key
					+"&rebate_code="+($scope.others.rebate_code_type ? $scope.others.rebate_code_type.key : '')
					+"&report_view_selected="+($scope.others_selected ? $scope.others_selected : '')
					+"&om_section="+($scope.others.omsection ? $scope.others.omsection.key : '')
					+"&meter_code="+($scope.others.metercode ? $scope.others.metercode.key : '')
					+"&reading_day="+($scope.others.reading_day ? $scope.others.reading_day.key : '')
					+"&load_type_selected="+($scope.load_type_selected ? $scope.load_type_selected : '')
					+"&from_load_hp_kw="+($scope.others.from_load_hp_kw ? $scope.others.from_load_hp_kw : '')
					+"&to_load_hp_kw="+($scope.others.to_load_hp_kw ? $scope.others.to_load_hp_kw : '')
					+"&dmd_consmp_selected="+($scope.others_dmd_consmp_selected ? $scope.others_dmd_consmp_selected : '')
					+"&dmd_consmp_from_value="+($scope.others.dmd_consmp_from_value ? $scope.others.dmd_consmp_from_value : '')
					+"&dmd_consmp_to_value="+($scope.others.dmd_consmp_to_value ? $scope.others.dmd_consmp_to_value : '')
					+"&dateoption_selected="+($scope.others_dateoption_selected ? $scope.others_dateoption_selected : '')
					+"&from_date="+($scope.others.dfromdate ? $scope.others.dfromdate : '')
					+"&to_date="+($scope.others.dtodate ? $scope.others.dtodate : '')
					+"&month_year="+($scope.others.dmonthyear ? $scope.others.dmonthyear : '')
					+"&no_of_months="+($scope.others.numberofmonths ? $scope.others.numberofmonths : '0')
					+"&rrnumber="+($scope.others.rrnumber ? $scope.others.rrnumber : '')
					+"&rrnumber_expressions="+($scope.others.rrnumber_expressions ? $scope.others.rrnumber_expressions : '')
					+"&tariffs="+request_tariffs
					+"&customer_status="+request_cust_status
					+"&location_code="+$rootScope.user.location_code
					+"&subdivision_name="+$rootScope.user.subDivision
					+"&company="+$rootScope.user.company
					+"&username="+$rootScope.user.user_id
					+"&filename="+filename
					,{ responseType : 'arraybuffer'}).then(handleResponse)
					
		      function handleResponse(response){
		       		
				var pdfFile = new Blob([response.data], { type : 'application/pdf' });	
		       	var downloadURL = URL.createObjectURL(pdfFile);
		       	$('#loading').hide();
		       	$window.open(downloadURL);
		       	
	     	  };
					
			
		};
		
		
	}
	
	if(report_flow === 'exception_reports'){
		
		$scope.exception = {};
		
		$scope.get_exception_reports = function(){
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
			};
			remote.load("getexceptionreportstypelist", function(response){
				$scope.exception_reports_list = response.EXCEPTION_REPORT_LIST;
			}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.exception_om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getexceptionreports_camplist", function(response){
				$scope.camp_list = response.CAMP_LIST;
			}, request , 'POST', false, false, true);
		};
		
		$scope.get_meter_reader_info = function(){
			var request = {
				"om_code": $scope.exception.omsection.key || $rootScope.user.location_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReaderCodesByOMUnit", function(response){
				$scope.exception_MeterReaderCode = response.MeterReaderCode;
			}, request , 'POST');
		};
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			};	
		$scope.get_exception_reports();
		$scope.get_tarifflist();
		
		$scope.having_count_list = [{key:'12',value:'12'},{key:'6',value:'6'},{key:'3',value:'3'},{key:'1',value:'1'}];
		$scope.percentage_list = [{key:'10',value:'10%'},{key:'25',value:'25%'},{key:'50',value:'50%'},{key:'100',value:'100%'}];
		
		$scope.row_1 = true;
		$scope.row_2 = true;
		$scope.row_3 = true;
		$scope.row_4 = true;
		$scope.radio_indetail_show = true;
		$scope.radio_inabstract_show = true;
		$scope.div_tariff_selection = true;
		$scope.div_dateoption =  true;
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.others_dateoption_selected = 'datewise';
		
	    $scope.$watch('exception.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.others_dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.exception.dfromdate && $scope.exception.dfromdate ) {
	        		  var date1 = moment($scope.exception.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.exception.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.exception.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('exception.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.exception.dfromdate === undefined || $scope.exception.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.exception.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.exception.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.exception.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.exception.dtodate = null;
	            return;
	          }
	        }
	      });
	}
	
	if(report_flow === 'billing_cancellation'){
		
/*		VAR CUR REFCURSOR;

		EXEC PKG_REPORTS.GET_BILL_CANCEL_REPORT(:CUR,'2110105','','','','','daterangewise','01/01/2013','25/10/2019','','','SA');

		GET_BILL_CANCEL_REPORT(CUR OUT SYS_REFCURSOR, P_LOCATION_CODE IN VARCHAR2, P_OM_CODE IN VARCHAR2, P_MR_CODE IN VARCHAR2, P_RDG_DAY IN VARCHAR2,  P_TARIFFS IN VARCHAR2,  
			                                                   P_DATE_TYPE IN VARCHAR2, P_FROM_DT IN VARCHAR2, P_TO_DT IN VARCHAR2, P_MONTH_YEAR IN VARCHAR2, 
			                                                   P_RR_NO IN VARCHAR2, P_USER_ID IN VARCHAR2)*/
		
		$scope.billcancel = {};
		
		var request = {
				"conn_type": $rootScope.user.connection_type,
				"location_code": $rootScope.user.location_code
			}
		remote.load("getuseridlist_billcancelreport", function(response){
			$scope.USERID_LIST = response.USERID_LIST;
		}, request , 'POST', false, false, true);
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.billcancel_selected = 'userid';
		
		var filename = 'bill_cancellation_report';
		
		$scope.change_ui = function(){
			
			if($scope.billcancel_selected === 'userid'){
				$scope.billcancel.rrnumber = '';
			}else if($scope.billcancel_selected === 'rrno'){
				$scope.billcancel.userid = null;
			}
			
		};
		
		$scope.generate_report = function(){
			
			if($scope.billcancel_selected){
				if($scope.billcancel_selected === 'userid'){
					$scope.billcancel.rrnumber = '';
					if(!$scope.billcancel.userid){
						notify.warn("Please Select User-Id");return;
					}
				}else if($scope.billcancel_selected === 'rrno'){
					$scope.billcancel.userid = null;
					if(!$scope.billcancel.rrnumber){
						notify.warn("Please Enter RR-Number");return;
					}
				}
			}else{
				notify.warn("Please Select Any One Option");return;
			}
			
			if($scope.dateoption_selected){
				if($scope.dateoption_selected === 'datewise'){
					if(!$scope.billcancel.dfromdate){notify.warn("Please Select Date");return;}
				}else if($scope.dateoption_selected === 'daterangewise'){
					if(!$scope.billcancel.dfromdate){notify.warn("Please Select From Date");return;}
					if(!$scope.billcancel.dtodate){notify.warn("Please Select To Date");return;}
				}else if($scope.dateoption_selected === 'monthwise'){
					if(!$scope.billcancel.dmonthyear){notify.warn("Please Select month");return;}
				}
			}
			
			$('#loading').show();
			$http.get($rootScope.serviceURL+'generate_bill_cancel_report?conn_type='+$rootScope.user.connection_type
					+"&billcancel_selected="+($scope.billcancel_selected ? $scope.billcancel_selected : '')
					+"&billcancel_userid="+($scope.billcancel.userid ? $scope.billcancel.userid.key : '')
					+"&billcancel_rrnumber="+($scope.billcancel.rrnumber ? $scope.billcancel.rrnumber : '')
					+"&om_section="
					+"&meter_code="
					+"&reading_day="
					+"&dateoption_selected="+($scope.dateoption_selected ? $scope.dateoption_selected : '')
					+"&from_date="+($scope.billcancel.dfromdate ? $scope.billcancel.dfromdate : '')
					+"&to_date="+($scope.billcancel.dtodate ? $scope.billcancel.dtodate : '')
					+"&month_year="+($scope.billcancel.dmonthyear ? $scope.billcancel.dmonthyear : '')
					+"&tariffs="
					+"&location_code="+$rootScope.user.location_code
					+"&subdivision_name="+$rootScope.user.subDivision
					+"&company="+$rootScope.user.company
					+"&username="+$rootScope.user.user_id
					+"&filename="+filename
					,{ responseType : 'arraybuffer'}).then(handleResponse)
					
		      function handleResponse(response){
		       		
				var pdfFile = new Blob([response.data], { type : 'application/pdf' });	
		       	var downloadURL = URL.createObjectURL(pdfFile);
		       	$('#loading').hide();
		       	$window.open(downloadURL);
		       	
	     	  };
			
		};
		
		
	    $scope.$watch('billcancel.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.billcancel.dfromdate && $scope.billcancel.dfromdate ) {
	        		  var date1 = moment($scope.billcancel.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.billcancel.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.billcancel.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('billcancel.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.billcancel.dfromdate === undefined || $scope.billcancel.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.credit.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.billcancel.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.billcancel.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.billcancel.dtodate = null;
	            return;
	          }
	        }
	      });
		
	}
	
	if(report_flow === 'debit_and_withdrawal'){

		$scope.debit_withdrawal = {};
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.reporttype_selected = 'withdrawal';
		$scope.datetype_selected = 'withdrawaldate';
		$scope.reportwise_selected = 'indetail';
		
		$scope.DEBIT_STATUS_LIST = [{key:'Approved',value:'Approved'},{key:'Rejected',value:'Rejected'},{key:'Pending',value:'Pending'}];
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
			
			};	
		$scope.get_tarifflist();
		$scope.get_charge_description_list = function(){
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getchargedescriptionreportlist", function(response){
				$scope.CHARGE_DESCRIPTION_LIST = response.CHARGE_DESCRIPTION_LIST;
			}, request , 'POST', false, false, true);
		};
		$scope.get_charge_description_list();
		
		//$scope.debit_withdrawal.check_tariffwise = false;
		//$scope.debit_withdrawal.disable_tariffwise = false;
		
		
		
		$scope.change_ui = function(){
			
			if($scope.reporttype_selected === 'withdrawal'){
				
				$scope.debit_withdrawal.debitstatuslist = '';
				//$scope.debit_withdrawal.check_approved = true;
				//$scope.debit_withdrawal.disable_approved = false;
				
				
			}else if($scope.reporttype_selected === 'debit'){
				//$scope.debit_withdrawal.debitstatuslist = "Approved";
				$scope.debit_withdrawal.debitstatuslist = $filter('filter')($scope.DEBIT_STATUS_LIST,{key:'Approved'},true)[0];
				//$scope.debit_withdrawal.check_approved = false;
				//$scope.debit_withdrawal.disable_approved = true;
			}
			
		};
		
		$scope.change_ui();
		
		$scope.generate_report = function(){
			
			var filename = "withdrawal_debit_report";
			
			filename = filename+'_'+$scope.reportwise_selected ; 
			
			if($scope.dateoption_selected){
				if($scope.dateoption_selected === 'datewise'){
					if(!$scope.debit_withdrawal.dfromdate){notify.warn("Please Select Date");return;}
				}else if($scope.dateoption_selected === 'daterangewise'){
					if(!$scope.debit_withdrawal.dfromdate){notify.warn("Please Select From Date");return;}
					if(!$scope.debit_withdrawal.dtodate){notify.warn("Please Select To Date");return;}
				}else if($scope.dateoption_selected === 'monthwise'){
					if(!$scope.debit_withdrawal.dmonthyear){notify.warn("Please Select month");return;}
				}
			}
			
			$('#loading').show();
			$http.get($rootScope.serviceURL+'generate_debit_withdrawal_report?conn_type='+$rootScope.user.connection_type
					+"&reporttype_selected="+($scope.reporttype_selected ? $scope.reporttype_selected : '')
					+"&reportwise_selected="+($scope.reportwise_selected ? $scope.reportwise_selected : '')
					+"&datetype_selected="+($scope.datetype_selected ? $scope.datetype_selected : '')
					+"&debit_status="+($scope.debit_withdrawal.debitstatuslist ? $scope.debit_withdrawal.debitstatuslist.key : '')
					+"&charge_description="+($scope.debit_withdrawal.charge_description ? $scope.debit_withdrawal.charge_description.key : '')
					+"&rrnumber="+($scope.debit_withdrawal.rrnumber ? $scope.debit_withdrawal.rrnumber : '')
					+"&om_section="+($scope.debit_withdrawal.omsection ? $scope.debit_withdrawal.omsection.key : '')
					+"&meter_code="
					+"&reading_day="
					+"&dateoption_selected="+($scope.dateoption_selected ? $scope.dateoption_selected : '')
					+"&from_date="+($scope.debit_withdrawal.dfromdate ? $scope.debit_withdrawal.dfromdate : '')
					+"&to_date="+($scope.debit_withdrawal.dtodate ? $scope.debit_withdrawal.dtodate : '')
					+"&month_year="+($scope.debit_withdrawal.dmonthyear ? $scope.debit_withdrawal.dmonthyear : '')
					+"&tariffs="
					+"&location_code="+$rootScope.user.location_code
					+"&subdivision_name="+$rootScope.user.subDivision
					+"&company="+$rootScope.user.company
					+"&username="+$rootScope.user.user_id
					+"&filename="+filename
					,{ responseType : 'arraybuffer'}).then(handleResponse)
					
		      function handleResponse(response){
		       		
				var pdfFile = new Blob([response.data], { type : 'application/pdf' });	
		       	var downloadURL = URL.createObjectURL(pdfFile);
		       	$('#loading').hide();
		       	$window.open(downloadURL);
		       	
	     	  };
			
		};
		
	    $scope.$watch('debit_withdrawal.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.debit_withdrawal.dfromdate && $scope.debit_withdrawal.dfromdate ) {
	        		  var date1 = moment($scope.debit_withdrawal.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.credit.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.debit_withdrawal.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('debit_withdrawal.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.debit_withdrawal.dfromdate === undefined || $scope.debit_withdrawal.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.debit_withdrawal.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.debit_withdrawal.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.debit_withdrawal.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.debit_withdrawal.dtodate = null;
	            return;
	          }
	        }
	      });
	}
	
	if(report_flow === 'credit_reports'){

		$scope.credit = {};
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.credit_reporttype_selected = 'indetail';
		$scope.credit_datetype_selected = 'creditdate';
		
		$scope.CREDIT_STATUS_LIST = [{key:'Approved',value:'Approved'},{key:'Rejected',value:'Rejected'},{key:'Pending',value:'Pending'}];
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			};	
		$scope.get_tarifflist();
		$scope.get_credit_type_list = function(){
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getcredittypelist", function(response){
				$scope.CREDIT_TYPE_LIST = response.CREDIT_TYPE_LIST;
			}, request , 'POST', false, false, true);
		};
		$scope.get_credit_type_list();
		
		$scope.generate_report = function(){
			
			var filename = "credit_report";
			
			filename = filename+'_'+$scope.credit_reporttype_selected ; 
			
			if($scope.dateoption_selected){
				if($scope.dateoption_selected === 'datewise'){
					if(!$scope.credit.dfromdate){notify.warn("Please Select Date");return;}
				}else if($scope.dateoption_selected === 'daterangewise'){
					if(!$scope.credit.dfromdate){notify.warn("Please Select From Date");return;}
					if(!$scope.credit.dtodate){notify.warn("Please Select To Date");return;}
				}else if($scope.dateoption_selected === 'monthwise'){
					if(!$scope.credit.dmonthyear){notify.warn("Please Select month");return;}
				}
			}
			
			$('#loading').show();
			$http.get($rootScope.serviceURL+'generate_credit_report?conn_type='+$rootScope.user.connection_type
					+"&reporttype_selected="+($scope.credit_reporttype_selected ? $scope.credit_reporttype_selected : '')
					+"&reportwise_selected="+($scope.credit_datetype_selected ? $scope.credit_datetype_selected : '')
					+"&credit_status="+($scope.credit.credit_status ? $scope.credit.credit_status.key : '')
					+"&credit_type="+($scope.credit.credit_type ? $scope.credit.credit_type.key : '')
					+"&om_section="
					+"&meter_code="
					+"&reading_day="
					+"&dateoption_selected="+($scope.dateoption_selected ? $scope.dateoption_selected : '')
					+"&from_date="+($scope.credit.dfromdate ? $scope.credit.dfromdate : '')
					+"&to_date="+($scope.credit.dtodate ? $scope.credit.dtodate : '')
					+"&month_year="+($scope.credit.dmonthyear ? $scope.credit.dmonthyear : '')
					+"&tariffs="
					+"&location_code="+$rootScope.user.location_code
					+"&subdivision_name="+$rootScope.user.subDivision
					+"&company="+$rootScope.user.company
					+"&username="+$rootScope.user.user_id
					+"&filename="+filename
					,{ responseType : 'arraybuffer'}).then(handleResponse)
					
		      function handleResponse(response){
		       		
				var pdfFile = new Blob([response.data], { type : 'application/pdf' });	
		       	var downloadURL = URL.createObjectURL(pdfFile);
		       	$('#loading').hide();
		       	$window.open(downloadURL);
		       	
	     	  };
			
		};
		
	    $scope.$watch('credit.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.credit.dfromdate && $scope.credit.dfromdate ) {
	        		  var date1 = moment($scope.credit.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.credit.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.credit.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('credit.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.credit.dfromdate === undefined || $scope.credit.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.credit.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.credit.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.credit.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.credit.dtodate = null;
	            return;
	          }
	        }
	      });
	}
	
	if(report_flow === 'adjustment_report'){

		$scope.adjustment = {};
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.adjustment_reporttype_selected = 'indetail';
		$scope.Adjustment_Type = [{key:'Revenue',value:'Revenue'},{key:'Non-Revenue',value:'Non-Revenue'}];
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.adjustment_om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
			};	
		$scope.get_tarifflist();
		
		$scope.clear_form = function(){
			
			$scope.adjustment = null;
			$scope.dateoption_selected = 'datewise';
			$scope.adjustment_reporttype_selected = 'indetail';
			$scope.get_tarifflist();
		};
		
	    $scope.$watch('adjustment.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.adjustment.dfromdate && $scope.adjustment.dfromdate ) {
	        		  var date1 = moment($scope.adjustment.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.adjustment.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.adjustment.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('adjustment.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.adjustment.dfromdate === undefined || $scope.adjustment.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.adjustment.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.adjustment.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.adjustment.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.adjustment.dtodate = null;
	            return;
	          }
	        }
	      });
		
	}
	
	if(report_flow === 'dl_&_mnr_report'){

		$scope.doorlockmnr = {};
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.doorlockmnr_reporttype_selected = 'indetail';
		$scope.doorlockmnr_type_selected = 'faultymnr';
		$scope.reportwise_selected = 'tariffwsie';
		
		
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getmrcodelist", function(response){
				$scope.meter_code_list = response.MeterReaderCode;
			}, request , 'POST', false, false, true);
			};	
		$scope.get_tarifflist();
		
		$scope.clear_form = function(){
			
			$scope.doorlockmnr = null;
			
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.dateoption_selected = 'datewise';
			$scope.doorlockmnr_reporttype_selected = 'indetail';
			$scope.doorlockmnr_type_selected = 'faultymnr';
			$scope.reportwise_selected = 'tariffwsie';
			$scope.get_tarifflist();
		};
		
	    $scope.$watch('doorlockmnr.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.doorlockmnr.dfromdate && $scope.doorlockmnr.dfromdate ) {
	        		  var date1 = moment($scope.doorlockmnr.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.doorlockmnr.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.doorlockmnr.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('doorlockmnr.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.doorlockmnr.dfromdate === undefined || $scope.present.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.doorlockmnr.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.doorlockmnr.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.doorlockmnr.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.doorlockmnr.dtodate = null;
	            return;
	          }
	        }
	      });
		
	}
	
	if(report_flow === 'present_reading_lesser_then_previous'){

		$scope.present = {};
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getmrcodelist", function(response){
				$scope.meter_code_list = response.MeterReaderCode;
			}, request , 'POST', false, false, true);
			};	
		$scope.get_tarifflist();
		
		$scope.clear_form = function(){
			
			$scope.present = null;
			
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.dateoption_selected = 'datewise';
			$scope.get_tarifflist();
		};
		
	    $scope.$watch('present.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.present.dfromdate && $scope.present.dfromdate ) {
	        		  var date1 = moment($scope.present.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.present.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.present.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('present.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.present.dfromdate === undefined || $scope.present.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.present.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.present.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.present.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.present.dtodate = null;
	            return;
	          }
	        }
	      });
		
	}
	if(report_flow === 'abnormal_subnormal_report'){
		
		$scope.abnormal = {};
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.abnormal_reporttype_selected = 'indetail';
		$scope.abnormal_type_selected = 'abnormal';
		$scope.reportwise_selected = 'tariffwsie';
		
		
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getmrcodelist", function(response){
				$scope.meter_code_list = response.MeterReaderCode;
			}, request , 'POST', false, false, true);
			};	
		$scope.get_tarifflist();
		
		$scope.clear_form = function(){
			
			$scope.abnormal = null;
			
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.dateoption_selected = 'datewise';
			$scope.abnormal_reporttype_selected = 'indetail';
			$scope.abnormal_type_selected = 'abnormal';
			$scope.reportwise_selected = 'tariffwsie';
			$scope.get_tarifflist();
		};
	    $scope.$watch('abnormal.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.abnormal.dfromdate && $scope.abnormal.dfromdate ) {
	        		  var date1 = moment($scope.abnormal.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.abnormal.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.abnormal.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('abnormal.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.abnormal.dfromdate === undefined || $scope.abnormal.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.abnormal.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.abnormal.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.abnormal.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.abnormal.dtodate = null;
	            return;
	          }
	        }
	      });
	}
	
	if(report_flow === 'zero_consumption'){
		
		$scope.zero = {};
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getmrcodelist", function(response){
				$scope.meter_code_list = response.MeterReaderCode;
			}, request , 'POST', false, false, true);
			
			$scope.having_count_list = [{key:'12',value:'>=12'},{key:'6',value:'>=6'},{key:'3',value:'>=3'},{key:'1',value:'>=1'}];
			
			};	
			
			$scope.get_tarifflist();
		$scope.clear_form = function(){
			
			$scope.zero = null;
			
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.dateoption_selected = 'datewise';
			$scope.get_tarifflist();
		};
	    $scope.$watch('zero.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.zero.dfromdate && $scope.zero.dfromdate ) {
	        		  var date1 = moment($scope.zero.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.zero.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.zero.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('zero.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.zero.dfromdate === undefined || $scope.zero.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.zero.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.zero.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.zero.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.zero.dtodate = null;
	            return;
	          }
	        }
	      });
		
	}
	
	if(report_flow === 'demand_recovery_status_report'){
		
		$scope.demandrecovery = {};
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.reporttype_selected = 'indetail';
		$scope.reportwise_selected = 'tariffwsie';
		$scope.sanctionload_selected = '';
		$scope.slum_taxexempted_selected = '';
		$scope.escomoffice_dc_instl_selected = '';
		
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getmrcodelist", function(response){
				$scope.meter_code_list = response.MeterReaderCode;
			}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getgramapanchayathlist", function(response){
				$scope.grama_panchayath_list = response.GRAMA_PANCHAYATH_LIST;
			}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"code_type": 'APLNT_TYP'
				}
			remote.load("getcodedetailsfordropdowns", function(response){
				$scope.customer_type_list = response.CodeDetailsDropDownList;
			}, request , 'POST', false, false, true);
			};	
		$scope.get_tarifflist();
		
		$scope.clear_form = function(){
			
			$scope.demandrecovery = null;
			
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.dateoption_selected = 'datewise';
			$scope.reporttype_selected = 'indetail';
			$scope.reportwise_selected = 'tariffwsie';
			$scope.sanctionload_selected = '';
			$scope.slum_taxexempted_selected = '';
			$scope.escomoffice_dc_instl_selected = '';
			$scope.get_tarifflist();
		};
	    $scope.$watch('demandrecovery.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.demandrecovery.dfromdate && $scope.demandrecovery.dfromdate ) {
	        		  var date1 = moment($scope.demandrecovery.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.demandrecovery.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.demandrecovery.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('demandrecovery.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.demandrecovery.dfromdate === undefined || $scope.demandrecovery.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.demandrecovery.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.demandrecovery.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.demandrecovery.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.demandrecovery.dtodate = null;
	            return;
	          }
	        }
	      });
	}
	
	if(report_flow === 'agewise_arrears_report'){
		
		$scope.agewise = {};
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.reportwise_selected = 'nilpayment';
		$scope.dateoption_selected = 'datewise';
		
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getmrcodelist", function(response){
				$scope.meter_code_list = response.MeterReaderCode;
			}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getexceptionreports_camplist", function(response){
				$scope.camp_list = response.CAMP_LIST;
			}, request , 'POST', false, false, true);
			
			$scope.having_count_list = [{key:'3',value:'3-Months'},{key:'6',value:'6-Months'},{key:'9',value:'9-Months'},
										{key:'12',value:'1-Year'},{key:'24',value:'2-Year'},{key:'36',value:'3-Year'}];
			
			};	
			
			$scope.get_tarifflist();
		$scope.clear_form = function(){
			
			$scope.agewise = null;
			
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.reportwise_selected = 'nilpayment';
			$scope.dateoption_selected = 'datewise';
			$scope.get_tarifflist();
		};
	    $scope.$watch('agewise.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.agewise.dfromdate && $scope.agewise.dfromdate ) {
	        		  var date1 = moment($scope.agewise.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.agewise.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.agewise.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('agewise.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.agewise.dfromdate === undefined || $scope.agewise.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.agewise.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.agewise.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.agewise.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.agewise.dtodate = null;
	            return;
	          }
	        }
	      });
	}
	
	if(report_flow === 'slum_consumer_report'){
		
		$scope.slum = {};
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.reporttype_selected = 'indetail';
		
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			};	
			
			$scope.get_tarifflist();
		$scope.clear_form = function(){
			
			$scope.slum = null;
			
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.dateoption_selected = 'datewise';
			$scope.reporttype_selected = 'indetail';
			$scope.get_tarifflist();
		};
	    $scope.$watch('zero.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.zero.dfromdate && $scope.zero.dfromdate ) {
	        		  var date1 = moment($scope.zero.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.zero.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.zero.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('zero.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.zero.dfromdate === undefined || $scope.zero.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.zero.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.zero.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.zero.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.zero.dtodate = null;
	            return;
	          }
	        }
	      });
		
	}
	
	if(report_flow === 'disconn_reconn_reports'){

		$scope.disconn = {};
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.reportwise_selected = 'disconnected';
		
		
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getmrcodelist", function(response){
				$scope.meter_code_list = response.MeterReaderCode;
			}, request , 'POST', false, false, true);
			};	
		$scope.get_tarifflist();
		
		$scope.clear_form = function(){
			
			$scope.disconn = null;
			
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.dateoption_selected = 'datewise';
			$scope.reportwise_selected = 'disconnected';
			$scope.get_tarifflist();
		};
		
	    $scope.$watch('disconn.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.disconn.dfromdate && $scope.disconn.dfromdate ) {
	        		  var date1 = moment($scope.disconn.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.disconn.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.disconn.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('disconn.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.disconn.dfromdate === undefined || $scope.disconn.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.disconn.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.disconn.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.disconn.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.disconn.dtodate = null;
	            return;
	          }
	        }
	      });
		
	}
	
	if(report_flow === 'rr_6b_and_temp_discon_list'){

		$scope.rr6b = {};
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.reporttype_selected = 'rr6bdetails';
		$scope.reportwise_selected = '';
		
		$scope.change_ui = function(){
			console.log($scope.reporttype_selected);
			
			if($scope.reporttype_selected === 'rr6bdetails'){
				if($scope.reportwise_selected === 'rrnumberwise'){
					$scope.show_tariff = false;
					$scope.disable_omcode = false;
					$scope.disable_metercode = false;
					$scope.show_dates=false;
					$scope.show_date_values = false;
				}else if($scope.reportwise_selected === 'serviced_datewise'){
					$scope.show_tariff = true;
					$scope.disable_omcode = true;
					$scope.disable_metercode = true;
					$scope.show_dates=true;
					$scope.show_date_values = true;
				}
			}
			
			if($scope.reporttype_selected === 'temp_discon'){
				if($scope.reportwise_selected === 'rrnumberwise'){
					$scope.show_tariff = false;
					$scope.disable_omcode = false;
					$scope.disable_metercode = false;
					$scope.show_dates=false;
					$scope.show_date_values = false;
				}else if($scope.reportwise_selected === 'serviced_datewise'){
					$scope.show_tariff = true;
					$scope.disable_omcode = true;
					$scope.disable_metercode = true;
					$scope.show_dates=true;
					$scope.show_date_values = true;
				}
			}
			
		};
		
		
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getmrcodelist", function(response){
				$scope.meter_code_list = response.MeterReaderCode;
			}, request , 'POST', false, false, true);
			};	
		$scope.get_tarifflist();
		$scope.change_ui();
		
		$scope.clear_form = function(){
			
			$scope.rr6b = null;
			
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.dateoption_selected = 'datewise';
			$scope.reporttype_selected = 'rr6bdetails';
			$scope.reportwise_selected = '';
			$scope.get_tarifflist();
			
			$scope.show_tariff = false;
			$scope.disable_omcode = false;
			$scope.disable_metercode = false;
			$scope.show_dates=false;
			$scope.show_date_values = false;
			$scope.change_ui();
		};
		
	    $scope.$watch('rr6b.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.rr6b.dfromdate && $scope.rr6b.dfromdate ) {
	        		  var date1 = moment($scope.rr6b.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.rr6b.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.rr6b.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('rr6b.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.rr6b.dfromdate === undefined || $scope.rr6b.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.rr6b.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.rr6b.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.rr6b.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.rr6b.dtodate = null;
	            return;
	          }
	        }
	      });
		
	}
	
	if(report_flow === 'high_value_cheque_report'){

		$scope.highvalue = {};
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.reporttype_selected = 'indetail';
		
		
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			};	
		$scope.get_tarifflist();
		
		$scope.clear_form = function(){
			
			$scope.highvalue = null;
			
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.dateoption_selected = 'datewise';
			$scope.reporttype_selected = 'indetail';
			$scope.get_tarifflist();
		};
		
	    $scope.$watch('highvalue.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.highvalue.dfromdate && $scope.highvalue.dfromdate ) {
	        		  var date1 = moment($scope.highvalue.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.highvalue.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.highvalue.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('highvalue.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.highvalue.dfromdate === undefined || $scope.highvalue.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.highvalue.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.highvalue.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.highvalue.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.highvalue.dtodate = null;
	            return;
	          }
	        }
	      });
		
	}
	
	if(report_flow === 'revenue_report'){

		$scope.revenue = {};
		
		$scope.date_1 = true;
		$scope.date_2 = true;
		$scope.date_3 = true;
		$scope.dateoption_selected = 'datewise';
		$scope.reportwise_selected = 'rrnumberwise';
		
		
		$scope.get_tarifflist = function(){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code 
				}
				remote.load("getConsumerMasterPickListValues", function(response){
					$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
				}, request , 'POST', false, false, true);
			
			request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getomunitlist", function(response){
				$scope.om_list = response.OM_LIST;
			}, request , 'POST', false, false, true);
			
			request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code
				}
			remote.load("getmrcodelist", function(response){
				$scope.meter_code_list = response.MeterReaderCode;
			}, request , 'POST', false, false, true);
			};	
		$scope.get_tarifflist();
		
		$scope.clear_form = function(){
			
			$scope.revenue = null;
			
			$scope.date_1 = true;
			$scope.date_2 = true;
			$scope.date_3 = true;
			$scope.dateoption_selected = 'datewise';
			$scope.reportwise_selected = 'rrnumberwise';
			$scope.get_tarifflist();
		};
		
	    $scope.$watch('revenue.dfromdate', function (newval, oldval) {
	        console.log(newval);
	        if($scope.dateoption_selected === 'daterangewise'){
		        if (newval) {
	        	 if ($scope.revenue.dfromdate && $scope.revenue.dfromdate ) {
	        		  var date1 = moment($scope.revenue.dfromdate, 'DD-MM-YYYY');
			          var date2 = moment($scope.revenue.dtodate, 'DD-MM-YYYY');
			          if ((moment(date1).isAfter(date2)) === true) {
			            notify.warn("From Date should be lesser !!!");
			            $scope.revenue.dfromdate = null;
			            return;
			          }
	        	 }	
		        }
	        }
	      });
		
	    $scope.$watch('revenue.dtodate', function (newval, oldval) {
	        console.log(newval);
	        if (newval) {
	          if ($scope.revenue.dfromdate === undefined || $scope.revenue.dfromdate === null) {
	        	  notify.warn("From Date should not be empty !!!");
	        	  $scope.highvalue.dtodate = '';
	            return;
	          }
	          var date1 = moment($scope.revenue.dfromdate, 'DD-MM-YYYY');
	          var date2 = moment($scope.revenue.dtodate, 'DD-MM-YYYY');
	          if ((moment(date1).isAfter(date2)) === true) {
	            notify.warn("From Date should be lesser !!!");
	            $scope.revenue.dtodate = null;
	            return;
	          }
	        }
	      });
		
	}
	
}]);
