var accounts_controller = angular.module('accounts_controller',[]);

accounts_controller.controller('accounts_controller',['$scope','$rootScope','remote','$timeout','$compile','$uibModal','uiGridConstants','$sce','notify','$filter','webValidations','$http','$window',
	                                          function($scope,$rootScope,remote,$timeout,$compile,$uibModal,uiGridConstants,$sce,notify,$filter,webValidations,$http,$window){
	
	var accounts_flow = $rootScope.breadcrumb[$rootScope.breadcrumb.length-1];
	
	// Free lighting Details grid starts
	if(accounts_flow === 'free_lighting_details'){
		
		var $rr_no = $('#fl-sanction-rr-number');
		
		$scope.fl_sanction_disable_rr_no = false;
		$scope.flSanctionRRNoTooltipHtml = $sce.trustAsHtml('EX: <br>[%] => ...<br>[ABC] => ABC<br>[ABC%] => ABC...<br>[%ABC] => ...ABC<br>[%ABC%] => ...ABC...');
	
		//load Designations
		remote.load("getdesignations", function(response){
			$scope.designationList = response.designationList;
			$scope.flSanctionGridOptions.columnDefs[5]['options'] = response.designationList;
		}, { conn_type : $rootScope.user.connection_type } , 'POST');
		
		
		$scope.load_fl_sanctions = function(e){
			if($rr_no.val().trim() == '') {
				$rr_no.val('%');
			}
			
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"rr_number": $rootScope.user.location_code + $rr_no.val().trim(),
				"conn_type" : $rootScope.user.connection_type
			}
			console.log(request);
			remote.load("getfldetails", function(response){
				if(!response.fl_details){
					$scope.flSanctionGridOptions.data = [];
					return;
			}
			$scope.fl_sanction_disable_rr_no = true;
			$scope.flSanctionGridOptions.data = response.fl_details;
			}, request , 'POST');
		};
		
		$scope.flSanctionGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
			     {field: 'row_num', displayName: '#',width : '4%', hide: true },
	             {field: 'rr_no', displayName: 'RR Number',width : '10%', required: true, alphanumeric: true},
	             {field: 'sl_no', displayName: 'Serial No',width : '7%', hide: true},
	             {field: 'emp_no', displayName: 'Employee No',width : '10%', required: true, alphanumeric: true},
	             {field: 'emp_name', displayName: 'Employee Name',width : '15%', required: true, alphanumeric: true},
	             {field: 'designation_descr', displayName: 'Designation',field_key : 'designation', width : '15%', required: true},
	             {field: 'place_of_work', displayName: 'Place Of Working',width : '15%'},
	             {field: 'ref_letter_no', displayName: 'Ref Letter No',width : '10%'},
	             {field: 'ref_letter_dt', displayName: 'Ref Letter Date',width : '12%', type: 'date'},
	             {field: 'from_dt', displayName: 'From Date',width : '8%', type: 'date', required: true},
	             {field: 'to_dt', displayName: 'To Date',width : '8%', type: 'date'},
	             {field: 'remarks', displayName: 'Remarks',width : '10%'},
	             {field: 'userid', displayName: 'User ID',width : '10%', hide: true},
	             {field: 'tmpstp', displayName: 'Time Stamp',width : '13%', hide: true}
	    	],
	        data: [],
	        onRegisterApi: function( gridApi ) { 
	             $scope.flSanctionGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_fl_sanction($event,row)" title="Edit"></button></div>';
	             $scope.flSanctionGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.fl_sanction_clear = function(e){
			$scope.fl_sanction_disable_rr_no = false;
			$scope.flSanctionGridOptions.data = [];
			$rr_no.val('').focus();
		};
		
		$scope.edit_fl_sanction = function(e,row){
			var editFLSanctionModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit FL Sanction";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to RR No and From Date fields(edit mode)
			    	var readOnly = [1,9];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
						
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
		    			remote.load("doaddorupdatedfldetails", function(response){
		    				$uibModalInstance.close();
		    			}, request ,'POST');
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
			        }
			    }
			});
			editFLSanctionModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric']);
			});
		};
		$scope.add_fl_sanction = function(e){
			var addFLSanctionModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add FL Sanction";
			    	$scope.ok_text = "Create";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		from_dt : $filter('date')(new Date(), 'dd/MM/yyyy')
			    	};
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
						
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
		    			remote.load("doaddorupdatedfldetails", function(response){
		    				$scope.data['sl_no'] = response.sl_no;
		    				$uibModalInstance.close($scope.data);
		    			}, request ,'POST');
			    	}
			    	$scope.cancel = function(){
			    		$uibModalInstance.dismiss('cancel');
			    	}
			    	$rootScope.popupScope = $scope;
			    },
			    resolve: {
			        configs: function() {
			        	return $scope.flSanctionGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addFLSanctionModalInstance.result.then(function (newRecord) {
				var $this = $('#fl-sanction-rr-number');
				if($this.val().trim() == ''){
					$this.val(newRecord.rr_no);
				}
				$scope.load_fl_sanctions();
			});
			addFLSanctionModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric']);
			});
		};
	}
	
	// Rebate Details grid starts
	if(accounts_flow === 'rebate_details'){
		
		$scope.rebateDetailsRRNoTooltipHtml = $sce.trustAsHtml('EX: <br>[%] => ...<br>[ABC] => ABC<br>[ABC%] => ABC...<br>[%ABC] => ...ABC<br>[%ABC%] => ...ABC...');
		var $rrNo = $('#rebate-details-rr-number');
		var $rebateType = $('#rebate-details-rebate-type');
		//load rebate type picklists
		remote.load("getrebatetypelist", function(response){
			$scope.RebateList = response.RebateList;
			$scope.rebateDetailsGridOptions.columnDefs[2]['options'] = response.RebateList;
		}, { conn_type : $rootScope.user.connection_type } , 'POST');
		
		$scope.load_rebate_details = function(e){
			if($rrNo.val().trim() == '') {
				$rrNo.val('%');
			}
			var request = {
				"location_code" : $rootScope.user.location_code,		
				"conn_type" : $rootScope.user.connection_type,
				"rr_number": $rootScope.user.location_code + $rrNo.val().trim(),
				"rebate_description" : $rebateType.val()
			}
			$scope.rebateDetailsGridOptions.data = [];
			remote.load("getrebatedetails", function(response){
				$scope.rebateDetailsGridOptions.data = response.rr_rebate_details;
			}, request , 'POST');
		};
		
		$scope.rebateDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#',width : '4%', hide: true },
	             {field: 'rr_no', displayName: 'RR Number',width : '10%', required: true},
	             {field: 'rebate_description', field_key: 'rebate_code', displayName: 'Type', width : '10%', required: true},
	             {field: 'rebate_unit', displayName: 'Unit',width : '5%', readOnly: true},
	             {field: 'max_rebate_amt', displayName: 'Max Amount',width : '9%', readOnly: true},
	             {field: 'chrg_description', field_key: 'rebate_code', displayName: 'Charge Code',width : '10%', readOnly: true},
	             {field: 'rebate_eff_from_dt', displayName: 'Effected From',width : '9%', type: 'date', required: true},
	             {field: 'rebate_eff_to_dt', displayName: 'Effected Upto',width : '9%', type: 'date'},
	             {field: 'remarks', displayName: 'Remarks',width : '10%'},
	             {field: 'userid', displayName: 'User ID',width : '10%', hide: true},
	             {field: 'tmpstp', displayName: 'Time Stamp',width : '13%', hide: true}
	        ],
	        data: [],
	        onRegisterApi: function( gridApi ) { 
	             $scope.rebateDetailsGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_rebate_details($event,row)" title="Edit"></button></div>';
	             $scope.rebateDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.rebate_details_clear = function(e){
			$rrNo.val('').focus();
			$rebateType.val('');
			$scope.rebateDetailsGridOptions.data = [];
		};
		
		$scope.edit_rebate_details = function(e,row){
			var editRebateDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote, notify){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Rebate Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,2,6];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
			    		$scope.data.rebate_description = $('.rebate_description').find('select').find('option[value="'+$('.rebate_description').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
		    			remote.load("doaddorupdaterebatedetails", function(response){
		    				$uibModalInstance.close();
		    			}, request ,'POST');
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
			        }
			    }
			});
			editRebateDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope);
			});
		}
		$scope.add_rebate_details = function(e){
			var addRebateDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote, notify){
			    	$scope.header = "Add Rebate Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		rebate_eff_from_dt : $filter('date')(new Date(), 'dd/MM/yyyy')
			    	};
			    	$scope.$watch('data.rebate_code',function(new_val, old_val){
			    		if(typeof new_val !== 'undefined' && new_val !== old_val){
			    			$scope.getChargeCodeDetails();
			    		}
			    	});
			    	$scope.getChargeCodeDetails = function(){
			    		angular.extend($scope.data, {
		    				max_rebate_amt: '',
		    				chrg_description: '',
		    				rebate_unit: ''
		    			});
			    		if($scope.data.rebate_code){
			    			var request = {
		    					"conn_type": $rootScope.user.connection_type,
		    					"rebate_type": $scope.data.rebate_code,
		    					"conn_type" : $rootScope.user.connection_type
		    				};
			    			remote.load("getchargecodedetailsforrebatetype", function(response){
			    		        $scope.data.max_rebate_amt = response.max_rebate_amount;
			    		        $scope.data.chrg_description = response.charge_code;
			    		        $scope.data.rebate_unit = response.charge_unit;
			    			}, request , 'POST', false, true, true);
			    		}
			    	};
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
			    		$scope.data.rebate_description = $('.rebate_description').find('select').find('option[value="'+$('.rebate_description').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
		    			remote.load("doaddorupdaterebatedetails", function(response){
		    				$uibModalInstance.close($scope.data);
		    			}, request ,'POST');
			    	}
			    	$scope.cancel = function(){
			    		$uibModalInstance.dismiss('cancel');
			    	}
			    	$rootScope.popupScope = $scope;
			    },
			    resolve: {
			        configs: function() {
			        	return $scope.rebateDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addRebateDetailsModalInstance.result.then(function (newRecord) {
				$rrNo.val(newRecord.rr_no);
				$rebateType.val(newRecord.rebate_code);
				$scope.load_rebate_details();
			});
			addRebateDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-alphanumeric', 'web-float']);
			});
		};
		
	}
	
	//Regular Penality Grid starts
	if(accounts_flow === 'regular_penalty_details'){
		
		var $rr_no = $('#regular-penality-rr-number');
		var $sl_no = $('#regular-penality-serial-number');
		
		//load charge code picklists
		remote.load("getchargecodedetails", function(response){
			$scope.ChargeCodeList = response.ChargeCodeList;
			$scope.regularPenalityGridOptions.columnDefs[3]['options'] = response.ChargeCodeList;
		}, { conn_type : $rootScope.user.connection_type } , 'POST');
		
		
		$scope.load_regular_penalty_details = function($event){
			if($rr_no.val().trim() == '') {
				$rr_no.val('%');
			}			
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"rr_number": $rootScope.user.location_code + $rr_no.val().trim(),
				"serial_number" : $sl_no.val().trim(),
				"conn_type" : $rootScope.user.connection_type
			}
			$scope.regularPenalityGridOptions.data = [];
			remote.load("getregularpenality", function(response){
				$scope.regularPenalityGridOptions.data = response.penality_details;
			}, request , 'POST');
		};
		
		$scope.regularPenalityGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#',width : '4%', hide: true},
	             {field: 'rr_no', displayName: 'RR Number',width : '10%', required: true},
	             {field: 'sl_no', displayName: 'Serial No',width : '7%', hide: true},
	             {field: 'chrg_description', displayName: 'Charge Code', field_key: 'chrg_cd', width : '10%', required: true},
	             {field: 'amount', displayName: 'Amount',width : '8%', required: true, float: true},
	             {field: 'from_dt', displayName: 'From Date',width : '8%', type: 'date', required: true},
	             {field: 'to_dt', displayName: 'To Date',width : '8%', type: 'date'},
	             {field: 'remarks', displayName: 'Remarks',width : '15%'},
	             {field: 'userid', displayName: 'User ID',width : '10%', hide: true},
	             {field: 'tmpstp', displayName: 'Time Stamp',width : '13%', hide: true}
            ],
            data: [],
	        onRegisterApi: function( gridApi ) { 
	             $scope.regularPenalityGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_regular_penality($event,row)" title="Edit"></button></div>';
	             $scope.regularPenalityGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.regular_penality_clear = function(e){
			$rr_no.val('').focus();
			$sl_no.val('');
			$scope.regularPenalityGridOptions.data = [];
		};
		
		$scope.edit_regular_penality = function(e,row){
			var editRegularPenalityModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Regular Penality Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,3,4,5];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
			    		remote.load("upsertregularpenaltydetails", function(response){
		    				$uibModalInstance.close();
		    			}, request ,'POST');
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
			        }
			    }
			});
			editRegularPenalityModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-alphanumeric', 'web-float']);
			});
		}
		$scope.add_regular_penality = function(e){
			var addRegularPenalityModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add Regular Penality Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		from_dt : $filter('date')(new Date(), 'dd/MM/yyyy')
			    	};
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
		    			remote.load("upsertregularpenaltydetails", function(response){
		    				$scope.data['sl_no'] = response.sl_no;
		    				$uibModalInstance.close($scope.data);
		    			}, request ,'POST');
			    	}
			    	$scope.cancel = function(){
			    		$uibModalInstance.dismiss('cancel');
			    	}
			    	$rootScope.popupScope = $scope;
			    },
			    resolve: {
			        configs: function() {
			        	return $scope.regularPenalityGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addRegularPenalityModalInstance.result.then(function (newRecord) {
				$rr_no.val(newRecord.rr_no);
				$sl_no.val(newRecord.sl_no);
				$scope.load_regular_penalty_details();
			});
			addRegularPenalityModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-alphanumeric', 'web-float']);
			});
		};
	}
	
	//ECS Details Grid starts
	if(accounts_flow === 'ecs_details'){

		var $rr_no = $('#ecs-rr-number');
		var $ecs_no = $('#ecs-number');
		
		//load charge code picklists
		
		remote.load("getecsbankaccounttype", function(response){
			$scope.ecs_account_type_list = response.ecs_account_type_list;
			$scope.ecsDetailsGridOptions.columnDefs[10]['options'] = response.ecs_account_type_list;
		}, { conn_type : $rootScope.user.connection_type } , 'POST');
		
		$scope.load_ecs_details = function($event){
			if($rr_no.val().trim() == '') {
				$rr_no.val('%');
			}			
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"rr_number": $rootScope.user.location_code + $rr_no.val().trim(),
				"ecs_number" : (($ecs_no.val().trim() == '') ? '' : $rootScope.user.location_code) + $ecs_no.val().trim()
			}
			$scope.ecsDetailsGridOptions.data = [];
			remote.load("getecsdetails", function(response){
				$scope.ecsDetailsGridOptions.data = response.ecs_details;
			}, request , 'POST');
		};
		
		$scope.ecsDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#',width : '5%', hide: true},
	             {field: 'rr_no', displayName: 'RR Number',width : '10%', required: true},
	             {field: 'ecs_no', displayName: 'ECS Number',width : '10%'},
	             {field: 'customer_name', displayName: 'Customer Name',width : '15%', required: true, alphanumeric: true},
	             {field: 'ecs_customer_name', displayName: 'ECS Customer Name',width : '15%', required: true, alphanumeric: true},
	             {field: 'acct_no', displayName: 'Account Number',width : '15%', required: true, numeric: true},
	             {field: 'acct_holder_name', displayName: 'Account Holder Name',width : '15%', required: true, alphanumeric: true},
	             {field: 'bank_cd', displayName: 'Bank Code',width : '10%', required: true, numeric: true},
	             {field: 'bank_name', displayName: 'Bank name',width : '12%', required: true, alphanumeric: true},
	             {field: 'branch_name', displayName: 'Branch Name',width : '12%', required: true, alphanumeric: true},
	             {field: 'acct_type_description', displayName: 'Account Type', field_key : 'acct_type_cd',width : '13%', required: true},
	             {field: 'effect_from_dt', displayName: 'Effected From',width : '10%', type : 'date', required: true},
	             {field: 'effect_to_dt', displayName: 'Effected Upto',width : '10%', type : 'date'},
	             {field: 'remarks', displayName: 'Remarks',width : '15%'},
	             {field: 'userid', displayName: 'User ID',width : '10%', hide: true},
	             {field: 'tmpstp', displayName: 'Time Stamp',width : '13%', hide: true}
            ],
            data: [],
            onRegisterApi: function( gridApi ) { 
	             $scope.ecsGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_ecs_details($event,row)" title="Edit"></button></div>';
	             $scope.ecsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.ecs_mandate_form_clear = function(e){
			$scope.ecsDetailsGridOptions.data = [];
			$rr_no.val('').focus();
			$ecs_no.val('');
		};
		
		// add function
		$scope.add_ecs_details = function(e){
			var addECSDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add ECS Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		acct_type_cd : '10',
			    		effect_from_dt : $filter('date')(new Date(), 'dd/MM/yyyy')
			    	};
			    	
			    	$scope.$watch('data.rr_no',function(new_val, old_val){
			    		console.log(new_val, old_val);
			    		if(typeof new_val !== 'undefined' && new_val !== old_val){
			    			$scope.getCustomerName();
			    		}
			    	});
			    	$scope.getCustomerName = function(){
			    		angular.extend($scope.data, {
			    			customer_name : '',
			    			ecs_customer_name : '',
			    			acct_holder_name : '',
			    			acct_type_cd : '',
			    			effect_from_dt : ''
		    			});
			    		if($scope.data.rr_no){
			    			var request = {
		    					"conn_type": $rootScope.user.connection_type,
		    					"rr_no" : $rootScope.user.location_code + $scope.data.rr_no
		    				};
			    			remote.load("getcustomername", function(response){
			    		        $scope.data.customer_name = response.customer_name;
			    		        $scope.data.ecs_customer_name = response.customer_name;
			    		        $scope.data.acct_holder_name = response.customer_name;
			    		        $scope.data.acct_type_cd = "10";
			    		        $scope.data.effect_from_dt = $filter('date')(new Date(), 'dd/MM/yyyy');
			    			}, request , 'POST', false, true, true);
			    		}
			    	};
			    	
			    	$scope.$watch('data.bank_cd',function(new_val, old_val){
			    		console.log(new_val, old_val);
			    		if(typeof new_val !== 'undefined' && new_val !== old_val){
			    			$scope.getBankDetails();
			    		}
			    	});
			    	$scope.getBankDetails = function(){
			    		angular.extend($scope.data, {
			    			bank_name : '',
			    			branch_name : ''
		    			});
			    		if($scope.data.bank_cd){
			    			var request = {
		    					"conn_type": $rootScope.user.connection_type,
		    					"micr_code" :  $scope.data.bank_cd,
		    				};
			    			remote.load("getbankdetailsbymicrcode", function(response){
			    		        $scope.data.bank_name = response.bank_name;
			    		        $scope.data.branch_name = response.branch_name;
			    			}, request , 'POST', false, true, true);
			    		}
			    	};
			    	
			    	
			    	//loading hide property to fields(add mode)
			    	var hide = [2];
			    	for(var i=0; i< hide.length;i++){
			    		$scope.configs[hide[i]]['hide'] = true;
			    	}
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
			    		
		    			remote.load("upsertecsdetails", function(response){
		    				$scope.data['ecs_no'] = response.ecs_no;
		    				$uibModalInstance.close($scope.data);
		    			}, request ,'POST');
			    	}
			    	$scope.cancel = function(){
			    		$uibModalInstance.dismiss('cancel');
			    	}
			    	$rootScope.popupScope = $scope;
			    },
			    resolve: {
			        configs: function() {
			        	return $scope.ecsDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addECSDetailsModalInstance.result.then(function (newRecord) {
				$rr_no.val(newRecord.rr_no);
				$ecs_no.val(newRecord.ecs_no);
				$scope.load_ecs_details();
			});
			addECSDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-alphanumeric', 'web-numeric']);
			});
		};
		
		// edit/update function
		$scope.edit_ecs_details = function(e,row){
			var editECSDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit ECS Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	
			    	$scope.$watch('data.bank_cd',function(new_val, old_val){
			    		console.log(new_val, old_val);
			    		if(typeof new_val !== 'undefined' && new_val !== old_val){
			    			$scope.getBankDetails();
			    		}
			    	});
			    	$scope.getBankDetails = function(){
			    		angular.extend($scope.data, {
			    			bank_name : '',
			    			branch_name : ''
		    			});
			    		if($scope.data.bank_cd){
			    			var request = {
		    					"conn_type": $rootScope.user.connection_type,
		    					"micr_code" :  $scope.data.bank_cd,
		    					"city_code" : '',
		    					"bank_code" : '',
		    					"branch_code" : '',
		    				};
			    			remote.load("getbankdetails", function(response){
			    		        $scope.data.bank_name = response.bank_name;
			    		        $scope.data.branch_name = response.branch_name;
			    			}, request , 'POST', false, true, true);
			    		}
			    	};
			    	
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,2,11];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
			    		remote.load("upsertecsdetails", function(response){
		    				$uibModalInstance.close();
		    			}, request ,'POST');
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
			        }
			    }
			});
			editECSDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-alphanumeric', 'web-numeric']);
			});
		}
	}
	
	//Cheque Dishoner Details Grid starts
	if(accounts_flow === 'cheque_dishonour'){
		
		$scope.chqdis = {};
		
		var $rr_no = $('#cheque-dishonour-rr-number');
		var $chq_no = $('#cheque-dishonour-cheque-number');
		var $bank_name = $('#cheque-dishonour-bank-name');
		
		$scope.load_cheque_dishoner_details = function($event){
			var request = {
					"location_code" : $rootScope.user.location_code,					
					"rr_number": (($rr_no.val().trim()) ?  $rootScope.user.location_code + $rr_no.val().trim() : ''),
					"receipt_date" : (($scope.receiptDate) ? $scope.receiptDate : ''),
					"cheque_number" : (($chq_no.val()) ?  $chq_no.val().trim() : ''),
					"cheque_date" :(($scope.chequeDate) ? $scope.chequeDate : ''),
					"bank" : (($bank_name.val().trim()) ? $bank_name.val().trim() : ''),
					"conn_type" : $rootScope.user.connection_type
			}
			$scope.chequeDishonourDetailsGridOptions.data = [];
			remote.load("getchequedetails", function(response){
				$scope.cheque_dishonour_details = response.cheque_details;
				$scope.chequeDishonourDetailsGridOptions.data = $scope.cheque_dishonour_details;
			}, request , 'POST');
		};

		$scope.chequeDishonourDetailsGridOptions = {
				showGridFooter: true,
				gridFooterHeight: 20,
				columnDefs: [
		             {field: 'row_num', displayName: '#',width : '4%'},
		             {field: 'chq_dd_no', displayName: 'Cheque Number',width : '15%',cellTemplate:'<div><a ng-click="grid.appScope.addchequedishonourdetails(row.entity)">{{row.entity[col.field]}}</a></div>'},
		             {field: 'chq_dd_dt', displayName: 'Cheque Date',width : '15%'},
		             {field: 'drawn_bank', displayName: 'Bank Name',width : '25%'},
		             {field: 'chq_dd_amt', displayName: 'Cheque Amount',width : '15%'},
		             {field: 'userid', displayName: 'User ID',width : '10%'},
		             {field: 'tmpstp', displayName: 'Time Stamp',width : '15%'}
	            ],
	            data: []
		};
		$scope.cheque_dishonour_clear = function(e){
			$scope.cheque_dishonour_details = [];
			$scope.chequeDishonourDetailsGridOptions.data = [];
			$rr_no.val('').focus();
			$chq_no.val('');
			$scope.receiptDate = '';
			$scope.chequeDate = '';
			$bank_name.val('');
		};
		
		$scope.setmessagefordishonour = null;
		
		$scope.addchequedishonourdetails = function(row){
			
			console.log(row);
			$scope.setmessagefordishonour = null;
			
			var request = {
					"conn_type" : $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code,
					"cheque_number": row.chq_dd_no,
					"cheque_date": row.chq_dd_dt,
					"bank":row.drawn_bank 
			};
			
			remote.load("getreceiptdetailsforchequedisno", function(response){
				$scope.receipt_details_cheque_dishonour_details = response.receipt_cheque_details;
				
				$scope.chqdis.chequeno = $scope.receipt_details_cheque_dishonour_details[0].chq_dd_no;
				$scope.chqdis.chequedate = $scope.receipt_details_cheque_dishonour_details[0].chq_dd_dt;
				$scope.chqdis.chequeamount =  $scope.receipt_details_cheque_dishonour_details[0].chq_dd_amt;
				$scope.chqdis.drawnbank = $scope.receipt_details_cheque_dishonour_details[0].drawn_bank;
				$scope.chqdis.penaltyamount = $scope.receipt_details_cheque_dishonour_details[0].chq_dis_penalty;
				$scope.chqdis.bankcharges = 0 ;
				
				$scope.chqdis.chequedisdate = moment(new Date()).format("DD/MM/YYYY").toString();
				
				$scope.temp_debit_to_bill = $scope.receipt_details_cheque_dishonour_details[0].debit_amount;
				
				if($scope.receipt_details_cheque_dishonour_details[0].chq_dis_flag === 'Y'){
					$scope.setmessagefordishonour = "This Cheque Is Already Dishonoured.";
				}
				
			}, request , 'POST');
			
			$('#myModal').modal('toggle');
			
		};
		
		$scope.calculatedebitamount = function(){
			
			if(!$scope.chqdis.bankcharges){
				$scope.receipt_details_cheque_dishonour_details[0].debit_amount = $scope.temp_debit_to_bill ;
				$scope.chqdis.bankcharges = 0 ;
				return;
			}
			
			console.log($scope.chqdis.bankcharges);
			console.log($scope.chqdis.penaltyamount);
			console.log($scope.receipt_details_cheque_dishonour_details[0].rcpt_amount);
			var amount = parseInt($scope.chqdis.bankcharges) + parseInt($scope.chqdis.penaltyamount) + parseInt($scope.receipt_details_cheque_dishonour_details[0].rcpt_amount);
			console.log(amount);
			
			$scope.receipt_details_cheque_dishonour_details[0].debit_amount = amount;
			
		}
		
		$scope.save_cheque_dishonour = function(){
			
			if(!$scope.chqdis.remarks){notify.warn("Please enter remarks !!!");return;}
			
			var request = {
					"conn_type" : $rootScope.user.connection_type,
					"location": $rootScope.user.location_code,
					"cheque_number": $scope.chqdis.chequeno,
					"cheque_date": $scope.chqdis.chequedate,
					"bank":$scope.chqdis.drawnbank ,
					"userid": $rootScope.user.user_id,
					"remarks": $scope.chqdis.remarks,
					"cheque_dis_date": $scope.chqdis.chequedisdate,
					"penalty_amount": $scope.chqdis.penaltyamount,
					"bank_charges": $scope.chqdis.bankcharges
			};
			
			remote.load("dochequedishonour", function(response){
				
			}, request , 'POST');
			
		};
	}
	
	//Other Cheque Dishoner Details Grid starts
	if(accounts_flow === 'other_cheque_dishonour'){
		
		var $rr_no = $('#other-cheque-dishonour-rr-number');
		var $chq_no = $('#other-cheque-dishonour-cheque-number');
		var $bank_name = $('#other-cheque-dishonour-bank-name');
		
		$scope.load_other_cheque_dishoner_details = function($event){
			var request = {
					"location_code" : $rootScope.user.location_code,					
					"rr_number": (($rr_no.val().trim()) ?  $rootScope.user.location_code + $rr_no.val().trim() : ''),
					"receipt_date" : (($scope.receiptDate) ? $scope.receiptDate : ''),
					"cheque_number" : (($chq_no.val()) ?  $chq_no.val().trim() : ''),
					"cheque_date" :(($scope.chequeDate) ? $scope.chequeDate : ''),
					"bank" : (($bank_name.val().trim()) ? $bank_name.val().trim() : ''),
					"conn_type" : $rootScope.user.connection_type
			}
			$scope.otherchequeDishonourDetailsGridOptions.data = [];
			remote.load("getotherchequedetails", function(response){
				$scope.other_cheque_dishonour_details = response.other_cheque_details;
				$scope.otherchequeDishonourDetailsGridOptions.data = $scope.other_cheque_details;
			}, request , 'POST');
		};

		$scope.otherchequeDishonourDetailsGridOptions = {
				showGridFooter: true,
				gridFooterHeight: 20,
				columnDefs: [
		             {field: 'row_num', displayName: '#',width : '4%'},
		             {field: 'chq_dd_no', displayName: 'Cheque Number',width : '15%'},
		             {field: 'chq_dd_dt', displayName: 'Cheque Date',width : '15%'},
		             {field: 'drawn_bank', displayName: 'Bank Name',width : '25%'},
		             {field: 'chq_dd_amt', displayName: 'Cheque Amount',width : '15%'},
		             {field: 'userid', displayName: 'User ID',width : '10%'},
		             {field: 'tmpstp', displayName: 'Time Stamp',width : '15%'}
	            ],
	            data: []
		};
		$scope.cheque_dishonour_clear = function(e){
			$scope.cheque_dishonour_details = [];
			$scope.otherchequeDishonourDetailsGridOptions.data = [];
			$rr_no.val('').focus();
			$chq_no.val('');
			$scope.receiptDate = '';
			$scope.chequeDate = '';
			$bank_name.val('');
		};
		
		
	}
	
	//Other Cheque Dishoner Details Grid starts
	if(accounts_flow === 'manual_average_unit_fixation'){
		
		
		var $rr_no = $('#manual-average-unit-fixation-rr-number');
		$scope.manual_average_fixation_disable_rr_no = false;
		$scope.manulAverageFixationRRNoTooltipHtml = $sce.trustAsHtml('EX: <br>[%] => ...<br>[ABC] => ABC<br>[ABC%] => ABC...<br>[%ABC] => ...ABC<br>[%ABC%] => ...ABC...');
	
		$scope.load_manual_average_unit_fixation = function($event){
			if($rr_no.val().trim() === '') {
				$rr_no.val('%');
			}
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"rr_number": $rootScope.user.location_code + $rr_no.val().trim(),
				"conn_type" : $rootScope.user.connection_type
			}
			remote.load("getfixedavgdetails", function(response){
				if(!response.fixed_avg_details){
					$scope.manualAverageUnitFixationDetailsGridOptions.data = [];
					return;
				}
				$scope.manual_average_fixation_disable_rr_no = true;
				$scope.manualAverageUnitFixationDetailsGridOptions.data = response.fixed_avg_details;
			}, request , 'POST');
		};
		
		$scope.manualAverageUnitFixationDetailsGridOptions = {
				showGridFooter: true,
				gridFooterHeight: 20,
				columnDefs: [
		             {field: 'row_num', displayName: '#',width : '4%'},
		             {field: 'rr_no', displayName: 'RR Number',width : '10%', required: true},
		             {field: 'full_rr_no', displayName: 'Full RR Number',width : '5%', visible: false},
		             {field: 'billed_avg_units', displayName: 'Billed Average Units',width : '5%', visible: false, readOnly: true},
		             {field: 'avg_units', displayName: 'Average Units',width : '10%', required: true, numeric: true},
		             {field: 'remarks', displayName: 'Remarks',width : '20%', required: true, alphanumeric: true},
		             {field: 'from_dt', displayName: 'Effect From',width : '10%',type : 'date', required: true},
		             {field: 'to_dt', displayName: 'Effect Upto',width : '10%',type : 'date'},
		             {field: 'inserted_user', displayName: 'Created By',width : '10%'},
		             {field: 'inserted_tmpstp', displayName: 'Created Time Stamp',width : '15%'},
		             {field: 'updated_user', displayName: 'Updated By',width : '10%'},
		             {field: 'updated_tmpstp', displayName: 'Updated Time Stamp',width : '15%'}
		             ],
		             data: [],
		             onRegisterApi: function( gridApi ) { 
			             $scope.manualAvegrageGridApi = gridApi;
			             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_manual_average_unit_fixation($event,row)" title="Edit"></button></div>';
			             $scope.manualAvegrageGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
			        }
		};
		
		
		$scope.manual_average_unit_fixation_clear = function(e){
			$scope.manual_average_fixation_disable_rr_no = false;
			$scope.manualAverageUnitFixationDetailsGridOptions.data = [];
			$rr_no.val('').focus();
		};
		
		// add function
		$scope.add_manual_average_unit_fixation = function(e){
			var addManualAverageModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add Manual Average Units";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		from_dt : $filter('date')(new Date(), 'dd/MM/yyyy')
			    	};
			    	
			    	$scope.$watch('data.rr_no',function(new_val, old_val){
			    		console.log(new_val, old_val);
			    		if(typeof new_val !== 'undefined' && new_val !== old_val){
			    			$scope.getAvgUnits();
			    		}
			    	});
			    	$scope.getAvgUnits = function(){
			    		angular.extend($scope.data, {
			    			billed_avg_units: ''
		    			});
			    		if($scope.data.rr_no){
			    			var request = {
		    					"conn_type": $rootScope.user.connection_type,
		    					"rr_no" : $rootScope.user.location_code + $scope.data.rr_no,
		    					"conn_type" : $rootScope.user.connection_type
		    				};
			    			remote.load("getbilledavgunits", function(response){
			    		        $scope.data.billed_avg_units = response.billed_avg_units;
			    		        $scope.data.from_dt = $filter('date')(new Date(), 'dd/MM/yyyy');
			    			}, request , 'POST', false, true, true);
			    		}
			    	};
			    	
			    	//loading hide property to fields(add mode)
			    	var hide = [0,2,8,9,10,11];
			    	for(var i=0; i< hide.length;i++){
			    		$scope.configs[hide[i]]['hide'] = true;
			    	}
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
			    		
		    			remote.load("upsertmanualaverageunits", function(response){
		    				$uibModalInstance.close($scope.data);
		    			}, request ,'POST');
			    	}
			    	$scope.cancel = function(){
			    		$uibModalInstance.dismiss('cancel');
			    	}
			    	$rootScope.popupScope = $scope;
			    },
			    resolve: {
			        configs: function() {
			        	return $scope.manualAverageUnitFixationDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addManualAverageModalInstance.result.then(function (newRecord) {
				$rr_no.val(newRecord.rr_no);
				//$ecs_no.val(newRecord.ecs_no);
				$scope.load_manual_average_unit_fixation();
			});
			addManualAverageModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-alphanumeric', 'web-numeric']);
			});
		};
		
		// edit/update function
		$scope.edit_manual_average_unit_fixation = function(e,row){
			var editManualAverageModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Manual Average Units";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	
			    	//loading hide property to fields(add mode)
			    	var hide = [0,2,8,9,10,11];
			    	for(var i=0; i< hide.length;i++){
			    		$scope.configs[hide[i]]['hide'] = true;
			    	}			    	
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,6];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
			    		remote.load("upsertmanualaverageunits", function(response){
		    				$uibModalInstance.close();
		    			}, request ,'POST');
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
			        }
			    }
			});
			editManualAverageModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-alphanumeric', 'web-numeric']);
			});
		}
				
	}
	
	//Adjustment Details Grid starts
	if(accounts_flow === 'adjustments'){
		
		var $from_rr_number = $('#adjustments-from-rr-number');
		var $to_rr_number = $('#adjustments-to-rr-number');
		var $receipt_number = $('#adjustments-receipt-number');
		var $receipt_date = $('#adjustments-receipt-date');
		var $counter_number = $('#adjustments-counter-number');
		
		$scope.adjustments_from_rr_no = false;
		$scope.adjustments_to_rr_no = false;
		$scope.adjustmentsFromRRNoTooltipHtml = $sce.trustAsHtml('EX: <br>[%] => ...<br>[ABC] => ABC<br>[ABC%] => ABC...<br>[%ABC] => ...ABC<br>[%ABC%] => ...ABC...');
		$scope.adjustmentsToRRNoTooltipHtml = $sce.trustAsHtml('EX: <br>[%] => ...<br>[ABC] => ABC<br>[ABC%] => ABC...<br>[%ABC] => ...ABC<br>[%ABC%] => ...ABC...');
		
		remote.load("cashcounterlist", function(response){
			$scope.cash_counters_list = response.cash_counters_list;
		}, { conn_type : $rootScope.user.connection_type,location_code : $rootScope.user.location_code, } , 'POST');
		
		$scope.load_adjustments_details = function($event){
			var request = {
					"location_code" : $rootScope.user.location_code,					
					"from_rr_no": (($scope.fromRRNumber) ? $rootScope.user.location_code+$scope.fromRRNumber : ''),
					"to_rr_no": (($scope.toRRNumber) ? $rootScope.user.location_code+$scope.toRRNumber : ''),
					"receipt_number" : (($scope.receiptNumber) ? $scope.receiptNumber : ''),
					"receipt_date" : (($scope.receiptDate) ? $scope.receiptDate : ''),
					"counter_number" : (($scope.counterNumber) ? $scope.counterNumber : ''),
					"conn_type" : $rootScope.user.connection_type
			}
			console.log(request);
			remote.load("getadjustmentdetails", function(response){
				$scope.adjustments_details = response.adjustment_details;
				$scope.adjustmentsDetailsGridOptions.data = $scope.adjustments_details;
			}, request , 'POST');
		};

		$scope.adjustmentsDetailsGridOptions = {
				showGridFooter: true,
				gridFooterHeight: 20,
				columnDefs: [
		             {field: 'rcpt_no', displayName: 'Receipt No',width : '8%'},
		             {field: 'rcpt_dt', displayName: 'Receipt Date',width : '8%'},
		             {field: 'counter_no_descr', displayName: 'Cash Counter',field_key: 'counter_no', width : '14%'},
		             {field: 'from_rr_no', displayName: 'From RR No',width : '8%'},
		             {field: 'from_pymnt_purp_decription', displayName: 'From Purpose',width : '9%'},
		             {field: 'to_rr_no', displayName: 'To RR No',width : '8%'},
		             {field: 'to_pymnt_purp_decription', displayName: 'To Purpose',width : '9%'},
		             {field: 'adj_jv_no', displayName: 'JV No',width : '5%'},
		             {field: 'adj_no', displayName: 'Adj No',width : '6%'},
		             {field: 'adj_dt', displayName: 'Adj Date',width : '7%'},
		             {field: 'userid', displayName: 'Adj By',width : '6%'},
		             {field: 'tmpstp', displayName: 'Time Stamp',width : '13%'}
		             ],
		             data: []
		};
		
		$scope.adjustments_clear = function(e){
			$scope.adjustments_details = [];
			$scope.adjustmentsDetailsGridOptions.data = [];
			delete $scope.fromRRNumber;
			delete $scope.toRRNumber;
			delete $scope.receiptNumber;
			delete $scope.receiptDate;
			delete $scope.counterNumber;
			$('#adjustments-from-rr-number').focus();
			
		};
		
		
		$scope.addnewadjustment = function(){
			
			$scope.addadjustment = {};
			$scope.verifiedpaymentpurpose = true;
			$scope.rr_status = false;
			
			$scope.addadjustment.receiptdate = moment(new Date()).format("DD/MM/YYYY").toString();
			$scope.addadjustment.adjdate     = moment(new Date()).format("DD/MM/YYYY").toString();
			
			remote.load("getpaymentpurposelist", function(response){
				$scope.payment_purpose_list = response.PAYMENT_PURPOSE_DESCR_LIST;
			}, { CONN_TYPE : $rootScope.user.connection_type,LOCATION_CODE : $rootScope.user.location_code, } , 'POST');
			
			$('#adjustmentModal').modal('toggle');
			
		};
		
		$scope.verifyandfetchreceiptdetails = function(){
			
			var request = {
					"location_code" : $rootScope.user.location_code,	
					"conn_type" : $rootScope.user.connection_type,
					"receipt_number" : (($scope.addadjustment.receiptno) ? $scope.addadjustment.receiptno : ''),
					"receipt_date" : (($scope.addadjustment.receiptdate) ? $scope.addadjustment.receiptdate : ''),
					"counter_number" : (($scope.addadjustment.counter) ? $scope.addadjustment.counter : '')
			}
			console.log(request);
			remote.load("getreceiptdetailstoadjust", function(response){
				$scope.addadjustment.fromrrnumber = response.receipt_rr_number;
				$scope.addadjustment.purpose = response.receipt_purpose;
				$scope.addadjustment.amount = response.receipt_amount_paid;
				
			}, request , 'POST');
			
			
		};
		
		$scope.verifypaymentpurpose = function(){
			if($scope.addadjustment.paymentpurpose === '2' // '3MMD'
				||$scope.addadjustment.paymentpurpose === '15' // 'ADDL MSD' 
					||$scope.addadjustment.paymentpurpose === '6' // 'ADD. 3MMD' 
						||$scope.addadjustment.paymentpurpose === '1' // 'REVENUE'
							){
								$scope.verifiedpaymentpurpose = false;
			}else{
				$scope.verifiedpaymentpurpose = true;
			}
			
		};
		
		$scope.rr_status = false;
		$scope.CheckRRnumberExistsOrNot = function(event){
			
			var request = {
					"location_code" : $rootScope.user.location_code,	
					"conn_type" : $rootScope.user.connection_type,
					"to_rrno" : (($scope.addadjustment.torrnumber) ? $rootScope.user.location_code+$scope.addadjustment.torrnumber : ''),
					
			}
			console.log(request);
			remote.load("dovalidaterrnumber", function(response){
				$scope.rr_status = response.rr_status;
			}, request , 'POST');
			
		};
		
		$scope.validateandtransferrrno = function(){
			
			if(!$scope.addadjustment.receiptno){notify.warn("Please Enter Receipt Number !!!");return;}
			if(!$scope.addadjustment.receiptdate){notify.warn("Please Select Receipt Date !!!");return;}
			if(!$scope.addadjustment.counter){notify.warn("Please Select Counter !!!");return;}
			if(!$scope.addadjustment.paymentpurpose){notify.warn("Please Select Payment Purpose !!!");return;}
			if(!$scope.addadjustment.torrnumber){notify.warn("Please Enter TO Rr-Number !!!");return;}
			if(!$scope.addadjustment.jvnumber){notify.warn("Please Enter JV Number !!!");return;}
			if(!$scope.addadjustment.adjnumber){notify.warn("Please Enter Adjustment Number !!!");return;}
			if(!$scope.addadjustment.adjdate){notify.warn("Please Select Adjustment Date !!!");return;}
			
			var pymnt_desc = $filter('filter')($scope.payment_purpose_list,{PAYMENT_PURPOSE_CODE:$scope.addadjustment.paymentpurpose},true)[0]; 
			console.log("pymnt_desc",pymnt_desc);
			
			var request = {
					"location_code" : $rootScope.user.location_code,	
					"conn_type" : $rootScope.user.connection_type,
					"adjustment_date" : (($scope.addadjustment.adjdate) ? $scope.addadjustment.adjdate : ''),
					"adjustment_number" : (($scope.addadjustment.adjnumber) ? $scope.addadjustment.adjnumber : ''),
					"jv_number" : (($scope.addadjustment.jvnumber) ? $scope.addadjustment.jvnumber : ''),
					"receipt_number" : (($scope.addadjustment.receiptno) ? $scope.addadjustment.receiptno : ''),
					"receipt_date" : (($scope.addadjustment.receiptdate) ? $scope.addadjustment.receiptdate : ''),
					"counter_number" : (($scope.addadjustment.counter) ? $scope.addadjustment.counter : ''),
					"to_rrnumber" : (($scope.addadjustment.torrnumber) ? $rootScope.user.location_code+$scope.addadjustment.torrnumber : ''),
					"from_rrnumber" : (($scope.addadjustment.fromrrnumber) ? $rootScope.user.location_code+$scope.addadjustment.fromrrnumber : ''),
					"payment_purpose_descr" :  (($scope.addadjustment.paymentpurpose) ? $scope.addadjustment.paymentpurpose : ''),
					"remarks" : (($scope.addadjustment.remarks) ? $scope.addadjustment.remarks : ''),
					"user" :  $rootScope.user.user_id,
					"from_rr_flag" : (($scope.addadjustment.fromrrnumber) ? 'Y' : 'N'),
					"to_rr_flag" : (($scope.addadjustment.torrnumber) ? 'Y' : 'N'),
			}
			console.log(request);
			
			
			remote.load("saveadjustmentrecord", function(response){
				
				if(response.status === "success"){
					$scope.addadjustment = {};
					$scope.verifiedpaymentpurpose = true;
					$scope.rr_status = false;
				}
				
			}, request , 'POST');
			
			
		};
		
	}
	
	//Disconnection Details Grid starts
	if(accounts_flow === 'disconnection'){
		
		
		var $omCode = $('#disconnection-om-code');
		var $mrCode = $('#disconnection-mr-code');
		var $fromAmount = $('#disconnection-from-amount');
		var $toAmount = $('#disconnection-to-amount');
		
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
		
		$scope.disconnectionFromDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		$scope.disconnectionToDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		$scope.fromAmount = '100';
		$scope.toAmount = '999999999';
		
		
		$scope.load_disconnection_details = function($event){
			
			if(!$scope.disconnectionFromDate){
				notify.warn('Please Select From Date..!');
				return;
			}
			if(!$scope.disconnectionToDate){
				notify.warn('Please Select To Date..!');
				return;
			}
			if(!$scope.fromAmount){
				notify.warn('Enter From Amount..!');
				return;
			}
			if(!$scope.toAmount){
				notify.warn('Enter To Amount..!');
				return;
			}
			var request = {
					"location_code" : $rootScope.user.location_code,					
					"from_date": (($scope.disconnectionFromDate) ? $scope.disconnectionFromDate : ''),
					"to_date": (($scope.disconnectionToDate) ? $scope.disconnectionToDate : ''),
					"from_amount" :  (($scope.fromAmount) ? $scope.fromAmount : '100'), 
					"to_amount" : (($scope.toAmount) ? $scope.toAmount : '999999999'),
					"om_unit_code" : $omCode.val().trim(),
					"mr_code" : $mrCode.val().trim(),
					"conn_type" : $rootScope.user.connection_type
			}
			console.log(request);
			$scope.disconnectionDetailsGridOptions.data = [];
			remote.load("getdisconnectiondetails", function(response){
				$scope.disconnectionDetailsGridOptions.data = response.disconnection_details;
			}, request , 'POST');
		};

		$scope.disconnectionDetailsGridOptions = {
				showGridFooter: true,
				gridFooterHeight: 20,
				columnDefs: [
		             {field: 'row_num', displayName: '#',width : '4%'},
		             {field: 'rr_no', displayName: 'RR Number',width : '8%'},
		             {field: 'tariff', displayName: 'Tariff',width : '8%'},
		             {field: 'customer_name', displayName: 'Customer Name',width : '10%'},
		             {field: 'addr1', displayName: 'Premises',width : '10%'},
		             {field: 'addr2', displayName: 'Address1',width : '10%'},
		             {field: 'addr3', displayName: 'Address2',width : '10%'},
		             {field: 'addr4', displayName: 'Address3',width : '10%'},
		             {field: 'mr_cd', displayName: 'MR Code',width : '7%'},
		             {field: 'rdg_day', displayName: 'Rdg Day',width : '7%'},
		             {field: 'spot_folio', displayName: 'Spot Folio',width : '7%'},
		             {field: 'arr', displayName: 'Balance',width : '8%'}
		             ],
		             data: []
		};
		
		$scope.disconnection_clear = function(e){
			$scope.disconnection_details = [];
			$fromAmount.val('100').focus();
			$toAmount.val('999999999');
			$scope.disconnectionFromDate=$filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.disconnectionToDate=$filter('date')(new Date(), 'dd/MM/yyyy');
			$omCode.val('');
			$mrCode.val('');
			$scope.disconnectionDetailsGridOptions.data = [];
			
		};
		
	}
	
	//Reconnection Details Grid starts
	if(accounts_flow === 'reconnection'){
		
		var $rr_no = $('#reconnection-details-rr-number');
		
		$scope.disconnectionDate=$filter('date')(new Date(), 'dd/MM/yyyy');
		
		$scope.load_reconnection_details = function($event){
			var request = {
					"location_code" : $rootScope.user.location_code,					
					"disconnection_date": (($scope.disconnectionDate) ? $scope.disconnectionDate : ''),
					"rr_number": (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : ''),
					"conn_type" : $rootScope.user.connection_type
			}
			console.log(request);
			remote.load("getreconnectiondetails", function(response){
				$scope.reconnection_details = response.reconnection_details;
				$scope.reconnectionDetailsGridOptions.data = $scope.reconnection_details;
			}, request , 'POST');
		};

		$scope.reconnectionDetailsGridOptions = {
				showGridFooter: true,
				gridFooterHeight: 20,
				columnDefs: [
		             {field: 'row_num', displayName: '#',width : '5%'},
		             {field: 'rr_no', displayName: 'RR Number',width : '10%'},
		             {field: 'disconn_dt', displayName: 'Disconnected On',width : '15%'},
		             {field: 'final_rdg', displayName: 'Final Reading',width : '10%'},
		             {field: 'dr_fees', displayName: 'D&R Fees',width : '8%'},
		             {field: 'recon_dt', displayName: 'Reconnected On',width : '10%'},
		             {field: 'remarks', displayName: 'Remarks',width : '20%'},
		             {field: 'userid', displayName: 'User ID',width : '10%'},
		             {field: 'tmpstp', displayName: 'Time Stamp',width : '13%'}
	             ],
	             data: []
		};
		
		$scope.reconnection_clear = function(e){
			$scope.reconnection_details = [];
			$rr_no.val('').focus();
			$scope.disconnectionDate=$filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.reconnectionDetailsGridOptions.data = [];
			
		};
		
	}
	
	//Debit Details Grid starts
	if(accounts_flow === 'debit_details'){

		var $rr_no = $('#debit-details-rr-number');
		
		remote.load("getchargecodedetails", function(response){
			$scope.ChargeCodeList = response.ChargeCodeList;
			$scope.debitDetailsGridOptions.columnDefs[3]['options'] = response.ChargeCodeList;
		}, { conn_type : $rootScope.user.connection_type } , 'POST');
		
		$scope.load_debit_details = function($event){
			if($rr_no.val().trim() === '') {
				$rr_no.val('%');
			}
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"rr_number": $rootScope.user.location_code + $rr_no.val().trim(),
				"debit_date": (($scope.debitDate) ? $scope.debitDate : ''),
				"conn_type" : $rootScope.user.connection_type
			}
			$scope.debitDetailsGridOptions.data = [];
			remote.load("getdebitdetails", function(response){
				$scope.debitDetailsGridOptions.data = response.debit_details;
			}, request , 'POST');
		};
		
		$scope.debitDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#',width : '5%', hide: true},
	             {field: 'rr_no', displayName: 'RR Number',width : '8%', required: true},
	             {field: 'debit_dt', displayName: 'Debit Date',width : '8%', type: 'date', hide: true},
	             {field: 'chrg_cd_description', field_key: 'chrg_cd', displayName: 'Charged On',width : '12%', required: true},
	             {field: 'debit_amt', displayName: 'Debit Amt',width : '8%', required: true, float: true},
	             {field: 'debit_remarks', displayName: 'Remarks',width : '10%', required: true},
	             {field: 'acct_sts', displayName: 'Debit Status',width : '8%', hide: true},
	             {field: 'bill_no', displayName: 'Bill No',width : '6%', hide: true},
	             {field: 'bill_dt', displayName: 'Bill Date',width : '7%', hide: true},
	             {field: 'ref_appr', displayName: 'Approved By',width : '9%', hide: true},
	             {field: 'userid', displayName: 'Entered By',width : '8%', hide: true},
	             {field: 'tmpstp', displayName: 'Time Stamp',width : '13%', hide: true}
            ],
            data: []
		};
		$scope.debit_details_clear = function(e){
			$rr_no.val('').focus();
			delete $scope.debitDate;
			$scope.debitDetailsGridOptions.data = [];
		};
		$scope.add_debit_details = function(e){
			var addDebitDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add New Debit";
			    	$scope.ok_text = "Create";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id
			    	};
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
		    			remote.load("insertdebit", function(response){
		    				$scope.data['sl_no'] = response.sl_no;
		    				$uibModalInstance.close();
		    			}, request ,'POST');
			    	}
			    	$scope.cancel = function(){
			    		$uibModalInstance.dismiss();
			    	}
			    	$rootScope.popupScope = $scope;
			    },
			    resolve: {
			        configs: function() {
			        	return $scope.debitDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addDebitDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-float']);
			});
		};
	}
	
	//Debits Approve Grid starts
	if(accounts_flow === 'debits_approve'){
		$scope.load_account_debits_approvals = function(){
			$scope.debitsApproveDetailsGridOptions.data = [];
			remote.load("getpendingdebits", function(response){
				$scope.debitsApproveDetailsGridOptions.data = response.pending_debits;
			},{"location_code": $rootScope.user.location_code,
				"conn_type" : $rootScope.user.connection_type}, 'POST');
		};
		$scope.debitsApproveDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: 'Sl. No',width : '5%'},
	             {field: 'rr_no', displayName: 'RR Number',width : '10%', type: 'number'},
	             {field: 'sl_no', displayName: 'Serial No',width : '8%'},
	             {field: 'debit_amt', displayName: 'Debit Amount',width : '12%'},
	             {field: 'debit_dt', displayName: 'Debit Date',width : '10%'},
	             {field: 'chrg_cd_description', displayName: 'Charged On',width : '17%'},
	             {field: 'debit_remarks', displayName: 'Remarks',width : '16%'},
	             {field: 'userid', displayName: 'Entered By',width : '10%'},
	             {field: 'tmpstp', displayName: 'Time Stamp',width : '13%'}
            ],
            data: [],
            onRegisterApi : function(gridApi){
            	$scope.gridApi = gridApi;
            }
		};
		$scope.load_account_debits_approvals();
		$scope.approve_debits = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select debits to Approve...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				approverid : $rootScope.user.user_id,
				data: selected_rows
			};
			remote.load("approvedebits", function(response){
				$scope.load_account_debits_approvals();
			}, request, 'POST');
		}
		$scope.reject_debits = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select debits to Reject...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				rejecterid : $rootScope.user.user_id,
				data: selected_rows
			};
			remote.load("rejectdebits", function(response){
				$scope.load_account_debits_approvals();
			}, request , 'POST');
		}
	}
	
	//Customer Credit Grid starts
	if(accounts_flow === 'credit_details'){
		
		var $rr_no = $('#credit-details-rr-number');
		
		$scope.load_credit_details = function($event){
			if($rr_no.val().trim() === '') {
				$rr_no.focus();
				return false;
			}
			$scope.creditDetailsGridOptions.data = [];
			remote.load("getcustomercredits", function(response){
				$scope.creditDetailsGridOptions.data = response.customer_credits;
			}, { "rr_number": $rootScope.user.location_code + $rr_no.val().trim(),
				"conn_type" : $rootScope.user.connection_type }, 'POST');
		};
		
		$scope.creditDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			expandableRowTemplate: '<div ui-grid="row.entity.creditBreakUpGridOptions" style="width:100%;height:120px;"></div>',
		    expandableRowHeight: 150,
			columnDefs: [
	             {field: 'row_num', displayName: '#',width : '4%', hide: true},
	             {field: 'rr_no', displayName: 'RR Number',width : '8%', required: true},
	             {field: 'credit_no', displayName: 'Credit No',width : '8%', hide: true},
	             {field: 'credit_dt', displayName: 'Credit Date',width : '8%', hide: true},
	             {field: 'credit_amt', displayName: 'Credit Amt',width : '7%', required: true, float: true},
	             {field: 'credited_amt', displayName: 'Credited Amt',width : '8%', hide: true},
	             {field: 'bill_dt', displayName: 'Bill Date',width : '8%', hide: true},
	             {field: 'bill_no', displayName: 'Bill No',width : '7%', hide: true},
	             {field: 'remarks', displayName: 'Remarks',width : '12%', required: true},
	             {field: 'credit_sts', displayName: 'Status',width : '6%', hide: true},
	             {field: 'userid', displayName: 'User ID',width : '8%', hide: true},
	             {field: 'tmpstp', displayName: 'Time Stamp',width : '13%', hide: true},
	             {field: 'jv_flag', displayName: 'JV Flag', visible: false, type: 'checkbox'}
	        ],
	        data: [],
	        onRegisterApi: function (gridApi) {
	        	gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
	                if (row.isExpanded) {
	                	//Credit break up grid loading
	                	row.entity.creditBreakUpGridOptions = {
	                		showGridFooter: true,
	                		gridFooterHeight: 20,
	    	                columnDefs: [
	    						{field: 'row_num', displayName: '#',width : '4%'},
	    						{field: 'cr_no', displayName: 'Credit No', width : '8%'},
	    						{field: 'cr_dt', displayName: 'Credit Date', width : '8%'},
	    						{field: 'cr_amt', displayName: 'Amount', width : '7%'},
	    						{field: 'detl_table', displayName: 'Credit From', width : '12%'},
	    						{field: 'cr_from_detl', displayName: 'Credit Details', width : '20%'},
	    						{field: 'remarks', displayName: 'Remarks', width : '20%'},
	    						{field: 'apprv_by', displayName: 'User ID', width : '8%'},
	    						{field: 'apprv_tmpstp', displayName: 'Time Stamp', width : '13%'}
	    		            ],
	    		            data: []
	    	            };
	                	var request = {
	        				"rr_number": $rootScope.user.location_code + row.entity.rr_no,
	        				"credit_number": row.entity.credit_no,
	        				"conn_type" : $rootScope.user.connection_type
	        			}
	                	remote.load("getcreditdetails", function(response){
	                		console.log(response);
	        				row.entity.creditBreakUpGridOptions.data = response.credit_details;
	        			}, request , 'POST');
	                }
	            });
	        }
		};
		
		$scope.credit_details_clear = function(e){
			$rr_no.val('').focus();
			$scope.creditDetailsGridOptions.data = [];
		};
		
		$scope.add_credit_details = function(e){
			var addCreditDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add New Credit";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id
			    	};
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no,
			    			jv_flag : ($scope.data.jv_flag) ? 'Y' : 'N'
			    		});
		    			remote.load("insertcredit", function(response){
		    				$uibModalInstance.close();
		    			}, request ,'POST');
			    	}
			    	$scope.cancel = function(){
			    		$uibModalInstance.dismiss();
			    	}
			    	$rootScope.popupScope = $scope;
			    },
			    resolve: {
			        configs: function() {
			        	return $scope.creditDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addCreditDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-float']);
			});
		};
	}
	
	//Credits Approve Grid starts
	if(accounts_flow === 'credits_approval'){
		
		$scope.creditsApprovalDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#',width : '5%'},
	             {field: 'rr_no', displayName: 'RR Number',width : '15%'},
	             {field: 'credit_amt', displayName: 'Credit Amount',width : '15%'},
	             {field: 'credit_dt', displayName: 'Credit Date',width : '15%'},
	             {field: 'remarks', displayName: 'Remarks',width : '15%'},
	             {field: 'inserted_user', displayName: 'Entered By',width : '10%'},
	             {field: 'inserted_tmpstp', displayName: 'Entered On',width : '15%'}
	        ],
	        data: [],
            onRegisterApi : function(gridApi){
            	$scope.gridApi = gridApi;
            }
		};
		$scope.load_account_credits_approvals = function(){
			$scope.creditsApprovalDetailsGridOptions.data = [];
			remote.load("getpendingcredits", function(response){
				$scope.creditsApprovalDetailsGridOptions.data = response.pending_credits;
			}, { "location_code": $rootScope.user.location_code,
				"conn_type" : $rootScope.user.connection_type } , 'POST');
		};
		$scope.load_account_credits_approvals();
		$scope.approve_credits = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select credits to Approve...');
				return;
			}
			var request = {
				location_code: $rootScope.user.location_code,
				conn_type: $rootScope.user.connection_type,
				approverid : $rootScope.user.user_id,
				data: selected_rows,
				bulk: null // this holds proper value in bulk credits approve
			};
			remote.load("approvecredits", function(response){
				$scope.load_account_credits_approvals();
			}, request , 'POST');
		};
		$scope.reject_credits = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select credits to Reject...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				location_code: $rootScope.user.location_code,
				rejecterid : $rootScope.user.user_id,
				data: selected_rows
			};
			remote.load("rejectcredits", function(response){
				$scope.load_account_credits_approvals();
			}, request , 'POST');
		};
	}
	
	//Credits Bulk Approve Grid starts
	if(accounts_flow === 'bulk_credits_approval'){
		
		$scope.bulk_credits_from_date=$filter('date')(new Date(), 'dd/MM/yyyy');
		$scope.bulk_credits_to_date=$filter('date')(new Date(), 'dd/MM/yyyy');
		$scope.bulk_credits_consumption_from='0';
		$scope.bulk_credits_consumption_to='18';
		
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
		//TODO : remove this after proper tariff service ==> Inefficient 
		var request = {
			"Conn_Type": $rootScope.user.connection_type,
			"Location_Code": $rootScope.user.location_code 
		}
		remote.load("getConsumerMasterPickListValues", function(response){
			$scope.tariff_list = response.CONSUMER_MASTER_PICKLIST.TariffCode;
		}, request , 'POST', false, false, true);
		
		$scope.load_bulk_credits_approvals = function(){
			$scope.bulkCreditsApprovalDetailsGridOptions.data = [];
			var $selected_tariffs = $('#accounts').find('.bulk-credits-approval').find('.tariff-selection').find('.selected');
			var request_tariffs = [];
			$selected_tariffs.each(function(key, tariff){
				request_tariffs.push("'"+$(tariff).attr('param')+"'");
			});
			if(!$scope.bulk_credits_consumption_from || !$scope.bulk_credits_consumption_to){
				notify.warn('Please enter consumption units...');
				return;
			}
			if(!$scope.bulk_credits_from_date || !$scope.bulk_credits_to_date){
				notify.warn('Please select date...');
				return;
			}
			var request = { 
				"conn_type" : $rootScope.user.connection_type,
				"location_code" : $rootScope.user.location_code,
				"from_date" : $scope.bulk_credits_from_date,
				"to_date" : $scope.bulk_credits_to_date,
				"from_consumption" : $scope.bulk_credits_consumption_from,
				"to_consumption" : $scope.bulk_credits_consumption_to,
				"om_code" : (($scope.om_code) ? $scope.om_code : ''),
				"mr_code" : (($scope.mr_code) ? $scope.mr_code : ''),
				"tarrifs" : request_tariffs.join()
			}
			console.log('bulk_credits',request);
			remote.load("getbulkcreditdetailsforapprove", function(response){
				$scope.bulkCreditsApprovalDetailsGridOptions.data = response.bulk_credit_details;
			}, request , 'POST');
		};
		
		$scope.bulkCreditsApprovalDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
				{field: 'row_num', displayName: '#', width : '4%'},
				{field: 'rr_no', displayName: 'RR Number', width : '9%'},
				{field: 'om_cd_description', displayName: 'O&M Unit', field_key : 'om_cd', width : '12%'},
				{field: 'mr_cd', displayName: 'MR Code', width : '10%'},
				{field: 'tariff', displayName: 'Tariff', width : '12%'},
				{field: 'bill_dt', displayName: 'Bill Date', width : '10%'},
				{field: 'bill_no', displayName: 'Bill Number', width : '10%'},
				{field: 'demand', displayName: 'Demand', width : '8%'},
				{field: 'int', displayName: 'Intrest', width : '8%'},
				{field: 'jv_adj_amt', displayName: 'JV Amount', width : '9%'}

	        ],
	        data: [],
            onRegisterApi : function(gridApi){
            	$scope.gridApi = gridApi;
            }
		};
		
		$scope.clear_bulk_credits = function(){
			$scope.bulkCreditsApprovalDetailsGridOptions.data = [];
			delete $scope.om_code;
			delete $scope.mr_code;
			$scope.bulk_credits_from_date=$filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.bulk_credits_to_date=$filter('date')(new Date(), 'dd/MM/yyyy');
			$scope.bulk_credits_consumption_from = '0';
			$scope.bulk_credits_consumption_to = '18';
			var $selected_tariffs = $('#accounts').find('.bulk-credits-approval').find('.tariff-selection').find('.selected');
			$selected_tariffs.find('span').removeClass().addClass('fa fa-circle-o');
			$selected_tariffs.removeClass('selected');
		};
		
		$scope.approve_bulk_credits = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!$scope.bulk_credits_jv_desc){
				notify.warn('Please mention JV Remarks...');
				return;
			}
			if(!selected_rows.length){
				notify.warn('Select credits to Approve...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				approverid : $rootScope.user.user_id,
				data: selected_rows,
				bulk: $scope.bulk_credits_jv_desc
			};
			console.log(request);
			remote.load("approvecredits", function(response){
				$scope.load_bulk_credits_approvals();
			}, request , 'POST');
		};
	}
	
	// Withdrawal Details Grid starts
	if(accounts_flow === 'withdrawal_details'){
		
		var $rr_no = $('#withdrawal-details-rr-number');
		
		$scope.load_withdrawal_details = function($event){
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"rr_number": (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : ''), 
				"withdrawl_date": (($scope.withdrawalDate) ? $scope.withdrawalDate : ''),
				"conn_type" : $rootScope.user.connection_type
			}
			console.log(request);
			$scope.withdrawalDetailsGridOptions.data = [];
			remote.load("getwithdrawldetails", function(response){
				$scope.withdrawalDetailsGridOptions.data = response.withdrawl_details;
			}, request , 'POST');
		};
		
		$scope.withdrawalDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#',width : '5%' },
	             {field: 'rr_no', displayName: 'RR Number',width : '10%'},
	             {field: 'sl_no', displayName: 'Serial Number',width : '10%'},
	             {field: 'billdt', displayName: 'Bill Date',width : '8%'},
	             {field: 'bill_no', displayName: 'Bill No',width : '8%'},
	             {field: 'chrg_cd_description', displayName: 'Charge Type',width : '15%'},
	             {field: 'amt_wdrn', displayName: ' Wdrl Amount',width : '10%'},
	             {field: 'wdrl_no', displayName: 'Wdrl No',width : '6%'},
	             {field: 'wdrl_dt', displayName: 'Wdrl Date',width : '8%'},
	             {field: 'remarks', displayName: 'Remarks',width : '15%'},
	             {field: 'inserted_user', displayName: 'Entered By',width : '8%'},
	             {field: 'inserted_tmpstp', displayName: 'Entered On',width : '12%'},
	             {field: 'apprv_sts', displayName: 'Status',width : '6%'},
	             {field: 'approved_user', displayName: 'Approved By',width : '8%'},
	             {field: 'approved_tmpstp', displayName: 'Approved On',width : '12%'}
	        ],
	        data: []
		};
		$scope.withdrawal_details_clear = function(e){
			$rr_no.val('').focus();
			delete $scope.withdrawalDate;
			$scope.withdrawalDetailsGridOptions.data = [];
		};
		
		$scope.new_withdrawal_entry_details = function(e){
			$scope.withdrawal_disable_rr_no = false;
			var newWithdrawalEntryDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
				size : 'lg',
			    templateUrl: templates.modal.new_withdrawal_entry_modal,
			    controller: function($scope, $uibModalInstance, remote){
			    	$scope.data = {
			    		userid : $rootScope.user.user_id
			    	};
			    	$scope.newWithdrawalEntryGridOptions = {
		    			showGridFooter: true,
		    			gridFooterHeight: 20,
		    			columnDefs: [
		    	             {field: 'row_num', displayName: '#',width : '6%' },
		    	             {field: 'chrg_cd_descr', displayName: 'Charge Code',width : '25%'},
		    	             {field: 'billed_amt', displayName: 'Billed',width : '10%'},
		    	             {field: 'rbt_amt', displayName: 'Rebate',width : '10%'},
		    	             {field: 'paid_amt', displayName: 'Paid',width : '10%'},
		    	             {field: 'withdrawn_amt', displayName: 'Withdrawn',width : '12%'},
		    	             {field: 'pending_wdrl_amt', displayName: 'Pending',width : '10%'},
		    	             {field: 'withdrawl_amt', displayName: 'Withdrawal', width : '12%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
		    	             {field: 'adj_no', displayName: 'Adj No', width : '10%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
		    	             {field: 'remarks', displayName: 'Remarks', width : '20%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'}
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
			    	
			    	$scope.ok = function(){
			    		//TODO: validate form
			    		console.log($scope.newWithdrawalEntryGridOptions.data);
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			conn_type : $rootScope.user.connection_type,
			    			userid : $rootScope.user.user_id
			    		});
			    		console.log(request);
		    			remote.load("insertwithdrawldetails", function(response){
		    				$uibModalInstance.close();
		    			}, request ,'POST');
			    	}
			    	$scope.cancel = function(){
			    		$uibModalInstance.dismiss();
			    	}
			    	$scope.clear = function(){
			    		$scope.withdrawal_disable_rr_no = false;
			    		$scope.data = {};
			    		$scope.newWithdrawalEntryGridOptions.data = [];
			    		$('#withdrawal-new-entry-rr-number').focus();
			    	}
			    	$scope.load_withdrawal_new_entry = function(){
			    		var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
			    		$scope.clear();
		    			remote.load("getwithdrawldetailsfornewentry", function(response){
		    				$scope.withdrawal_disable_rr_no = true;
		    				$scope.newWithdrawalEntryGridOptions.data = response.new_withdrawl_details;
		    				$.extend($scope.data, response);
		    				$scope.data.rr_no = response.new_withdrawl_details[0].rr_no;
		    				console.log($scope.data);
		    			}, request ,'POST');
			    	}
			    },
			    resolve: {
			        configs: function() {
			        	return [];
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
		};
		
		
	}
	
	//Withdrawal Approve Grid starts
	if(accounts_flow === 'withdrawal_approval'){
		
		$scope.withdrawalApprovalDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: 'Sl. No', width : '5%'},
	             {field: 'rr_no', displayName: 'RR Number', width : '8%'},
	             {field: 'wdrl_bill_dt', displayName: 'Bill Date', width : '8%'},
	             {field: 'wdrl_bill_no', displayName: 'Bill No', width : '8%'},
	             {field: 'chrg_cd_description', displayName: 'Charge Code', width : '10%'},
	             {field: 'billed_amt', displayName: 'Billed Amt', width : '8%'},
	             {field: 'paid_amt', displayName: 'Paid Amt', width : '8%'},
	             {field: 'pending_wdrl_amt', displayName: 'Pending Wdrl Amt', width : '12%'},
	             {field: 'wdrl_dt', displayName: 'Wdrl Date', width : '8%'},
	             {field: 'wdrl_no', displayName: 'Wdrl No', width : '8%'},
	             {field: 'remarks', displayName: 'Remarks', width : '15%'},
	             {field: 'userid', displayName: 'Entered By', width : '8%'},
	             {field: 'tmpstp', displayName: 'Entered On', width : '13%'}
             ],
             data: [],
             onRegisterApi : function(gridApi){
             	$scope.gridApi = gridApi;
             }
		};
		
		$scope.load_withdrawal_approvals_pending = function(){
			$scope.withdrawalApprovalDetailsGridOptions.data = [];
			remote.load("getpendingwithdrawls", function(response){
				$scope.withdrawalApprovalDetailsGridOptions.data = response.pending_withdrawl;
			}, { "location_code": $rootScope.user.location_code ,
				"conn_type" : $rootScope.user.connection_type} , 'POST');
		}
		
		$scope.load_withdrawal_approvals_pending();
		
		$scope.approve_withdrawals = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select withdrawals to Approve...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				approverid : $rootScope.user.user_id,
				option : 'APPROVE',
				data: selected_rows
			};
			remote.load("approverejectwithdrawals", function(response){
				$scope.load_withdrawal_approvals_pending();
			}, request , 'POST');
		};
		$scope.reject_withdrawals = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select withdrawals to Reject...');
				return;
			}
			var request = {
					conn_type: $rootScope.user.connection_type,
					approverid : $rootScope.user.user_id,
					option : 'REJECT',
					data: selected_rows
			};
			remote.load("approverejectwithdrawals", function(response){
				$scope.load_withdrawal_approvals_pending();
			}, request , 'POST');
		};
		
	}
		
	//Reading Entry starts
	if(accounts_flow === 'reading_entry'){
		
		remote.load("getmrcodelist", function(response){
			$scope.mrCodes = response.MeterReaderCode;
		}, {
			location_code: $rootScope.user.location_code,
			conn_type: $rootScope.user.connection_type
		} , 'POST');
		
		$scope.load_reading_days = function(){
			$scope.readingDays = [];
			if(!$scope.mrCode) return;
			remote.load("getmrdaylist", function(response){
				$scope.readingDays = response.MeterReadingDay;
			}, {
				location_code: $rootScope.user.location_code,
				conn_type: $rootScope.user.connection_type,
				mr_code: $scope.mrCode
			} , 'POST');
		};
		
		$scope.load_reading_date = function(){
			$scope.readingDate = '';
			if(!$scope.readingDay) return;
			$scope.readingDate = (($scope.readingDay.length === 1) ? '0'+$scope.readingDay : $scope.readingDay) + $filter('date')(new Date(), '/MM/yyyy');
		};
		
		$scope.load_reading_entry = function(){
			if($scope.rrNo){
				$scope.mrCode = '';
				$scope.readingDay = '';
				$scope.readingDate = '';
			}else if(!$scope.mrCode){
				$('#mr-code').click();
				return;
			}else if(!$scope.readingDay){
				$('#mr-day').click();
				return;
			}else if(!$scope.readingDate){
				$('#mr-date').focus();
				return;
			}
			var request = {
				location_code: $rootScope.user.location_code,
				conn_type: $rootScope.user.connection_type,
				rr_no: ($scope.rrNo) ? $rootScope.user.location_code + $scope.rrNo : '',
				mr_code: $scope.mrCode,
				mr_day: $scope.readingDay,
				rdg_date: $scope.readingDate,
				entry_type: ''
			}
			$scope.readingEntryGridOptions.data = [];
			remote.load("getreadingentrydata", function(response){
				$scope.readingEntryGridOptions.data = response.ReadingList;
			}, request , 'POST');
		};
		
		$scope.readingEntryGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	            {field: 'row_num', displayName: '#', width : '5%'},
	            {field: 'rr_no', displayName: 'RR Number', width : '10%'},
	            {field: 'prev_rdg_dt', displayName: 'Prev Rdg Date', width : '12%'},
	            {field: 'prev_bkwh', displayName: 'Prev BKWH', width : '10%'},
	            {field: 'pres_bkwh', displayName: 'Prsnt BKWH', width : '10%'},
	            {field: 'prev_ckwh', displayName: 'Prev CKWH', width : '10%'},
	            {field: 'pres_ckwh', displayName: 'Prsnt CKWH', width : '10%'},
	            {field: 'prev_bmd', displayName: 'Prev BMD', width : '10%'},
	            {field: 'pres_bmd', displayName: 'Prsnt BMD', width : '10%'},
	            {field: 'prev_bpf', displayName: 'Prev BPF', width : '10%'},
	            {field: 'pres_bpf', displayName: 'Prsnt BPF', width : '10%'},
	            {field: 'pres_rdg_sts', displayName: 'Status', width : '10%'},
	            {field: 'pres_mc_flg', displayName: 'M/C Flag', width : '8%'},
	            {field: 'pres_observ', displayName: 'Observation', width : '8%'},
	            {field: 'pres_ir_fr', displayName: 'IR/FR', width : '12%'},
	            {field: 'spot_folio', displayName: 'Folio No', width : '10%'},
	            {field: 'userid', displayName: 'Last Modified By', width : '8%'},
	            {field: 'tmpstp', displayName: 'Last Modified On', width : '13%'}
	        ],
	        data: [],
	        onRegisterApi: function( gridApi ) { 
	            $scope.readingEntryGridApi = gridApi;
	            $scope.intimationsGridApi = gridApi;
	            var editCellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_reading_entry($event,row)" title="Edit"></button></div>';
	            $scope.intimationsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: editCellTemplate } );
	            var deleteCellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-trash" ng-click="grid.appScope.delete_reading_entry($event,row.entity)" title="Delete"></button></div>';
	            $scope.readingEntryGridApi.core.addRowHeaderColumn({ name: 'Delete', displayName: '', width: '3%', cellTemplate: deleteCellTemplate } );
	        }
		};
		
		$scope.delete_reading_entry = function(e,row){
			//TODO Remove 
			window.alert('Delete reading entry functionality build in progress...');
			console.log(row)
		};
		
		$scope.add_reading_entry = function(){
			var addNewReadingEntryModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
			    templateUrl: templates.modal.meter_reading_entry,
			    controller: function($scope, $uibModalInstance, info, remote){
			    	var data_backup = {};
			    	$scope.isNewEntry = true;
			    	$scope.data = {};
			    	$scope.dataToSave = [];
			    	$scope.clear_reading_entry = function(){
			    		$scope.data = {};
			    		$scope.disable_meter_reading_rrno_input = false;
			    	}
			    	//summary calculations for TOD
			    	$scope.$watch('data',function(){
			    		if($scope.data.slot1_tod_pres_ckwh){
			    			$scope.data.slot1_tod_pres_bkwh = parseFloat($scope.data.slot1_tod_pres_ckwh) - (($scope.data.slot1_tod_prev_ckwh) ? parseFloat($scope.data.slot1_tod_prev_ckwh) : 0);
			    		}
			    		if($scope.data.slot2_tod_pres_ckwh){
			    			$scope.data.slot2_tod_pres_bkwh = parseFloat($scope.data.slot2_tod_pres_ckwh) - (($scope.data.slot2_tod_prev_ckwh) ? parseFloat($scope.data.slot2_tod_prev_ckwh) : 0);
			    		}
			    		if($scope.data.slot3_tod_pres_ckwh){
			    			$scope.data.slot3_tod_pres_bkwh = parseFloat($scope.data.slot3_tod_pres_ckwh) - (($scope.data.slot3_tod_prev_ckwh) ? parseFloat($scope.data.slot3_tod_prev_ckwh) : 0);
			    		}
			    		if($scope.data.slot1_tod_pres_bkwh && $scope.data.slot2_tod_pres_bkwh && $scope.data.slot3_tod_pres_bkwh){
			    			$scope.data.pres_bkwh = parseFloat($scope.data.slot1_tod_pres_bkwh) + parseFloat($scope.data.slot2_tod_pres_bkwh) + parseFloat($scope.data.slot3_tod_pres_bkwh);
			    		}
			    		if($scope.data.slot1_tod_pres_ckwh && $scope.data.slot2_tod_pres_ckwh && $scope.data.slot3_tod_pres_ckwh){
			    			$scope.data.pres_ckwh = parseFloat($scope.data.slot1_tod_pres_ckwh) + parseFloat($scope.data.slot2_tod_pres_ckwh) + parseFloat($scope.data.slot3_tod_pres_ckwh);
			    		}
			    		if($scope.data.slot1_tod_pres_bmd && $scope.data.slot2_tod_pres_bmd && $scope.data.slot3_tod_pres_bmd){
			    			$scope.data.pres_bmd = Math.max.apply(Math,[ parseFloat($scope.data.slot1_tod_pres_bmd), parseFloat($scope.data.slot2_tod_pres_bmd), parseFloat($scope.data.slot3_tod_pres_bmd)]);
			    		}
			    		if($scope.data.slot1_tod_pres_bpf && $scope.data.slot2_tod_pres_bpf && $scope.data.slot3_tod_pres_bpf){
			    			$scope.data.pres_bpf = Math.min.apply(Math,[ parseFloat($scope.data.slot1_tod_pres_bpf), parseFloat($scope.data.slot2_tod_pres_bpf), parseFloat($scope.data.slot3_tod_pres_bpf)]);
			    		}
			    	},true);
			    	$scope.getRRNoDetails = function(){
			    		var request = {
		    				location_code: $rootScope.user.location_code,
		    				conn_type: $rootScope.user.connection_type,
		    				rr_no: angular.copy($rootScope.user.location_code + $scope.data.rr_no),
		    				mr_code: '',
		    				mr_day: '',
		    				rdg_date: '',
		    				entry_type: 'new'
		    			}
			    		$scope.data = {};
		    			remote.load("getreadingentrydata", function(response){
		    				$scope.data = response.ReadingList[0];
		    				if(!$scope.data.pres_rdg_dt){
		    					$scope.data.pres_rdg_dt = (($scope.data.rdg_day.length === 1) ? '0'+$scope.data.rdg_day : $scope.data.rdg_day) + $filter('date')(new Date(), '/MM/yyyy');
		    				}
		    				$scope.disable_meter_reading_rrno_input = true;
		    				data_backup = angular.copy($scope.data);
		    			}, request , 'POST');
			    	}
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.meterReadingEntryForm.$error)){
							return;
						}
			    		if(!data_backup.rr_no){
			    			notify.error('Load the RR No details first to proceed...');
			    			return;
			    		}
			    		if($scope.meterReadingEntryForm.$dirty && $scope.meterReadingEntryForm.$valid){
			    			if(data_backup.pres_bkwh === "" && data_backup.pres_rdg_sts === ""){
			    				$scope.data.save_type = 'insert';
			    			}else{
			    				$scope.data.save_type = 'update';
			    			}
			    		}
		    			var request =  {
			    			conn_type : $rootScope.user.connection_type,
			    			location_code : $rootScope.user.location_code,
			    			userid : $rootScope.user.user_id,
			    			ReadingList : [$scope.data]
			    		};
		    			remote.load("upsertreadingentrydata", function(response){
		    				$uibModalInstance.close($scope.data.rr_no);
		    			}, request ,'POST');
			    	}
			    	$scope.cancel = function(){
			    		if($scope.meterReadingEntryForm.$dirty){
			    			var cancel = confirm("You have unsaved data. Do you really want to continue... ?");
							if(!cancel){
								return;
							}
			    		}
			    		$uibModalInstance.dismiss();
			    	}
			    },
			    resolve: {
			        info: function() {
			        	return {};
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addNewReadingEntryModalInstance.result.then(function (rr_no) {
				$scope.rrNo = rr_no;
				$scope.load_reading_entry();
			});
		};
		
		$scope.edit_reading_entry = function(e,row){
			var editReadingEntryModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
			    templateUrl: templates.modal.meter_reading_entry,
			    controller: function($scope, $uibModalInstance, info, remote, data_set, reading_date){
			    	var data_set_backup = angular.copy(data_set);
			    	var data_set_length = data_set.length;
			    	$scope.isNewEntry = false;
			    	$scope.data = info.entity;
			    	$scope.dataToSave = [];
			    	$scope.$watch('data.pres_rdg_dt',function(new_val){
				    	if(!new_val){
				    		$scope.data.pres_rdg_dt = reading_date;
				    	}
			    	});
			    	
			    	//summary calculations for TOD
			    	if($scope.data.tod_meter_flag === 'Y'){
				    	$scope.$watch('data',function(){
				    		if($scope.data.slot1_tod_pres_ckwh){
				    			$scope.data.slot1_tod_pres_bkwh = parseFloat($scope.data.slot1_tod_pres_ckwh) - (($scope.data.slot1_tod_prev_ckwh) ? parseFloat($scope.data.slot1_tod_prev_ckwh) : 0);
				    		}
				    		if($scope.data.slot2_tod_pres_ckwh){
				    			$scope.data.slot2_tod_pres_bkwh = parseFloat($scope.data.slot2_tod_pres_ckwh) - (($scope.data.slot2_tod_prev_ckwh) ? parseFloat($scope.data.slot2_tod_prev_ckwh) : 0);
				    		}
				    		if($scope.data.slot3_tod_pres_ckwh){
				    			$scope.data.slot3_tod_pres_bkwh = parseFloat($scope.data.slot3_tod_pres_ckwh) - (($scope.data.slot3_tod_prev_ckwh) ? parseFloat($scope.data.slot3_tod_prev_ckwh) : 0);
				    		}
				    		if($scope.data.slot1_tod_pres_bkwh && $scope.data.slot2_tod_pres_bkwh && $scope.data.slot3_tod_pres_bkwh){
				    			$scope.data.pres_bkwh = parseFloat($scope.data.slot1_tod_pres_bkwh) + parseFloat($scope.data.slot2_tod_pres_bkwh) + parseFloat($scope.data.slot3_tod_pres_bkwh);
				    		}
				    		if($scope.data.slot1_tod_pres_ckwh && $scope.data.slot2_tod_pres_ckwh && $scope.data.slot3_tod_pres_ckwh){
				    			$scope.data.pres_ckwh = parseFloat($scope.data.slot1_tod_pres_ckwh) + parseFloat($scope.data.slot2_tod_pres_ckwh) + parseFloat($scope.data.slot3_tod_pres_ckwh);
				    		}
				    		if($scope.data.slot1_tod_pres_bmd && $scope.data.slot2_tod_pres_bmd && $scope.data.slot3_tod_pres_bmd){
				    			$scope.data.pres_bmd = Math.max.apply(Math,[ parseFloat($scope.data.slot1_tod_pres_bmd), parseFloat($scope.data.slot2_tod_pres_bmd), parseFloat($scope.data.slot3_tod_pres_bmd)]);
				    		}
				    		if($scope.data.slot1_tod_pres_bpf && $scope.data.slot2_tod_pres_bpf && $scope.data.slot3_tod_pres_bpf){
				    			$scope.data.pres_bpf = Math.min.apply(Math,[ parseFloat($scope.data.slot1_tod_pres_bpf), parseFloat($scope.data.slot2_tod_pres_bpf), parseFloat($scope.data.slot3_tod_pres_bpf)]);
				    		}
				    	},true);
			    	}
			    	
			    	$scope.delete_reading_entry = function(){
			    		var current = parseInt($scope.data.row_num);
			    		$scope.reload_reading_entry();
			    		if($scope.data.save_type === 'delete'){
			    			$scope.data.save_type = null;
			    		}else if(data_set_backup[current-1].pres_bkwh !== "" && data_set_backup[current-1].pres_rdg_sts !== ""){
			    			if(!$scope.data.hasOwnProperty('save_type')){
			    				$scope.dataToSave.push($scope.data);
			    			}
			    			$scope.data.save_type = 'delete';
			    		}		
			    		$scope.meterReadingEntryForm.$setPristine();
			    	};
			    	$scope.prepareUpdate = function(step){
			    		var current = parseInt($scope.data.row_num);
			    		if($scope.meterReadingEntryForm.$dirty && $scope.meterReadingEntryForm.$valid && !$scope.data.hasOwnProperty('save_type')){
			    			if(data_set_backup[current-1].pres_bkwh === "" && data_set_backup[current-1].pres_rdg_sts === ""){
			    				$scope.data.save_type = 'insert';
			    			}else{
			    				$scope.data.save_type = 'update';
			    			}
			    			$scope.dataToSave.push($scope.data);
			    		}
			    		$scope.meterReadingEntryForm.$setPristine();
			    		if(step === 'next'){
			    			$scope.data = data_set[(current+data_set_length) % data_set_length];
			    		}else if(step === 'previous'){
			    			$scope.data = data_set[(current-2+data_set_length) % data_set_length];
			    		}
			    	}
			    	$scope.next = function(){
			    		if($scope.meterReadingEntryForm.$dirty){
			    			$scope.$broadcast('required-check-validity');
			    			notify.warn('Click reset button not to update anything...');
			    		}
						if(!$.isEmptyObject($scope.meterReadingEntryForm.$error)){
							return;
						}
			    		$scope.prepareUpdate('next');
			    	}
			    	$scope.previous = function(){
			    		if($scope.meterReadingEntryForm.$dirty){
			    			$scope.$broadcast('required-check-validity');
			    			notify.warn('Click reset button not to update anything...');
			    		}
						if(!$.isEmptyObject($scope.meterReadingEntryForm.$error)){
							return;
						}
			    		$scope.prepareUpdate('previous');
			    	}
			    	$scope.reload_reading_entry = function(){
			    		var current = parseInt($scope.data.row_num);
			    		angular.extend( $scope.data, data_set_backup[current-1]);
			    		$scope.meterReadingEntryForm.$setPristine();
			    	}
			    	$scope.ok = function(){
			    		if($scope.meterReadingEntryForm.$dirty){
			    			$scope.$broadcast('required-check-validity');
			    			notify.warn('Click reset button not to update anything...');
			    		}
						if(!$.isEmptyObject($scope.meterReadingEntryForm.$error)){
							return;
						}
			    		$scope.prepareUpdate();
			    		var request =  {
			    			conn_type : $rootScope.user.connection_type,
			    			location_code : $rootScope.user.location_code,
			    			userid : $rootScope.user.user_id,
			    			ReadingList : $scope.dataToSave
			    		};
		    			remote.load("upsertreadingentrydata", function(response){
		    				$uibModalInstance.close($scope.data.rr_no);
		    			}, request ,'POST');
			    	}
			    	$scope.cancel = function(){
			    		if($scope.meterReadingEntryForm.$dirty || $scope.dataToSave.length){
			    			var cancel = confirm("You have unsaved data. Do you really want to continue... ?");
							if(!cancel){
								return;
							}
			    		}
			    		$uibModalInstance.dismiss(data_set_backup);
			    	}
			    },
			    resolve: {
			        info: function() {
			        	return row;
			        },
			        remote: function(){
			        	return remote;
			        },
			        data_set: function() {
			        	return $scope.readingEntryGridOptions.data;
			        },
			        reading_date: function(){
			        	return $scope.readingDate;
			        }
			    }
			});
			editReadingEntryModalInstance.result.then(function () {},function(data_set_backup){
				$scope.readingEntryGridOptions.data = data_set_backup;
			});
			
		};
		
		$scope.clear_reading_entry = function(){
			$scope.readingEntryGridOptions.data = [];
			$scope.rrNo = '';
			$scope.mrCode = '';
			$scope.readingDay = '';
			$scope.readingDate = '';
		};
	}
	
	if(accounts_flow === 'meter_rating_detail'){

		var $rr_no = $('#meter-rating-detail-rr-number');
		
		remote.load("getdesignationdetails", function(response){
			$scope.designation_details = response.designation_details;
			$scope.meterRatingDetailGridOptions.columnDefs[8]['options'] = response.designation_details;
		}, { conn_type : $rootScope.user.connection_type, designation_type : 'T'} , 'POST');
		
		$scope.load_meter_rating_detail = function($event){
			if($rr_no.val().trim() === '') {
				$rr_no.val('%');
			}
			var request = {
				"conn_type" : $rootScope.user.connection_type,
				"location_code" : $rootScope.user.location_code,					
				"rr_number": (($rr_no.val().trim()) ? $rootScope.user.location_code + $rr_no.val().trim() : ''),
				"rated_date": (($scope.ratingDate) ? $scope.ratingDate : '')
			}
			$scope.meterRatingDetailGridOptions.data = [];
			remote.load("getratingdetails", function(response){
				$scope.meterRatingDetailGridOptions.data = response.rating_details;
			}, request , 'POST');
		};
		
		$scope.meterRatingDetailGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
				{field: 'row_num', displayName: '#', width : '4%', hide : true},
				{field: 'rr_no', displayName: 'RR Number', width : '8%', required: true},
				{field: 'rated_dt', displayName: 'Rating Date', width : '8%', type : 'date', required: true},
				{field: 'rdt_rdg', displayName: 'Final Reading', width : '10%', required: true, float: true},
				{field: 'rated_ld', displayName: 'Rated Load', width : '8%', float: true},
				{field: 'rated_pf', displayName: 'Rated PF', width : '8%', float: true},
				{field: 'rated_err_prcnt', displayName: 'Rated Error(%)', width : '10%', float: true},
				{field: 'nature_use', displayName: 'Nature Of Use', width : '10%', required: true, alphanumeric: true},
				{field: 'rated_by_description', displayName: 'Rated By', field_key : 'rated_by', width : '25%', required: true},
				{field: 'ref_no', displayName: 'Reference Number', width : '12%', required: true},
				{field: 'ref_dt', displayName: 'Reference Date', width : '10%', type : 'date', required: true},
				{field: 'ter_dt', displayName: 'Termination Date', width : '11%', type : 'date'},
				{field: 'remarks', displayName: 'Remarks', width : '20%'},
				{field: 'userid', displayName: 'User ID', width : '10%', hide : true},
				{field: 'tmpstp', displayName: 'Time Stamp', width : '12%', hide : true},

            ],
            data: [],
            onRegisterApi: function( gridApi ) { 
	             $scope.RatingDetailsGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_meter_rating_details($event,row)" title="Edit"></button></div>';
	             $scope.RatingDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		$scope.meter_rating_details_clear = function(e){
			$rr_no.val('').focus();
			$scope.ratingDate='';
			$scope.meterRatingDetailGridOptions.data = [];
		};
		$scope.add_meter_rating_details = function(e){
			var addRatingDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	console.log(configs);
			    	$scope.header = "Add Meter Rating Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		rated_by : '500',
			    		rated_dt : $filter('date')(new Date(), 'dd/MM/yyyy'),
			    		ref_dt : $filter('date')(new Date(), 'dd/MM/yyyy')
			    	};
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
						
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
			    	$rootScope.popupScope = $scope;
			    },
			    resolve: {
			        configs: function() {
			        	return $scope.meterRatingDetailGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addRatingDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-float']);
			});
		};
		
		// edit/update function
		$scope.edit_meter_rating_details = function(e,row){
			var editRatingDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Meter Rating Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,2,3,4,5,6,7,8,9,10];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
						
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
			    		remote.load("upsertratingdetails", function(response){
		    				$uibModalInstance.close();
		    			}, request ,'POST');
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
			        }
			    }
			});
			editRatingDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-float']);
			});
		}
	}
	
	if(accounts_flow === 'spot_folio_regeneration'){
		
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
				"om_code": $scope.om_code || $rootScope.user.location_code,
				"mr_code": $scope.mr_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getMeterReadingDayByMrCode", function(response){
				$scope.MeterReadingDay = response.MeterReadingDay;
			}, request , 'POST');
		}
		
		$scope.spotFolioDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#', width : '5%'},
	             {field: 'rr_no', displayName: 'RR Number'},
	             {field: 'folio_no', displayName: 'Folio Number'},
	             {field: 'new_folio_no', displayName: 'New Folio Number', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input new-folio-no" rr_no="{{row.entity.rr_no}}" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'}
             ],
             data: []
		};
		
		$scope.hitTab = function(e){
			if(e.which === 13){
				var $el = $(e.target);
				$el.closest('.ui-grid-row').next('.ui-grid-row').find('.new-folio-no').focus();
			}
		}
		
		$scope.load_spot_folio_details = function(){
			
			if(!$scope.mr_code){
				notify.warn('Please Select MR Code');
				return;
			}
			if(!$scope.rdg_day){
				notify.warn('Please Select Reading Day');
				return;
			}
			
			var request = {
				"mr_cd": $scope.mr_code,
				"rdg_day": $scope.rdg_day,
				"location_code": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getspotfoliodetails", function(response){
				$scope.spotFolioDetailsGridOptions.data = response.spot_folio_details;
			}, request , 'POST');
		}
		
		$scope.save_spot_folio_details = function(){
			var $rows_edited = $('#accounts').find('#spotFolioDetailsGrid').find('.new-folio-no.ng-dirty');
			if(!$rows_edited.length){
				notify.warn('No changes to save');
				return;
			}
			var rows_to_update = [];
			$rows_edited.each(function( key, el){
				var $el = $(el);
				if($el.val()){
					rows_to_update.push({
						rr_no : $rootScope.user.location_code+$el.attr('rr_no'),
						new_folio_no : $el.val()
					});
				}
			});
			var request = {
    			userid : $rootScope.user.user_id,
    			conn_type : $rootScope.user.connection_type,
    			data : rows_to_update
    		};
    		console.log(request);
    		remote.load("upsertspotfoliodetails", function(response){
    			//$rows_edited.removeClass('ng-dirty');
    			$scope.newSpotFolioForm.$setPristine();
    			$scope.load_spot_folio_details();
			}, request ,'POST');
		}
		
		$scope.regenerate_spot_folio_details = function(){
			
		}
		
	}
	
	if(accounts_flow === 'meter_details'){
			
			
			$rr_no = $('#meter-detail-rr-number');
			$mtr_sl_no = $('#meter-detail-serial-number');
			$mtr_make = $('#meter-detail-meter-make');
			$mtr_type = $('#meter-detail-meter-type');
			
	    	$scope.loadmetermakelist = function(){
	    		//load meter make details
		    	var request = {
					conn_type : $rootScope.user.connection_type,
					code_type : 'MTR_MAKE'
				}
				remote.load("getcodedetailsfordropdowns", function(response){
					$scope.MeterMakeList = response.CodeDetailsDropDownList;
				}, request , 'POST');
	    	};
	    	
			$scope.loadmetertypelist = function(){
				//load meter type
		    	var request = {
					conn_type : $rootScope.user.connection_type,
					code_type : 'MTR_TYP'
				}
				remote.load("getcodedetailsfordropdowns", function(response){
					$scope.MeterTypeList = response.CodeDetailsDropDownList;
				}, request , 'POST');
	    	};
	    	
    		$scope.loadmeterstatuslist = function(){
    			var request = {
    					conn_type : $rootScope.user.connection_type,
    					code_type : 'AS_MTR_STS'
    				}
    				remote.load("getcodedetailsfordropdowns", function(response){
    					$scope.MeterStatusList = response.CodeDetailsDropDownList;
    				}, request , 'POST');
	    	};
	    	
	    	$timeout(function(){ $scope.loadmetermakelist();	});
	    	$timeout(function(){ $scope.loadmetertypelist();	});
	    	$timeout(function(){ $scope.loadmeterstatuslist();	});
	    	
			$scope.load_meter_detail = function(e){
				
				if(!($rr_no.val().length > 0) && !($mtr_sl_no.val().length > 0) && !($mtr_make.val().length > 0) && !($mtr_type.val().length > 0)){
					notify.warn("Please enter/select any one filter");
					return;
				}
				
				var request = {
					"conn_type": $rootScope.user.connection_type,	
					"location_code" : $rootScope.user.location_code,					
					"rr_no": (($rr_no.val()) ? $rootScope.user.location_code + $rr_no.val() : ''),
					"mtr_sl_no" : (($mtr_sl_no.val()) ? $mtr_sl_no.val() : ''),
					"mtr_make" : (($mtr_make.val()) ? $mtr_make.val() : ''),
					"mtr_type" : (($mtr_type.val()) ? $mtr_type.val() : '')
				}
				remote.load("getmeterdetails", function(response){
					$scope.meterDetailGridOptions.data = response.meter_details;
				}, request , 'POST');
			};
			
			$scope.meterDetailGridOptions = {
				showGridFooter: true,
				columnDefs: [
				    {field: 'row_num', displayName: '#', width : '4%', hide : true},
					{field: 'rr_no', displayName: 'RR Number', width : '9%'},
					{field: 'mtr_sl_no', displayName: 'Mtr Sl.No', width : '10%'},
					{field: 'mtr_make_descr', displayName: 'Make', field_key : 'mtr_make', width : '10%'},
					{field: 'mtr_type_descr', displayName: 'Mtr Type', field_key : 'mtr_type', width : '8%'},
					{field: 'no_of_ph_descr', displayName: 'Phase', field_key : 'no_of_ph', width : '9%'},
					{field: 'mtr_amp', displayName: 'Amps', width : '6%'},
					{field: 'mtr_volt_descr', displayName: 'Volts', field_key : 'mtr_volt', width : '5%'},
					{field: 'mtr_sts_descr', displayName: 'Mtr Status', field_key : 'mtr_sts', width : '9%'},
					{field: 'mtr_rated_dt', displayName: 'Rated Date', type : 'date', width : '8%'},
					{field: 'mtr_assign_sts_descr', displayName: 'Assign Status', field_key : 'mtr_assign_sts', width : '9%'},
					{field: 'mra_assigned_dt', displayName: 'Assigned Date', width : '9%'},
					{field: 'mra_release_dt', displayName: 'Release Date', width : '9%'},
					{field: 'remarks', displayName: 'Remarks', width : '20%'},
					{field: 'userid', displayName: 'User ID', width : '8%', hide : true},
					{field: 'tmpstp', displayName: 'Time Stamp', width : '13%', hide : true}
		        ],
		        data: [],
		        onRegisterApi: function (gridApi) {
		        	//whole data view action
		        	var viewCellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_assign_or_remove_meter_details($event,row)" title="Assign or Remove Meter"></button></div>';
		        	gridApi.core.addRowHeaderColumn({ name: 'View', displayName: '', width: '3%', cellTemplate: viewCellTemplate } );
		        	
		        }
			};
			
			$scope.meter_details_clear = function(e){
				$scope.meterDetailGridOptions.data = [];
				$rr_no.val('').focus();
				$mtr_sl_no.val('');
				$mtr_make.val('');
				$mtr_type.val('');
			};
			
			$scope.edit_assign_or_remove_meter_details = function(e, row){
				
				$scope.removedmeter = {};
				$scope.viewdetails = {};
				$scope.search = {};
				$scope.fixedmeter = {
						mtr_sl_no:'',
						mtr_make:'',
						mtr_type:'',
						mtr_amp:'',
						mtr_volt:'',
						no_of_ph: '',
						mtr_sts:'',
						mra_assigned_dt:'',
						f_bkwh : '',
						f_ckwh : '',
						f_bmd : '',
						f_bpf : '',
						assigned_released_by : '',
						remarks : ''
						};
				
				$scope.phaselist = [
					{key:"1",value:"Single Phase"},{key:"3",value:"Three Phase"}
				];
				
				/*if(row.entity.mtr_assign_sts === '4'){
					notify.error("Cannot Edit !!! Already Released...");
					return;
				}*/
				
				var assignMeterModalInstance = $uibModal.open({
					animation: true,
					size: 'lg',
				    templateUrl: templates.modal.assign_remove_meter_modal,
				    controller: function($scope, $uibModalInstance,configs,data,remote,MeterMakeList,MeterTypeList,MeterStatusList,phaselist,fixedmeter){
				    	
				    	if(row.entity.mtr_assign_sts === '4'){
							notify.info("Cannot Edit !!! Already Released. View Only.");
							$scope.viewdetails = angular.copy(data);
						}
				    	
				    	$scope.action = 'edit';
				    	console.log("row.entity",row.entity);
				    	$scope.removedmeter = angular.copy(data);
				    	$scope.removedmeter.mra_release_dt = null;	
				    	$scope.MeterMakeList = angular.copy(MeterMakeList);
				    	$scope.MeterTypeList = angular.copy(MeterTypeList);
				    	$scope.MeterStatusList = angular.copy(MeterStatusList);
				    	$scope.phaselist = angular.copy(phaselist);
				    	$scope.fixedmeter = angular.copy(fixedmeter);
				    	$scope.removedmeter.mra_release_dt = moment(new Date()).format("DD/MM/YYYY").toString();
				    	$scope.fixedmeter.mra_assigned_dt = moment(new Date()).format("DD/MM/YYYY").toString();
				    	
				    	//$scope.fixedmeter =  angular.copy(data);
				    	//$scope.fixedmeter.mra_assigned_dt = moment(new Date()).format("DD/MM/YYYY").toString();
				    	
				    	$scope.search = angular.copy(data);
				    	$scope.disablerr_no = true;
				    	
				    	$scope.cancel = function(){
				    		$uibModalInstance.dismiss();
				    	}
				    	
				    	$scope.clear = function(){
				    		$scope.removedmeter = {};
							$scope.viewdetails = {};
							$scope.search = {};
							$scope.fixedmeter = {
									mtr_sl_no:'',
									mtr_make:'',
									mtr_type:'',
									mtr_amp:'',
									mtr_volt:'',
									no_of_ph: '',
									mtr_sts:'',
									mra_assigned_dt:'',
									f_bkwh : '',
									f_ckwh : '',
									f_bmd : '',
									f_bpf : '',
									assigned_released_by : '',
									remarks : ''
									};
				    	};
				    	
				    	$scope.setAssignDateinFixed = function(){
				    		
				    		$scope.fixedmeter.mra_assigned_dt = moment(moment($scope.removedmeter.mra_release_dt,'DD/MM/YYYY').add('days', 1)).format("DD/MM/YYYY").toString();
				    		
				    	};
				    	
						$scope.save_remove_assign_meter_details = function(e){
							
							if(!$scope.fixedmeter){notify.warn("Please Enter Fixed Meter Details To Proceed !!!");return;}
							
							if(!$scope.fixedmeter.mtr_sl_no){notify.warn("Please Enter Meter Sl.No.");return;}
							if(!$scope.fixedmeter.mtr_make){notify.warn("Please Select Meter Make");return;}	
							if(!$scope.fixedmeter.mtr_type){notify.warn("Please Select Meter Type");return;}
							if(!$scope.fixedmeter.mtr_amp){notify.warn("Please Enter Amps");return;}
							if(!$scope.fixedmeter.mtr_volt){notify.warn("Please Enter Voltage");return;}
							if(!$scope.fixedmeter.no_of_ph){notify.warn("Please Select NO. Of Phases");return;}
							if(!$scope.fixedmeter.mtr_sts){notify.warn("Please Select Meter Status");return;}
							if(!$scope.fixedmeter.mra_assigned_dt){notify.warn("Please Select Assigned Date");return;}
							if(!$scope.fixedmeter.assigned_released_by){notify.warn("Please Enter Assigned By");return;}

							if($scope.fixedmeter.mtr_type === '3' || $scope.fixedmeter.mtr_type === '6' ){
								if(!$scope.fixedmeter.f_ckwh){notify.warn("Please Enter CKWH");return;}
								if(!$scope.fixedmeter.f_bmd){notify.warn("Please Enter BMD");return;}
								if(!$scope.fixedmeter.f_bpf){notify.warn("Please Enter BPF");return;}
							}else{
								if(!$scope.fixedmeter.f_bkwh){notify.warn("Please Enter BKWH");return;}
							}
							
							
							var request = {
									rrno:$rootScope.user.location_code+$scope.search.rr_no,
									r_mtr_sl_no:($scope.removedmeter.mtr_sl_no  ? $scope.removedmeter.mtr_sl_no : ''),
									r_mtr_make:($scope.removedmeter.mtr_make ? $scope.removedmeter.mtr_make : ''),
									r_mtr_type:($scope.removedmeter.mtr_type ? $scope.removedmeter.mtr_type : ''),
									r_mtr_amp:($scope.removedmeter.mtr_amp ? $scope.removedmeter.mtr_amp : ''),
									r_mtr_volt:($scope.removedmeter.mtr_volt ? $scope.removedmeter.mtr_volt : ''),
									r_no_of_ph:($scope.removedmeter.no_of_ph ? $scope.removedmeter.no_of_ph : '0'),
									r_mtr_sts:($scope.removedmeter.mtr_sts ? $scope.removedmeter.mtr_sts : ''),
									r_mra_assigned_dt:($scope.removedmeter.mra_assigned_dt ? $scope.removedmeter.mra_assigned_dt : ''),
									r_mra_release_dt:($scope.removedmeter.mra_release_dt ? $scope.removedmeter.mra_release_dt : ''),
									r_bkwh:($scope.removedmeter.r_bkwh ? $scope.removedmeter.r_bkwh : '0'),
									r_ckwh:($scope.removedmeter.r_ckwh ? $scope.removedmeter.r_ckwh : '0'),
									r_bmd:($scope.removedmeter.r_bmd ? $scope.removedmeter.r_bmd : '0'),
									r_bpf:($scope.removedmeter.r_bpf ? $scope.removedmeter.r_bpf : '0'),
									r_assigned_released_by:($scope.removedmeter.assigned_released_by  ? $scope.removedmeter.assigned_released_by : ''),
									r_remarks:($scope.removedmeter.remarks  ? $scope.removedmeter.remarks : ''),
									f_mtr_sl_no:$scope.fixedmeter.mtr_sl_no,
									f_mtr_make:$scope.fixedmeter.mtr_make,
									f_mtr_type:$scope.fixedmeter.mtr_type,
									f_mtr_amp:$scope.fixedmeter.mtr_amp,
									f_mtr_volt:$scope.fixedmeter.mtr_volt,
									f_no_of_ph:($scope.fixedmeter.no_of_ph ? $scope.fixedmeter.no_of_ph : '0'),
									f_mtr_sts:$scope.fixedmeter.mtr_sts,
									f_mra_assigned_dt:$scope.fixedmeter.mra_assigned_dt,
									f_bkwh:($scope.fixedmeter.f_bkwh ? $scope.fixedmeter.f_bkwh : '0'),
									f_ckwh:($scope.fixedmeter.f_ckwh ? $scope.fixedmeter.f_ckwh : '0'),
									f_bmd:($scope.fixedmeter.f_bmd   ? $scope.fixedmeter.f_bmd : '0'),
									f_bpf:($scope.fixedmeter.f_bpf   ? $scope.fixedmeter.f_bpf : '0'),
									f_assigned_released_by:($scope.fixedmeter.assigned_released_by  ? $scope.fixedmeter.assigned_released_by : ''),
									f_remarks:($scope.fixedmeter.remarks  ? $scope.fixedmeter.remarks : ''),
									
									conn_type: $rootScope.user.connection_type,
									userid : $rootScope.user.user_id,
							};
							
							console.log("save",request);
							remote.load("saveremoveassignmeterdetails", function(response){
								if(response.status === 'success'){
									$scope.cancel();
								}
							}, request , 'POST');
						};
				    },
				    resolve: {
				        configs: function() {
				        	return $scope.assignMeterModalInstance;
				        },
				        data: function() {
				        	return row.entity;
				        },
				        remote: function(){
				        	return remote;
				        },
				        MeterMakeList: function(){
				        	return $scope.MeterMakeList;
				        },
				        MeterTypeList: function(){
				        	return $scope.MeterTypeList;
				        },
				        MeterStatusList: function(){
				        	return $scope.MeterStatusList;
				        },
				        phaselist: function(){
				        	return $scope.phaselist;
				        },
				        fixedmeter: function(){
				        	return $scope.fixedmeter;
				        },
				    }
				});
			};
			
			$scope.add_assign_or_remove_meter_details = function(e){
				

				$scope.removedmeter = {};
				$scope.viewdetails = {};
				$scope.search = {};
				$scope.fixedmeter = {
						mtr_sl_no:'',
						mtr_make:'',
						mtr_type:'',
						mtr_amp:'',
						mtr_volt:'',
						no_of_ph: '',
						mtr_sts:'',
						mra_assigned_dt:'',
						f_bkwh : '',
						f_ckwh : '',
						f_bmd : '',
						f_bpf : '',
						assigned_released_by : '',
						remarks : ''
						};
				$scope.disablerr_no = false;
				
				$scope.phaselist = [
					{key:"1",value:"Single Phase"},{key:"3",value:"Three Phase"}
				];
				
				$modal_rr_no = $('#assign-remove-meter-rr-number');
				$modal_customer_id = $('#assign-remove-meter-customer-id');
				
				var assignMeterModalInstance = $uibModal.open({
					animation: true,
					size: 'lg',
				    templateUrl: templates.modal.assign_remove_meter_modal,
				    controller: function($scope, $uibModalInstance,configs,remote,MeterMakeList,MeterTypeList,MeterStatusList,phaselist,fixedmeter){
				    	
				    	$scope.action = 'add';
				    	$scope.data = {};
				    	$scope.MeterMakeList = angular.copy(MeterMakeList);
				    	$scope.MeterTypeList = angular.copy(MeterTypeList);
				    	$scope.MeterStatusList = angular.copy(MeterStatusList);
				    	$scope.phaselist = angular.copy(phaselist);
				    	$scope.fixedmeter = angular.copy(fixedmeter);
				    	$scope.fixedmeter.mra_assigned_dt = moment(new Date()).format("DD/MM/YYYY").toString();
				    	
				    	$scope.cancel = function(){
				    		$uibModalInstance.dismiss();
				    	};
				    	
				    	$scope.clear = function(){
				    		$scope.removedmeter = {};
							$scope.viewdetails = null;
							$scope.search = {};
							$scope.fixedmeter = {
									mtr_sl_no:'',
									mtr_make:'',
									mtr_type:'',
									mtr_amp:'',
									mtr_volt:'',
									no_of_ph: '',
									mtr_sts:'',
									mra_assigned_dt:'',
									f_bkwh : '',
									f_ckwh : '',
									f_bmd : '',
									f_bpf : '',
									assigned_released_by : '',
									remarks : ''
									};
							$scope.disablerr_no = false;
				    	};
				    	
				    	$scope.load_meter_detail_modal = function(e){
							var request = {
								"conn_type": $rootScope.user.connection_type,	
								"location_code" : $rootScope.user.location_code,					
								"rr_no": (($scope.search.rr_no) ? $rootScope.user.location_code + $scope.search.rr_no : ''),
								"customer_id": (($modal_customer_id.val()) ? $modal_customer_id.val() : ''),
								"mtr_sl_no" : '',
								"mtr_make" : '',
								"mtr_type" : ''
							}
							remote.load("getmeterdetails", function(response){
								if(response.meter_details){
									if(response.meter_details.length > 0){
										$scope.removedmeter = response.meter_details[0];
										$scope.disablerr_no = true;
									}
									//$scope.fixedmeter.mra_assigned_dt = moment(new Date()).format("DD/MM/YYYY").toString();
								}
							}, request , 'POST');
						};
						
						$scope.setAssignDateinFixed = function(){
				    		
				    		$scope.fixedmeter.mra_assigned_dt = moment(new Date()).format("DD/MM/YYYY").toString();
				    		
				    	};
				    	
						$scope.save_remove_assign_meter_details = function(e){
							
							if(!$scope.fixedmeter){notify.warn("Please Enter Fixed Meter Details To Proceed !!!");return;}
							
							if(!$scope.fixedmeter.mtr_sl_no){notify.warn("Please Enter Meter Sl.No.");return;}
							if(!$scope.fixedmeter.mtr_make){notify.warn("Please Select Meter Make");return;}	
							if(!$scope.fixedmeter.mtr_type){notify.warn("Please Select Meter Type");return;}
							if(!$scope.fixedmeter.mtr_amp){notify.warn("Please Enter Amps");return;}
							if(!$scope.fixedmeter.mtr_volt){notify.warn("Please Enter Voltage");return;}
							if(!$scope.fixedmeter.no_of_ph){notify.warn("Please Select NO. Of Phases");return;}
							if(!$scope.fixedmeter.mtr_sts){notify.warn("Please Select Meter Status");return;}
							if(!$scope.fixedmeter.mra_assigned_dt){notify.warn("Please Select Assigned Date");return;}
							if(!$scope.fixedmeter.assigned_released_by){notify.warn("Please Enter Assigned By");return;}

							if($scope.fixedmeter.mtr_type === '3' || $scope.fixedmeter.mtr_type === '6' ){
								if(!$scope.fixedmeter.f_ckwh){notify.warn("Please Enter CKWH");return;}
								if(!$scope.fixedmeter.f_bmd){notify.warn("Please Enter BMD");return;}
								if(!$scope.fixedmeter.f_bpf){notify.warn("Please Enter BPF");return;}
							}else{
								if(!$scope.fixedmeter.f_bkwh){notify.warn("Please Enter BKWH");return;}
							}
							
							
							var request = {
									rrno:$rootScope.user.location_code+$scope.search.rr_no,
									r_mtr_sl_no:'',
									r_mtr_make:'',
									r_mtr_type:'',
									r_mtr_amp:'',
									r_mtr_volt:'',
									r_no_of_ph:'0',
									r_mtr_sts:'',
									r_mra_assigned_dt:'',
									r_mra_release_dt:'',
									r_bkwh:'0',
									r_ckwh:'0',
									r_bmd:'0',
									r_bpf:'0',
									r_assigned_released_by:'',
									r_remarks:'',
									f_mtr_sl_no:$scope.fixedmeter.mtr_sl_no,
									f_mtr_make:$scope.fixedmeter.mtr_make,
									f_mtr_type:$scope.fixedmeter.mtr_type,
									f_mtr_amp:$scope.fixedmeter.mtr_amp,
									f_mtr_volt:$scope.fixedmeter.mtr_volt,
									f_no_of_ph:($scope.fixedmeter.no_of_ph ? $scope.fixedmeter.no_of_ph : '0'),
									f_mtr_sts:$scope.fixedmeter.mtr_sts,
									f_mra_assigned_dt:$scope.fixedmeter.mra_assigned_dt,
									f_bkwh:($scope.fixedmeter.f_bkwh ? $scope.fixedmeter.f_bkwh : '0'),
									f_ckwh:($scope.fixedmeter.f_ckwh ? $scope.fixedmeter.f_ckwh : '0'),
									f_bmd:($scope.fixedmeter.f_bmd   ? $scope.fixedmeter.f_bmd : '0'),
									f_bpf:($scope.fixedmeter.f_bpf   ? $scope.fixedmeter.f_bpf : '0'),
									f_assigned_released_by:($scope.fixedmeter.assigned_released_by  ? $scope.fixedmeter.assigned_released_by : ''),
									f_remarks:($scope.fixedmeter.remarks  ? $scope.fixedmeter.remarks : ''),
									
									conn_type: $rootScope.user.connection_type,
									userid : $rootScope.user.user_id,
							};
							
							console.log("save",request);
							remote.load("saveremoveassignmeterdetails", function(response){
								if(response.status === 'success'){
									$scope.cancel();
								}
							}, request , 'POST');
						};
				    },
				    resolve: {
				        configs: function() {
				        	return $scope.assignMeterModalInstance;
				        },
				        remote: function(){
				        	return remote;
				        },
				        MeterMakeList: function(){
				        	return $scope.MeterMakeList;
				        },
				        MeterTypeList: function(){
				        	return $scope.MeterTypeList;
				        },
				        MeterStatusList: function(){
				        	return $scope.MeterStatusList;
				        },
				        phaselist: function(){
				        	return $scope.phaselist;
				        },
				        fixedmeter: function(){
				        	return $scope.fixedmeter;
				        },
				    }
				});
				
			};
			
		}
	
	if(accounts_flow === 'transfer'){
		
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

}]);