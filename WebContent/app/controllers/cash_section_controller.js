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
	             {field: 'new_purpose_key', displayName: 'New RR Number', width : '10%'},
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
		
		$scope.receipts_posting_details_clear = function(e){
			$scope.receipts_posting_details = [];
			$scope.receiptsPostingDetailsGridOptions.data = [];
			$scope.receiptsPostingReceiptDate = $filter('date')(new Date(), 'dd/MM/yyyy');
			$counterNumber.val('');
		};
		
		

		$scope.receipts_posting_details_post = function(){
			
			$scope.receipts_posting_details = [];
			
			var request = {
					conn_type : "LT",
					location_code :  $rootScope.user.location_code,
					user_id  : $rootScope.user.user_id,
					"receipt_date": $scope.receiptsPostingReceiptDate,
					"counter_number": (($scope.receiptsPostingCounter) ? $scope.receiptsPostingCounter : '')
				}
				console.log(request);
				remote.load("dorecepitposting", function(response){
					/*$scope.receipts_posting_details = response.receipts_list;
					console.log(response.receipts_list);
					$scope.receiptsPostingDetailsGridOptions.data = $scope.receipts_posting_details;*/
					
					setTimeout(function () {
						$scope.load_receipt_details_for_posting();
					},1000);
				}, request , 'POST');
			
		};
	}
	
	// receipts generation starts
	if(cash_section_flow === 'receipts_generation'){
		
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
					"conn_type":'LT',
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
					"conn_type":'LT',
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
					"conn_type":'LT',
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
	
	
}]);