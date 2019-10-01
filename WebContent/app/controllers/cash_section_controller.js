var cash_section_controller = angular.module('cash_section_controller',[]);

cash_section_controller.controller('cash_section_controller',['$scope','$rootScope','remote','$timeout','$filter','$compile','notify',function($scope,$rootScope,remote,$timeout,$filter,$compile,notify){
	
	var cash_section_flow = $rootScope.breadcrumb[$rootScope.breadcrumb.length-1];
	
	// search payments starts
	if(cash_section_flow === 'search_payments'){
		
		var $rr_no = $('#search-payments-rr-number');
		var $receipt_no = $('#search-payments-receipt-number');
		var $cheque_no = $('#search-payments-cheque-number');
		var $bank_name = $('#search-payments-bank-name');
		
		$scope.load_search_payments_details = function(){
			if(!$scope.searchPaymentsRRNumber && !$scope.searchPaymentsReceiptNumber && !$scope.searchPaymentsReceiptDate && !$scope.searchPaymentsCounter && !$scope.searchPaymentsPurpose && !$scope.searchPaymentsChequeNumber && !$scope.searchPaymentsChequeDate && !$scope.searchPaymentsBank){
				notify.warn('Invalid nuput...');
				$('#search-payments-rr-number').focus();
				return;
			}
			var request = {
				"conn_type" : $rootScope.user.connection_type,
				"type" : '',
				"rr_no" : (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : ''),
				"receipt_date" : (($scope.searchPaymentsReceiptDate) ?  $scope.searchPaymentsReceiptDate : ''),
				"receipt_number" : (($receipt_no.val().trim()) ? $receipt_no.val().trim() : ''),
				"counter_number" : (($scope.searchPaymentsCounter) ?  $scope.searchPaymentsCounter : ''),
				"purpose" : (($scope.searchPaymentsPurpose) ?  $scope.searchPaymentsPurpose : ''),
				"cheque_dd_date" : (($scope.searchPaymentsChequeDate) ?  $scope.searchPaymentsChequeDate : ''),
				"cheque_dd_number" : (($cheque_no.val().trim()) ? $cheque_no.val().trim() : ''),
				"bank_name": (($bank_name.val().trim()) ? $bank_name.val().trim() : ''),
				"limit" : '0'
			}
			$scope.data = {};
			$scope.collection = [];
			remote.load("getreceiptdetails", function(response){
				$scope.collection = response.receipt_details;
				if($scope.collection.length){
					$scope.data = $scope.collection[0];
				}
			}, request , 'POST');
		};
		
		$scope.next = function(){
			if($scope.collection.length){
				$scope.data = $scope.collection[(parseInt($scope.data.r) + $scope.collection.length) % $scope.collection.length];
			}
		};
		
		$scope.previous = function(){
			if($scope.collection.length){
				$scope.data = $scope.collection[(parseInt($scope.data.r) - 2 + $scope.collection.length) % $scope.collection.length];
			}
		};
		
		$scope.first = function(){
			if($scope.collection.length){
				$scope.data = $scope.collection[0];
			}
		};
		
		$scope.last = function(){
			if($scope.collection.length){
				$scope.data = $scope.collection[$scope.collection.length - 1];
			}
		};
		
		$scope.search_payments_details_clear = function(){
			$scope.data = {};
			$scope.collection = [];
			$rr_no.val('').focus();
			$scope.searchPaymentsReceiptDate='';
			$receipt_no.val('') ;
			$scope.searchPaymentsCounter = '';
			$scope.searchPaymentsPurpose = '';
			$scope.searchPaymentsChequeDate = '';
			$cheque_no.val('');
			$bank_name.val('');
		};
		
	}
		
	// list_of_payments grid starts
	if(cash_section_flow === 'list_of_payment'){
		
		var $rr_no = $('#list-payments-rr-number');
		var $no_of_months = $('#list-payments-no-of-months');
		$no_of_months.val('12');
		
		$scope.load_list_payments_details = function($event){
			if(!$scope.listPaymentsRRNumber){
				notify.warn('Please Enter RR Number..!');
				$('#list-payments-rr-number').focus();
				return;
			}
			var request = {
					"conn_type" : $rootScope.user.connection_type,
					"rr_number": (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : ''),
					"no_of_months" : (($no_of_months.val().trim()) ?  $no_of_months.val().trim() : '12'),
					"from_date": (($scope.listPaymentsFromDate) ?  $scope.listPaymentsFromDate : ''),
					"to_date": (($scope.listPaymentsToDate) ?  $scope.listPaymentsToDate : ''),
				}
				console.log(request);
				remote.load("getlistofpayments", function(response){
					$scope.list_of_payment_details = response.payments_list;
					$scope.listOfPaymentDetailsGridOptions.data = $scope.list_of_payment_details;
				}, request , 'POST');
		};
		
		$scope.listOfPaymentDetailsGridOptions = {
			showGridFooter: true,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
	             {name : 'row_num', displayName: '#', width : '4%'},
	             {field: 'rr_no', displayName: 'RR Number', width : '10%'},
	             {field: 'amt_paid', displayName: 'Paid Amount', width : '10%'},
	             {field: 'rcpt_no', displayName: 'Receipt Number', width : '10%'},
	             {field: 'rcpt_dt', displayName: 'Receipt Date', width : '10%'},
	             {field: 'countr_no', displayName: 'Counter Number', width : '10%'},
	             {field: 'pymnt_purpose', displayName: 'Payment Purpose', width : '20%'},
	             {field: 'pymnt_mode', displayName: 'Payment Mode', width : '10%'},
	             {field: 'chq_dd_no', displayName: 'Cheque/DD Number', width : '15%'},
	             {field: 'chq_dd_dt', displayName: 'Cheque/DD Date', width : '15%'},
	             {field: 'drawn_bank', displayName: 'Drawee Bank', width : '15%'},
	             {field: 'dishonour_dt', displayName: 'Cheque Dishoner Date', width : '15%'}
	         ],
	         data: []
		};
		
		$scope.list_payments_details_clear = function(e){
			$scope.listOfPaymentDetailsGridOptions.data = [];
			$scope.list_of_payment_details = [];
			$rr_no.val('').focus();
			$no_of_months.val('12');
			$scope.listPaymentsFromDate = '';
			$scope.listPaymentsToDate = '';
		};
	}
	
	// receipts posting details grid starts
	if(cash_section_flow === 'receipts_posting'){
		
		$counterNumber = $('#receipt-posting-cash-counter-number');
		$scope.receiptsPostingReceiptDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		
		var request = {
				"location_code": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
		}
		remote.load("cashcounterlist", function(response){
			$scope.cashCountersList = response.cash_counters_list;
		}, request , 'POST');
		
		$scope.load_receipt_details_for_posting = function($event){
			
			$scope.receipts_posting_details = [];
			
			var request = {
				"location_code": $rootScope.user.location_code,
				"receipt_date": $scope.receiptsPostingReceiptDate,
				"counter_number": (($counterNumber.val()) ? $counterNumber.val() : '')
			}
			console.log(request);
			remote.load("getrecieptsforpost", function(response){
				$scope.receipts_posting_details = response.receipts_list;
				console.log(response.receipts_list);
				$scope.receiptsPostingDetailsGridOptions.data = $scope.receipts_posting_details;
			}, request , 'POST');
		};
		
		$scope.receiptsPostingDetailsGridOptions = {
			showGridFooter: true,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
	             {field: 'row_num', displayName: '#', width : '4%'},
	             {field: 'rr_no', displayName: 'RR Number', width : '10%'},
	             {field: 'new_purpose_key', displayName: 'New RR Number', width : '10%',enableCellEdit: true,
	              cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-disabled="grid.appScope.disablefieldsonpostedstatus(row.entity)"/></div>'},
	             {field: 'purpose_descr', displayName: 'Payment Purpose', width : '11%'},
	             {field: 'amt_paid', displayName: 'Paid Amount', width : '8%'},
	             {field: 'rcpt_no', displayName: 'Receipt Number', width : '10%'},
	             {field: 'rcpt_dt', displayName: 'Receipt Date', width : '8%'},
	             {field: 'countr_name', displayName: 'Counter Number',  width : '15%'},
	             {field: 'pymnt_mode_description', displayName: 'Payment Mode', width : '10%'},
	             {field: 'description', displayName: 'Status', width : '15%'}/*,
	             {field: 'chq_dd_no', displayName: 'Cheque/DD Number', width : '10%'},
	             {field: 'chq_dd_dt', displayName: 'Cheque/DD Date', width : '10%'},
	             {field: 'drawn_bank', displayName: 'Drawee Bank', width : '10%'},
	             {field: 'payee_name', displayName: 'Payee Name', width : '10%'},
	             {field: 'remarks', displayName: 'Remarks', width : '10%'},
	             {field: 'cancel_flg', displayName: 'Cancel Flag', width : '10%'},
	             {field: 'rcpt_typ', displayName: 'Receipt Type', width : '10%'},
	             {field: 'posted_sts', displayName: 'Posted Staus', width : '10%'},
	             {field: 'printed_flg', displayName: 'Printed flag', width : '10%'},
	             {field: 'rrno_applno_flg', displayName: 'RR Numger Applno flag', width : '15%'},
	             {field: 'less_amt_realised', displayName: 'Less Amount Realised', width : '10%'},
	             {field: 'less_amt_posted_sts', displayName: 'Less Amount Posted Status', width : '10%'},
	             {field: 'ldgr_no', displayName: 'Ledger Number', width : '10%'},
	             {field: 'folio_no', displayName: 'Folio number', width : '10%'},
	             {field: 'status', displayName: 'Status Code', width : '10%'},
	             {field: 'purpose', displayName: 'Payment Purpose Code', width : '10%'},
	             {field: 'purpose_key', displayName: 'Purpose Key', width : '10%'},
	             {field: 'userid', displayName: 'User ID', width : '10%'},
	             {field: 'tmpstp', displayName: 'Time Stamp', width : '10%'}*/

	         ],
	         data: []
		};
		
		$scope.disablefieldsonpostedstatus = function(row){
			console.log(row);
			return (row.status ===  '2')   ? false : true ;
		};
		
		$scope.receipts_posting_details_clear = function(e){
			$scope.receipts_posting_details = [];
			$scope.receiptsPostingDetailsGridOptions.data = [];
			$scope.receiptsPostingReceiptDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$counterNumber.val('');
		};
		
		

		$scope.receipts_posting_details_post = function(){
			
			$scope.receipts_posting_details = [];
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
					location_code :  $rootScope.user.location_code,
					user_id  : $rootScope.user.user_id,
					"receipt_date": $scope.receiptsPostingReceiptDate,
					"counter_number": (($scope.receiptsPostingCounter) ? $scope.receiptsPostingCounter : '')
				}
				console.log(request);
				remote.load("dorecepitposting", function(response){
					$scope.receipts_posting_details = response.receipts_list;
					console.log(response.receipts_list);
					$scope.receiptsPostingDetailsGridOptions.data = $scope.receipts_posting_details;
					
					if(response.status1 === 'fail'){
						setTimeout(function () {
							$scope.load_receipt_details_for_posting();
						},500);
					}
					
					
				}, request , 'POST');
			
		};
		
		$scope.receipts_posting_details_re_post = function(){
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code,
					"user_id": $rootScope.user.user_id,
					"receipt_date": $scope.receiptsPostingReceiptDate,
					"counter_number": (($scope.receiptsPostingCounter) ? $scope.receiptsPostingCounter : ''),
					"receipts_list" : $scope.receipts_posting_details
				}
				console.log(request);
				remote.load("doreceiptreposting", function(response){
					$scope.receipts_posting_details = response.receipts_list;
					console.log(response.receipts_list);
					$scope.receiptsPostingDetailsGridOptions.data = $scope.receipts_posting_details;
				}, request , 'POST');
			
		};
	}
	
	// receipts generation starts
	if(cash_section_flow === 'automatic_receipts'){
		
		$scope.receipts_entry = {};
		$scope.billdetails = {};
		
		$scope.paymentpurposelist = [
			{key:'1',value:'Revenue'}
		];
		
		$scope.paymentmodelist = [
			{key:'cash',value:'Cash'},
			{key:'cheque',value:'Cheque'}
		];
		
		$scope.receipts_generation_clear = function(){
			
			$scope.receipts_entry = {};
			$scope.billdetails    = {};
			
			$scope.receipts_entry.paymentmode = 'cash';
			$scope.receipts_entry.paymentpurpose = '1';
			$scope.receipts_entry.chequenumber = '' ;
			$scope.receipts_entry.chequeamount = '' ;
			$scope.receipts_entry.draweebank   = '' ;
			$scope.loadreceiptdate();
			$scope.loadchequedate();
			$scope.billdetails.rrnumber = '' ;
			$scope.billdetails.billamount = '' ;
			$scope.billdetails.consumername = '' ;
			$scope.receipt_details = [];
			$scope.total_bill_amount = 0;
			$scope.cash_counter = "10000001";
			
			$('#billdetails_rrnumber').focus();
			
			$scope.getSummaryDetails();
			
	//		$("#receipt_info_table").height($('#bill_details_div').height() -125);
			
		};
		
		$scope.loadreceiptdate = function(){
			$scope.receipts_entry.receiptdate = '';
			$scope.receipts_entry.receiptdate =  $filter('date')(new Date(), 'dd/MM/yyyy');
			
			
		};
		
		$scope.loadchequedate = function(){
			
			$scope.receipts_entry.chequedate = '';
			$scope.receipts_entry.chequedate =  $filter('date')(new Date(), 'dd/MM/yyyy');
			
		};
		
		$scope.getBillDetailsbyrrno = function(){
			
			if(!$scope.billdetails.rrnumber){
				notify.warn("Please enter the shop number");
				$scope.billdetails.rrnumber.focus();
				$scope.billdetails.billamount = '';
				$scope.billdetails.consumername = '';
				return;
			}
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
					"rrno" :   $rootScope.user.location_code +$scope.billdetails.rrnumber
			};
			
			console.log("request",request);
			remote.load("getbilldetailsinreceiptgen", function(response){
				console.log("getbilldetailsinreceiptgen",response);
				$scope.billdetails.billamount = response.amount_paid;
				$scope.billdetails.consumername = response.consumer_name;
				$scope.billdetails.customerid = response.ivrs_id;
				$scope.billdetails.newrrno = response.cd_rr_no;
				$('#add_button').focus();
			}, request , 'POST');
			
		};
		
		$scope.addreceipttotable = function(){
			
			if(parseInt($scope.billdetails.billamount) <= 0){
				notify.error("Please enter valid bill amount !!!");
				return;
			}
			
			var addobj = {
				
					"rrno":  $rootScope.user.location_code +$scope.billdetails.rrnumber,
					"name":$scope.billdetails.consumername,
					"amount":$scope.billdetails.billamount,
					"customerid":$scope.billdetails.customerid,
					"newrrno":$scope.billdetails.newrrno
			};
			
			$scope.receipt_details.push(addobj);
			$scope.calculatetotalamount();
			
			$scope.billdetails.rrnumber = '' ;
			$scope.billdetails.consumername = '' ;
			$scope.billdetails.billamount = '' ;
			$('#billdetails_rrnumber').focus();
		};

		$scope.calculatetotalamount = function(){
			
			$scope.total_bill_amount = 0;
			amount = 0 ;
			
			$.each($scope.receipt_details, function(index,jsonObject){
			    $.each(jsonObject, function(key,val){
			        if(key === "amount"){
			        	console.log(val);
			        	amount = amount + parseInt(val);
			        }
			    });
			});
			$scope.total_bill_amount = amount ;
		};
		
		$scope.getSummaryDetails = function(){
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
					"receipt_date" : ($scope.receipts_entry.receiptdate === undefined ? '' : $scope.receipts_entry.receiptdate),
					"counter_number" : ($scope.cash_counter === undefined ? '' : $scope.cash_counter)
			};
			
			console.log("request",request);
			remote.load("getreceiptsummarydetails", function(response){
				console.log("getreceiptsummarydetails",response);
				$scope.summarydetails = response.summarydetails[0];
			}, request , 'POST');
		};
		
		$scope.SaveAndPrintReceipts = function(){
			
			var request = {} ;
			
			if($scope.receipts_entry.paymentmode === 'cash'){
			
				if(!$scope.receipts_entry.receiptdate){
					notify.warn("Please Select The Receipt Date");
					return;
				}else if(!$scope.receipts_entry.paymentmode){
					notify.warn("Please Select The payment mode");
					return;
				}else if($scope.receipt_details.length == 0){
					notify.error("No Receipts Generated !!!");
					return;
				} 
			}else if($scope.receipts_entry.paymentmode === 'cheque'){
				
				if(!$scope.receipts_entry.receiptdate){
					notify.warn("Please Select The Receipt Date");
					return;
				}else if(!$scope.receipts_entry.chequedate){
					notify.warn("Please Select The Cheque Date");
					return;
				}else if(!$scope.receipts_entry.chequenumber){
					notify.warn("Please enter The Cheque Number");
					return;
				}else if(!$scope.receipts_entry.chequeamount){
					notify.warn("Please enter The Cheque Amount");
					return;
				}else if(!$scope.receipts_entry.draweebank){
					notify.warn("Please enter the drawee bank");
					return;
				}else if($scope.receipt_details.length == 0){
					notify.error("No Receipts Found !!!");
					return;
				}
				
				if($scope.total_bill_amount != $scope.receipts_entry.chequeamount ){
					notify.error("Bill Amount Should Match Cheque Amount !!!");
					return;
				}
			}
			
			request =  {
					"conn_type": $rootScope.user.connection_type,
					cash_counter : ($scope.cash_counter === undefined ? '' : $scope.cash_counter) ,
					location :  $rootScope.user.location_code,
					user_id  : $rootScope.user.user_id,
					receipt_date: ($scope.receipts_entry.receiptdate === undefined ? '' : $scope.receipts_entry.receiptdate),
					payment_mode : (($scope.receipts_entry.paymentmode === 'cash') ? 'C' : (($scope.receipts_entry.paymentmode === 'cheque') ? 'CHQ' : '') ),
					payment_purpose : ($scope.receipts_entry.paymentpurpose === undefined ? '' : $scope.receipts_entry.paymentpurpose),
					cheque_date : ($scope.receipts_entry.chequedate === undefined ? '' : $scope.receipts_entry.chequedate),
					cheque_number : ($scope.receipts_entry.chequenumber === undefined ? '' : $scope.receipts_entry.chequenumber) ,
					cheque_amount : ($scope.receipts_entry.chequeamount === undefined ? '' : $scope.receipts_entry.chequeamount),
					drawee_bank : ($scope.receipts_entry.draweebank === undefined ? '' : $scope.receipts_entry.draweebank),
					remarks : '',
					receipt_details : $scope.receipt_details
			};
			
			console.log(request);
			
			remote.load("savereceiptdetails", function(response){
				console.log("savereceiptdetails",response);
				console.log(response);
				//$scope.printPdf(response.filepath);
				
				$scope.receipts_generation_clear();
				
			}, request , 'POST');
		};
		
		$scope.receipts_generation_clear();
	}
	
	// receipts generation starts
	if(cash_section_flow === 'manual_receipts'){
		
		$scope.manual_receipts_entry = {};
		$scope.billdetails = {};
		
		$scope.paymentpurposelist = [
			{key:'1',value:'Revenue'}
		];
		
		$scope.paymentmodelist = [
			{key:'cash',value:'Cash'},
			{key:'cheque',value:'Cheque'}
		];
		
		$scope.receipts_generation_clear = function(){
			
			$scope.manual_receipts_entry = {};
			$scope.billdetails    = {};
			
			$scope.load_cashcounters();
			
			$scope.manual_receipts_entry.paymentmode = 'cash';
			$scope.manual_receipts_entry.paymentpurpose = '1';
			$scope.manual_receipts_entry.chequenumber = '' ;
			$scope.manual_receipts_entry.chequeamount = '' ;
			$scope.manual_receipts_entry.draweebank   = '' ;
			$scope.loadreceiptdate();
			$scope.loadchequedate();
			$scope.billdetails.rrnumber = '' ;
			$scope.billdetails.billamount = '' ;
			$scope.billdetails.consumername = '' ;
			$scope.receipt_details = [];
			$scope.total_bill_amount = 0;
			//$scope.cash_counter = "10000001";
			$scope.manual_receipts_entry.cashcounter = $rootScope.user.location_code +"1";
			
			$('#billdetails_receiptnumber').focus();
			
			
			
    		setTimeout(function () {
    			$scope.getSummaryDetails();
    		}, 1000);
    		
    		setTimeout(function () {
    			$scope.getfirstreceiptnumber();
    		}, 1000);
    		
			
			
			$scope.MANUAL_RECEIPT_NUMBER = 0;
			
		};
		
		$scope.loadreceiptdate = function(){
			$scope.manual_receipts_entry.receiptdate = '';
			$scope.manual_receipts_entry.receiptdate =  $filter('date')(new Date(), 'dd/MM/yyyy');
			
			
		};
		
		$scope.loadchequedate = function(){
			
			$scope.manual_receipts_entry.chequedate = '';
			$scope.manual_receipts_entry.chequedate =  $filter('date')(new Date(), 'dd/MM/yyyy');
			
		};
		
		$scope.focustofield = function(field_id){
			$('#'+field_id).focus().select();
		};
		
		$scope.getBillDetailsbyrrno = function(){
			
			if(!$scope.billdetails.rrnumber){
				notify.warn("Please enter the shop number");
				$scope.billdetails.rrnumber.focus();
				$scope.billdetails.billamount = '';
				$scope.billdetails.consumername = '';
				return;
			}
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
					"rrno" :   $rootScope.user.location_code +$scope.billdetails.rrnumber
			};
			
			console.log("request",request);
			remote.load("getbilldetailsinreceiptgen", function(response){
				console.log("getbilldetailsinreceiptgen",response);
				$scope.billdetails.billamount = response.amount_paid;
				$scope.billdetails.consumername = response.consumer_name;
				$scope.billdetails.customerid = response.ivrs_id;
				$scope.billdetails.newrrno = response.cd_rr_no;
				$scope.focustofield('billdetails_billamount');
				//$('#billdetails_billamount').focus();
				//$('#add_button').focus();
			}, request , 'POST');
			
		};
		
		$scope.addreceipttotable = function(){
			
			if(parseInt($scope.billdetails.billamount) <= 0){
				notify.error("Please enter valid bill amount !!!");
				return;
			}
			
			var addobj = {
				
					"manualreceiptnumber" : $scope.billdetails.receiptnumber,
					"rrno":  $rootScope.user.location_code +$scope.billdetails.rrnumber,
					"name":$scope.billdetails.consumername,
					"amount":$scope.billdetails.billamount,
					"customerid":$scope.billdetails.customerid,
					"newrrno":$scope.billdetails.newrrno
			};
			
			$scope.receipt_details.push(addobj);
			$scope.calculatetotalamount();
			
			$scope.billdetails.rrnumber = '' ;
			$scope.billdetails.consumername = '' ;
			$scope.billdetails.billamount = '' ;
			$('#billdetails_rrnumber').focus();
			
			$scope.MANUAL_RECEIPT_NUMBER = parseInt($scope.billdetails.receiptnumber) + 1;
			$scope.billdetails.receiptnumber = $scope.MANUAL_RECEIPT_NUMBER;
			
		};

		$scope.calculatetotalamount = function(){
			
			$scope.total_bill_amount = 0;
			amount = 0 ;
			
			$.each($scope.receipt_details, function(index,jsonObject){
			    $.each(jsonObject, function(key,val){
			        if(key === "amount"){
			        	console.log(val);
			        	amount = amount + parseInt(val);
			        }
			    });
			});
			$scope.total_bill_amount = amount ;
		};
		
		$scope.getSummaryDetails = function(){
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
					"receipt_date" : ($scope.manual_receipts_entry.receiptdate === undefined ? '' : $scope.manual_receipts_entry.receiptdate),
					"counter_number" : ($scope.manual_receipts_entry.cashcounter === undefined ? '' : $scope.manual_receipts_entry.cashcounter)
			};
			
			console.log("request",request);
			remote.load("getreceiptsummarydetailshrt", function(response){
				console.log("getreceiptsummarydetailshrt",response);
				$scope.summarydetails = response.summarydetails[0];
			}, request , 'POST');
		};
		
		$scope.SaveAndPrintReceipts = function(){
			
			var request = {} ;
			
			if($scope.manual_receipts_entry.paymentmode === 'cash'){
			
				if(!$scope.manual_receipts_entry.receiptdate){
					notify.warn("Please Select The Receipt Date");
					return;
				}else if(!$scope.manual_receipts_entry.paymentmode){
					notify.warn("Please Select The payment mode");
					return;
				}else if($scope.receipt_details.length == 0){
					notify.error("No Receipts Generated !!!");
					return;
				} 
			}else if($scope.manual_receipts_entry.paymentmode === 'cheque'){
				
				if(!$scope.manual_receipts_entry.receiptdate){
					notify.warn("Please Select The Receipt Date");
					return;
				}else if(!$scope.manual_receipts_entry.chequedate){
					notify.warn("Please Select The Cheque Date");
					return;
				}else if(!$scope.manual_receipts_entry.chequenumber){
					notify.warn("Please enter The Cheque Number");
					return;
				}else if(!$scope.manual_receipts_entry.chequeamount){
					notify.warn("Please enter The Cheque Amount");
					return;
				}else if(!$scope.manual_receipts_entry.draweebank){
					notify.warn("Please enter the drawee bank");
					return;
				}else if($scope.receipt_details.length == 0){
					notify.error("No Receipts Found !!!");
					return;
				}
				
				if($scope.total_bill_amount != $scope.manual_receipts_entry.chequeamount ){
					notify.error("Bill Amount Should Match Cheque Amount !!!");
					return;
				}
			}
			
			request =  {
					"conn_type": $rootScope.user.connection_type,
					cash_counter : ($scope.manual_receipts_entry.cashcounter === undefined ? '' : $scope.manual_receipts_entry.cashcounter) ,
					location :  $rootScope.user.location_code,
					user_id  : $rootScope.user.user_id,
					receipt_date: ($scope.manual_receipts_entry.receiptdate === undefined ? '' : $scope.manual_receipts_entry.receiptdate),
					payment_mode : (($scope.manual_receipts_entry.paymentmode === 'cash') ? 'C' : (($scope.manual_receipts_entry.paymentmode === 'cheque') ? 'CHQ' : '') ),
					payment_purpose : ($scope.manual_receipts_entry.paymentpurpose === undefined ? '' : $scope.manual_receipts_entry.paymentpurpose),
					cheque_date : ($scope.manual_receipts_entry.chequedate === undefined ? '' : $scope.manual_receipts_entry.chequedate),
					cheque_number : ($scope.manual_receipts_entry.chequenumber === undefined ? '' : $scope.manual_receipts_entry.chequenumber) ,
					cheque_amount : ($scope.manual_receipts_entry.chequeamount === undefined ? '' : $scope.manual_receipts_entry.chequeamount),
					drawee_bank : ($scope.manual_receipts_entry.draweebank === undefined ? '' : $scope.manual_receipts_entry.draweebank),
					remarks : '',
					receipt_details : $scope.receipt_details
			};
			
			console.log(request);
			
			remote.load("savereceiptdetailsmanualreceipts", function(response){
				console.log("savereceiptdetailsmanualreceipts",response);
				console.log(response);
				//$scope.printPdf(response.filepath);
				
				$scope.receipts_generation_clear();
				
			}, request , 'POST');
		};
		
		
		$scope.verifyReceiptNumber = function(){
			
			if(!$scope.billdetails.receiptnumber){
				notify.warn("Please enter the receipt number");
				('#billdetails_receiptnumber').focus();
				$scope.billdetails_rrnumber = '';
				$scope.billdetails.billamount = '';
				$scope.billdetails.consumername = '';
				return;
			}
			
			var request = {
					"receiptno" :  $scope.billdetails.receiptnumber,
					"receiptdate" : $scope.manual_receipts_entry.receiptdate,
					"counterno" :$scope.manual_receipts_entry.cashcounter,
					"conn_type": $rootScope.user.connection_type,
			};
			
			console.log("request",request);
			remote.load("verifyreceiptnumber", function(response){
				console.log("verifyreceiptnumber",response);
				
				if(response.receipts_count == -1 || response.receipts_count == 0){
					$scope.billdetails_rrnumber = '';
					$scope.billdetails.billamount = '';
					$scope.billdetails.consumername = '';
					//$scope.receiptgen_rrnumber.focus();
					$('#billdetails_rrnumber').focus();
					notify.success("Receipt Number : "+$scope.billdetails.receiptnumber+" Not Exists. You may continue.");
					
					
				}else{
					notify.error("Receipt Number : "+$scope.billdetails.receiptnumber+" Already Exists. Kindly enter new receipt number");
					$scope.receiptgen_manualreceiptnumber = '';
					//$scope.receiptgen_manualreceiptnumber.focus();
					$scope.billdetails_rrnumber = '';
					$scope.billdetails.billamount = '';
					$scope.billdetails.consumername = '';
					
					$scope.billdetails.error_message = "Receipt Number : "+$scope.billdetails.receiptnumber+" Already Exists. Kindly enter new receipt number ." ; 
					
					$timeout(function(){
						$scope.billdetails.error_message = null;
					},5000);
					
					$('#billdetails_receiptnumber').focus();
				}
				
				//$scope.receiptgen_shopname = response.shop_name;
				//$scope.receiptgen_billamount = response.amount_paid;
			}, request , 'POST');
			
		};
		
		$scope.getfirstreceiptnumber = function(){
			
			var request = {
					"receiptdate" : $scope.manual_receipts_entry.receiptdate,
					"counterno" :$scope.manual_receipts_entry.cashcounter,
					"conn_type": $rootScope.user.connection_type,
			};
			
			remote.load("getfirstreceiptnumber", function(response){
				console.log("getfirstreceiptnumber",response);
				
				$scope.billdetails.receiptnumber = response.NEW_RECEIPT_NUMBER;
				$('#billdetails_rrnumber').focus();
				$scope.MANUAL_RECEIPT_NUMBER = response.NEW_RECEIPT_NUMBER;
				
			}, request , 'POST');
			
		};
		
		
		$scope.load_cashcounters = function(){
			$scope.manual_receipts_entry.cashcounter = null;
			var request = {
					"location_code": $rootScope.user.location_code,
					"conn_type": $rootScope.user.connection_type,
					"counter_type":'HRT'
			}
			remote.load("cashcounterlist", function(response){
				$scope.cashCountersList = response.cash_counters_list;
				$scope.manual_receipts_entry.cashcounter = $scope.cashCountersList[0].key;
			}, request , 'POST');
		}
		
		$scope.receipts_generation_clear();
		
	}
	
	// receipt/cheque cancellation starts
	if(cash_section_flow === 'receipt_cancellation'){
		
		remote.load("cashcounterlist", function(response){
			$scope.cash_counters_list = response.cash_counters_list;
		}, { conn_type : $rootScope.user.connection_type,location_code : $rootScope.user.location_code, } , 'POST');																												
		
		$scope.togglefunction = function(canceltype){
			
			if(canceltype === 'receiptwise'){
				
				 $scope.receiptcancel = {};
				 
				 $scope.cancel_type_selected = 'receiptwise' ;
				 
				 $scope.receiptcancel.receiptno = '';
				 $scope.receiptcancel.cancelflag = 'N';
				 $('#receipt_no').val('').focus();
				 
				 $scope.message = '';
			     $scope.sts = '';
			     
				 $scope.proceed = true;
				 $scope.change = true;
				 
				 $scope.receiptcancel.receiptdate =  $filter('date')(new Date(), 'dd/MM/yyyy');
				 
			}
			
			else if(canceltype === 'chequewise'){
				
				 $scope.chequecancel = {};
				 
				 $scope.cheque_details = {};
				
				 $scope.cancel_type_selected = 'chequewise' ;
				 
				 $scope.chequecancel.receiptno = '';
				 $scope.chequecancel.cancelflag = 'N';
				 $('#cheque_no').val('').focus();
				 
				 $scope.message = '';
		    	 $scope.sts = '';
		    	 
		    	 $scope.proceed = true;
				 $scope.change = true;
				 
				 $scope.chequecancel.chequedate =  $filter('date')(new Date(), 'dd/MM/yyyy');
				 
			}
			
		};
		
		$scope.load_receipt_details_for_cancellation = function(){
			
			if(!$scope.receiptcancel.receiptdate){
				notify.warn("Please Select Date");
				return;
			}
			if(!$scope.receiptcancel.counter){
				notify.warn("Please Select Counter");
				return;
			}
			if(!$scope.receiptcancel.receiptno){
				notify.warn("Please eneter receipt no");
				$('#receipt_no').val('').focus();
				return;
			}

			var request = {
					"location_code": $rootScope.user.location_code,
					"conn_type": $rootScope.user.connection_type,
					"user_id": $rootScope.user.user_id,
					"counter": (($scope.receiptcancel.counter) ? $scope.receiptcancel.counter : ''),
					"receiptdate": (($scope.receiptcancel.receiptdate) ? $scope.receiptcancel.receiptdate : ''),
					"receiptno": (($scope.receiptcancel.receiptno) ? $scope.receiptcancel.receiptno : '')
				}
				console.log(request);
			remote.load("getreceiptdetailstocancel", function(response){
				$scope.receiptcancel.cancelflag = response.cancel_flag;
				$scope.receiptcancel.rrnumber     = response.shop_number;
				$scope.receiptcancel.customername = response.payee_name;
				$scope.receiptcancel.amountpaid = response.amount_paid;
				$scope.receiptcancel.payment = response.payment_mode_descr;
				if(response.cancel_flag === 'Y' || response.posted_status === '4'){
					$scope.proceed = true;
				}else{
					$scope.proceed = false;
				}
				$scope.message = response.message;
				$scope.sts = response.sts;
			}, request , 'POST');
		};
		
		$scope.load_cheque_details_for_cancellation = function(){
			
			$scope.cheque_details = [];
			
			if(!$scope.chequecancel.chequedate){
				notify.warn("Please Select Date");
				return;
			}
			if(!$scope.chequecancel.counter){
				notify.warn("Please Select Counter");
				return;
			}
			if(!$scope.chequecancel.chequeno){
				notify.warn("Please eneter receipt no");
				$('#cheque-no').val('').focus();
				return;
			}

			var request = {
					"location_code": $rootScope.user.location_code,
					"conn_type": $rootScope.user.connection_type,
					"user_id": $rootScope.user.user_id,
					"counter": (($scope.chequecancel.counter) ? $scope.chequecancel.counter : ''),
					"cheque_date": (($scope.chequecancel.chequedate) ? $scope.chequecancel.chequedate : ''),
					"cheque_no": (($scope.chequecancel.chequeno) ? $scope.chequecancel.chequeno : '')
				}
				console.log(request);
			remote.load("getchequedetailstocancel", function(response){
				
				console.log(response);
				
				$scope.cheque_details = response.cheque_list;
				$scope.chequecancel.draweebank  = response.bankname;
				$scope.chequecancel.chequeamount = response.total_cheque_amount;
				if(response.cancel_flag === 'Y' || response.posted_status === '4'){
					$scope.proceed = true;
					
					$scope.message = response.message;
					$scope.sts = response.sts;
				}else{
					$scope.proceed = false;
					$scope.change = true;
				}
				/*$scope.message = response.message;
				$scope.sts = response.sts;*/
			}, request , 'POST');
			
		};
		
		$scope.change_value = function(value){
			
			if(value === 'c'){
				if($scope.receiptcancel.cancelflag === 'Y'){
					$scope.change = false;
				}else{
					$scope.change = true;
				}
			}else if(value === 'chq'){
				if($scope.chequecancel.cancelflag === 'Y'){
					$scope.change = false;
				}else{
					$scope.change = true;
				}
			}
		};
		
		$scope.receipts_do_cancel = function(){
			
			if($scope.cancel_type_selected === 'receiptwise'){
				
				var request = {
						"location_code": $rootScope.user.location_code,
						"conn_type": $rootScope.user.connection_type,
						"user_id": $rootScope.user.user_id,
						"counter": (($scope.receiptcancel.counter) ? $scope.receiptcancel.counter : ''),
						"receiptdate": (($scope.receiptcancel.receiptdate) ? $scope.receiptcancel.receiptdate : ''),
						"receiptno": (($scope.receiptcancel.receiptno) ? $scope.receiptcancel.receiptno : '')
					};
				console.log(request);
				remote.load("docancelreceipts", function(response){
					console.log(response);
					$scope.receipts_clear();

				}, request , 'POST');
				
			}else if($scope.cancel_type_selected === 'chequewise'){
				
				var request = {
						"location_code": $rootScope.user.location_code,
						"conn_type": $rootScope.user.connection_type,
						"user_id": $rootScope.user.user_id,
						"counter": (($scope.chequecancel.counter) ? $scope.chequecancel.counter : ''),
						"cheque_date": (($scope.chequecancel.chequedate) ? $scope.chequecancel.chequedate : ''),
						"cheque_no": (($scope.chequecancel.chequeno) ? $scope.chequecancel.chequeno : '')
					};
				console.log(request);
				remote.load("docancelcheques", function(response){
					console.log(response);
					$scope.receipts_clear();
				}, request , 'POST');
				
			}
			

			
		};
		
		$scope.receipts_clear = function(){
			
			$scope.receiptcancel = {};
			$scope.chequecancel = {};
			
			$scope.proceed = true;
			$scope.change = true;
			
		        $("#cancel_receiptwise").prop("checked", true);
		        $("#cancel_chequewise").prop("checked", false);
			
		        $scope.cancel_type_selected = 'receiptwise' ;
		        
		        $scope.togglefunction('receiptwise');
		        
		        $scope.message = '';
		    	$scope.sts = '';
			
		};
		
		$scope.receipts_clear();
		
	}
	
	if(cash_section_flow === 'upload_hrt_receipts'){
		
		$scope.getSummaryDetails = function(){
			
			if(!$scope.uploadmanual_receiptdate){
				notify.warn("Please Select Date");
				return;
			}
			if(!$scope.uploadmanual_counter){
				notify.warn("Please Select Counter");
				return;
			}
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
					"receipt_date" : ($scope.uploadmanual_receiptdate === undefined ? '' : $scope.uploadmanual_receiptdate),
					"counter_number" : ($scope.uploadmanual_counter === undefined ? '' : $scope.uploadmanual_counter)
			};
			
			console.log("request",request);
			remote.load("getreceiptsummarydetailshrt", function(response){
				console.log("getreceiptsummarydetailshrt",response);
				$scope.summarydetails = response.summarydetails[0];
				
			//	$('#myModal').modal('toggle');
				
			}, request , 'POST');
		};
		
		$scope.upload_receipts = function(){
			
			if(!$scope.uploadmanual_receiptdate){
				notify.warn("Please Select Date");
				return;
			}
			if(!$scope.uploadmanual_counter){
				notify.warn("Please Select Counter");
				return;
			}
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
					"receipt_date" : ($scope.uploadmanual_receiptdate === undefined ? '' : $scope.uploadmanual_receiptdate),
					"counter_number" : ($scope.uploadmanual_counter === undefined ? '' : $scope.uploadmanual_counter),
					"user_id": $rootScope.user.user_id
			};
			
			console.log("request",request);
			remote.load("uploadmanualreceipts", function(response){
				$scope.cancel();
			}, request , 'POST');
			
			
		};
		
		$scope.cancel = function(){
			$scope.summarydetails = null;
			$scope.uploadmanual_counter = null;
			$scope.uploadmanual_receiptdate =  $filter('date')(new Date(), 'dd/MM/yyyy');
			
			remote.load("cashcounterlist", function(response){
				$scope.cash_counters_list = response.cash_counters_list;
			}, { conn_type : $rootScope.user.connection_type,location_code : $rootScope.user.location_code,counter_type:'HRT' } , 'POST');	
		};
		
		$scope.cancel();
		
	}
	
	// HRT receipt/cheque cancellation starts
	if(cash_section_flow === 'hrt_receipt_cancellation'){
		
		remote.load("cashcounterlist", function(response){
			$scope.cash_counters_list = response.cash_counters_list;
		}, { conn_type : $rootScope.user.connection_type,location_code : $rootScope.user.location_code,counter_type:'HRT' } , 'POST');																												
		
		$scope.togglefunction = function(canceltype){
			
			if(canceltype === 'receiptwise'){
				
				 $scope.receiptcancel = {};
				 
				 $scope.cancel_type_selected = 'receiptwise' ;
				 
				 $scope.receiptcancel.receiptno = '';
				 $scope.receiptcancel.cancelflag = 'N';
				 $('#receipt_no').val('').focus();
				 
				 $scope.message = '';
			     $scope.sts = '';
			     
				 $scope.proceed = true;
				 $scope.change = true;
				 
				 $scope.receiptcancel.receiptdate =  $filter('date')(new Date(), 'dd/MM/yyyy');
				 
			}
			
			else if(canceltype === 'chequewise'){
				
				 $scope.chequecancel = {};
				 
				 $scope.cheque_details = {};
				
				 $scope.cancel_type_selected = 'chequewise' ;
				 
				 $scope.chequecancel.receiptno = '';
				 $scope.chequecancel.cancelflag = 'N';
				 $('#cheque_no').val('').focus();
				 
				 $scope.message = '';
		    	 $scope.sts = '';
		    	 
		    	 $scope.proceed = true;
				 $scope.change = true;
				 
				 $scope.chequecancel.chequedate =  $filter('date')(new Date(), 'dd/MM/yyyy');
				 
			}
			
		};
		
		$scope.load_receipt_details_for_cancellation = function(){
			
			if(!$scope.receiptcancel.receiptdate){
				notify.warn("Please Select Date");
				return;
			}
			if(!$scope.receiptcancel.counter){
				notify.warn("Please Select Counter");
				return;
			}
			if(!$scope.receiptcancel.receiptno){
				notify.warn("Please eneter receipt no");
				$('#receipt_no').val('').focus();
				return;
			}

			var request = {
					"location_code": $rootScope.user.location_code,
					"conn_type": $rootScope.user.connection_type,
					"user_id": $rootScope.user.user_id,
					"counter": (($scope.receiptcancel.counter) ? $scope.receiptcancel.counter : ''),
					"receiptdate": (($scope.receiptcancel.receiptdate) ? $scope.receiptcancel.receiptdate : ''),
					"receiptno": (($scope.receiptcancel.receiptno) ? $scope.receiptcancel.receiptno : '')
				}
				console.log(request);
			remote.load("getreceiptdetailstocancel_hrt", function(response){
				$scope.receiptcancel.cancelflag = response.cancel_flag;
				$scope.receiptcancel.rrnumber     = response.shop_number;
				$scope.receiptcancel.customername = response.payee_name;
				$scope.receiptcancel.amountpaid = response.amount_paid;
				$scope.receiptcancel.payment = response.payment_mode_descr;
				if(response.cancel_flag === 'Y' || response.posted_status === '4'){
					$scope.proceed = true;
				}else{
					$scope.proceed = false;
				}
				$scope.message = response.message;
				$scope.sts = response.sts;
			}, request , 'POST');
		};
		
		$scope.load_cheque_details_for_cancellation = function(){
			
			$scope.cheque_details = [];
			
			if(!$scope.chequecancel.chequedate){
				notify.warn("Please Select Date");
				return;
			}
			if(!$scope.chequecancel.counter){
				notify.warn("Please Select Counter");
				return;
			}
			if(!$scope.chequecancel.chequeno){
				notify.warn("Please eneter receipt no");
				$('#cheque-no').val('').focus();
				return;
			}

			var request = {
					"location_code": $rootScope.user.location_code,
					"conn_type": $rootScope.user.connection_type,
					"user_id": $rootScope.user.user_id,
					"counter": (($scope.chequecancel.counter) ? $scope.chequecancel.counter : ''),
					"cheque_date": (($scope.chequecancel.chequedate) ? $scope.chequecancel.chequedate : ''),
					"cheque_no": (($scope.chequecancel.chequeno) ? $scope.chequecancel.chequeno : '')
				}
				console.log(request);
			remote.load("getchequedetailstocancel_hrt", function(response){
				
				console.log(response);
				
				$scope.cheque_details = response.cheque_list;
				$scope.chequecancel.draweebank  = response.bankname;
				$scope.chequecancel.chequeamount = response.total_cheque_amount;
				if(response.cancel_flag === 'Y' || response.posted_status === '4'){
					$scope.proceed = true;
					
					$scope.message = response.message;
					$scope.sts = response.sts;
				}else{
					$scope.proceed = false;
					$scope.change = true;
				}
				/*$scope.message = response.message;
				$scope.sts = response.sts;*/
			}, request , 'POST');
			
		};
		
		$scope.change_value = function(value){
			
			if(value === 'c'){
				if($scope.receiptcancel.cancelflag === 'Y'){
					$scope.change = false;
				}else{
					$scope.change = true;
				}
			}else if(value === 'chq'){
				if($scope.chequecancel.cancelflag === 'Y'){
					$scope.change = false;
				}else{
					$scope.change = true;
				}
			}
		};
		
		$scope.receipts_do_cancel = function(){
			
			if($scope.cancel_type_selected === 'receiptwise'){
				
				var request = {
						"location_code": $rootScope.user.location_code,
						"conn_type": $rootScope.user.connection_type,
						"user_id": $rootScope.user.user_id,
						"counter": (($scope.receiptcancel.counter) ? $scope.receiptcancel.counter : ''),
						"receiptdate": (($scope.receiptcancel.receiptdate) ? $scope.receiptcancel.receiptdate : ''),
						"receiptno": (($scope.receiptcancel.receiptno) ? $scope.receiptcancel.receiptno : '')
					};
				console.log(request);
				remote.load("docancelreceipts_hrt", function(response){
					console.log(response);
					$scope.receipts_clear();

				}, request , 'POST');
				
			}else if($scope.cancel_type_selected === 'chequewise'){
				
				var request = {
						"location_code": $rootScope.user.location_code,
						"conn_type": $rootScope.user.connection_type,
						"user_id": $rootScope.user.user_id,
						"counter": (($scope.chequecancel.counter) ? $scope.chequecancel.counter : ''),
						"cheque_date": (($scope.chequecancel.chequedate) ? $scope.chequecancel.chequedate : ''),
						"cheque_no": (($scope.chequecancel.chequeno) ? $scope.chequecancel.chequeno : '')
					};
				console.log(request);
				remote.load("docancelcheques_hrt", function(response){
					console.log(response);
					$scope.receipts_clear();
				}, request , 'POST');
				
			}
			

			
		};
		
		$scope.receipts_clear = function(){
			
			$scope.receiptcancel = {};
			$scope.chequecancel = {};
			
			$scope.proceed = true;
			$scope.change = true;
			
		        $("#cancel_receiptwise").prop("checked", true);
		        $("#cancel_chequewise").prop("checked", false);
			
		        $scope.cancel_type_selected = 'receiptwise' ;
		        
		        $scope.togglefunction('receiptwise');
		        
		        $scope.message = '';
		    	$scope.sts = '';
			
		};
		
		$scope.receipts_clear();
		
	}
	
	if(cash_section_flow === 'reconciliation'){
		
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
	
}]);