var deposits_controller = angular.module('deposits_controller',[]);

deposits_controller.controller('deposits_controller',['$scope','$rootScope','remote','$uibModal','$timeout','$compile','notify',function($scope,$rootScope,remote,$uibModal,$timeout,$compile,notify){
	
	var deposits_flow = $rootScope.breadcrumb[$rootScope.breadcrumb.length-1];

	if(deposits_flow === 'customer_deposits'){
		
		var $rr_no = $('#customer-deposits-rr-number');
		var $ldgr_no = $('#customer-deposits-ledger-number');
		var $folio_no = $('#customer-deposits-ledger-folio-number');
		var $om_cd = $('#customer-master-details-om-code');
		var $mr_cd = $('#customer-deposits-details-mr-code');
		var $rdg_day = $('#customer-deposits-details-rdg-day');
		
		//getomcodelist
		var request = {
			"Conn_Type": $rootScope.user.connection_type,
			"Location_Code": $rootScope.user.location_code
		}
		remote.load("getomunitlist", function(response){
			$scope.om_list = response.OM_LIST;
		}, request , 'POST', false, false, true);
		
		var request = {
				"om_code": $scope.om_code || $rootScope.user.location_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
		}
		remote.load("getMeterReaderCodesByOMUnit", function(response){
			$scope.MeterReaderCode = response.MeterReaderCode;
		}, request , 'POST');

		
		$scope.get_meter_reader_info = function(){
			var request = {
				"om_code": $scope.om_code || $rootScope.user.location_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReaderCodesByOMUnit", function(response){
				$scope.MeterReaderCode = response.MeterReaderCode;
			}, request , 'POST');
		}
		$scope.get_reading_day_info = function(){
			var request = {
				"om_code": $scope.om_code || $rootScope.user.location_code,
				"mr_code": $scope.mr_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReadingDayByMrCode", function(response){
				$scope.MeterReadingDay = response.MeterReadingDay;
			}, request , 'POST');
		}
		
		$scope.load_deposit_details = function(){
			$scope.customerDepositsGridOptions.data = [];
			var request = {
				"conn_type": $rootScope.user.connection_type,
				"location_code": $rootScope.user.location_code,
				"rr_number": (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : ''),
				"Ledger_number": (($ldgr_no.val().trim()) ? $ldgr_no.val().trim() : ''),
				"folio_number": (($folio_no.val().trim()) ? $folio_no.val().trim() : ''),
				"om_code": (($om_cd.val().trim()) ? $om_cd.val().trim() : ''),
				"mr_code": (($mr_cd.val().trim()) ? $mr_cd.val().trim() : ''),
				"reading_day": (($rdg_day.val().trim()) ? $rdg_day.val().trim() : '')
			}
			console.log(request);
			remote.load("getcustomerdeposits", function(response){
				$scope.customerDepositsGridOptions.data = response.customer_deposits;
			}, request , 'POST');
		};
		
		$scope.customerDepositsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			expandableRowTemplate: '<div ui-grid="row.entity.depositsBreakUpGridOptions" style="width:100%;height:180px;"></div>',
		    expandableRowHeight: 180,
			columnDefs: [
	            {field: 'row_num', displayName: '#', width : '4%'},
	            {field: 'rr_no', displayName: 'RR Number', width : '10%'},
				{field: 'tariff', displayName: 'Tariff', width : '10%'},
				{field: 'ldgr_no', displayName: 'Ledger', width : '8%'},
				{field: 'folio_no', displayName: 'Ledger Folio', width : '9%'},
				{field: 'mr_cd', displayName: 'MR Code', width : '8%'},
				{field: 'rdg_day', displayName: 'Reading Day', width : '9%'},
				{field: 'mmd', displayName: 'MMD Total', width : '9%'},
				{field: 'msd', displayName: 'MSD Total', width : '9%'},
				{field: 'ymd', displayName: 'YMD Total', width : '9%'},
				{field: 'tot_dep', displayName: 'Deposits Total', width : '12%'}
	        ],
	        data: [],
	        onRegisterApi: function (gridApi) {
	        	gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
	                if (row.isExpanded) {
	                	//Deposits break up grid loading
	                	row.entity.depositsBreakUpGridOptions = {
	                		showGridFooter: true,
	                		gridFooterHeight: 20,
	    	                columnDefs: [
	    	                             
								{field: 'row_num', displayName: '#', width : '4%', hide : true},
								{field: 'rr_no', displayName: 'RR Number', width : '10%'},
								{field: 'pymnt_purpose_decription', displayName: 'Purpose',field_key : 'pymnt_purpose', width : '10%'},
								{field: 'deposit_amount', displayName: 'Amount', width : '8%'},
								{field: 'rcpt_no', displayName: 'Receipt Number', width : '12%'},
								{field: 'rcpt_dt', displayName: 'Receipt Date', width : '9%'},
								{field: 'counter_name', displayName: 'Counter',field_key : 'counter_no', width : '15%'},
								{field: 'adj_sts_description', displayName: 'Adjusted Sts',field_key : 'adj_sts', width : '9%'},
								{field: 'remarks', displayName: 'Remarks', width : '24%'},
								{field: 'dr_acct_cd', displayName: 'DR Acct Cd', width : '9%'},
								{field: 'cr_acct_cd', displayName: 'Cr Acct Cd', width : '9%'},
								{field: 'adjusted_bill_no', displayName: 'Adjusted Bill No', width : '12%'},
								{field: 'adjusted_bill_dt', displayName: 'Adjusted Bill Date', type : 'date', width : '12%'},
								{field: 'valid_to_dt', displayName: 'Valid Upto', type : 'date', width : '9%'},
								{field: 'userid', displayName: 'User ID', width : '9%', hide : true},
								{field: 'tmpstp', displayName: 'Time Stamp', width : '13%', hide : true},
	    		            ],
	    		            data: []
	    	            };
	                	var request = {
	        				"rr_number": $rootScope.user.location_code + row.entity.rr_no,
	        				"conn_type": $rootScope.user.connection_type
	        			}
	                	console.log(request);
	                	remote.load("getcustomerdepositsdetails", function(response){
	                		console.log(response);
	        				row.entity.depositsBreakUpGridOptions.data = response.customer_deposit_details;
	        			}, request , 'POST');
	                }
	            });
	        }
		};
		
		$scope.customer_deposits_clear = function(e){
			$rr_no.val('').focus();
			$ldgr_no.val('');
			$folio_no.val('');
			$om_cd.val('');
			$mr_cd.val('');
			$rdg_day.val('');
			$scope.customerDepositsGridOptions.data = [];
		};
		
		$scope.add_customer_deposit_details = function(e){
			var addDepositDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	console.log(configs);
			    	$scope.header = "Add New Deposit Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		rated_by : '500',
			    		rated_dt : $filter('date')(new Date(), 'dd/MM/yyyy'),
			    		ref_dt : $filter('date')(new Date(), 'dd/MM/yyyy')
			    	};
			    	$scope.ok = function(){
			    		//TODO: validate form
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no,
			    			option : 'ADD'
			    		});
		    			remote.load("upsertratingdetails", function(response){
		    				$uibModalInstance.close();
		    			}, request ,'POST');
			    	}
			    	$scope.cancel = function(){
			    		$uibModalInstance.dismiss();
			    	}
			    },
			    resolve: {
			        configs: function() {
			        	return $scope.row.entity.depositsBreakUpGridOptions.data.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
		};
	}
	
	if(deposits_flow === 'generate_add_mmd_and_deposits_intrest'){
		
		$scope.selected = 'additional_mmd';
		$scope.rr_selected = 'all';
		
		
		var type = 'additional_mmd';
		
		if ($scope.selected === 'additional_mmd'){
			type = 'ADD_MMD';
		}else{
			type = 'SEC_DEP_INT';
		}
		
		$scope.get_deposit_int_nmmd_parameters = function() {
			var request = {
					"type" : type,
					"location_code": $rootScope.user.location_code,
					"conn_type": $rootScope.user.connection_type
			}
			console.log(request);
			remote.load("getdepositinstrestandnmmdparameters", function(response){
				$scope.depositIntNmmdParameters = response.deposit_instrest_nmmd_parameters;
				$scope.mmd=$scope.depositIntNmmdParameters[0].nmmd;
				$scope.promptMmd=$scope.depositIntNmmdParameters[0].prompt_nmmd;
				$scope.interest=$scope.depositIntNmmdParameters[0].sec_dep_int_percent;
				$scope.tdsAmount=$scope.depositIntNmmdParameters[0].sec_dep_int_tds_maxamt;
				$scope.tdsInterest=$scope.depositIntNmmdParameters[0].sec_dep_int_tds_percent;
			}, request , 'POST');
		}

		
		$scope.get_deposit_int_nmmd_parameters();
		
		
		$scope.generate_mmd_interest = function(){
			
		}
		$scope.clear_form = function(){
			
		}
	}	
	
	if(deposits_flow === 'deposit_interest_approval'){
		
		//load deposit interest Year
    	var request = {
			conn_type : $rootScope.user.connection_type,
			location_code : $rootScope.user.location_code,
			type : 'SEC_DEP_INT'
		}
		remote.load("getdepositinstrestyear", function(response){
			$scope.YearList = response.depint_mmd_year_details;
		}, request , 'POST');
		
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
		$scope.get_meter_reader_info();
		
		$scope.get_reading_day_info = function(){
			var request = {
				"conn_type": $rootScope.user.connection_type,
				"location_code": $rootScope.user.location_code,
				"om_code": $scope.om_code || $rootScope.user.location_code,
				"mr_code": $scope.mr_code || '',
			}
			remote.load("getMeterReadingDayByMrCode", function(response){
				$scope.MeterReadingDay = response.MeterReadingDay;
			}, request , 'POST');
		}
		$scope.get_reading_day_info();
		
		$scope.depositInterestDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#', width : '4%'},
	             {field: 'rr_no', displayName: 'RR Number', width : '8%'},
	             {field: 'md_cd', displayName: 'MR Code', width : '8%'},
	             {field: 'rdg_day', displayName: 'Rdg Day', width : '7%'},
	             {field: 'total_deposit', displayName: 'Total Deposit', width : '9%'},
	             {field: 'intrst_rate', displayName: 'Int Rate(%)', width : '8%'},
	             {field: 'deposit_interest', displayName: 'Deposit Intrest', width : '10%'},
	             {field: 'credited_amt', displayName: 'Credited Amt', width : '10%'},
	             {field: 'credited_dt', displayName: 'Credited Date', width : '12%'},
	             {field: 'balance_deposit_int', displayName: 'Balance Credit Amt', width : '12%'},
	             {field: 'user_id', displayName: 'User ID', width : '10%'},
	             {field: 'tmpstp', displayName: 'Time Stamp', width : '13%'}
             ],
             data: [],
             onRegisterApi : function(gridApi){
             	$scope.gridApi = gridApi;
             }
 		};
 		
		$scope.load_deposit_interest_approval_details = function(){
			
			$scope.depositInterestDetailsGridOptions.data = [];
			
			if(!$scope.year){
				notify.warn('Please Select Year...');
				return;
			}
			if(!$scope.rdg_day){
				notify.warn('Please Select Reading Day...');
				return;
			}
			
			var request = {
				"conn_type": $rootScope.user.connection_type,
				"location_code": $rootScope.user.location_code,
				"year": $scope.year,
				"mr_cd": $scope.mr_code || '',
				"rdg_day": $scope.rdg_day
			}
			remote.load("getpendingdepositintrestdetails", function(response){
				$scope.depositInterestDetailsGridOptions.data = response.pending_deposit_int_details;
			}, request , 'POST');
		}
		
 		$scope.approve_deposit_interest_details = function(){
 			var selected_rows = $scope.gridApi.selection.getSelectedRows();
 			if(!selected_rows.length){
 				notify.warn('Select Rows to Approve...');
 				return;
 			}
 			var request = {
 				conn_type: $rootScope.user.connection_type,
 				approverid : $rootScope.user.user_id,
 				data: selected_rows
 			};
 			remote.load("approvedepositsintrest", function(response){
 				$scope.load_deposit_interest_approval_details();
 			}, request , 'POST');
 		};
 		
 		$scope.refresh_deposit_interest_details = function(){
 			$scope.load_deposit_interest_approval_details();
 		};
 		
 		$scope.clear_deposit_interest_details = function(e){
 			$scope.depositInterestDetailsGridOptions.data = [];
 			$scope.year = '';
 			$scope.mr_code = '';
 			$scope.rdg_day = '';
		};
	}
	
}]);