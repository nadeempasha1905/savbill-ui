var customer_controller = angular.module('customer_controller',[]);

customer_controller.controller('customer_controller',['$scope','$rootScope','remote','$timeout','$compile','$uibModal','notify','$filter','webValidations', function($scope,$rootScope,remote,$timeout,$compile,$uibModal,notify,$filter,webValidations){
	
	var customer_flow = $rootScope.breadcrumb[$rootScope.breadcrumb.length-1];

	// customer master starts
	if(customer_flow === 'customer_master'){
		$scope.customer_master = {};
		$scope.depositsGridOptions = {};
		$scope.ct_pt_ratioGridOptions = {};
		$scope.documentsGridOptions = {};
		$scope.intimationsGridOptions = {};
		$scope.resetSettings = function(){
			$scope.customer_master_disable_fields = true;
			$scope.customer_master_disable_rr_no = false;
			$scope.customer_master_save_visible = false;
			$scope.customer_master_edit_visible = false;
			$scope.customer_master_update_visible = false;
		}
		$scope.resetSettings();
		// loads all picklist values for customer master
		if(!$rootScope.customer_master_picklists){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getConsumerMasterPickListValues", function(response){
				$rootScope.customer_master_picklists = response.CONSUMER_MASTER_PICKLIST;
				console.log('CONSUMER_MASTER_PICKLIST',response.CONSUMER_MASTER_PICKLIST);
			}, request , 'POST', false, false, true);
		}
		
		$scope.getCustomerRRNoDetails = function($event){
			var $this = $('#get-customer-master-details');
			if($this.val().trim() == '') {
				$this.focus();
				return false;
			}
			var request = {
				"rrNumber": $rootScope.user.location_code + $this.val().trim(),
				"location": $rootScope.user.location_code,
				"conntype": $rootScope.user.connection_type
			}
			remote.load("getconsumerrrnodetails", function(response){
				$('web-tabs').focus();
				$scope.customer_master = response;
				$scope.customer_master_disable_rr_no = true;
				$scope.customer_master_disable_fields = true;
				$scope.customer_master_edit_visible = true;
				$scope.depositsGridOptions.data = $scope.customer_master.rrno_deposits;
				$scope.ct_pt_ratioGridOptions.data = $scope.customer_master.rrno_customerCTPTratio;
				$scope.documentsGridOptions.data = $scope.customer_master.rrno_customerDocuments;
				$scope.intimationsGridOptions.data = $scope.customer_master.rrno_customerIntimations;
				$scope.get_customer_master_feeder_info();
				$scope.get_customer_master_transformer_info();
				$scope.get_customer_master_meter_reader_info();
				$scope.get_customer_master_meter_reading_day_info();
				$scope.load_deposit_totals();
				$scope.load_temp_renew();
			}, request , 'POST', function(response){
				var save = confirm("RR No entered doesn't exist. Do you want to create new customer record ?");
				if(save){
					notify.info('You are adding new customer record...');
					$scope.customer_master_save_visible = true;
					$scope.customer_master_disable_fields = false;
					$scope.customer_master_disable_rr_no = true;
					$scope.customer_master.rrno_deposits = [];
					$scope.customer_master.rrno_customerCTPTratio = [];
					$scope.customer_master.rrno_customerDocuments = [];
					$scope.customer_master.rrno_customerIntimations = [];
					//loading default values for new rr no
					angular.extend($scope.customer_master.rrno_detail, {
						cmApplntTyp: "7",
						cmTrfEffectFrmDt : $filter('date')(new Date(), 'dd/MM/yyyy'),
						cmServiceDt : $filter('date')(new Date(), 'dd/MM/yyyy'),
						cmInstallTyp : "3",
						cmTaxExemptFlg : "N",
						cmConsmrSts : "1",
						cmMeteredFlg : "Y",
						cmKebOfficeFlg : "N",
						cmTodMeterFlag : "N",
						cmPwrCutExemptFlg : "N",
						cmPurgeFlg : "N",
						cmUnauthFlg : "N",
						cmLdgrOpenedDt : $filter('date')(new Date(), 'dd/MM/yyyy'),
						cmMtrRdgCycle : "1",
						cmFirstBillDcFlg : "N",
						cmChqBounceFlg : "N",
						cmSubmeterFlg : "N",
						cmFlConsumer : "N",
						cmSlumFlg : "N",
						cmIndEffFrmDt : $filter('date')(new Date(), 'dd/MM/yyyy'),
						cmPowerSanctDt : $filter('date')(new Date(), 'dd/MM/yyyy'),
						cmPowerSanctAuth : "1",
						cmPwrPurEffFrmDt : $filter('date')(new Date(), 'dd/MM/yyyy'),
						cmSupplyEffFrmDt : $filter('date')(new Date(), 'dd/MM/yyyy'),
						cmLdEffectFrmDt : $filter('date')(new Date(), 'dd/MM/yyyy'),
						cmSupplyVolt : "230",
						cmBulkNoOfHouses : "1",
						cmPhaseOfInstln  : "1",
						cmConnTyp : "3",
						cdLangCd : '1',
						cmOldRrNo : $scope.customer_master.rrno_detail.cmRrNo,
						cmUser : $rootScope.user.user_id
					});
					$scope.customer_master.rrno_customerDescription = {
						cdRrNo : $scope.customer_master.rrno_detail.cmRrNo,
						cdLangCd : '1',
						cdUsrid : $rootScope.user.user_id
					};
					$scope.customer_master.rrno_customerSpotFolio = {
						spRRNo : $scope.customer_master.rrno_detail.cmRrNo,
						spUser : $rootScope.user.user_id
					};
					$timeout(function(){
						$('input.get-side-rrno-details').focus();
						$scope.load_deposit_totals();
					});
				}
			});
		};
		$scope.getSideRRNoDetails = function($event){
			var $this = $('#get-side-rrno-details');
			if($this.val().trim() == '') {
				$this.focus();
				return false;
			}
			var request = {
				"rrNumber": $rootScope.user.location_code + $this.val().trim(),
				"location": $rootScope.user.location_code,
				"conntype": $rootScope.user.connection_type
			}
			remote.load("getSideRRnumberValues", function(response){
				angular.extend($scope.customer_master.rrno_detail, response.rrno_detail);
				angular.extend($scope.customer_master.rrno_customerDescription, response.rrno_customerDescription);
				angular.extend($scope.customer_master.rrno_customerSpotFolio, response.rrno_customerSpotFolio);
				$scope.get_customer_master_feeder_info();
				$scope.get_customer_master_transformer_info();
				$scope.get_customer_master_meter_reader_info();
				$scope.get_customer_master_meter_reading_day_info();
			}, request , 'POST');
		};
		$scope.load_deposit_totals = function(){
			if(!$scope.depositsGridOptions.data){
				return;
			}
			var deposits = angular.copy($scope.depositsGridOptions.data);
			var each = {};
			$scope.total_mmd = 0;
			$scope.total_msd = 0;
			$scope.total_ymd = 0;
			for(var i=0; i< deposits.length; i++){
				each = deposits[i];
				if(each.cdpAdjSts === 'N'){
					if(each.cdpPymntPurpose === '2' || each.cdpPymntPurpose === '6' || each.cdpPymntPurpose === '74' || each.cdpPymntPurpose === '75'){
						$scope.total_mmd += parseInt(each.cdpAmtPaid);
					}else if(each.cdpPymntPurpose === '3' || each.cdpPymntPurpose === '15'){
						$scope.total_msd += parseInt(each.cdpAmtPaid);
					}else if(each.cdpPymntPurpose === '4' || each.cdpPymntPurpose === '47'){
						$scope.total_ymd += parseInt(each.cdpAmtPaid);
					}
				}
			}
		};
		
		$(document).on('click', '.customer-master-tabs li', function(e){
			var $target = $(e.target);
			$scope.customer_master_add_deposits_visible = false;
			$scope.customer_master_add_documents_visible = false;
			$scope.customer_master_add_ct_pt_ratio_visible = false;
			$scope.customer_master_add_intimations_visible = false;
			if($target.hasClass('customer-master-deposits-tab')){
				$scope.customer_master_add_deposits_visible = true;
				if(!$scope.depositsGridOptions.columnDefs){
					angular.extend($scope.depositsGridOptions,{
						showGridFooter: true,
						gridFooterTemplate: '<div class="ui-grid-footer-info ui-grid-grid-footer"><span>Total Items: {{grid.rows.length}}</span><span class="pull-right">Total YMD: {{grid.appScope.total_ymd || 0}}</span><span class="pull-right">Total MSD: {{grid.appScope.total_msd || 0}}</span><span class="pull-right">Total MMD: {{grid.appScope.total_mmd || 0}}</span></div>',
						gridFooterHeight: 20,
						columnDefs: [
				             {field: 'rowNUM', displayName: '#', width : '5%', readOnly: true},
				             {field: 'cdpRcptNo', displayName: 'Rcpt No', required: true, alphanumeric: true},
				             {field: 'cdpRcptDt', displayName: 'Rcpt Date', type: 'date', required: true},
				             {field: 'cashCounterDescr', displayName: 'Cash Counter No', field_key: 'cdpCashCountr', options: $rootScope.customer_master_picklists.CashCounter, required: true},
				             {field: 'cdpAmtPaid', displayName: 'Amount Paid', type: 'number', readOnly: true},
				             {field: 'depositDescription', displayName: 'Payment Purpose', required: true, readOnly: true, field_key: 'cdpPymntPurpose', options: $rootScope.customer_master_picklists.PurposeDetail},
				             {field: 'cdpRemarks', displayName: 'Remarks', alphaNumeric: true},
				             {field: 'cdpAdjStsDescription', displayName: 'Adj Status', field_key: 'cdpAdjSts', options: $rootScope.customer_master_picklists.YesNo},
				             {field: 'cdpDrAcctCd', displayName: 'Dr A/C Cd', type: 'number', float: true},
				             {field: 'cdpCrAcctCd', displayName: 'Cr A/C Cd', type: 'number', float: true}
				         ],
				         onRegisterApi: function( gridApi ) { 
				             $scope.depositsGridApi = gridApi;
				             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button ng-disabled="!(grid.appScope.customer_master_save_visible || grid.appScope.customer_master_update_visible)" class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_deposits($event,row)" title="Edit"></button></div>';
				             $scope.depositsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
				         }
					});
					$scope.load_deposit_totals();
					$scope.edit_deposits = function(e,row){
						var editDepositsModalInstance = $uibModal.open({
							animation: true,
							backdrop: 'static',
							keyboard: false,
						    templateUrl: templates.modal.edit,
						    controller: function($scope, $uibModalInstance, configs, data, remote, isNewRecord, notify){
						    	var data_backup =  angular.copy(data);
						    	$scope.header = "Edit Deposits";
						    	$scope.ok_text = "Update";
						    	$scope.configs = configs;
						    	var readOnly = [1,2,3,4];
						    	for(var i=0; i< readOnly.length;i++){
						    		$scope.configs[readOnly[i]]['readOnly'] = true;
						    	}
						    	$scope.data = data;
						    	$scope.data.cdpUser = $rootScope.user.user_id;
						    	$scope.$watch('data.cdpRcptNo',function(new_val, old_val){
						    		if(typeof new_val !== 'undefined' && new_val !== old_val){
						    			angular.extend($scope.data,{'cdpRcptDt':'', 'cdpCashCountr':''});
						    		}
						    	});
						    	$scope.$watch('data.cdpRcptDt',function(new_val, old_val){
						    		if(typeof new_val !== 'undefined' && new_val !== '' && new_val !== old_val){
						    			$scope.getAppealAmount();
						    		}
						    	});
						    	$scope.$watch('data.cdpCashCountr',function(new_val, old_val){
						    		if(typeof new_val !== 'undefined' && new_val !== '' && new_val !== old_val){
						    			$scope.getAppealAmount();
						    		}
						    	});
						    	$scope.getAppealAmount = function(){
						    		if($scope.data.cdpRcptNo && $scope.data.cdpRcptDt && $scope.data.cdpCashCountr){
						    			var request = {
					    					"conn_type": $rootScope.user.connection_type,
					    					"receipt_no": $scope.data.cdpRcptNo,
					    					"receipt_date": $scope.data.cdpRcptDt,
					    					"cash_counter_no": $scope.data.cdpCashCountr
					    				};
						    			$scope.data.depositDescription = '';
					    				$scope.data.cdpPymntPurpose = '';
					    				$scope.data.cdpAmtPaid = '';
						    			remote.load("getAppealAmount", function(response){
						    				if(response.PURPOSE_CODE === '1'){
						    					notify.warning('Revenue Purspose can not be added...');
						    					return;
						    				}
						    		        $scope.data.depositDescription = response.PURPOSE_DESCR;
						    				$scope.data.cdpPymntPurpose = response.PURPOSE_CODE;
						    				$scope.data.cdpAmtPaid = response.AMOUNT_PAID;
						    			}, request , 'POST', false, true, true);
						    		}
						    	};
						    	$scope.ok = function(){
						    		$scope.$broadcast('required-check-validity');
									if(!$.isEmptyObject($scope.addEditForm.$error)){
										return;
									}
						    		if(!isNewRecord){
						    			$scope.data.cdpAdjStsDescription = $('.cdpAdjStsDescription').find('select').find('option[value="'+$('.cdpAdjStsDescription').find('select').val()+'"]').text();
						    			var request = angular.copy($scope.data);
							    		angular.extend(request, {
							    			option : 'UPDATE',
							    			conn_type : $rootScope.user.connection_type,
							    			cdpRRNO : $rootScope.user.location_code+$scope.data.cdpRRNO
							    		});
						    			remote.load("addupdateconsumerdeposits", function(response){
						    				$uibModalInstance.close();
						    			}, request ,'POST');
						    		}else{
						    			$uibModalInstance.close('setDirty');
						    		}
						    	}
						    	$scope.cancel = function(){
						    		angular.extend($scope.data, data_backup);
						    		$uibModalInstance.dismiss();
						    	}
						    	$rootScope.popupScope = $scope;
						    },
						    resolve: {
						        configs: function() {
						        	return row.grid.options.columnDefs;
						        },
						        data: function() {
						        	return row.entity;
						        },
						        remote: function(){
						        	return remote;
						        },
						        isNewRecord: function(){
						        	return $scope.customer_master_save_visible;
						        }
						    }
						});
						editDepositsModalInstance.result.then(function (action) {
							if(action === 'setDirty'){
								$scope.customerMaster.$setDirty();
							}
							$scope.load_deposit_totals();
						});
						/*
						 * Arguments to load validations:
						 * 1. Name of the popup form
						 * 2. Current scope of the popup
						 * 3. Array of validations needed. Default is ['web-required']) if not specified
						 * Ex : webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-numeric', ...]);
						*/
						editDepositsModalInstance.rendered.then(function(){
							webValidations.load('addEditForm', $rootScope.popupScope);
						});
					}
					$scope.customer_master_add_deposits = function(e){
						var addDepositsModalInstance = $uibModal.open({
							animation: true,
							backdrop: 'static',
							keyboard: false,
						    templateUrl: templates.modal.add,
						    controller: function($scope, $uibModalInstance, configs, remote, isNewRecord, RRNo, nextRowNum){
						    	$scope.header = "Add New Deposits";
						    	$scope.ok_text = "Add";
						    	$scope.configs = configs;
						    	
						    	var readOnly = [1,2,3,4];
						    	for(var i=0; i< readOnly.length;i++){
						    		$scope.configs[readOnly[i]]['readOnly'] = false;
						    	}
						    	
						    	$scope.data = {
						    		cdpUser : $rootScope.user.user_id,
						    		cdpRRNO : RRNo,
						    		cdpAdjSts : 'N',
						    		rowNUM : nextRowNum
						    	};
						    	$scope.$watch('data.cdpRcptNo',function(new_val, old_val){
						    		if(typeof new_val !== 'undefined' && new_val !== old_val){
						    			angular.extend($scope.data,{'cdpRcptDt':'', 'cdpCashCountr':''});
						    		}
						    	});
						    	$scope.$watch('data.cdpRcptDt',function(new_val, old_val){
						    		if(typeof new_val !== 'undefined' && new_val !== '' && new_val !== old_val){
						    			$scope.getAppealAmount();
						    		}
						    	});
						    	$scope.$watch('data.cdpCashCountr',function(new_val, old_val){
						    		if(typeof new_val !== 'undefined' && new_val !== '' && new_val !== old_val){
						    			$scope.getAppealAmount();
						    		}
						    	});
						    	$scope.getAppealAmount = function(){
						    		if($scope.data.cdpRcptNo && $scope.data.cdpRcptDt && $scope.data.cdpCashCountr){
						    			var request = {
					    					"conn_type": $rootScope.user.connection_type,
					    					"receipt_no": $scope.data.cdpRcptNo,
					    					"receipt_date": $scope.data.cdpRcptDt,
					    					"cash_counter_no": $scope.data.cdpCashCountr
					    				};
						    			$scope.data.depositDescription = '';
					    				$scope.data.cdpPymntPurpose = '';
					    				$scope.data.cdpAmtPaid = '';
						    			remote.load("getAppealAmount", function(response){
						    				if(response.PURPOSE_CODE === '1'){
						    					notify.warning('Revenue Purspose can not be added...');
						    					return;
						    				}
						    		        $scope.data.depositDescription = response.PURPOSE_DESCR;
						    				$scope.data.cdpPymntPurpose = response.PURPOSE_CODE;
						    				$scope.data.cdpAmtPaid = response.AMOUNT_PAID;
						    			}, request , 'POST', false, true, true);
						    		}
						    	};
						    	$scope.ok = function(){
						    		$scope.$broadcast('required-check-validity');
									if(!$.isEmptyObject($scope.addEditForm.$error)){
										return;
									}
						    		if(!isNewRecord){
						    			$scope.data.cdpAdjStsDescription = $('.cdpAdjStsDescription').find('select').find('option[value="'+$('.cdpAdjStsDescription').find('select').val()+'"]').text();
						    			var request = angular.copy($scope.data);
							    		angular.extend(request, {
							    			option : 'ADD',
							    			conn_type : $rootScope.user.connection_type,
							    			cdpRRNO : $rootScope.user.location_code+RRNo
							    		});
						    			remote.load("addupdateconsumerdeposits", function(response){
						    				$uibModalInstance.close($scope.data);
						    			}, request ,'POST');
						    		}else{
						    			$scope.data.formAction = 'setDirty';
						    			$uibModalInstance.close($scope.data);
						    		}
						    	}
						    	$scope.cancel = function(){
						    		$uibModalInstance.dismiss('cancel');
						    	}
						    	$rootScope.popupScope = $scope;
						    },
						    resolve: {
						        configs: function() {
						        	return $scope.depositsGridOptions.columnDefs;
						        },
						        remote: function(){
						        	return remote;
						        },
						        isNewRecord: function(){
						        	return $scope.customer_master_save_visible;
						        },
						        RRNo: function(){
						        	return $scope.customer_master.rrno_detail.cmRrNo;
						        },
						        nextRowNum: function(){
						        	return $scope.depositsGridOptions.data.length + 1;
						        }
						    }
						});
						addDepositsModalInstance.result.then(function (newRecord) {
							$scope.customer_master.rrno_deposits.push(newRecord);
							$scope.depositsGridOptions.data = $scope.customer_master.rrno_deposits;
							if(newRecord.formAction === 'setDirty'){
								$scope.customerMaster.$setDirty();
							}
							$scope.load_deposit_totals();
						});
						addDepositsModalInstance.rendered.then(function(){
							webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-alphanumeric', 'web-float']);
						});
					};
					$('#deposits').html($compile('<div class="gridStyle" ui-grid="depositsGridOptions" style="width: 96%;height: 385px;"></div>')($scope));
				}
			}else if($target.hasClass('customer-master-documents-tab')){
				$scope.customer_master_add_documents_visible = true;
				if(!$scope.documentsGridOptions.columnDefs){
					angular.extend($scope.documentsGridOptions,{
						showGridFooter: true,
						gridFooterHeight: 20,
						columnDefs: [
				             {field: 'rowNUM', displayName: '#', width : '5%', readOnly: true},
				             {field: 'docDescription', displayName: 'Document Type', field_key: 'cdocDocTyp', options: $rootScope.customer_master_picklists.DocumentType, required: true},
				             {field: 'cdocDocSubmDt', displayName: 'Submitted Date', type: 'date', required: true}
				         ],
				         onRegisterApi: function( gridApi ) { 
				             $scope.documentsGridApi = gridApi;
				             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button ng-disabled="!(grid.appScope.customer_master_save_visible || grid.appScope.customer_master_update_visible)" class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_documents($event,row)" title="Edit"></button></div>';
				             $scope.documentsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
				         }
					});
					$scope.edit_documents = function(e,row){
						var editDocumentsModalInstance = $uibModal.open({
							animation: true,
							backdrop: 'static',
							keyboard: false,
						    templateUrl: templates.modal.edit,
						    controller: function($scope, $uibModalInstance, configs, data, remote, isNewRecord){
						    	var data_backup =  angular.copy(data);
						    	$scope.header = "Edit Documents";
						    	$scope.ok_text = "Update";
						    	$scope.configs = configs;
						    	$scope.data = data;
						    	$scope.ok = function(){
						    		$scope.$broadcast('required-check-validity');
									if(!$.isEmptyObject($scope.addEditForm.$error)){
										return;
									}
						    		$scope.data.docDescription = $('.docDescription').find('select').find('option[value="'+$('.docDescription').find('select').val()+'"]').text();
						    		if(!isNewRecord){
						    			var request = angular.copy($scope.data);
							    		angular.extend(request, {
							    			option : 'UPDATE',
							    			conn_type : $rootScope.user.connection_type,
							    			cdocRrno : $rootScope.user.location_code+request.cdocRrno
							    		});
						    			remote.load("addupdateconsumerdocuments", function(response){
						    				$uibModalInstance.close();
						    			}, request ,'POST');
						    		}else{
						    			$uibModalInstance.close('setDirty');
						    		}
						    	}
						    	$scope.cancel = function(){
						    		angular.extend($scope.data, data_backup);
						    		$uibModalInstance.dismiss();
						    	}
						    	$rootScope.popupScope = $scope;
						    },
						    resolve: {
						        configs: function() {
						        	return row.grid.options.columnDefs;
						        },
						        data: function() {
						        	return row.entity;
						        },
						        remote: function(){
						        	return remote;
						        },
						        isNewRecord: function(){
						        	return $scope.customer_master_save_visible;
						        }
						    }
						});
						editDocumentsModalInstance.result.then(function (action) {
							if(action === 'setDirty'){
								$scope.customerMaster.$setDirty();
							}
						});
						editDocumentsModalInstance.rendered.then(function(){
							webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-numeric']);
						});
					}
					$scope.customer_master_add_documents = function(e){
						var addDocumentsModalInstance = $uibModal.open({
							animation: true,
							backdrop: 'static',
							keyboard: false,
						    templateUrl: templates.modal.add,
						    controller: function($scope, $uibModalInstance, configs, remote, isNewRecord, RRNo,nextRowNum){
						    	$scope.header = "Add New Documents";
						    	$scope.ok_text = "Add";
						    	$scope.configs = configs;
						    	$scope.data = {
						    		cdocUser : $rootScope.user.user_id,
						    		cdocRrno : RRNo,
						    		rowNUM : nextRowNum
						    	};
						    	$scope.ok = function(){
						    		$scope.$broadcast('required-check-validity');
									if(!$.isEmptyObject($scope.addEditForm.$error)){
										return;
									}
						    		$scope.data.docDescription = $('.docDescription').find('select').find('option[value="'+$('.docDescription').find('select').val()+'"]').text();
						    		if(!isNewRecord){
						    			var request = angular.copy($scope.data);
							    		angular.extend(request, {
							    			option : 'ADD',
							    			conn_type : $rootScope.user.connection_type,
							    			cdocRrno : $rootScope.user.location_code+RRNo
							    		});
						    			remote.load("addupdateconsumerdocuments", function(response){
						    				$scope.data.cdocSlNo = response.cdocSlNo;
						    				$uibModalInstance.close($scope.data);
						    			}, request ,'POST');
						    		}else{
						    			$scope.data.formAction = 'setDirty'
						    			$uibModalInstance.close($scope.data);
						    		}
						    	}
						    	$scope.cancel = function(){
						    		$uibModalInstance.dismiss('cancel');
						    	}
						    	$rootScope.popupScope = $scope;
						    },
						    resolve: {
						        configs: function() {
						        	return $scope.documentsGridOptions.columnDefs;
						        },
						        remote: function(){
						        	return remote;
						        },
						        isNewRecord: function(){
						        	return $scope.customer_master_save_visible;
						        },
						        RRNo: function(){
						        	return $scope.customer_master.rrno_detail.cmRrNo;
						        },
						        nextRowNum: function(){
						        	return $scope.documentsGridOptions.data.length + 1;
						        }
						    }
						});
						addDocumentsModalInstance.result.then(function (newRecord) {
							$scope.customer_master.rrno_customerDocuments.push(newRecord);
							$scope.documentsGridOptions.data = $scope.customer_master.rrno_customerDocuments;
							if(newRecord.formAction === 'setDirty'){
								$scope.customerMaster.$setDirty();
							}
						});
						addDocumentsModalInstance.rendered.then(function(){
							webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-numeric']);
						});
					};
					$('#documents').html($compile('<div class="gridStyle" ui-grid="documentsGridOptions" style="width: 96%;height: 385px;"></div>')($scope));
				}
			}else if($target.hasClass('customer-master-ct-pt-ratio-tab')){
				$scope.customer_master_add_ct_pt_ratio_visible = true;
				if(!$scope.ct_pt_ratioGridOptions.columnDefs){
					angular.extend($scope.ct_pt_ratioGridOptions,{
							showGridFooter: true,
							gridFooterHeight: 20,
							columnDefs: [
						         {field: 'rowNUM', displayName: '#', width : '5%', readOnly: true},
					             {field: 'cprFromDt', displayName: 'From Date', type: 'date', required: true},
					             {field: 'cprToDt', displayName: 'To Date', type: 'date'},
					             {field: 'cprCtRatioAvail', displayName: 'Avail CT Ratio', required: true},
					             {field: 'cprPtRatioAvail', displayName: 'Avail PT Ratio', required: true},
					             {field: 'cprCtRatioNum', displayName: 'CT Ratio Num', readOnly: true},
					             {field: 'cprPtRatioNum', displayName: 'PT Ratio Num', readOnly: true},
					             {field: 'cprCtRatioDen', displayName: 'CT Ratio Den', readOnly: true},
					             {field: 'cprPtRatioDen', displayName: 'PT Ratio Den', readOnly: true},
					             {field: 'cprMultConst', displayName: 'Multi Constant', readOnly: true},
					             {field: 'cprRmks', displayName: 'Remarks', required: true}
					         ],
					         onRegisterApi: function( gridApi ) { 
					             $scope.ctPtRationGridApi = gridApi;
					             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button ng-disabled="!(grid.appScope.customer_master_save_visible || grid.appScope.customer_master_update_visible)" class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_ct_pt_ratio($event,row)" title="Edit"></button></div>';
					             $scope.ctPtRationGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
					         }
					});
					$scope.edit_ct_pt_ratio = function(e,row){
						var editCtPtRatioModalInstance = $uibModal.open({
							animation: true,
							backdrop: 'static',
							keyboard: false,
						    templateUrl: templates.modal.edit,
						    controller: function($scope, $uibModalInstance, configs, data, remote, isNewRecord){
						    	var data_backup =  angular.copy(data);
						    	$scope.header = "Edit CT PT Ratio";
						    	$scope.ok_text = "Update";
						    	$scope.configs = angular.copy(configs);
						    	if(data.cprToDt){
						    		delete $scope.ok_text;
						    		for(var i=0; i< $scope.configs.length; i++){
						    			$scope.configs[i].readOnly = true;
						    		}
						    	}
						    	$scope.data = data;
						    	$scope.data.cprUser = $rootScope.user.user_id;
						    	$scope.loadMultiConstant = function(){
						    		$scope.data.cprMultConst = '1';
						    		if(parseInt($scope.data.cprCtRatioNum) && parseInt($scope.data.cprCtRatioDen) && parseInt($scope.data.cprPtRatioNum) && parseInt($scope.data.cprPtRatioDen)){
						    			$scope.data.cprMultConst = ((parseInt($scope.data.cprCtRatioNum) / parseInt($scope.data.cprCtRatioDen)) * (parseInt($scope.data.cprPtRatioNum) / parseInt($scope.data.cprPtRatioDen))) + "";
						    		}
						    	}
						    	$scope.$watch('data.cprCtRatioAvail',function(new_val, old_val){
						    		if(typeof new_val !== 'undefined' && new_val !== old_val){
						    			var ct_split = new_val.split('/');
						    			angular.extend($scope.data,{'cprCtRatioNum':ct_split[0], 'cprCtRatioDen':ct_split[1]});
						    			if($scope.data.cprPtRatioAvail){
						    				$scope.loadMultiConstant();
						    			}
						    		}
						    	});
						    	$scope.$watch('data.cprPtRatioAvail',function(new_val, old_val){
						    		if(typeof new_val !== 'undefined' && new_val !== old_val){
						    			var pt_split = new_val.split('/');
						    			angular.extend($scope.data,{'cprPtRatioNum':pt_split[0], 'cprPtRatioDen':pt_split[1]});
						    			if($scope.data.cprCtRatioAvail){
						    				$scope.loadMultiConstant();
						    			}
						    		}
						    	});
						    	$scope.loadMultiConstant();			    	
						    	$scope.ok = function(){
						    		$scope.$broadcast('required-check-validity');
									if(!$.isEmptyObject($scope.addEditForm.$error)){
										return;
									}
						    		if(!isNewRecord){
						    			var request = angular.copy($scope.data);
							    		angular.extend(request, {
							    			option : 'UPDATE',
							    			conn_type : $rootScope.user.connection_type,
							    			cprRrNo : $rootScope.user.location_code+request.cprRrNo
							    		});
						    			remote.load("addupdateconsumerctptratio", function(response){
						    				$uibModalInstance.close();
						    			}, request ,'POST');
						    		}else{
						    			$uibModalInstance.close('setDirty');
						    		}
						    	}
						    	$scope.cancel = function(){
						    		angular.extend($scope.data, data_backup);
						    		$uibModalInstance.dismiss();
						    	}
						    	$rootScope.popupScope = $scope;
						    },
						    resolve: {
						        configs: function() {
						        	return row.grid.options.columnDefs;
						        },
						        data: function() {
						        	return row.entity;
						        },
						        remote: function(){
						        	return remote;
						        },
						        isNewRecord: function(){
						        	return $scope.customer_master_save_visible;
						        }
						    }
						});
						editCtPtRatioModalInstance.result.then(function (action) {
							if(action === 'setDirty'){
								$scope.customerMaster.$setDirty();
							}
						});
						editCtPtRatioModalInstance.rendered.then(function(){
							webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-numeric']);
						});
					}
					$scope.customer_master_add_ct_pt_ratio = function(e){
						var ctpt_length = $scope.customer_master.rrno_customerCTPTratio.length;
						if(ctpt_length && !$scope.customer_master.rrno_customerCTPTratio[ctpt_length - 1].cprToDt){
							notify.warn('Please close active record...');
							return;
						}
						var addCtPtRatioModalInstance = $uibModal.open({
							animation: true,
							backdrop: 'static',
							keyboard: false,
						    templateUrl: templates.modal.add,
						    controller: function($scope, $uibModalInstance, configs, remote, isNewRecord, RRNo,nextRowNum){
						    	$scope.header = "Add New CT PT ratio";
						    	$scope.ok_text = "Add";
						    	$scope.configs = configs;
						    	$scope.data = {
						    		cprUser : $rootScope.user.user_id,
						    		cprRrNo : RRNo,
						    		rowNUM : nextRowNum
						    	};
						    	$scope.loadMultiConstant = function(){
						    		$scope.data.cprMultConst = '1';
						    		if(parseInt($scope.data.cprCtRatioNum) && parseInt($scope.data.cprCtRatioDen) && parseInt($scope.data.cprPtRatioNum) && parseInt($scope.data.cprPtRatioDen)){
						    			$scope.data.cprMultConst = ((parseInt($scope.data.cprCtRatioNum) / parseInt($scope.data.cprCtRatioDen)) * (parseInt($scope.data.cprPtRatioNum) / parseInt($scope.data.cprPtRatioDen))) + "";
						    		}
						    	}
						    	$scope.$watch('data.cprCtRatioAvail',function(new_val, old_val){
						    		if(typeof new_val !== 'undefined' && new_val !== old_val){
						    			var ct_split = new_val.split('/');
						    			angular.extend($scope.data,{'cprCtRatioNum':ct_split[0], 'cprCtRatioDen':ct_split[1]});
						    			if($scope.data.cprPtRatioAvail){
						    				$scope.loadMultiConstant();
						    			}
						    		}
						    	});
						    	$scope.$watch('data.cprPtRatioAvail',function(new_val, old_val){
						    		if(typeof new_val !== 'undefined' && new_val !== old_val){
						    			var pt_split = new_val.split('/');
						    			angular.extend($scope.data,{'cprPtRatioNum':pt_split[0], 'cprPtRatioDen':pt_split[1]});
						    			if($scope.data.cprCtRatioAvail){
						    				$scope.loadMultiConstant();
						    			}
						    		}
						    	});
						    	$scope.ok = function(){
						    		$scope.$broadcast('required-check-validity');
									if(!$.isEmptyObject($scope.addEditForm.$error)){
										return;
									}
						    		if(!isNewRecord){
						    			var request = angular.copy($scope.data);
							    		angular.extend(request, {
							    			option : 'ADD',
							    			conn_type : $rootScope.user.connection_type,
							    			cprRrNo : $rootScope.user.location_code+RRNo
							    		});
						    			remote.load("addupdateconsumerctptratio", function(response){
						    				$scope.data.cprToDt = (!$scope.data.cprToDt) ? '' : $scope.data.cprToDt;
						    				$uibModalInstance.close($scope.data);
						    			}, request ,'POST');
						    		}else{
						    			$scope.data.cprToDt = (!$scope.data.cprToDt) ? '' : $scope.data.cprToDt;
						    			$scope.data.formAction = 'setDirty';
						    			$uibModalInstance.close($scope.data);
						    		}
						    	}
						    	$scope.cancel = function(){
						    		$uibModalInstance.dismiss('cancel');
						    	}
						    	$rootScope.popupScope = $scope;
						    },
						    resolve: {
						        configs: function() {
						        	return $scope.ct_pt_ratioGridOptions.columnDefs;
						        },
						        remote: function(){
						        	return remote;
						        },
						        isNewRecord: function(){
						        	return $scope.customer_master_save_visible;
						        },
						        RRNo: function(){
						        	return $scope.customer_master.rrno_detail.cmRrNo;
						        },
						        nextRowNum: function(){
						        	return $scope.ct_pt_ratioGridOptions.data.length + 1;
						        }
						    }
						});
						addCtPtRatioModalInstance.result.then(function (newRecord) {
							$scope.customer_master.rrno_customerCTPTratio.push(newRecord);
							$scope.ct_pt_ratioGridOptions.data = $scope.customer_master.rrno_customerCTPTratio;
							if(newRecord.formAction === 'setDirty'){
								$scope.customerMaster.$setDirty();
							}
						});
						addCtPtRatioModalInstance.rendered.then(function(){
							webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-numeric']);
						});
					};
					$('#ct_pt_ratio').html($compile('<div class="gridStyle" ui-grid="ct_pt_ratioGridOptions" style="width: 96%;height: 385px;"></div>')($scope));
				}
			}else if($target.hasClass('customer-master-intimations-tab')){
				$scope.customer_master_add_intimations_visible = true;
				if(!$scope.intimationsGridOptions.columnDefs){
					angular.extend($scope.intimationsGridOptions,{
							showGridFooter: true,
							gridFooterHeight: 20,
							columnDefs: [
					             {field: 'rowNUM', displayName: '#', width : '5%', readOnly: true},
					             {field: 'codeDescription', displayName: 'Type', field_key: 'ciIntmTyp', options: $rootScope.customer_master_picklists.ConsumerIntimation, required: true},
					             {field: 'ciIntmDt', displayName: 'Date', type: 'date', required: true},
					             {field: 'ciLetrNo', displayName: 'Letter Number', required: true},
					             {field: 'ciRmks', displayName: 'Remarks', required: true}
					         ],
					         onRegisterApi: function( gridApi ) { 
					             $scope.intimationsGridApi = gridApi;
					             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button ng-disabled="!(grid.appScope.customer_master_save_visible || grid.appScope.customer_master_update_visible)" class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_intimations($event,row)" title="Edit"></button></div>';
					             $scope.intimationsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
					         }
					});
					$scope.edit_intimations = function(e,row){
						var editIntimationsModalInstance = $uibModal.open({
							animation: true,
							backdrop: 'static',
							keyboard: false,
						    templateUrl: templates.modal.edit,
						    controller: function($scope, $uibModalInstance, configs, data, remote, isNewRecord){
						    	var data_backup =  angular.copy(data);
						    	$scope.header = "Edit Intimations";
						    	$scope.ok_text = "Update";
						    	$scope.configs = configs;
						    	var readOnly = [2];
						    	for(var i=0; i< readOnly.length;i++){
						    		$scope.configs[readOnly[i]]['readOnly'] = true;
						    	}
						    	$scope.data = data;
						    	$scope.data.ciUser = $rootScope.user.user_id;
						    	$scope.ok = function(){
						    		$scope.$broadcast('required-check-validity');
									if(!$.isEmptyObject($scope.addEditForm.$error)){
										return;
									}
						    		if(!isNewRecord){
						    			$scope.data.codeDescription = $('.codeDescription').find('select').find('option[value="'+$('.codeDescription').find('select').val()+'"]').text();
						    			var request = angular.copy($scope.data);
							    		angular.extend(request, {
							    			option : 'UPDATE',
							    			conn_type : $rootScope.user.connection_type,
							    			ciRrNo : $rootScope.user.location_code+request.ciRrNo
							    		});
						    			remote.load("addupdateconsumerintimations", function(response){
						    				$uibModalInstance.close();
						    			}, request ,'POST');
						    		}else{
						    			$uibModalInstance.close('setDirty');
						    		}
						    	}
						    	$scope.cancel = function(){
						    		angular.extend($scope.data, data_backup);
						    		$uibModalInstance.dismiss();
						    	}
						    	$rootScope.popupScope = $scope;
						    },
						    resolve: {
						        configs: function() {
						        	return row.grid.options.columnDefs;
						        },
						        data: function() {
						        	return row.entity;
						        },
						        remote: function(){
						        	return remote;
						        },
						        isNewRecord: function(){
						        	return $scope.customer_master_save_visible;
						        }
						    }
						});
						editIntimationsModalInstance.result.then(function (action) {
							if(action === 'setDirty'){
								$scope.customerMaster.$setDirty();
							}
						});
						editIntimationsModalInstance.rendered.then(function(){
							webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-numeric']);
						});
					}
					$scope.customer_master_add_intimations = function(e){
						var addIntimationsModalInstance = $uibModal.open({
							animation: true,
							backdrop: 'static',
							keyboard: false,
						    templateUrl: templates.modal.add,
						    controller: function($scope, $uibModalInstance, configs, remote, isNewRecord, RRNo,nextRowNum){
						    	$scope.header = "Add New Intimations";
						    	$scope.ok_text = "Add";
						    	$scope.configs = configs;
						    	$scope.data = {
						    		ciUser : $rootScope.user.user_id,
						    		ciRrNo : RRNo,
						    		rowNUM : nextRowNum
						    	};
						    	$scope.ok = function(){
						    		$scope.$broadcast('required-check-validity');
									if(!$.isEmptyObject($scope.addEditForm.$error)){
										return;
									}
						    		if(!isNewRecord){
						    			$scope.data.codeDescription = $('.codeDescription').find('select').find('option[value="'+$('.codeDescription').find('select').val()+'"]').text();
						    			var request = angular.copy($scope.data);
							    		angular.extend(request, {
							    			option : 'ADD',
							    			conn_type : $rootScope.user.connection_type,
							    			ciRrNo : $rootScope.user.location_code+RRNo
							    		});
						    			remote.load("addupdateconsumerintimations", function(response){
						    				$uibModalInstance.close($scope.data);
						    			}, request ,'POST');
						    		}else{
						    			$scope.data.formAction = 'setDirty';
						    			$uibModalInstance.close($scope.data);
						    		}
						    	}
						    	$scope.cancel = function(){
						    		$uibModalInstance.dismiss('cancel');
						    	}
						    	$rootScope.popupScope = $scope;
						    },
						    resolve: {
						        configs: function() {
						        	return $scope.intimationsGridOptions.columnDefs;
						        },
						        remote: function(){
						        	return remote;
						        },
						        isNewRecord: function(){
						        	return $scope.customer_master_save_visible;
						        },
						        RRNo: function(){
						        	return $scope.customer_master.rrno_detail.cmRrNo;
						        },
						        nextRowNum: function(){
						        	return $scope.intimationsGridOptions.data.length + 1;
						        }
						    }
						});
						addIntimationsModalInstance.result.then(function (newRecord) {
							$scope.customer_master.rrno_customerIntimations.push(newRecord);
							$scope.intimationsGridOptions.data = $scope.customer_master.rrno_customerIntimations;
							if(newRecord.formAction === 'setDirty'){
								$scope.customerMaster.$setDirty();
							}
						});
						addIntimationsModalInstance.rendered.then(function(){
							webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-numeric']);
						});
					};
					$('#intimations').html($compile('<div class="gridStyle" ui-grid="intimationsGridOptions" style="width: 96%;height: 385px;"></div>')($scope));
				}
			}
		});
		$scope.customer_master_clear = function(e){
			$scope.customer_master = {};
			delete $rootScope.customer_master_picklists.FeederCodeList;
			delete $rootScope.customer_master_picklists.TransformerCodeList;
			$scope.depositsGridOptions.data = [];
			$scope.ct_pt_ratioGridOptions.data = [];
			$scope.documentsGridOptions.data = [];
			$scope.intimationsGridOptions.data = [];
			$scope.load_deposit_totals();
			$scope.load_temp_renew();
			$('.error').removeClass('error');
			$scope.resetSettings();
			$scope.customerMaster.$setPristine();
		};
		//loads renewal info and action buttons
		$scope.load_temp_renew = function(){
			$scope.customer_master_temp_renew_action_visible = false;
			$scope.customer_master_temp_renew_date_visible = false;
			if(!$scope.customer_master.rrno_detail || $scope.customer_master.rrno_detail.cmTrfCatg !== '171'){
				return;
			}
			var service_date = $.datepicker.parseDate( "dd/mm/yy", $scope.customer_master.rrno_detail.cmServiceDt);
			service_date = service_date.getTime();
			var temp_duration = parseInt($scope.customer_master.rrno_detail.cmTmpDurn) * 24 * 60 * 60 * 1000;
			var renewal_date = service_date + temp_duration;
			$scope.customer_master.rrno_detail.renewalDate = $filter('date')(renewal_date, 'dd/MM/yyyy');
			$scope.customer_master_temp_renew_date_visible = true;
			//checks current day and last two days to show renew action
			if( (renewal_date <= new Date().getTime()) || new Date().getTime() + (2 * 24 * 60 * 60 * 1000) >= renewal_date){
				$scope.customer_master_temp_renew_action_visible = true;
			} 
		}
		//submits/extends the temp renewal
		$scope.renew = function(){
			var tempRenewalModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.customer_master_temp_renewal,
			    controller: function($scope, $uibModalInstance, data, remote, notify){
			    	$scope.data = angular.copy(data);
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.tempRenewalForm.$error)){
							return;
						}
			    		var request = {
			    			conn_type : $rootScope.user.connection_type,
			    			userid : $rootScope.user.user_id,
			    			rr_no : $rootScope.user.location_code + data.cmRrNo,
			    			service_date : $scope.data.cmServiceDt,
			    			old_duration : $scope.data.cmTmpDurn,
			    			new_duration: $scope.new_duration,
			    			renewal_remarks: $scope.renewal_remarks
			    		};
			    		console.log(request);
		    			remote.load("temporaryrenewal", function(response){
		    				$uibModalInstance.close(response);
		    			}, request ,'POST');
			    	}
			    },
			    resolve: {
			        data: function() {
			        	return $scope.customer_master.rrno_detail;
			        },
			        remote: function(){
			        	return remote;
			        },
			        notify: function(){
			        	return notify;
			        }
			    }
			});
			tempRenewalModalInstance.result.then(function (response) {
				console.log(response);
				angular.extend($scope.customer_master.rrno_detail, response);
			});
		}
		$scope.customer_master_update = function(e){
			if(!$scope.customerMaster.$dirty){
				notify.warn('There is no change to update...');
				return;
			}
			$scope.$broadcast('required-check-validity');
			if(!$.isEmptyObject($scope.customerMaster.$error)){
				var error_position = $('form[name="customerMaster"]').find('.tabs-content > div').index($('form[name="customerMaster"]').find('.error').not('[disabled]').eq(0).closest('table').parent());
				if(error_position !== -1){
					$('#customer').find('ul.customer-master-tabs li').eq(error_position).trigger('click');
					return;
				}
			}
			var request = angular.copy($scope.customer_master);
			angular.extend(request,{
				option : "UPDATE",
				conn_type : $rootScope.user.connection_type,
				location_code : $rootScope.user.location_code,
				user : $rootScope.user.user_id
			});
			request.rrno_detail = [request.rrno_detail];
			request.rrno_customerDescription = [request.rrno_customerDescription];
			request.rrno_customerSpotFolio = [request.rrno_customerSpotFolio];
			delete request.rrno_customerBills;
			delete request.rrno_customerCTPTratio;
			delete request.rrno_customerDocuments;
			delete request.rrno_customerIntimations;
			delete request.rrno_deposits;
			
			remote.load("doAddOrUpdateConsumerMaster", function(response){
				$scope.customer_master_clear();
			}, request ,'POST');
		}
		$scope.customer_master_save = function(e){
			if(!$scope.customerMaster.$dirty){
				notify.warn('There is no change to update...');
				return;
			}
			$scope.$broadcast('required-check-validity');
			if(!$.isEmptyObject($scope.customerMaster.$error)){
				var error_position = $('form[name="customerMaster"]').find('.tabs-content > div').index($('form[name="customerMaster"]').find('.error').not('[disabled]').eq(0).closest('table').parent());
				if(error_position !== -1){
					$('#customer').find('ul.customer-master-tabs li').eq(error_position).trigger('click');
					return;
				}
			}
			if(!$scope.customer_master.rrno_customerDocuments.length){
				notify.warn('Please add atleast one document...');
				$('#customer').find('ul.customer-master-tabs li').eq(6).trigger('click');
				return;
			}
			var request = angular.copy($scope.customer_master);
			angular.extend(request,{
				option : "ADD",
				conn_type : $rootScope.user.connection_type,
				location_code : $rootScope.user.location_code,
				user : $rootScope.user.user_id
			});
			request.rrno_customerSpotFolio.spMrRdgDay = request.rrno_detail.cmMtrRdgDay;
			request.rrno_customerSpotFolio.spMrCode = request.rrno_detail.cmMtrRdrCd;
			request.rrno_detail = [request.rrno_detail];
			request.rrno_customerDescription = [request.rrno_customerDescription];
			request.rrno_customerSpotFolio = [request.rrno_customerSpotFolio];
			console.log(request.rrno_customerSpotFolio);
			remote.load("doAddOrUpdateConsumerMaster", function(response){
				$scope.customer_master_clear();
			}, request ,'POST');
		}
		$scope.customer_master_edit = function(e){
			$scope.customer_master_disable_fields = false;
			$scope.customer_master_disable_rr_no = true;
			$scope.customer_master_update_visible = true;
			$scope.customer_master_edit_visible = false;
		}
		$scope.get_customer_master_feeder_info = function(){
			delete $rootScope.customer_master_picklists.FeederCodeList;
			delete $rootScope.customer_master_picklists.TransformerCodeList;
			if(!$scope.customer_master.rrno_detail.cmStationNo) return;
			var request = {
				"stationCode": $scope.customer_master.rrno_detail.cmStationNo,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getFeederList", function(response){
				$rootScope.customer_master_picklists.FeederCodeList = response.FeederCodeList;
			}, request , 'POST');
		}
		$scope.get_customer_master_transformer_info = function(){
			delete $rootScope.customer_master_picklists.TransformerCodeList;
			if(!$scope.customer_master.rrno_detail.cmStationNo || !$scope.customer_master.rrno_detail.cmFdrNo) return;
			var request = {
				"stationCode": $scope.customer_master.rrno_detail.cmStationNo,
				"feederCode": $scope.customer_master.rrno_detail.cmFdrNo,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getTransformerList", function(response){
				$rootScope.customer_master_picklists.TransformerCodeList = response.TransformerCodeList;
			}, request , 'POST');
		}
		$scope.get_customer_master_meter_reader_info = function(){
			delete $rootScope.customer_master_picklists.MeterReaderCode;
			delete $rootScope.customer_master_picklists.MeterReadingDay;
			if(!$scope.customer_master.rrno_detail.cmOmUnitCd) return;
			var request = {
				"om_code": $scope.customer_master.rrno_detail.cmOmUnitCd,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReaderCodesByOMUnit", function(response){
				$rootScope.customer_master_picklists.MeterReaderCode = response.MeterReaderCode;
			}, request , 'POST');
		}
		$scope.get_customer_master_meter_reading_day_info = function(){
			delete $rootScope.customer_master_picklists.MeterReadingDay;
			if(!$scope.customer_master.rrno_detail.cmOmUnitCd || !$scope.customer_master.rrno_detail.cmMtrRdrCd) return;
			var request = {
				"om_code": $scope.customer_master.rrno_detail.cmOmUnitCd,
				"mr_code": $scope.customer_master.rrno_detail.cmMtrRdrCd,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReadingDayByMrCode", function(response){
				$rootScope.customer_master_picklists.MeterReadingDay = response.MeterReadingDay;
			}, request , 'POST');
		}
		$scope.$watch('customer_master_disable_fields', function(new_val, old_val){
			if(typeof new_val !== 'undefined'){
				if(new_val){
					$('.customer-master .ui-datepicker-trigger,.customer-master .clear-date').hide();
				}else{
					$('.customer-master .ui-datepicker-trigger,.customer-master .clear-date').show();
				}
			}
		});
	}
	// customer master ends
	
	// customer history starts
	if(customer_flow === 'customer_history'){
		$scope.customer_history = [];
		$scope.ledgerDetailsGridOptions = {};
		$scope.powerDetailsGridOptions = {};
		$scope.placeDetailsGridOptions = {};
		$scope.dtcDetailsGridOptions = {};
		$scope.customer_history_disable_rr_no = false;
		$scope.customerDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#', width : '4%'},
	             {field: 'cm_version', displayName: 'Version', width : '6%'},
	             {field: 'cd_consmr_name', displayName: 'Customer Name', width : '15%'},
	             {field: 'cd_corres_addr1', displayName: 'Correspondence Address', width : '15%'},
	             {field: 'cd_corres_addr2', displayName: 'Address 1/Village', width : '15%'},
	             {field: 'cd_corres_addr3', displayName: 'Address 2/City', width : '15%'},
	             {field: 'cd_corres_addr4', displayName: 'Address 3/Camp', width : '15%'},
	             {field: 'cm_pin_cd', displayName: 'PIN Code', width : '8%'},
	             {field: 'cm_telephone_no', displayName: 'Telephone No', width : '10%'},
	             {field: 'trf_catg_descr', displayName: 'Tariff Category', width : '10%'},
	             {field: 'cm_consmr_sts_descr', displayName: 'Customer Status', width : '15%'},
	             {field: 'cm_om_unit_cd_descr', displayName: 'O&M Unit', width : '13%'},
	             {field: 'cm_mtr_rdr_cd', displayName: 'MR Code', width : '10%'},
	             {field: 'cm_mtr_rdg_day', displayName: 'Reading Day', width : '10%'},
	             {field: 'applnt_typ_descr', displayName: 'Customer Type', width : '13%'},
	             {field: 'cm_install_typ_descr', displayName: 'Installation Type', width : '13%'},
	             {field: 'cm_service_dt', displayName: 'Service Date', width : '10%'},
	             {field: 'cm_trf_effect_frm_dt', displayName: 'Tariff Efft From Date', width : '13%'},
	             {field: 'cm_nxt_rr_no', displayName: 'Side RR Number', width : '12%'},
	             {field: 'cm_fl_consumer', displayName: 'FL Flag', width : '8%'},
	             {field: 'cm_ivrs_id', displayName: 'IVRS ID', width : '10%'},
	             {field: 'cm_user', displayName: 'User ID', width : '10%'},
	             {field: 'cm_tmpstp', displayName: 'TimeStamp', width : '13%'}
	         ]
		};
		$(document).on('keypress', '.get-customer-history-details', function(e){
			if(e.which == 13){
				if($(this).val().trim() == '') {
					$(this).focus();
					return false;
				}
				var request = {
					"rr_number": (($(this).val().trim()) ? $rootScope.user.location_code + $(this).val().trim() : '')
				}
				remote.load("getcustomerhistory", function(response){
					$scope.customer_history_disable_rr_no = true;
					$scope.customer_history = response.customer_history;
					$scope.customerDetailsGridOptions.data = $scope.customer_history;
					$scope.ledgerDetailsGridOptions.data = $scope.customer_history;
					$scope.powerDetailsGridOptions.data = $scope.customer_history;
					$scope.placeDetailsGridOptions.data = $scope.customer_history;
					$scope.dtcDetailsGridOptions.data = $scope.customer_history;
				}, request , 'POST');
			}
		});
		$(document).on('click', '.customer-history-tabs li', function(e){
			var $target = $(e.target);
			if($target.hasClass('customer-history-ledger-details-tab')){
				if(!$scope.ledgerDetailsGridOptions.columnDefs){
					angular.extend($scope.ledgerDetailsGridOptions,{
						showGridFooter: true,
						gridFooterHeight: 20,
						enableFiltering: false,
						columnDefs: [
				             {field: 'row_num', displayName: '#', width : '4%'},
				             {field: 'cm_version', displayName: 'Version', width : '6%'},
				             {field: 'cm_ldgr_no', displayName: 'Ledger No', width : '10%'},
				             {field: 'cm_ldgr_opened_dt', displayName: 'Ledger Open Date', width : '12%'},
				             {field: 'cm_folio_no', displayName: 'Ledger Folio No', width : '10%'},
				             {field: 'sf_folio_no', displayName: 'Spot Folio No', width : '10%'},
				             {field: 'cm_old_rr_no', displayName: 'Old RR Number', width : '13%'},
				             {field: 'cm_line_min', displayName: 'Line Minimum', width : '10%'},
				             {field: 'cm_ldgr_opened_dt', displayName: 'Line Due Date', width : '10%'},
				             {field: '0', displayName: 'Loan Amount', width : '10%'},
				             {field: 'cm_mtr_rdg_cycle', displayName: 'Mtr Rdg Cycle', width : '10%'},
				             {field: 'cm_first_bill_dc_flg', displayName: 'DC Flag', width : '8%'},
				             {field: 'cm_phase_of_instln_descr', displayName: 'Phase Of Installtion', width : '13%'},
				             {field: 'cm_beg_mnth_descr', displayName: 'Begining Month', width : '13%'},
				             {field: 'cm_submeter_flg', displayName: 'Sub Meter Flag', width : '10%'},
				             {field: 'cm_chq_bounce_flg', displayName: 'Cheque Bounce Flag', width : '13%'},
				             {field: 'cm_slum_flg', displayName: 'Slum Flag', width : '8%'},
				             {field: 'cm_purge_flg', displayName: 'Purge Flag', width : '8%'},
				             {field: 'cm_unauth_flg', displayName: 'Unauthorized Flag', width : '13%'},
				             {field: 'cm_user', displayName: 'User ID', width : '10%'},
				             {field: 'cm_tmpstp', displayName: 'Time Stamp', width : '13%'}
				         ]
					});
					$('#ledger_details').html($compile('<div class="gridStyle" ui-grid="ledgerDetailsGridOptions" ui-grid-edit style="width: 96%;height: 375px;"></div>')($scope));
				}
			}else if($target.hasClass('customer-history-power-details-tab')){
				if(!$scope.powerDetailsGridOptions.columnDefs){
					angular.extend($scope.powerDetailsGridOptions,{
						showGridFooter: true,
						gridFooterHeight: 20,
						enableFiltering: false,
						columnDefs: [
				             {field: 'row_num', displayName: '#', width : '4%'},
				             {field: 'cm_version', displayName: 'Version', width : '6%'},
				             {field: 'cm_pwr_purpose_descr', displayName: 'Power Purpose', width : '15%'},
				             {field: 'cm_pwr_pur_eff_frm_dt', displayName: 'Power Effected From date', width : '16%'},
				             {field: 'cm_industry_cd_descr', displayName: 'Indutry Code', width : '12%'},
				             {field: 'cm_ind_eff_frm_dt', displayName: 'Indutry Effected From date', width : '16%'},
				             {field: 'cm_ld_sanct_kw', displayName: 'Load Sanction KW', width : '12%'},
				             {field: 'cm_ld_sanct_hp', displayName: 'Load Sanction HP', width : '12%'},
				             {field: 'cm_ld_sanct_kva', displayName: 'Load Sanction KVA', width : '12%'},
				             {field: 'cm_conn_ld_kw', displayName: 'Load Connected KW', width : '12%'},
				             {field: 'cm_conn_ld_hp', displayName: 'Load Connected HP', width : '12%'},
				             {field: 'cm_supply_volt', displayName: 'Supply Voltage', width : '10%'},
				             {field: 'cm_supply_eff_frm_dt', displayName: 'Supply Effected From date', width : '16%'},
				             {field: 'cm_capacitor_cap', displayName: 'Capacitor Capacity', width : '12%'},
				             {field: 'cm_bjkj_outlet', displayName: 'No.Of Outlets', width : '10%'},
				             {field: 'cm_starter_typ_descr', displayName: 'Starter Type', width : '12%'},
				             {field: 'cm_power_sanct_no', displayName: 'Power Sanction No', width : '13%'},
				             {field: 'cm_power_sanct_dt', displayName: 'Power Sanction date', width : '13%'},
				             {field: 'cm_power_sanct_auth_descr', displayName: 'Power Sanctioned By', width : '13%'},
				             {field: 'cm_ld_effect_frm_dt', displayName: 'Load Effect from date', width : '14%'},
				             {field: 'cm_heat_load', displayName: 'Heating Load', width : '10%'},
				             {field: 'cm_light_load', displayName: 'Lighting Load', width : '10%'},
				             {field: 'cm_lighting_typ_descr', displayName: 'Lighting Type', width : '10%'},
				             {field: 'cm_motive_power', displayName: 'Movtive Power', width : '10%'},
				             {field: 'cm_well_typ_descr', displayName: 'Well Type', width : '12%'},
				             {field: 'cm_min_demand_entl', displayName: 'Minimum Demand Entitled(%)', width : '17%'},
				             {field: 'cm_pwr_cut_exempt_flg', displayName: 'Power Cut Exempt Flag', width : '15%'},
				             {field: 'cm_user', displayName: 'User ID', width : '10%'},
				             {field: 'cm_tmpstp', displayName: 'Time Stamp', width : '13%'}
				         ]
					});
					$('#power_details').html($compile('<div class="gridStyle" ui-grid="powerDetailsGridOptions" ui-grid-edit style="width: 96%;height: 375px;"></div>')($scope));
				}
			}else if($target.hasClass('customer-history-place-details-tab')){
				if(!$scope.placeDetailsGridOptions.columnDefs){
					angular.extend($scope.placeDetailsGridOptions,{
						showGridFooter: true,
						gridFooterHeight: 20,
						enableFiltering: false,
						columnDefs: [
						     {field: 'row_num', displayName: '#', width : '4%'},
				             {field: 'cm_version', displayName: 'Version', width : '6%'},
				             {field: 'cm_premis_juris_descr', displayName: 'Jurisdiction', width : '15%'},
				             {field: 'cd_premise_addr1', displayName: 'Premises Address', width : '15%'},
				             {field: 'cd_premise_addr2', displayName: 'Premises Address1/Village', width : '15%'},
				             {field: 'cd_premise_addr3', displayName: 'Premises Address2/City', width : '15%'},
				             {field: 'cd_premise_addr4', displayName: ' PremisesAddress3/Camp', width : '15%'},
				             {field: 'cd_place_name', displayName: 'Place Name', width : '15%'},
				             {field: 'cm_bulk_no_of_houses', displayName: 'No.Of Houses', width : '10%'},
				             {field: 'cm_region_cd_descr', displayName: 'Region', width : '15%'},
				             {field: 'cm_taluk_cd_descr', displayName: 'Taluk', width : '15%'},
				             {field: 'cm_district_cd_descr', displayName: 'District', width : '15%'},
				             {field: 'cm_state_constituency_cd_descr', displayName: 'State Constancy', width : '15%'},
				             {field: 'cm_central_constit_cd_descr', displayName: 'Central Constancy', width : '15%'},
				             {field: 'cm_conn_typ_descr', displayName: 'Connection Type', width : '15%'},
				             {field: 'cm_email_id', displayName: 'Email ID', width : '15%'},
				             {field: 'cm_kst_no', displayName: 'KST No', width : '10%'},
				             {field: 'cm_cst_no', displayName: 'CST No', width : '10%'},
				             {field: 'cm_tin_no', displayName: 'TIN No', width : '10%'},
				             {field: 'cm_user', displayName: 'User ID', width : '10%'},
				             {field: 'cm_tmpstp', displayName: 'Time Stamp', width : '13%'}
				         ]
					});
					$('#place_details').html($compile('<div class="gridStyle" ui-grid="placeDetailsGridOptions" style="width: 96%;height: 375px;"></div>')($scope));
				}
			}else if($target.hasClass('customer-history-dtc-details-tab')){
				if(!$scope.dtcDetailsGridOptions.columnDefs){
					angular.extend($scope.dtcDetailsGridOptions,{
						showGridFooter: true,
						gridFooterHeight: 20,
						enableFiltering: false,
						columnDefs: [
						     {field: 'row_num', displayName: '#', width : '4%'},
				             {field: 'cm_version', displayName: 'Version', width : '6%'},
				             {field: 'cm_station_no_descr', displayName: 'Station', width : '20%'},
				             {field: 'cm_fdr_no_descr', displayName: 'Feeder', width : '20%'},
				             {field: 'cm_trsfmr_no_descr', displayName: 'Transformer', width : '20%'},
				             {field: 'cm_ntr_loc_cd', displayName: 'Location Code', width : '10%'},
				             {field: 'pole_no', displayName: 'Pole Number', width : '10%'},
				             {field: 'cm_user', displayName: 'User ID' , width : '10%'},
				             {field: 'cm_tmpstp', displayName: 'Time Stamp', width : '13%'}
				         ],
				         data: []
					});
					$('#dtc_details').html($compile('<div class="gridStyle" ui-grid="dtcDetailsGridOptions" style="width: 96%;height: 375px;"></div>')($scope));
				}
			}
		});
		
		$scope.customer_history_clear = function(e){
			$scope.customer_history = [];
			$scope.customerDetailsGridOptions.data = [];
			$scope.ledgerDetailsGridOptions.data = [];
			$scope.powerDetailsGridOptions.data = [];
			$scope.placeDetailsGridOptions.data = [];
			$scope.dtcDetailsGridOptions.data = [];
			$scope.customer_history_disable_rr_no = false;
			$timeout(function(){
				$('input.get-customer-history-details').focus().val('');
			});
		};
	}
	// customer master history ends
	
	// customer master details grid starts
	if(customer_flow === 'customer_details'){
		
		var $rr_no = $('#customer-details-rr-number');
		var $stn_code = $('#customer-details-station-code');
		var $fdr_code = $('#customer-details-feeder-code');
		var $dtc_code = $('#customer-details-transformer-code');
		var $om_code = $('#customer-details-om-code');
		var $mr_code = $('#customer-details-mr-code');
		var $rdg_day = $('#customer-details-rdg-day');
		var $spot_folio = $('#customer-details-spot-folio');
		
		
		//getomcodelist
		var request = {
			"Conn_Type": $rootScope.user.connection_type,
			"Location_Code": $rootScope.user.location_code
		}
		remote.load("getomunitlist", function(response){
			$scope.om_list = response.OM_LIST;
		}, request , 'POST', false, false, true);
		
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
		$scope.get_meter_reader_info();
		
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
		
		//getstationlist
		var request = {
			"conn_type": $rootScope.user.connection_type,
			"location": $rootScope.user.location_code
		}
		remote.load("getStationList", function(response){
			$scope.StationCodeList = response.StationCodeList;
		}, request , 'POST');
		
		$scope.get_feeder_info = function(){
			var request = {
				"stationCode": $scope.StationCode,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getFeederList", function(response){
				$scope.FeederCodeList = response.FeederCodeList;
			}, request , 'POST');
		}
		$scope.get_transformer_info = function(){
			var request = {
				"stationCode": $scope.StationCode,
				"feederCode": $scope.FeederCode,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getTransformerList", function(response){
				$scope.TransformerCodeList = response.TransformerCodeList;
			}, request , 'POST');
		}
		
		$scope.load_customer_details = function(){
			if(!$scope.rrNumber && !$scope.StationCode && !$scope.FeederCode && !$scope.transformerCode && !$scope.mr_code && !$scope.readingDay && !$scope.spotFolio){
				notify.warn('Invalid Input...');
				$('#customer-details-rr-number').focus();
				return;
			}
			var request = {
				"type" : '',					
				"location_code": $rootScope.user.location_code,
				"rr_number": (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : ''),
				"mr_code" : (($mr_code.val().trim()) ? $mr_code.val().trim() : ''),
				"reading_day": (($rdg_day.val().trim()) ? $rdg_day.val().trim() : ''),
				"spot_folio_number": (($spot_folio.val().trim()) ? $spot_folio.val().trim() : ''),
				"station_code": (($stn_code.val().trim()) ? $stn_code.val().trim() : ''),
				"feeder_code": (($fdr_code.val().trim()) ? $fdr_code.val().trim() : ''),
				"om_code": (($om_code.val().trim()) ? $om_code.val().trim() : ''),
				"dtc_code": (($dtc_code.val().trim()) ? $dtc_code.val().trim() : ''),
			};
			$scope.customeDetailsGridOptions.data = [];
			remote.load("getcustomerdetails", function(response){
				$scope.customeDetailsGridOptions.data = response.customer_details;
			}, request , 'POST');
		};
		
		$scope.customer_details_count = function(){
			$scope.customeDetailsGridOptions.data = [];
			var request = {
					"type" : 'CNT',					
					"location_code": $rootScope.user.location_code,
					"rr_number": (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : ''),
					"mr_code" : (($mr_code.val().trim()) ? $mr_code.val().trim() : ''),
					"reading_day": (($rdg_day.val().trim()) ? $rdg_day.val().trim() : ''),
					"spot_folio_number": (($spot_folio.val().trim()) ? $spot_folio.val().trim() : ''),
					"station_code": (($stn_code.val().trim()) ? $stn_code.val().trim() : ''),
					"feeder_code": (($fdr_code.val().trim()) ? $fdr_code.val().trim() : ''),
					"om_code": (($om_code.val().trim()) ? $om_code.val().trim() : ''),
					"dtc_code": (($dtc_code.val().trim()) ? $dtc_code.val().trim() : ''),
				}
			remote.load("getcustomerdetails", function(response){
			}, request , 'POST');
			
			
		};
		
		$scope.customeDetailsGridOptions = {
			showGridFooter: true,
			columnDefs: [
	             {field: 'row_num', displayName: '#',width : '4%'},
	             {field: 'rr_no', displayName: 'RR Number',width : '10%'},
	             {field: 'ld_sanct_kw', displayName: 'Load KW',width : '7%'},
	             {field: 'ld_sanct_hp', displayName: 'Load HP',width : '7%'},
	             {field: 'stn_no', displayName: 'Station Code',width : '9%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
	             {field: 'fdr_no', displayName: 'Feeder Code',width : '9%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
	             {field: 'om_cd', displayName: 'O&M Code',width : '12%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
	             {field: 'dtc_no', displayName: 'DTC Code',width : '8%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
	             {field: 'pole_no', displayName: 'Pole No',width : '7%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
	             {field: 'mr_cd', displayName: 'MR Code',width : '8%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
	             {field: 'rdg_day', displayName: 'Rdg Day',width : '8%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
	             {field: 'sf_no', displayName: 'Spot Folio',width : '7%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
	             {field: 'rr_sts', displayName: 'RR Status',width : '7%'},
	             {field: 'userid', displayName: 'User ID',width : '8%'},
	             {field: 'tmpstp', displayName: 'Time Stamp',width : '13%'}
	         ],
	         data: []
		};
		
		$scope.hitTab = function(e){
			if(e.which === 13){
				var $el = $(e.target);
				var closest_input_elements = $el.closest('.ui-grid-row').find('input');
				var current_input_index = closest_input_elements.index($el);
				if(current_input_index < (closest_input_elements.length - 1)){
					closest_input_elements[current_input_index + 1].focus();
				}else{
					$el.closest('.ui-grid-row').next('.ui-grid-row').find('input').eq(0).focus();
				}
			}
		}
		
		$scope.customer_details_clear = function(e){
			$scope.customeDetailsGridOptions.data = [];
			$rr_no.val('').focus();
			$stn_code.val('');
			$fdr_code.val('');
			$dtc_code.val('');
			$om_code.val('');
			$mr_code.val('');
			$rdg_day.val('');
			$spot_folio.val('');
		};
	}
	
	// verify customer updations grid starts
	if(customer_flow === 'verify_customer_updations'){
		
		var $change_type = $('#customer-change-types');
		
		//load customer chage types
		remote.load("getcustomerchangetypes", function(response){
			$scope.customer_change_types = response.customer_change_types;
		}, { conn_type : $rootScope.user.connection_type } , 'POST');
		
		$scope.load_customer_changes = function(e){
			var request = {
					"location_code": $rootScope.user.location_code,
					"change_type": $change_type.val().trim(),
					"conn_type" : $rootScope.user.connection_type 
			}
			console.log(request);
			$scope.verifyCustomerUpdationsDetailsGridOptions.data = [];
			$scope.verify_customer_updations_details = [];
			remote.load("getcustomersforverify", function(response){
				$scope.verifyCustomerUpdationsDetailsGridOptions.data =  response.customer_details_verify;
			}, request , 'POST');
		}
			
		$scope.verifyCustomerUpdationsDetailsGridOptions = {
				showGridFooter: true,
				columnDefs: [
		             {field: 'row_num', displayName: '#',width : '5%'},
		             {field: 'rr_no', displayName: 'RR Number',width : '12%'},
		             {field: 'change_type', displayName: 'Change Type',width : '15%'},
		             {field: 'old_value_description', displayName: 'Old Value',width : '15%'},
		             {field: 'new_value_description', displayName: 'New Value',width : '15%'},
		             {field: 'remarks', displayName: 'Remarks',width : '15%'},
		             {field: 'inserted_userid', displayName: 'Entered By',width : '10%'},
		             {field: 'inserted_tmpstp', displayName: 'Entered On',width : '13%'},
		             {field: 'change_id', displayName: 'Change ID',width : '8%'},
		             {field: 'change_no', displayName: 'Change No',width : '8%'}
	             ],
	             data: [],
	             onRegisterApi : function(gridApi){
	             	$scope.gridApi = gridApi;
	             }
		};
			
		$scope.verify_customer_updations_clear = function(e){
			$scope.verify_customer_updations_details = [];
			$change_type.val('').focus();
			$scope.verifyCustomerUpdationsDetailsGridOptions.data = [];
		};
		
		$scope.verify_customer_updations_verify = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select customer updations to Verify...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				verifierid : $rootScope.user.user_id,
				option : 'VERIFY',
				data: selected_rows
			};
			console.log(request);
			remote.load("verifyrejectcustomerchanges", function(response){
				$scope.load_customer_changes();
			}, request, 'POST');
		}
		$scope.verify_customer_updations_reject = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select customer updations to Reject...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				verifierid : $rootScope.user.user_id,
				option : 'REJECT',
				data: selected_rows
			};
			remote.load("verifyrejectcustomerchanges", function(response){
				$scope.load_customer_changes();
			}, request , 'POST');
		}
	}
		
	
	// approve customer updations grid starts
	if(customer_flow === 'approve_customer_updations'){
		
		var $change_type = $('#customer-change-types');
		
		//load customer chage types
		remote.load("getcustomerchangetypes", function(response){
			$scope.customer_change_types = response.customer_change_types;
		}, { conn_type : $rootScope.user.connection_type } , 'POST');
		
		$scope.load_customer_changes = function(e){
			$scope.approveCustomerUpdationsDetailsGridOptions.data = [];
			if($change_type.val() === ''){
				$change_type.val('').focus();
				return;
			}
			var request = {
				"location_code": $rootScope.user.location_code,
				"change_type": $change_type.val().trim(),
				"conn_type" : $rootScope.user.connection_type 
			}
			remote.load("getcustomersforapprove", function(response){
				$scope.approveCustomerUpdationsDetailsGridOptions.data = response.customer_details_approve;
			}, request , 'POST');
		}
		$scope.approveCustomerUpdationsDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#',width : '5%'},
	             {field: 'rr_no', displayName: 'RR Number',width : '12%'},
	             {field: 'change_type', displayName: 'Change Type',width : '15%'},
	             {field: 'old_value_description', displayName: 'Old Value',width : '15%'},
	             {field: 'new_value_description', displayName: 'New Value',width : '15%'},
	             {field: 'remarks', displayName: 'Remarks',width : '15%'},
	             {field: 'inserted_userid', displayName: 'Entered By',width : '10%'},
	             {field: 'inserted_tmpstp', displayName: 'Entered On',width : '13%'},
	             {field: 'verified_userid', displayName: 'Verified By',width : '10%'},
	             {field: 'verified_tmpstp', displayName: 'Verified On',width : '13%'},
	             {field: 'change_id', displayName: 'Change ID',width : '8%'},
	             {field: 'change_no', displayName: 'Change No',width : '8%'}
	        ],
	        data: [],
            onRegisterApi : function(gridApi){
            	$scope.gridApi = gridApi;
            }
		};
		$scope.approve_customer_updations_clear = function(e){
			$change_type.val('').focus();
			$scope.approveCustomerUpdationsDetailsGridOptions.data = [];
		};
		$scope.approve_customer_updations_approve = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select customer updations to Approve...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				approverid : $rootScope.user.user_id,
				option : 'APPROVE',
				data: selected_rows
			};
			console.log(request);
			remote.load("approverejectcustomerchanges", function(response){
				$scope.load_customer_changes();
			}, request, 'POST');
		}
		$scope.approve_customer_updations_reject = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select customer updations to Reject...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				approverid : $rootScope.user.user_id,
				option : 'REJECT',
				data: selected_rows
			};
			console.log(request);
			remote.load("approverejectcustomerchanges", function(response){
				$scope.load_customer_changes();
			}, request , 'POST');
		}
	}
	
	if(customer_flow === 'add_customer_updations'){
			
		//load customer chage types
		remote.load("getcustomerchangetypes", function(response){
			$scope.customer_change_types = response.customer_change_types;
			$timeout(function(){
				$('#customer').find('.add-customer-updations').find('.change-types').find('div').eq(0).click();
			});
		}, { conn_type : $rootScope.user.connection_type } , 'POST');
		
		if(!$rootScope.customer_master_picklists){
			var request = {
					"Conn_Type": $rootScope.user.connection_type,
					"Location_Code": $rootScope.user.location_code
				}
			remote.load("getConsumerMasterPickListValues", function(response){
				$rootScope.customer_master_picklists = response.CONSUMER_MASTER_PICKLIST;
				console.log('CONSUMER_MASTER_PICKLIST',response.CONSUMER_MASTER_PICKLIST);
			}, request , 'POST', false, false, true);
		}
		$scope.customer_updation_disable_rr_no = false;
		
		$scope.load_customer_updation_template = function(e){
			var $target = $(e.target);
			$('#customer').find('.add-customer-updations').find('.change-types').find('div').removeClass('selected');
			$target.addClass('selected');
			if($scope.selectedChange === $target.attr('param')){
				return;
			}
			//$scope.data = {};
			$scope.clear_customer_information();
			$scope.selectedChange = $target.attr('param');
		}
		
		$scope.load_customer_information = function(){
			if(!$scope.rr_number){
				notify.warn('Enter RR Number to Load ...');
				$('#customer_updation_rr_number').focus();
				return;
			}
			$scope.customer_updation_disable_rr_no = true;
			$scope.data = {};
			var request = { 
				conn_type : $rootScope.user.connection_type,
				rr_number : $rootScope.user.location_code + $scope.rr_number, 
				changeType : $scope.selectedChange
			}
			console.log(request);
			remote.load("getcustomerdetailsforupdate", function(response){
				$scope.data = response.customer_information;
				$scope.data.rr_no = $rootScope.user.location_code + $scope.data.rr_no;
				console.log($scope.data);
			}, request , 'POST');
		}
		
		$scope.update_customer_information = function(){
			
			if(!$scope.rr_number){
				notify.warn('Load the RR Number Details First ...');
				$('#customer_updation_rr_number').focus();
				return;
			}else if(!$scope.data.remarks){
				notify.warn('Please Enter Remarks...');
				$('#customer_updation_cremarks').focus();
				return;
			}else if($scope.selectedChange==='1' && !$scope.data.LoadKW){
				notify.warn('Please Enter New Load KW...');
				$('#customer_updation_load_kw').focus();
				return;
			}else if($scope.selectedChange==='1' && !$scope.data.LoadHP){
				notify.warn('Please Enter New Load HP...');
				$('#customer_updation_load_hp').focus();
				return;
			}else if($scope.selectedChange==='1' && !$scope.data.LoadKVA){
				notify.warn('Please Enter New Load KVA...');
				$('#customer_updation_load_kva').focus();
				return;
			}else if($scope.selectedChange==='2' && !$scope.data.trfCatg){
				notify.warn('Please Select New Tariff Category...');
				$('#customer_updation_trf_catg').focus();
				return;
			}else if($scope.selectedChange==='3' && !$scope.data.customerName){
				notify.warn('Please Enter New Customer Name...');
				$('#customer_updation_customer_name').focus();
				return;
			}else if($scope.selectedChange==='4' && !$scope.data.customerStatus){
				notify.warn('Please Select New Customer Status...');
				$('#customer_updation_customer_status').focus();
				return;
			}else if($scope.selectedChange==='5' && !$scope.data.pemisesAddess){
				notify.warn('Please Enter New Premises Address...');
				$('#customer_updation_premise_addr').focus();
				return;
			}else if($scope.selectedChange==='5' && !$scope.data.pemisesAddess1){
				notify.warn('Please Enter New Premises Address1...');
				$('#customer_updation_premise_addr1').focus();
				return;
			}else if($scope.selectedChange==='5' && !$scope.data.pemisesAddess2){
				notify.warn('Please Enter New Premises Address2...');
				$('#customer_updation_premise_addr2').focus();
				return;
			}else if($scope.selectedChange==='6' && !$scope.data.correspondingAddress){
				notify.warn('Please Enter New Corresponding Address...');
				$('#customer_updation_corres_addr').focus();
				return;
			}else if($scope.selectedChange==='6' && !$scope.data.correspondingAddress1){
				notify.warn('Please Enter New Corresponding Address1...');
				$('#customer_updation_corres_addr1').focus();
				return;
			}else if($scope.selectedChange==='6' && !$scope.data.correspondingAddress2){
				notify.warn('Please Enter New Corresponding Address2...');
				$('#customer_updation_corres_addr2').focus();
				return;
			}
			
			var request = { 
				conn_type : $rootScope.user.connection_type,
				changeType : $scope.selectedChange,
				userid : $rootScope.user.user_id,
				data : $scope.data
			}
			console.log(request);
			remote.load("insertcustomerchangesinformation", function(response){
				
			}, request , 'POST');
		}
		
		$scope.clear_customer_information = function(){
			$scope.data = {};
			$scope.rr_number = '';
			$scope.customer_updation_disable_rr_no = false;
			$timeout(function(){
				$('#customer_updation_rr_number').focus();
			});
		}
	}
	
