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
		
		$scope.get_meter_reader_info();
		$scope.get_tarifflist();
		
		$scope.manageui = function(){
			
			if($scope.billeff.reporttype === 'reading_day_wise'){
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
		
		$scope.selected_report_type = "billing_efficiency";
		
		
		$scope.genereatereport = function(exportpdf){
			
			var search_location = "",zone="",circle="",division="",subdivision="",omsection="",station="",feeder="",transformer="",village="";
			if($scope.search.zone != undefined || $scope.search.zone != null){zone = $scope.search.zone.key; search_location = $scope.search.zone.ZONE_CODE;}
			if($scope.search.circle != undefined || $scope.search.circle != null){circle = $scope.search.circle.key; search_location = $scope.search.circle.CIRCLE_CODE;}
			if($scope.search.division != undefined || $scope.search.division != null){division = $scope.search.division.key; search_location = $scope.search.division.DIVISION_CODE;}
			if($scope.search.subdivision != undefined || $scope.search.subdivision != null){subdivision = $scope.search.subdivision.key; search_location = $scope.search.subdivision.LOCATION_CODES;}
			if($scope.search.omsection != undefined || $scope.search.omsection != null){omsection = $scope.search.omsection.key; search_location = $scope.search.omsection.key;}
			
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
						$('.collapse').collapse("hide");
						
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
							+"&metercode="+($scope.search.metercode != null || $scope.search.metercode != undefined ? $scope.search.metercode : '')
							+"&tariffcodes="+request_tariffs
							+"&fromdate="+(($scope.dfromdate != null || $scope.dfromdate != undefined )? $scope.dfromdate : '') 
							+"&todate="+ (($scope.dtodate != null || $scope.dtodate != undefined) ? $scope.dtodate : '')
							+"&header=false"
							+"&username="+$rootScope.user.user_id
							,{ responseType : 'arraybuffer'}).then(handleResponse)
					
					
				}else{
					remote.load("generateCollectionEfficiency", function(response){
						console.log(response);
						
						var data = response.COLLECTION_EFFICIENCY;
						$scope.COLLECTION_EFFICIENCY = response.COLLECTION_EFFICIENCY;
						$('.collapse').collapse("hide");
						
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
							+"&cashcounternumber="+"''"
							+"&fromdate="+(($scope.dfromdate != null || $scope.dfromdate != undefined )? $scope.dfromdate : '') 
							+"&todate="+ (($scope.dtodate != null || $scope.dtodate != undefined) ? $scope.dtodate : '')
							+"&header=false"
							+"&username="+$rootScope.user.user_id
							,{ responseType : 'arraybuffer'}).then(handleResponse)
					
					
				}else{
					remote.load("getPaymentPurposewiseReport", function(response){
						console.log(response);
						
						var data = response.PURPOSEWISE;
						$scope.PURPOSEWISE = response.PURPOSEWISE;
						$('.collapse').collapse("hide");
						
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
						$('.collapse').collapse("hide");
						
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
	
	
	
}]);
