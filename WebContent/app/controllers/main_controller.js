var main_controller = angular.module('main_controller',[]);

main_controller.controller('main_controller',['$scope','$rootScope','remote','$filter','notify','webValidations', 
	function($scope,$rootScope,remote,$filter,notify,webValidations){
	
	var main_flow = $rootScope.breadcrumb[$rootScope.breadcrumb.length-1];

	if(main_flow === 'bill_generation'){
		
		$RrNumber = $('#rr-number');
		
		//default billing mode
		$scope.selected = 'rr_no_wise';
		$scope.billDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		
		//loading all mr codes
		var request = {
			"om_code": $rootScope.user.location_code,
			"location": $rootScope.user.location_code,
			"conn_type": $rootScope.user.connection_type
		}
		remote.load("getMeterReaderCodesByOMUnit", function(response){
			$scope.MeterReaderCode = response.MeterReaderCode;
		}, request , 'POST');
		
		$scope.billGenerationGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
				{field: 'row_num', displayName: '#', width : '4%'},
				{field: 'rr_no', displayName: 'RR Number', width : '15%'},
				{field: 'mr_cd', displayName: 'MR Code', width : '15%'},
				{field: 'bill_dt', displayName: 'Bill Date', width : '15%'},
				{field: 'msg', displayName: 'Remarks', width : '51%'},
	        ],
	        data: []
		};
		
		$scope.generate_bills = function(){
			var request = {
				"conn_type" : $rootScope.user.connection_type,
				"Location" : $rootScope.user.location_code,
				"UserId" : $rootScope.user.user_id,
				"Bill_Date" : (($scope.billDate) ? $scope.billDate : ''),
				"Billing_Type" : $scope.selected,
				"RR_Number" : '',
				"Meter_Code" : ''
			}
			if(!$scope.billDate){
				$('#bill_date').focus();
				return;
			}
			if ($scope.selected === 'rr_no_wise'){
				if(!$scope.rrNo){
					$RrNumber.focus();
					return;
				}
				request.RR_Number = (($scope.rrNo) ? $rootScope.user.location_code + $scope.rrNo : '');
			}else if ($scope.selected === 'mr_code_wise'){
				if(!$scope.mrCode){
					notify.warn('Please select MR Code to proceed');
					return;
				}
				request.Meter_Code = (($scope.mrCode) ? $scope.mrCode : '');
			}
			
			console.log(request);
			remote.load("generateserversidebill", function(response){
				$scope.billGenerationGridOptions.data = response.remarks;
			}, request , 'POST');
		}

		$scope.clear_bill_generation = function(){
			$scope.billDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.billGenerationGridOptions.data = [];
			$RrNumber.val('').focus();
			$scope.mrCode = '';
		}
	}
	
	if(main_flow === 'bill_print'){
		
		$scope.billDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		//loading all mr codes
		var request = {
			"om_code": $rootScope.user.location_code,
			"location": $rootScope.user.location_code,
			"conn_type": $rootScope.user.connection_type
		}
		remote.load("getMeterReaderCodesByOMUnit", function(response){
			$scope.MeterReaderCode = response.MeterReaderCode;
		}, request , 'POST');
		$scope.print_bills = function(){
			
		}
		$scope.clear_bills = function(){
			
		}
	}
	
	if(main_flow === 'transfer'){
		
		$scope.from_folio_no ='0';
		$scope.to_folio_no ='9999';
		
		var request = {
			"om_code": $rootScope.user.location_code,
			"location": $rootScope.user.location_code,
			"conn_type": $rootScope.user.connection_type
		}
		remote.load("getMeterReaderCodesByOMUnit", function(response){
			$scope.MRCodeList = response.MeterReaderCode;
		}, request , 'POST');
			
		$scope.load_from_reading_days = function(){
			var request = {
				"om_code": $rootScope.user.location_code,
				"mr_code": $scope.from_mr_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReadingDayByMrCode", function(response){
				$scope.fromMeterReadingDay = response.MeterReadingDay;
			}, request , 'POST');
		}
		
		$scope.load_to_reading_days = function(){
			var request = {
				"om_code": $rootScope.user.location_code,
				"mr_code": $scope.to_mr_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReadingDayByMrCode", function(response){
				$scope.toMeterReadingDay = response.MeterReadingDay;
			}, request , 'POST');
		}
		
		$scope.transfer_save = function(){
			
			var from_mr_cd = $scope.from_mr_code;
			var to_mr_cd = $scope.to_mr_code;
			var from_rdg_day = $scope.from_reading_day;
			var to_rdg_day = $scope.to_reading_day;
			var from_folio = $scope.from_folio_no;
			var to_folio = $scope.to_folio_no;
			
			 if(!from_mr_cd){
				notify.warn('Select From MR Code to Transfer ...');
				return;
			}else if(!to_mr_cd){
				notify.warn('Select To MR Code to Transfer ...');
				return;
			}else if(!from_rdg_day){
				notify.warn('Select From Reading Day to Transfer ...');
				return;
			}else if(!to_rdg_day){
				notify.warn('Select To Reading Day to Transfer ...');
				return;
			}else if(!from_folio){
				notify.warn('Enter From Folio Number to Transfer ...');
				return;
			}else if(!to_folio){
				notify.warn('Enter To Folio Number to Transfer ...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				location_code : $rootScope.user.location_code,
				userid : $rootScope.user.user_id,
				from_mr_code : from_mr_cd,
				to_mr_code : to_mr_cd,
				from_reading_day : from_rdg_day,
				to_reading_day : to_rdg_day,
				from_folio_no : from_folio,
				to_folio_no : to_folio
			};
			console.log(request);
			remote.load("mrtomrrransfer", function(response){
			}, request, 'POST');
		}
		$scope.transfer_clear = function(){
			$scope.from_mr_code = '';
			$scope.to_mr_code = '';
			$scope.fromMeterReadingDay ='';
			$scope.toMeterReadingDay ='';
			$scope.from_folio_no ='0';
			$scope.to_folio_no ='9999';
		}
	}
	
	if(main_flow === 'reconciliation'){
		
		$scope.selected = 'date_wise';
		$scope.receiptDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		
		var request = {
				"location_code": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
		}
		remote.load("cashcounterlist", function(response){
			$scope.counters = response.cash_counters_list;
		}, request , 'POST');
		
		$scope.reconciliation_process = function(){
			
			if($scope.selected === 'date_wise'){
				if(!$scope.receiptDate){
					notify.warn("Please Select Receipt date !!!");
					$('#receipt_date').focus();
					return;
				}
			}else if($scope.selected === 'rr_no_wise'){
				console.log($scope.selected);
				if(!$scope.receiptDate){
					notify.warn("Please Select Receipt date !!!");
					$('#receipt_date').focus();
					return;
				}else if(!$scope.rrNo){
					notify.warn("Please enter the rrno !!!");
					$('#rr_number').val('').focus();
					return;
				}
			}/*else if($scope.selected === 'receipt_wise'){
				if(!$scope.receiptDate){
					notify.warn("Please Select Receipt date !!!");
					$('#receipt_date').focus();
					return;
				}else if(!$scope.receiptNo){
					notify.warn("Please enter the receipt no !!!");
					$('#receipt_number').val('').focus();
					return;
				}else if(!$scope.counter){
					notify.warn("Please select the counter !!!");
					$('#counter').val('').focus();
					return;
				}
			}*/
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
					"Location" : $rootScope.user.location_code,
					"UserId" : $rootScope.user.user_id,
					"recon_receipt_date" : (($scope.receiptDate) ? $scope.receiptDate : ''),
					"recon_rrno" : (($scope.rrNo) ? $rootScope.user.location_code+$scope.rrNo : ''),
					/*"recon_receiptno" : (($scope.billrecon_receipt_no) ? $scope.billrecon_receipt_no : ''),*/
					/*"recon_counter" : (($scope.billrecon_Counter) ? $scope.billrecon_Counter : ''),*/
					"recon_selected" : $scope.selected
				};
			
			console.log(request);
			
			remote.load("doreconcilation", function(response){
				console.log(response);
				$scope.billGenerationGridOptions.data = response.remarks;
			}, request , 'POST');
			
		}
		$scope.reconciliation_clear = function(){
			$scope.receiptDate = '';
			$scope.rrNo = ''; 
			$scope.selected = 'date_wise';
			$scope.receiptDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		}
	}
	
	
}]);