if(customer_flow === 'customer_region_mapping'){
		
		$omCode = $('#customer-region-mapping-om-code');
		$mrCode = $('#customer-region-mapping-mr-code');
		$rdgDay = $('#customer-region-mapping-reading-day');
		$regionCode = $('#transformer-town-mapped-details-region-code');
		
		//getomcodelist
		var request = {
			"Conn_Type": $rootScope.user.connection_type,
			"Location_Code": $rootScope.user.location_code
		}
		remote.load("getomunitlist", function(response){
			$scope.om_list = response.OM_LIST;
		}, request , 'POST', false, false, true);
		
		var request = {
				"om_code": $rootScope.user.location_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
		}
		remote.load("getMeterReaderCodesByOMUnit", function(response){
			$scope.MeterReaderCode = response.MeterReaderCode;
		}, request , 'POST');

		
		$scope.get_meter_reader_info = function(){
			var request = {
				"om_code": $scope.omCode || $rootScope.user.location_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReaderCodesByOMUnit", function(response){
				$scope.MeterReaderCode = response.MeterReaderCode;
			}, request , 'POST');
		}
		$scope.get_reading_day_info = function(){
			var request = {
				"om_code": $scope.omCode || $rootScope.user.location_code,
				"mr_code": $scope.mrCode,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReadingDayByMrCode", function(response){
				$scope.MeterReadingDay = response.MeterReadingDay;
			}, request , 'POST');
		}
		
		//load region details
		var request = {
			conn_type : $rootScope.user.connection_type,
			code_type : 'REG_TYP'
		}
		remote.load("getcodedetailsfordropdowns", function(response){
			 $scope.RegionTypeList = response.CodeDetailsDropDownList;
			 $scope.customerRegionMappingGridOptions.columnDefs[2]['options'] = response.CodeDetailsDropDownList;
		}, request , 'POST');
		
		$scope.load_customer_region_mapping_details = function(){
			
			if(!$scope.omCode && !$scope.mrCode && !$scope.readingDay){
				notify.warn('Invalid Input...');
				$('#customer-region-mapping-om-code').focus();
				return;
			}
			var request = {
					"conn_type" : $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code,
					"om_code" : $omCode.val().trim(),
					"mr_code": $mrCode.val().trim(),
					"rgd_day" : $rdgDay.val().trim()
			}
			console.log(request);
			remote.load("getcustomerregionrdetails", function(response){
				$scope.customer_region_details = response.customer_region_details;
				$scope.customerRegionMappingGridOptions.data = response.customer_region_details;
			}, request , 'POST');
		};
		
		$scope.customerRegionMappingGridOptions = {
				showGridFooter: true,
				enableFiltering: false,
				enableCellEdit: false,
				columnDefs: [
					{field: 'row_num', displayName: '#', width : '4%'},
					{field: 'rr_no', displayName: 'RR Number', width : '12%'},
					{field: 'om_name', displayName: 'O&M Unit', field_key : 'om_cd', width : '15%'},
					{field: 'mr_cd', displayName: 'MR Code', width : '8%'},
					{field: 'rdg_day', displayName: 'Rdg Day', width : '8%'},
					{field: 'sp_folio', displayName: 'Spot Folio', width : '8%'},
					{field: 'region_cd_description', displayName: 'Region', field_key : 'region_cd'}
		        ],
	             data: [],
	             onRegisterApi : function(gridApi){
		             	$scope.gridApi = gridApi;
		         }
		};
		
		$scope.customer_region_mapping_save = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select RR Numbers to Map Region ...');
				return;
			}
			if(!$scope.regionCode){
				notify.warn('Please Select Region to Map...');
				$('#transformer-town-mapped-details-region-code').focus();
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				userid : $rootScope.user.user_id,
				region_code : $scope.regionCode,
				data: selected_rows
			};
			console.log(request);
			remote.load("customerregionmapping", function(response){
				$scope.load_customer_region_mapping_details();
			}, request, 'POST');
		}
		

		$scope.customer_region_mapping_clear = function(e){
			$scope.customer_region_details = [];
			$scope.customerRegionMappingGridOptions.data = [];
			$omCode.val('').focus();
			$mrCode.val('');
			$rdgDay.val('');
			$regionCode.val('');
		};
		
	}
	
	if(customer_flow === 'customer_search'){
		var request = {
			conn_type: $rootScope.user.connection_type
		}
		remote.load("getsearchcriterialist", function(response){
			console.log(response);
		}, request, 'POST');
	}
	
	if(customer_flow === 'customer_deposits'){
		
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
	
	if(customer_flow === 'generate_addnl_mmd_and_deposits_intrest'){
		
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
	
	if(customer_flow === 'deposit_interest_approval'){
		
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