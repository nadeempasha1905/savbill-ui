var main_controller = angular.module('main_controller',[]);

main_controller.controller('main_controller',['$scope','$rootScope','remote','$timeout','$compile','$uibModal','uiGridConstants','$sce','notify','$filter','webValidations','$http','$window',
    function($scope,$rootScope,remote,$timeout,$compile,$uibModal,uiGridConstants,$sce,notify,$filter,webValidations,$http,$window){
	
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
	
	if(main_flow === 'bill_cancellation'){

		var $rr_no = $('#rr_no');
		
		$scope.getRRnoDetails = function(){
			$scope.disable_rr_no = true;
			var request = {
				"conn_type" : $rootScope.user.connection_type,
				"rr_no": (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : '')
			}
			remote.load("getrrdetailsforbillcancel", function(response){
				$scope.data = response.rr_details_for_bill_cancel;
				if (Object.keys($scope.data).length<=0){
					notify.warn('No Bills Found for RR Number : '+$rr_no.val());
					$scope.clear_entries();
					return;
				}else{
					$('#remarks').focus();
				}
			}, request ,'POST');
			
		}
		
		$scope.cancel_bill = function(){
			if(!$scope.disable_rr_no){
				notify.warn('Please fetch RR No details from DB');
				return;
			}
			if(!$scope.data.remarks){
				notify.warn('Please fill Remarks to Submit');
				return;
			}
			var request = {
				"conn_type" : $rootScope.user.connection_type,
				"rr_no": (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : ''),
				"userid" : $rootScope.user.user_id,
				"remarks" : $scope.data.remarks
			}
			remote.load("cancelbill", function(response){
				$scope.clear_entries();
			}, request ,'POST');
			
			
		}
		
		$scope.clear_entries = function(){
			$scope.data = {};
			$scope.disable_rr_no = false;
			$timeout(function(){
				$rr_no.focus();
			});
		}
		
	}
	
	// view_bills grid starts
	if(main_flow === 'view_bills'){
		
		$scope.print_bill = function(e, row){
			alert('Print bill functionality build in progress...');
			console.log(row);
		}
		$scope.view_bill = function(e, row){
			var viewBillModalInstance = $uibModal.open({
				animation: true,
				size: 'lg',
			    templateUrl: templates.modal.view_bill,
			    controller: function($scope, $uibModalInstance, configs, data, data_set, print_bill){
			    	var data_set_length = data_set.length;
			    	$scope.frames = configs;
			    	$scope.data = angular.copy(data);
			    	$scope.print_bill = print_bill;
			    	$scope.next = function(){
			    		var current = parseInt($scope.data.row_no);
			    		$scope.data = angular.copy(data_set[(current+data_set_length) % data_set_length]);
			    	}
			    	$scope.previous = function(){
			    		var current = parseInt($scope.data.row_no);
			    		$scope.data = angular.copy(data_set[(current-2+data_set_length) % data_set_length]);
			    	}
			    },
			    resolve: {
			        configs: function() {
			        	return $scope.viewBillModalConfig;
			        },
			        data: function() {
			        	return row.entity;
			        },
			        data_set: function() {
			        	return $scope.viewBillsGridOptions.data;
			        },
			        print_bill: function(){
			        	return $scope.print_bill;
			        }
			    }
			});
		}
		
		$scope.viewBillModalConfig = [
		     {
		    	 'header': 'Primary Details',
		    	 'config': [
    	            {field: 'row_no', displayName: '#'},
					{field: 'rr_no', displayName: 'RR Number'},
					{field: 'tariff', displayName: 'Tariff'},
					{field: 'bill_no', displayName: 'Bill No'},
					{field: 'bill_date', displayName: 'Bill Date'},
					{field: 'bill_due_date', displayName: 'Due Date'},
					{field: 'bill_type', displayName: 'Bill Type'},
					{field: 'bill_period_from', displayName: 'Bill Period From'},	             
					{field: 'bill_period_to', displayName: 'Bill Period To'},
					{field: 'consmr_sts', displayName: 'Customer Status'},
					{field: 'mtr_rdr_cd', displayName: 'MR Code'},
					{field: 'mtr_rdg_day', displayName: 'Rdg Day'},
					{field: 'bill_kw', displayName: 'Load KW'},
					{field: 'bill_hp', displayName: 'Load HP'},
					{field: 'bill_kva', displayName: 'Load KVA'}
	    	     ]
		     },{
		    	 'header': 'Meter Reading & Consumption Details',
		    	 'config': [
		    	    {field: 'bill_gen_mode', displayName: 'Bill Gen On'},
		    	    {field: 'prev_reading', displayName: 'Prev Reading'},
					{field: 'pres_reading', displayName: 'Pres Reading'},
					{field: 'bill_md', displayName: 'BMD'},
					{field: 'bill_pf', displayName: 'BPF'},
					{field: 'mult_const', displayName: 'Multi Const'},
					{field: 'fl_units', displayName: 'FL Units'},
					{field: 'error_crep', displayName: 'Error Crep(%)'},
					{field: 'unit_consmp', displayName: 'Units'}		    	    
	    	     ]
		     },{
		    	 'header': 'Balance Details',
		    	 'config': [
					{field: 'bill_amt', displayName: 'Bill Amt'},
					{field: 'paid_amt', displayName: 'Paid Amt'},
					{field: 'paid_date', displayName: 'Paid Date'},
					{field: 'rebate_amt', displayName: 'Rebate Amt'},
					{field: 'wdrl_amt', displayName: 'Wdrl Amt'},
					{field: 'credit_amt', displayName: 'Credit Amt'},                                                 
					{field: 'trf_chng_flg', displayName: 'Trf Chng Flag'},
					{field: 'fl_consmr', displayName: 'FL Flag'},
					{field: 'bal_amt', displayName: 'Balance Amt'},
					{field: 'energy_entlment', displayName: 'Energy Entlment'},
					{field: 'demand_entlment', displayName: 'Dmd Entlment'},
					{field: 'line_min', displayName: 'Line Min'},
					{field: 'arr_bill_no', displayName: 'Arr Bill No'},
					{field: 'arr_bill_date', displayName: 'Arr Bill Date'}
	    	     ]
		     },{
		    	 'header': 'CT PT Details',
		    	 'config': [
		    	    {field: 'ct_ratio_avail', displayName: 'CT Ratio Avail '},
					{field: 'ct_ratio_num', displayName: 'CT Ratio Num'},
					{field: 'ct_ratio_den', displayName: 'CT Ratio Den'},
					{field: 'pt_ratio_avail', displayName: 'PT Ratio Avail'},
					{field: 'pt_ratio_num', displayName: 'PT Ratio Num'},
					{field: 'pt_ratio_den', displayName: 'PT Ratio Den'}
	    	     ]
		     },{
		    	 'header': 'Other Details',
		    	 'config': [
    	            {field: 'bill_user', displayName: 'User ID'},
    	            {field: 'bill_tmpstp', displayName: 'Time Stamp'}
	    	     ]
		     }
		];
		
		$scope.viewBillsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			expandableRowTemplate: templates.billing.view_bills_expansion,
		    expandableRowHeight: 350,
			columnDefs: [
	             {field: 'row_no', displayName: '#', width : '3%', hide: true},
	             {field: 'rr_no', displayName: 'RR Number', width : '8%'},
	             {field: 'tariff', displayName: 'Tariff', width : '6%'},
	             {field: 'bill_no', displayName: 'Bill No', width : '5%'},
	             {field: 'bill_date', displayName: 'Bill Date', width : '7%'},
	             {field: 'bill_due_date', displayName: 'Due Date', width : '7%'},
	             {field: 'bill_kw', displayName: 'KW', width : '4%'},
	             {field: 'bill_hp', displayName: 'HP', width : '4%'},
	             {field: 'bill_kva', displayName: 'KVA', width : '4%'},
	             {field: 'prev_reading', displayName: 'IR', width : '6%'},
	             {field: 'pres_reading', displayName: 'FR', width : '6%'},
	             {field: 'unit_consmp', displayName: 'Units', width : '5%'},
	             {field: 'bill_amt', displayName: 'Bill Amt', width : '7%'},
	             {field: 'paid_amt', displayName: 'Paid', width : '6%'},
	             {field: 'credit_amt', displayName: 'Credit', width : '5%'},
	             {field: 'bal_amt', displayName: 'Balance', width : '8%'},
	        ],
	        data: [],
	        onRegisterApi: function (gridApi) {
	        	//print action
	        	var printCellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-print" ng-click="grid.appScope.print_bill($event,row.entity)" title="Print Bill"></button></div>';
	        	gridApi.core.addRowHeaderColumn({ name: 'Print', displayName: '', width: '3%', cellTemplate: printCellTemplate } );
	        	//whole data view action
	        	var viewCellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-fullscreen" ng-click="grid.appScope.view_bill($event,row)" title="View Bill"></button></div>';
	        	gridApi.core.addRowHeaderColumn({ name: 'View', displayName: '', width: '3%', cellTemplate: viewCellTemplate } );
	        	
	        	gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
	                if (row.isExpanded) {
	                	$scope.parentRow = row.entity;
	                	
	                	//Bill break up grid loading
	                	$scope.parentRow.billBreakUpGridOptions = {
	                		showColumnFooter: true,
	                		enableRowSelection: true, 
	                		enableRowHeaderSelection: false,
	                		multiSelect: false,
	                		modifierKeysToMultiSelect: false,
	                		noUnselect: true,
	    	                columnDefs: [
	    						{field: 'row_id', displayName: 'Sl. No', width : '6%', footerCellTemplate: '<div class="ui-grid-cell-contents" style="font-weight: bold;">Total:</div>'},
	    						{field: 'chrg_cd_descr', displayName: 'Charge Code', width : '30%'},
	    						{field: 'billed_amt', displayName: 'Demand', width : '16%', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
	    						{field: 'rbt_amt', displayName: 'Rebate', width : '16%',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
	    						{field: 'wdrls_amt', displayName: 'Withdrawal', width : '16%',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
	    						{field: 'total_amt', displayName: 'Total', width : '16%', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true}
	    		            ],
	    		            onRegisterApi : function(gridApi){
	    		            	gridApi.selection.on.rowSelectionChanged($scope, function(row){
	    		                   if(row.isSelected){
	    		                	   $('#billBreakUpSlabGrid').hide();
	    		                	   $scope.parentRow.billBreakUpSlabGridOptions.data = [];
	    		                	   var request = {
    				        				"rr_number": row.entity.full_rr_no,
    				        				"bill_date": row.entity.bill_dt,
    				        				"bill_number": row.entity.bill_no,
    				        				"charge_code": row.entity.chrg_cd,
    				        				"conn_type" : $rootScope.user.connection_type
    				        			}
	    			                	remote.load("getbillbreakupslabs", function(response){
	    			                		if(!response.bill_breakup_slabs){
	    			                			return;
	    			                		}
	    			                		$('#billBreakUpSlabGrid').show();
	    			                		$scope.parentRow.billBreakUpSlabGridOptions.data = response.bill_breakup_slabs;
	    			        			}, request , 'POST');
	    		                   }
	    		                });
	    	                },
	    		            data: []
	    	            };
	                	$scope.parentRow.billBreakUpSlabGridOptions = {
	                		showColumnFooter: true,
	    	                columnDefs: [
	    						{field: 'row_id', displayName: 'Sl. No', footerCellTemplate: '<div class="ui-grid-cell-contents" style="font-weight: bold;">Total:</div>'},
	    						{field: 'salb_unit', displayName: 'Units', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
	    						{field: 'slab_rate', displayName: 'Unit Rate'},
	    						{field: 'slab_amount', displayName: 'Total Rate', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true}
	    		            ],
	    		            data: []
	    	            };
	                	
	                	//Receipt grid loading
	                	$scope.parentRow.receiptGridOptions = {
	                		showColumnFooter: true,
	                		enableRowSelection: true, 
	                		enableRowHeaderSelection: false,
	                		multiSelect: false,
	                		modifierKeysToMultiSelect: false,
	                		noUnselect: true,
	    	                columnDefs: [
								{field: 'row_id', displayName: 'Sl. No', width : '6%', footerCellTemplate: '<div class="ui-grid-cell-contents" style="font-weight: bold;">Total:</div>'},
								{field: 'chrg_cd_descr', displayName: 'Charge Code', width : '34%'},
								{field: 'billed_amt', displayName: 'Demand', width : '12%', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
								{field: 'rbt_amt', displayName: 'Rebate', width : '12%',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
								{field: 'wdrls_amt', displayName: 'Withdrawal', width : '12%',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
								{field: 'total_amt', displayName: 'Total', width : '12%',aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
								{field: 'paid_amt', displayName: 'Paid', width : '12%', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true}
	    		            ],
	    		            onRegisterApi : function(gridApi){
	    		            	gridApi.selection.on.rowSelectionChanged($scope, function(row){
	    		                   if(row.isSelected){
	    		                	   $('#receiptSlabGrid').hide();
	    		                	   $scope.parentRow.receiptSlabGridOptions.data = [];
	    		                	   var request = {
    				        				"rr_number": row.entity.full_rr_no,
    				        				"bill_date": row.entity.bill_dt,
    				        				"bill_number": row.entity.bill_no,
    				        				"charge_code": row.entity.chrg_cd,
    				        				"conn_type" : $rootScope.user.connection_type
    				        			}
	    			                	remote.load("getbillreceiptbreakupslabs", function(response){
	    			                		if(!response.bill_receipt_breakup_slabs){
	    			                			return;
	    			                		}
	    			                		$('#receiptSlabGrid').show();
	    			                		$scope.parentRow.receiptSlabGridOptions.data = response.bill_receipt_breakup_slabs;
	    			        			}, request , 'POST');
	    		                   }
	    		                });
	    	                },
	    		            data: []
	    	            };
	                	$scope.parentRow.receiptSlabGridOptions = {
	                		showColumnFooter: true,
	    	                columnDefs: [
	    						{field: 'row_id', displayName: 'Sl. No', width : '6%', footerCellTemplate: '<div class="ui-grid-cell-contents" style="font-weight: bold;">Total:</div>'},
	    						{field: 'amt_paid', displayName: 'Paid Amount', width : '30%', aggregationType: uiGridConstants.aggregationTypes.sum, aggregationHideLabel: true},
	    						{field: 'rcpt_dt', displayName: 'Receipt Date', width : '16%'},
	    						{field: 'rcpt_detl', displayName: 'Receipt Details', width : '16%'},
	    						{field: 'rcpt_table', displayName: 'Receipt From', width : '16%'}
	    		            ],
	    		            data: []
	    	            };
	                	var request = {
		        				"rr_number": row.entity.full_rr_no,
		        				"bill_date": row.entity.bill_date,
		        				"bill_number": row.entity.bill_no,
		        				"conn_type" : $rootScope.user.connection_type
		        			}
	                	remote.load("getbillbreakup", function(response){
	        				row.entity.billBreakUpGridOptions.data = response.bill_breakup;
	        				row.entity.receiptGridOptions.data = response.bill_breakup;
	        			}, request , 'POST');
	                }
	            });
	        }
		};
				
		$scope.load_bills = function(){
			if( !$scope.view_bills_rr_number && !$scope.view_bills_bill_number && !$scope.view_bills_bill_date ){
				return;
			}
			$scope.viewBillsGridOptions.data = [];
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"rr_number": ($scope.view_bills_rr_number) ? $rootScope.user.location_code+$scope.view_bills_rr_number : '',
				"bill_number": $scope.view_bills_bill_number || '',
				"bill_date": $scope.view_bills_bill_date || '',
				"conn_type" : $rootScope.user.connection_type
			}
			remote.load("getbills", function(response){
				console.log(response.bills);
				$scope.viewBillsGridOptions.data = response.bills;
			}, request , 'POST');
		}
		$scope.clear_bill_view = function(){
			$scope.viewBillsGridOptions.data = [];
			delete $scope.view_bills_rr_number;
			delete $scope.view_bills_bill_number;
			delete $scope.view_bills_bill_date;
		}
	}
	
	// list_bill_details grid starts
	if(main_flow === 'list_bill_details'){
		
		
		var $rr_no = $('#list-bill-rr-number');
		var $no_of_months = $('#list-bill-no-of-months');
		$no_of_months.val('12');
		
		
		
		$scope.load_list_bill_details = function($event){
			
			if(!$rr_no.val()){
				notify.warn('Please Enter RR Number...!');
				$('#list-bill-rr-number').focus();
				return;
			}
			
			var request = {
					"location_code" : $rootScope.user.location_code,					
					"rr_number": (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : ''),
					"no_of_months" : (($no_of_months.val().trim()) ?  $no_of_months.val().trim() : ''),
					"fromdate": (($scope.listBillsFromDate) ? $scope.listBillsFromDate : ''),
					"todate": (($scope.listBillsToDate) ? $scope.listBillsToDate : ''),
					"om_code": '',
					"tariffs": '',
					"mrcode": '',
					"reading_day": '',
					"conn_type" : $rootScope.user.connection_type
				}
				remote.load("getbillslist", function(response){
					$scope.list_bills = response.bills_list;
					console.log(response.bills_list);
					$scope.listBillDetailsGridOptions.data = $scope.list_bills;
				}, request , 'POST');
			
			
		};
		
		$scope.print_list_bill_details = function($event){
			
			if(!$rr_no.val()){
				notify.warn('Please Enter RR Number...!');
				$('#list-bill-rr-number').focus();
				return;
			}
			
			$('#loading').show();
			
			/*var request = {
					"selected_location" : $rootScope.user.location_code,					
					"rr_number": (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : ''),
					"no_of_months" : (($no_of_months.val().trim()) ?  $no_of_months.val().trim() : ''),
					"fromdate": (($scope.listBillsFromDate) ? $scope.listBillsFromDate : ''),
					"todate": (($scope.listBillsToDate) ? $scope.listBillsToDate : ''),
					"om_code": '',
					"tariffs": '',
					"mrcode": '',
					"reading_day": '',
					"conn_type" : $rootScope.user.connection_type
				}
				remote.load("getbillslist", function(response){
					$scope.list_bills = response.bills_list;
					console.log(response.bills_list);
					$scope.listBillDetailsGridOptions.data = $scope.list_bills;
				}, request , 'POST');*/
			
			
			$http.get($rootScope.serviceURL+'downloadreport?conn_type='+$rootScope.user.connection_type
					+"&report_type=LIST_BILLS"
					+"&Location_Code="+$rootScope.user.location_code
					+"&selected_location="+$rootScope.user.location_code
					+"&rr_number="+ (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : '')
					+"&no_of_months="+ (($no_of_months.val().trim()) ?  $no_of_months.val().trim() : '')
					+"&fromdate="+ (($scope.listBillsFromDate) ? $scope.listBillsFromDate : '')
					+"&todate="+ (($scope.listBillsToDate) ? $scope.listBillsToDate : '')
					+"&om_code="+''
					+"&tariffs="+''
					+"&metercode="+''
					+"&reading_day="+''
					+"&username="+$rootScope.user.user_id
					
					,{ responseType : 'arraybuffer'}).then(handleResponse)
			
			
		};
		
		$scope.listBillDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: 'Sl. No',width : '5%'},
	             {field: 'rrno', displayName: 'RR Number', width : '8%'},
	             {field: 'trf', displayName: 'Tariff', width : '8%'},
	             {field: 'billno', displayName: 'Bill No', width : '8%'},
	             {field: 'billdt', displayName: 'Bill Date', width : '8%'},
	             {field: 'fr', displayName: 'Reading', width : '7%'},
	             {field: 'consp', displayName: 'Units', width : '6%'},
	             {field: 'obtot', displayName: 'Arrears', width : '6%'},
	             {field: 'fc', displayName: 'Fixed Charges', width : '9%'},
	             {field: 'ec', displayName: 'Energy Charges', width : '10%'},
	             {field: 'int', displayName: 'Interest', width : '6%'},
	             {field: 'tax', displayName: 'Tax', width : '5%'},
	             {field: 'dbt', displayName: 'Debit', width : '5%'},
	             {field: 'rbt', displayName: 'Rebate', width : '6%'},
	             {field: 'wdrl', displayName: 'Withdrawal', width : '8%'},
	             {field: 'totdmd', displayName: 'Total Demand', width : '9%'},
	             {field: 'totbal', displayName: 'Bill Amount', width : '9%'},
	             {field: 'col', displayName: 'Paid Amount', width : '9%'},
	             {field: 'credit', displayName: 'Credit', width : '6%'},
	             {field: 'cb', displayName: 'Balance', width : '9%'}
	         ],
	         data: []
		};
		
		$scope.list_bill_details_clear = function(e){
			$scope.list_bills = [];
			$rr_no.val('').focus();
			$no_of_months.val('12');
			$scope.listBillsFromDate='';
			$scope.listBillsToDate='';
			$scope.listBillDetailsGridOptions.data = [];
		};
	}
	
	function handleResponse(response){
       	var pdfFile = new Blob([response.data], { type : 'application/pdf' });	
       	var downloadURL = URL.createObjectURL(pdfFile);
       	$('#loading').hide();
       		$window.open(downloadURL);
     };
	
}]);