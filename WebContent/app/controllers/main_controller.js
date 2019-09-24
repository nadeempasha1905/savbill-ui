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
		$scope.message = null;
		
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
				$scope.message = response.message;
	    		setTimeout(function () {
	    			$scope.reconciliation_clear();
	        	}, 3000);
			}, request , 'POST');
			
		}
		$scope.reconciliation_clear = function(){
			$scope.receiptDate = '';
			$scope.rrNo = ''; 
			$scope.selected = 'date_wise';
			$scope.receiptDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.message = null;
		}
	}
	
	if(main_flow === 'process_details'){
		
		$scope.getprocessdetailslist = function(){
			
			if(!$scope.meterreadingday){
				notify.warn("Please Select Reading Day !!!");
				return;
			}
			$scope.process_list = [];$scope.process_rrnumber_list = [];
			var request = {
					"conn_type": $rootScope.user.connection_type,
					"Location" : $rootScope.user.location_code,
					"readingday" : $scope.meterreadingday
				};
			
			remote.load("getprocessdetails", function(response){
				console.log(response);
				$scope.process_list = response.process_list;
			}, request , 'POST');
		};
		
		$scope.getrrnumberdetails = function(row){
			$scope.process_rrnumber_list = [];
			var request = {
					"conn_type": $rootScope.user.connection_type,
					"Location" : $rootScope.user.location_code,
					"meterreadercode" : row.CM_MTR_RDR_CD,
					"billdate": row.CB_MRI_BILL_DT
				};
			
			remote.load("getrrnumberdetails", function(response){
				console.log(response);
				$scope.process_rrnumber_list = response.process_rrnumber_list;
			}, request , 'POST');
		};
		
		$scope.preparemeteretoreset = function(rowid,row){
			 $scope.process_list.map(function(e,index){
				 $('#meter_row'+index).removeClass("meter_highlight");
			 });
			 $('#'+rowid).addClass("meter_highlight");
			 
			 $scope.selected_mr = true;
			 $scope.request_mrreset = {
					 "conn_type": $rootScope.user.connection_type,
					 "locationcode" : $rootScope.user.location_code,
					 "meter_reader_code": row.CM_MTR_RDR_CD,
					 "bill_date": row.CB_MRI_BILL_DT,
					 "status" : row.CB_RR_STS
			 };
		};	
		
		$scope.preparerrnotoreset = function(rowid,row){
			 $scope.process_rrnumber_list.map(function(e,index){
				 $('#rrno_row'+index).removeClass("rrno_highlight");
			 });
			 $('#'+rowid).addClass("rrno_highlight");
			 
			 $scope.selected_rr = true;
			 $scope.request_rrreset = {
					 "conn_type": $rootScope.user.connection_type,
					 "locationcode" : $rootScope.user.location_code,
					 "rrno":$rootScope.user.location_code+row.CM_RR_NO,
					 "meter_reader_code": row.CM_MTR_RDR_CD,
					 "bill_date": row.CB_MRI_BILL_DT,
					 "status" : row.CB_RR_STS
			 };
		};	
		
		$scope.process_mr_reset = function(){
			if(!$scope.request_mrreset){
				notify.warn("Invalid Record !!!");
				return;
			}
			
			var status = confirm("Are Sure To Reset The MRcode "+$scope.request_rrreset.meter_reader_code +"For The Date "+$scope.request_rrreset.bill_date);
			if(status == true){
				remote.load("doprocessmrreset", function(response){
					console.log(response);
					if(response.status === "success"){
						$scope.getprocessdetailslist();
					}
				}, $scope.request_mrreset , 'POST');
			}
		};
		
		$scope.process_rr_reset = function(){
			if(!$scope.request_rrreset){
				notify.warn("Invalid Record !!!");
				return;
			}
			var status = confirm("Are Sure To Reset The RRNo "+$scope.request_rrreset.rrno+" Of MRcode "+$scope.request_rrreset.meter_reader_code +"And Date "+$scope.request_rrreset.bill_date);
			if(status == true){
				remote.load("doprocessrrreset", function(response){
					console.log(response);
					if(response.status === "success"){
						var data = {"CM_MTR_RDR_CD":$scope.request_rrreset.meter_reader_code,"CB_MRI_BILL_DT":$scope.request_rrreset.bill_date};
						$scope.getrrnumberdetails(data);
					}
				}, $scope.request_rrreset , 'POST');
			}
		};
		
		$scope.clear = function(){
			$scope.meterreadingday = null;
			$scope.readingdays = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
			$scope.process_list = [];
			$scope.process_rrnumber_list = [];
			$scope.request_mrreset = {};
			$scope.request_rrreset = {};
			$scope.selected_mr = false;
			$scope.selected_rr = false;
		};
		
		$scope.clear();
		
	}
	
	
}]);