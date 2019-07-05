var master_controller = angular.module('master_controller',[]);

master_controller.controller('master_controller',['$scope','$rootScope','remote','$timeout','$filter','$compile','$uibModal','uiGridConstants','$sce','notify','webValidations',function($scope,$rootScope,remote,$timeout,$filter,$compile,$uibModal,uiGridConstants,$sce,notify,webValidations){
	
	var master_flow = $rootScope.breadcrumb[$rootScope.breadcrumb.length-1];

	// code master grid starts
	if(master_flow === 'code_master'){
		
		remote.load("getcodetypesforcodedetails", function(response){
			$scope.codeTypes = response.CodeType;
			$timeout(function(){
				$('#master').find('.code-types').find('div').eq(0).trigger('click');
			});
		}, { conn_type: $rootScope.user.connection_type } , 'POST');
		
		$scope.load_code_details = function(e){
			var $target = $(e.target);
			$('#master').find('.code-types').find('.selected').removeClass('selected');
			$target.addClass('selected');
			if($scope.selected_code_type === $target.text()){
				return;
			}
			$scope.selected_code_type = $target.text();
			var request = {
				"code_type": $target.attr('param'),
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getcodedetails", function(response){
				var status_options = [{'key' : 'N','value' : 'Active'}, {'key' : 'Y','value' : 'InActive'}];
				$scope.codeMasterDetailsGridOptions.columnDefs[4]['options'] = status_options;
				$scope.codeMasterDetailsGridOptions.data = response.code_details;
			}, request , 'POST');
		};
		
		$scope.codeMasterDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#', width : '4%', hide : true},
	             {field: 'code_type', displayName: 'Code Type', width : '10%', visible: false, readOnly : true},
	             {field: 'code_value', displayName: 'Value', width : '10%', required: true, alphanumeric: true},
	             {field: 'code_description', displayName: 'Description', width : '40%', required: true, alphanumeric: true},
	             {field: 'code_status_description', displayName: 'Status', field_key: 'code_status' , width : '10%', required: true},
	             {field: 'userid', displayName: 'User ID', width : '10%', hide : true},
	             {field: 'tmpstp', displayName: 'TimeStamp', width : '20%', hide : true}
	         ],
	         data: [],
	            onRegisterApi: function( gridApi ) { 
		             $scope.codeDetailsGridApi = gridApi;
		             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_code_master_detail($event,row)" title="Edit"></button></div>';
		             $scope.codeDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
		        }
		};
		
		$scope.add_code_master_detail = function(e){

			var addCodeDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote, code_type, notify){
			    	$scope.header = "Add Code Details";
			    	$scope.ok_text = "Add";
			    	
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		code_type : code_type,
			    		code_status : 'N'
			    	};
			    	$scope.ok = function(){
			    		$scope.data.code_status_description = $('.code_status_description').find('select').find('option[value="'+$('.code_status_description').find('select').val()+'"]').text();
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		console.log(request);
		    			remote.load("upsertcodedetails", function(response){
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
			        	return $scope.codeMasterDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        },
			        code_type: function(){
			        	return $scope.selected_code_type;
			        }
			    }
			});
			addCodeDetailsModalInstance.result.then(function (newRecord) {
				$scope.load_code_details();
			});
			addCodeDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required', 'web-alphanumeric', 'web-float']);
			});
		};
		
		// edit/update function
		$scope.edit_code_master_detail = function(e,row){
			var editCodeDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Code Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,2];
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
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		remote.load("upsertcodedetails", function(response){
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
			editCodeDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope);
			});
		}
	}
	//code master grid ends...
	
	// config grid starts
	if(master_flow === 'bill_config'){
		
		$scope.load_cloudbill_config = function(){
			remote.load("getconfigurationdetails", function(response){
				$scope.cloudBillConfigDetailsGridOptions.data = response.configuration_details;
			}, { "location_code": $rootScope.user.location_code } , 'POST');
		};
		
		$scope.cloudBillConfigDetailsGridOptions = {
			enableGridMenu: true,
			exporterPdfHeader : function() { 
				return [
				        	{ text: 'Bill Config', alignment: 'center' },
					        { text: $rootScope.user.zone +'( '+$rootScope.user.company+' )', alignment: 'center' }
					   ]
			},
			exporterPdfFooter : function(currentPage, pageCount) { 
				var columns = [
				               	{ text: $filter('date')(new Date(), 'dd/MM/yyyy hh:mm:ss a'), alignment: 'left' },
					          	{ text: $rootScope.user.user_id, alignment: 'center' },
					          	{ text: currentPage.toString() + ' of ' + pageCount, alignment: 'right' }
					         ]
				return {columns: columns};
			},
			exporterPdfFilename: 'Cloudbill_Config.pdf',
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#', width : '5%', hide: true},
	             {field: 'config_veriable', displayName: 'Config Variable', width : '25%', required: true, alphanumeric: true},
	             {field: 'config_value', displayName: 'Config Value', width : '30%', required: true},
	             {field: 'userid', displayName: 'User Id', width : '15%', hide: true},
	             {field: 'tmpstp', displayName: 'TimeStamp', width : '20%', hide: true}
	         ],
	         data: [],
             onRegisterApi: function( gridApi ) { 
	             $scope.cloudbillConfigGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_cloudbill_config($event,row)" title="Edit"></button></div>';
	             $scope.cloudbillConfigGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		$scope.load_cloudbill_config();
		// add function
		$scope.add_cloudbill_config = function(e){
			var addCloudbillConfigModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add Bill Configuration";
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
			    			option : 'ADD',
			    			location_code : $rootScope.user.location_code,
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertcloudbillconfig", function(response){
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
			        	return $scope.cloudBillConfigDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			
			addCloudbillConfigModalInstance.result.then(function (newRecord) {
				$scope.load_cloudbill_config();
			});
			addCloudbillConfigModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric']);
			});
		};
		
		// edit/update function
		$scope.edit_cloudbill_config = function(e,row){
			var editCloudbillConfigModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Bill Configuration";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1];
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
			    			location_code : $rootScope.user.location_code,
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		remote.load("upsertcloudbillconfig", function(response){
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
			editCloudbillConfigModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope);
			});
			
		}
	}
	//config grid ends...
	if(master_flow === 'bill_parameter'){
		
		$scope.load_cloudbill_parameter = function(){
			remote.load("getbillingparameters", function(response){
				$scope.cloudBillParameterDetailsGridOptions.data = response.billing_parameters;;
			}, {} , 'POST');
		};
	
		$scope.cloudBillParameterDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
		         {field: 'row_num', displayName: '#', width : '4%', hide: true},
		         {field: 'id', displayName: 'ID', width : '5%', hide: true},
		         {field: 'type', displayName: 'Type', width : '15%', required: true, alphanumeric: true},
		         {field: 'value', displayName: 'Value', width : '5%', required: true, float: true},
		         {field: 'description', displayName: 'Description', width : '25%', required: true},
		         {field: 'effected_from_dt', displayName: 'Effected from date', width : '11%', type : 'date', required: true},
		         {field: 'effected_to_dt', displayName: 'Effected to date', width : '11%', type : 'date'},
		         {field: 'userid', displayName: 'User Id', width : '8%', hide: true},
		         {field: 'tmpstp', displayName: 'TimeStamp', width : '15%', hide: true}
		     ],
		     data: [],
             onRegisterApi: function( gridApi ) { 
	             $scope.cloudbillParameterGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_cloudbill_parameter($event,row)" title="Edit"></button></div>';
	             $scope.cloudbillParameterGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.load_cloudbill_parameter();
		// add function
		$scope.add_cloudbill_parameter = function(e){
			var addCloudbillParameterModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add Bill Parameter";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		effected_from_dt : $filter('date')(new Date(), 'dd/MM/yyyy')
			    	};
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertcloudbillparameter", function(response){
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
			        	return $scope.cloudBillParameterDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			
				addCloudbillParameterModalInstance.result.then(function (newRecord) {
				$scope.load_cloudbill_parameter();
			});
				addCloudbillParameterModalInstance.rendered.then(function(){
					webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-float']);
				});
				
		};
		
		// edit/update function
		$scope.edit_cloudbill_parameter = function(e,row){
			var editCloudbillParameterModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Bill Parameter";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,2,5];
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
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		remote.load("upsertcloudbillparameter", function(response){
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
			editCloudbillParameterModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-float']);
			});
		}
	}

	if(master_flow === 'form_master'){

		$scope.load_form_master = function(){
			remote.load("getformdetails", function(response){
				var status_options = [{'key' : 'Y','value' : 'Active'}, {'key' : 'N','value' : 'InActive'}];
				$scope.cloudFormMasterDetailsGridOptions.columnDefs[4]['options'] = status_options;
				$scope.cloudFormMasterDetailsGridOptions.data = response.form_details;
			}, {} , 'POST');
		};
		
		$scope.cloudFormMasterDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			     {field: 'row_num', displayName: '#', width : '4%', hide: true},
			     {field: 'form_cd', displayName: 'Form Code', width : '15%', required: true, alphanumeric: true},
			     {field: 'form_name', displayName: 'From Name', width : '25%', required: true},
			     {field: 'form_type', displayName: 'Form Type', width : '10%', hide: true, required: true},
			     {field: 'status_description', displayName: 'Status', field_key : 'status',width : '12%', required: true},
			     {field: 'userid', displayName: 'User Id', width : '13%', hide: true},
			     {field: 'tmpstp', displayName: 'TimeStamp', width : '20%', hide: true}
			 ],
			 data: [],
             onRegisterApi: function( gridApi ) { 
	             $scope.formMasterGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_form_master($event,row)" title="Edit"></button></div>';
	             $scope.formMasterGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.load_form_master();
		// add function
		$scope.add_form_master = function(e){
			var addFromMasterModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add From Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		status : 'Y'
			    	};
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertformmaster", function(response){
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
			        	return $scope.cloudFormMasterDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			
				addFromMasterModalInstance.result.then(function (newRecord) {
				$scope.load_form_master();
			});
				addFromMasterModalInstance.rendered.then(function(){
					webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric']);
				});
		};
		
		// edit/update function
		$scope.edit_form_master = function(e,row){
			var editFromMasterModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Form Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,2];
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
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		remote.load("upsertformmaster", function(response){
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
			editFromMasterModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric']);
			});
		}
	}

	if(master_flow === 'rebate_master'){
		
		
		$scope.load_rebate_master = function(){
			remote.load("getrebatemaster", function(response){
				remote.load("getchargecodedetails", function(response){
					$scope.ChargeCodeList = response.ChargeCodeList;
					$scope.rebateMasterDetailsGridOptions.columnDefs[3]['options'] = response.ChargeCodeList;
				}, { conn_type : $rootScope.user.connection_type } , 'POST');
				$scope.rebateMasterDetailsGridOptions.data = response.rebate_master_details;
			}, {} , 'POST');
		};
				
		
		$scope.rebateMasterDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			     {field: 'row_num', displayName: '#', width : '5%', hide: true},
			     {field: 'rbt_code', displayName: 'Rebate Code', width : '8%', required: true, numeric: true},
			     {field: 'rbt_description', displayName: 'Rebate Description', width : '15%', required: true, alphanumeric: true},
			     {field: 'chrg_cd_description', displayName: 'Charge Code', field_key : 'chrg_cd',width : '15%', required: true},
			     {field: 'rbt_unit', displayName: 'Rebate Unit', width : '8%', required: true, float: true},
			     {field: 'min_rbt', displayName: 'Minimum Rebate', width : '11%', required: true, float: true},
			     {field: 'max_rbt', displayName: 'Maximum Rebate', width : '11%', required: true, float: true},
			     {field: 'effected_from_dt', displayName: 'Effected from date', width : '11%', type : 'date', required: true},
			     {field: 'effected_to_dt', displayName: 'Effected To date', width : '11%', type : 'date'},
			     {field: 'rbt_on', displayName: 'Rebate On', width : '8%', required: true, alpha: true},
			     {field: 'rbt_type', displayName: 'Rebate Type', width : '8%', required: true, alpha: true},
			     {field: 'userid', displayName: 'User ID', width : '10%', hide: true},
			     {field: 'tmpstp', displayName: 'TimeStamp', width : '15%', hide: true}
			 ],
			 data: [],
             onRegisterApi: function( gridApi ) { 
	             $scope.rebateMasterGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_rebate_master($event,row)" title="Edit"></button></div>';
	             $scope.rebateMasterGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.load_rebate_master();
		// add function
		$scope.add_rebate_master = function(e){
			var addRebateMasterModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add Rebate Mater Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		effected_from_dt : $filter('date')(new Date(), 'dd/MM/yyyy')
			    	};
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertrebatemasterdetails", function(response){
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
			        	return $scope.rebateMasterDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			
				addRebateMasterModalInstance.result.then(function (newRecord) {
				$scope.load_rebate_master();
			});
				addRebateMasterModalInstance.rendered.then(function(){
					webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alpha','web-alphanumeric','web-numeric','web-float']);
				});
		};
		
		// edit/update function
		$scope.edit_rebate_master = function(e,row){
			var editRebateMasterModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Rebate Master Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,7];
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
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		remote.load("upsertrebatemasterdetails", function(response){
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
			editRebateMasterModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alpha','web-alphanumeric','web-numeric','web-float']);
			});
		}
	}
	
	
	if(master_flow === 'form_previleges'){
		
		var $form_code = $('#form-previlages-form-code');
		
		var previlage_options = [{'key' : '1','value' : 'Yes'}, {'key' : '0','value' : 'No'}];
		
		//TODO: Move remote action outside
		remote.load("getforms", function(response){
			$scope.FormsList = response.FormsList;
			remote.load("getuserroles", function(response){
				$scope.formPrevilegesDetailsGridOptions.columnDefs[3]['options'] = response.user_roles_details;
			}, { conn_type : $rootScope.user.connection_type } , 'POST');
			$scope.formPrevilegesDetailsGridOptions.columnDefs[1]['options'] = response.FormsList;
		}, { conn_type : $rootScope.user.connection_type } , 'POST');
				
		$scope.load_form_previleges = function(){
			
			var request = {
					conn_type : $rootScope.user.connection_type,
					form_code : $scope.FormsList.key,
				}
				remote.load("getformprevilages", function(response){
					$scope.form_previleges = response.form_previlage_details;
					$scope.formPrevilegesDetailsGridOptions.data = $scope.form_previleges;
				}, request , 'POST');
		};

			
		$scope.formPrevilegesDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
	             {field: 'row_num', displayName: '#', width : '5%', hide : true},
	             {field: 'form_cd', displayName: 'Form Code', field_key : 'form_cd', width : '8%', required: true},
	             {field: 'form_name', displayName: 'Form Name', width : '20%', hide : true, required: true},
	             {field: 'user_role_description', displayName: 'User Role',field_key : 'user_role', width : '15%', required: true},
	             {field: 'select_priv_description', displayName: 'Select', field_key : 'select_priv',width : '8%', options: previlage_options, required: true },
	             {field: 'insert_priv_description', displayName: 'Insert', field_key : 'insert_priv',width : '8%', options: previlage_options, required: true },
	             {field: 'update_priv_description', displayName: 'Update', field_key : 'update_priv',width : '8%', options: previlage_options, required: true },
	             {field: 'delete_priv_description', displayName: 'Delete', field_key : 'delete_priv',width : '8%', options: previlage_options, required: true },
	             {field: 'userid', displayName: 'User Id', width : '10%', hide : true},
	             {field: 'tmpstp', displayName: 'TimeStamp', width : '15%', hide : true}
	         ],
	         data: [],
             onRegisterApi: function( gridApi ) { 
	             $scope.formPrevilagesGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_form_previlege_details($event,row)" title="Edit"></button></div>';
	             $scope.formPrevilagesGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.form_previleges_clear = function(e){
			$form_code.val('');
			$scope.formPrevilegesDetailsGridOptions.data = [];
		};
		
		// add function
		$scope.add_form_previlege_details = function(e){
			var addFromPrevilageModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add Form Previlage Details";
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
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertformprevilagedetails", function(response){
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
			        	return $scope.formPrevilegesDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			
			addFromPrevilageModalInstance.result.then(function (newRecord) {
				$scope.load_form_previleges();
			});
			addFromPrevilageModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required']);
			});
		};
		
		// edit/update function
		$scope.edit_form_previlege_details = function(e,row){
			var editFromPrevilageModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Form Previlage Details";
			    	$scope.ok_text = "Update";
			    	$scope.data = data;
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,2,3];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
			    		
			    		$scope.data.select_priv_description = $('.select_priv_description').find('select').find('option[value="'+$('.select_priv_description').find('select').val()+'"]').text();
			    		$scope.data.insert_priv_description = $('.insert_priv_description').find('select').find('option[value="'+$('.insert_priv_description').find('select').val()+'"]').text();
			    		$scope.data.update_priv_description = $('.update_priv_description').find('select').find('option[value="'+$('.update_priv_description').find('select').val()+'"]').text();
			    		$scope.data.delete_priv_description = $('.delete_priv_description').find('select').find('option[value="'+$('.delete_priv_description').find('select').val()+'"]').text();
		    			
			    		var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		remote.load("upsertformprevilagedetails", function(response){
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
			editFromPrevilageModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required']);
			});
		
		}
	}

	if(master_flow === 'tariff_master'){
		
		$scope.load_tariff_master = function(){
			remote.load("gettarriffmaster", function(response){
				
				var power_unit_options = [{'key' : 'K','value' : 'KW'}, {'key' : 'H','value' : 'HP'}, {'key' : 'KV','value' : 'KVA'}];
				$scope.tariffMasterDetailsGridOptions.columnDefs[5]['options'] = power_unit_options;
				
				var billing_frequency_options = [{'key' : 'M','value' : 'Monthly'}, {'key' : 'B','value' : 'Bi-Monthly'}, {'key' : 'Q','value' : 'Quarterly'}];
				$scope.tariffMasterDetailsGridOptions.columnDefs[7]['options'] = billing_frequency_options;
				
				var triff_type_options = [{'key' : 'L','value' : 'LT(Low Tention)'}, {'key' : 'H','value' : 'HT(High Tention)'}];
				$scope.tariffMasterDetailsGridOptions.columnDefs[11]['options'] = triff_type_options;
				
				var status_options = [{'key' : 'Y','value' : 'Active'}, {'key' : 'N','value' : 'InActive'}];
				$scope.tariffMasterDetailsGridOptions.columnDefs[14]['options'] = status_options;
				
				$scope.tariffMasterDetailsGridOptions.data = response.tariff_master_details;
			}, {} , 'POST');
		};
		
		
		$scope.tariffMasterDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			     {field: 'row_num', displayName: 'Sl. No', width : '5%', hide: true},
			     {field: 'version_no', displayName: 'Version', width : '6%', hide: true},
			     {field: 'trf_code', displayName: 'Tariff Code', width : '8%', required: true, numeric: true},
			     {field: 'trf_name', displayName: 'Tariff Description', width : '11%', required: true},
			     {field: 'trf_description', displayName: 'Tariff Long Description', width : '24%', required: true},
			     {field: 'power_unit_description', displayName: 'Power Unit', field_key : 'power_unit',width : '8%', required: true},
			     {field: 'tax_percentage', displayName: 'Tax (%)', width : '6%',  float: true},
			     {field: 'billing_frequency_description', displayName: 'Billing Frequency', field_key : 'billing_frequency',width : '10%', required: true},
			     {field: 'fec_chrgs', displayName: 'FEC Charges', width : '8%',  float: true},
			     {field: 'fixed_min_chrgs', displayName: 'Fixed Minimum Charges', width : '14%',  float: true},
			     {field: 'const_chrgs', displayName: 'Constant Charges', width : '11%',  float: true},
			     {field: 'trf_type_description', displayName: 'Tariff Type', field_key : 'trf_type',width : '10%', required: true},
			     {field: 'effected_from_dt', displayName: 'Effected from date', width : '11%', type : 'date', required: true},
			     {field: 'effected_to_dt', displayName: 'Effected To date', width : '11%', type : 'date'},
			     {field: 'status_description', displayName: 'Status', field_key : 'status',width : '6%', required: true},
			     {field: 'userid', displayName: 'User Id', width : '10%', hide: true},
			     {field: 'tmpstp', displayName: 'TimeStamp', width : '12%', hide: true}
			 ],
			 data: [],
             onRegisterApi: function( gridApi ) { 
	             $scope.tariffMasterGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_tariff_master($event,row)" title="Edit"></button></div>';
	             $scope.tariffMasterGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.load_tariff_master();
		// add function
		$scope.add_tariff_master = function(e){
			var addTariffMasterModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add Tariff Mater Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		effected_from_dt : $filter('date')(new Date(), 'dd/MM/yyyy'),
			    		status : 'Y',
			    		trf_type : 'L'
			    	};
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upserttariffmasterdetails", function(response){
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
			        	return $scope.tariffMasterDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			
				addTariffMasterModalInstance.result.then(function (newRecord) {
				$scope.load_tariff_master();
			});
				addTariffMasterModalInstance.rendered.then(function(){
					webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-float']);
				});
		};
		
		// edit/update function
		$scope.edit_tariff_master = function(e,row){
			var editTariffMasterModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Tariff Master Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [2,12];
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
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		remote.load("upserttariffmasterdetails", function(response){
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
			editTariffMasterModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-float']);
			});
		}
	}
	
	if(master_flow === 'sub_division_details'){
		
		
		$scope.load_sub_division_details = function(){
			remote.load("getsubdivisiondetails", function(response){
				var office_type_options = [{'key' : 'AC','value' : 'ACCOUNTING SECTION'}, {'key' : 'SD','value' : 'SUB-DIVISION OFFICE'}];
				$scope.subDivisionDetailsGridOptions.columnDefs[3]['options'] = office_type_options;
				$scope.subDivisionDetailsGridOptions.data = response.sub_division_details;
			}, {} , 'POST');
		};
		
		$scope.subDivisionDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			     {field: 'row_num', displayName: '#', width : '4%', hide : true},
			     {field: 'sub_div_code', displayName: 'Code', width : '6%', required: true, numeric: true},
			     {field: 'sub_div_name', displayName: 'Name', width : '12%', required: true, alphanumeric: true},
			     {field: 'office_typ_description', displayName: 'Type',field_key : 'office_typ', width : '12%', required: true},
			     {field: 'addr1', displayName: 'Address1', width : '13%', required: true},
			     {field: 'addr2', displayName: 'Address2', width : '13%'},
			     {field: 'addr3', displayName: 'Address3', width : '12%'},
			     {field: 'addr4', displayName: 'Address4', width : '10%'},
			     {field: 'city', displayName: 'City', width : '12%', required: true},
			     {field: 'pin_cd', displayName: 'Pin Code', width : '8%', required: true, numeric: true},
			     {field: 'userid', displayName: 'User ID', width : '10%', hide : true},
			     {field: 'tmpstp', displayName: 'TimeStamp', width : '15%', hide : true}
			 ],
			 data: [],
             onRegisterApi: function( gridApi ) { 
	             $scope.subDivisionDetailsGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_sub_division_details($event,row)" title="Edit"></button></div>';
	             $scope.subDivisionDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.load_sub_division_details();

		// add function
		$scope.add_sub_division_details = function(e){
			var addSubDivisionDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add Sub Division Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id
			    	};
			    	$scope.$watch('data.office_typ',function(new_val, old_val){
			    		console.log(new_val, old_val);
			    		if(typeof new_val !== 'undefined' && new_val !== old_val){
			    			$scope.get_details();
			    		}
			    	});
			    	
			    	$scope.get_details = function(){
			    		if ($scope.data.office_typ==='SD'){
			    			angular.extend($scope.data, {
			    				addr1 : 'O/O THE ASSISTANT EXECUTIVE ENGINEER(EL).'
			    			});
			    		}else if ($scope.data.office_typ==='AC'){
			    			angular.extend($scope.data, {
			    				addr1 : 'O/O THE ASSISTANT ENGINEER(EL).'
			    			});
			    		}	
			    	};

			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertsubdivisiondetails", function(response){
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
			        	return $scope.subDivisionDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			
			addSubDivisionDetailsModalInstance.result.then(function (newRecord) {
				$scope.load_sub_division_details();
			});
			addSubDivisionDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-alphanumeric']);
			});
		};
		
		// edit/update function
		$scope.edit_sub_division_details = function(e,row){
			var editSubDivisionDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Sub Division Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	
			    	$scope.data = data;
			    	
			    	$scope.$watch('data.office_typ',function(new_val, old_val){
			    		console.log(new_val, old_val);
			    		if(typeof new_val !== 'undefined' && new_val !== old_val){
			    			$scope.get_details();
			    		}
			    	});
			    	
			    	$scope.get_details = function(){
			    		if ($scope.data.office_typ==='SD'){
			    			angular.extend($scope.data, {
			    				addr1 : 'O/O THE ASSISTANT EXECUTIVE ENGINEER(EL).'
			    			});
			    		}else if ($scope.data.office_typ==='AC'){
			    			angular.extend($scope.data, {
			    				addr1 : 'O/O THE ASSISTANT ENGINEER(EL).'
			    			});
			    		}	
			    	};
			    	$scope.ok = function(){
			    		$scope.data.office_typ_description = $('.office_typ_description').find('select').find('option[value="'+$('.office_typ_description').find('select').val()+'"]').text();

			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		remote.load("upsertsubdivisiondetails", function(response){
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
			editSubDivisionDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-alphanumeric']);
			});
		}
	}

	if(master_flow === 'bank_details'){
		
		var $micr_code = $('#bank-details-micr-code');
		var $city_code = $('#bank-details-city-code');
		var $bank_code = $('#bank-details-bank-code');
		var $branch_code = $('#bank-details-branch-code');
		
			
		$scope.load_bank_details = function($event){
			if($micr_code.val().trim() == '') {
				$micr_code.val('%');
			}
			if($city_code.val().trim() == '') {
				$city_code.val('%');
			}	
			if($bank_code.val().trim() == '') {
				$bank_code.val('%');
			}	
			if($branch_code.val().trim() == '') {
				$branch_code.val('%');
			}	
			var request = {
				"conn_type" : $rootScope.user.connection_type,	
				"micr_code" : $micr_code.val().trim(),
				"city_code" : $city_code.val().trim(),					
				"bank_code" : $bank_code.val().trim(),
				"branch_code" : $branch_code.val().trim()
			}
			$scope.bankDetailsGridOptions.data = [];
			remote.load("getbankdetails", function(response){
				$scope.bank_details = response.bank_details;
				$scope.bankDetailsGridOptions.data = $scope.bank_details;
			}, request , 'POST');
		};
		
		$scope.bankDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			     {field: 'row_num', displayName: '#', width : '4%', hide : true},
			     {field: 'micr_cd', displayName: 'MICR Code', width : '9%', hide : true},
			     {field: 'city_cd', displayName: 'City Code', width : '9%', required: true, numeric: true},
			     {field: 'city_name', displayName: 'City Name', width : '14%', required: true, alphanumeric: true},
			     {field: 'bank_cd', displayName: 'Bank Code', width : '9%', required: true, numeric: true},
			     {field: 'bank_name', displayName: 'Bank Name', width : '14%', required: true, alphanumeric: true},
			     {field: 'branch_cd', displayName: 'Branch Code', width : '11%', required: true, numeric: true},
			     {field: 'branch_name', displayName: 'Branch Name', width : '14%', required: true, alphanumeric: true},
			     {field: 'userid', displayName: 'User Id', width : '8%', hide : true},
			     {field: 'tmpstp', displayName: 'TimeStamp', width : '13%', hide : true}
			 ],
			 data: [],
             onRegisterApi: function( gridApi ) { 
	             $scope.bankDetailsGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_bank_details($event,row)" title="Edit"></button></div>';
	             $scope.bankDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		
		$scope.bank_details_clear = function(e){
			$micr_code.val('').focus();
			$city_code.val('');
			$bank_code.val('');
			$branch_code.val('');
			$scope.bankDetailsGridOptions.data = [];
		};
		
		//$scope.load_bank_details();
		// add function
		$scope.add_bank_details = function(e){
			var addBankDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add Bank Details";
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
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertbankdetails", function(response){
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
			        	return $scope.bankDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
				addBankDetailsModalInstance.result.then(function (newRecord) {
				$scope.load_bank_details();
			});
				
				addBankDetailsModalInstance.rendered.then(function(){
					webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-alphanumeric']);
				});
		};
		
		// edit/update function
		$scope.edit_bank_details = function(e,row){
			var editBankDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Bank Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1];
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
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		remote.load("upsertbankdetails", function(response){
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
			$scope.load_bank_details();
			
			editBankDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-alphanumeric']);
			});
		}
	}

	if(master_flow === 'posting_priority'){
		
		var priority_options = [{'key' : 'Y','value' : 'Yes'}, {'key' : 'N','value' : 'No'}];
		var charge_type_options =[
		  {'key' : 'O','value' : 'Others'},
		  {'key' : 'CQ','value' : 'Cheque Dis Fee'},
		  {'key' : 'TA','value' : 'Tax Arrears'},
		  {'key' : 'P','value' : 'Penality'},
		  {'key' : 'IT','value' : 'Intrest On Tax'},
		  {'key' : 'DA','value' : 'Demand Arrears'},
		  {'key' : 'D','value' : 'Demand'},
		  {'key' : 'C','value' : 'Delay Payment  Intrest Arrears'},
		  {'key' : 'T','value' : 'Tax'},
		  {'key' : 'CI','value' : 'Delay Payment  Intrest'},
		  {'key' : 'IR','value' : 'Intrest On Revenue'},
		  {'key' : 'CHQ','value' : 'Cheque Dis Amt'},
		  {'key' : 'PA','value' : 'Penality Arrears'}
		];
		
		$scope.load_posting_priority_details = function(){
			remote.load("getpaymentadjpriorty", function(response){
				$scope.posting_priority = response.payment_adjustment_priority_details;
				$scope.postingPriorityDetailsGridOptions.data = $scope.posting_priority;
				$scope.postingPriorityDetailsGridOptions.columnDefs[2]['options'] = charge_type_options;
				$scope.postingPriorityDetailsGridOptions.columnDefs[7]['options'] = priority_options;
				$scope.postingPriorityDetailsGridOptions.columnDefs[8]['options'] = priority_options;
			}, {} , 'POST');
		};
		
		$scope.postingPriorityDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			     {field: 'row_num', displayName: '#', width : '4%', hide : true},
			     {field: 'chrg_cd', displayName: 'Charge Code', width : '8%', required: true, numeric: true},
			     {field: 'chrg_typ_descr', displayName: 'Charge Type', field_key : 'chrg_typ', width : '8%', required: true},
			     {field: 'arrs_cd', displayName: 'Arrears Charge Code', width : '12%',  numeric: true},
			     {field: 'chrg_cd_description', displayName: 'Description', width : '20%', required: true, alphanumeric: true},
			     {field: 'priority', displayName: 'Priority', width : '6%', required: true, numeric: true},
			     {field: 'jv_priority', displayName: 'JV Priority', width : '7%', required: true, numeric: true},
			     {field: 'slabs_flg_descr', displayName: 'Slabs Flag', field_key : 'slabs_flg', width : '7%', required: true},
			     {field: 'rbt_flg_descr', displayName: 'Rebate Flag', field_key : 'rbt_flg', width : '8%', required: true},
			     {field: 'sign', displayName: 'Sign', width : '4%', required: true},
			     {field: 'userid', displayName: 'User ID', width : '8%', hide : true},
			     {field: 'tmpstp', displayName: 'Time Stamp', width : '13%', hide : true}
			 ],
			 data: [],
             onRegisterApi: function( gridApi ) { 
	             $scope.postingPriorityGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_posting_priority($event,row)" title="Edit"></button></div>';
	             $scope.postingPriorityGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.load_posting_priority_details();
		// add function
		$scope.add_posting_priority = function(e){
			var addPostingPriorityModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add Posting Priority Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		status : 'Y',
			    		sign : '1'
			    	};
			    	
			     				    	
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertpaymentadjustmentpriortydetails", function(response){
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
			        	return $scope.postingPriorityDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			
			addPostingPriorityModalInstance.result.then(function (newRecord) {
				$scope.load_posting_priority_details();
			});
			addPostingPriorityModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-alphanumeric']);
			});
		};
		
		// edit/update function
		$scope.edit_posting_priority = function(e,row){
			var editPostingPriorityModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Posting Priority Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1];
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
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		remote.load("upsertpaymentadjustmentpriortydetails", function(response){
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
			editPostingPriorityModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-alphanumeric']);
			});
		}
		
		$scope.load_posting_priority_details();
	}

	//Cheque Dishoner Penality grid option Started
	if(master_flow === 'cheque_dis_penalty'){
		
		$scope.load_cheque_dishoner_penalty = function(){
			remote.load("getchequepenality", function(response){
				var status_options = [{'key' : 'Y','value' : 'Active'}, {'key' : 'N','value' : 'InActive'}];
				$scope.chequeDisPenaltyDetailsGridOptions.columnDefs[6]['options'] = status_options;
				$scope.chequeDisPenaltyDetailsGridOptions.data = response.chqdis_penalty_master_details;
			}, {} , 'POST');
		};
		
		$scope.chequeDisPenaltyDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			             
			     {field: 'row_num', displayName: 'Sl. No', width : '5%', hide : true},
			     {field: 'id', displayName: 'ID', width : '5%'},
			     {field: 'from_amt', displayName: 'Amount From', width : '15%', required: true, float: true},
			     {field: 'to_amt', displayName: 'Amount Upto', width : '15%', required: true, float: true},
			     {field: 'penality_percentage', displayName: 'Penality(%)', width : '10%', required: true, float: true},
			     {field: 'penality_max_amt', displayName: 'Maximum Amount', width : '15%', required: true, float: true},
			     {field: 'status_description', displayName: 'Status', field_key : 'status',width : '10%', required: true},
			     {field: 'userid', displayName: 'User ID', width : '10%', hide : true},
			     {field: 'tmpstp', displayName: 'Time Stamp', width : '15%', hide : true}
			 ],
			 data: [],
             onRegisterApi: function( gridApi ) { 
	             $scope.chequeDisPenaltyGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_cheque_dis_penalty_details($event,row)" title="Edit"></button></div>';
	             $scope.chequeDisPenaltyGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		
		$scope.load_cheque_dishoner_penalty();
		// add function
		$scope.add_cheque_dis_penalty_details = function(e){
			var addChequeDisPenaltyModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add Cheque Dis Penality Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		status : 'Y'
			    	};
			    	
			     	//loading hide property to fields(add mode)
			    	var hide = [1];
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
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertchequedispenaltymasterDetails", function(response){
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
			        	return $scope.chequeDisPenaltyDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			
				addChequeDisPenaltyModalInstance.result.then(function (newRecord) {
				$scope.load_cheque_dishoner_penalty();
			});
				addChequeDisPenaltyModalInstance.rendered.then(function(){
					webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-float']);
				});
		};
		
		// edit/update function
		$scope.edit_cheque_dis_penalty_details = function(e,row){
			var editChequeDisPenaltyModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Cheque Dis Penality Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
			    		$scope.data.status_description = $('.status_description').find('select').find('option[value="'+$('.status_description').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type
			    		});
			    		remote.load("upsertchequedispenaltymasterDetails", function(response){
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
			editChequeDisPenaltyModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-float']);
			});
		}
		
		$scope.load_cheque_dishoner_penalty();
	}

	//form Contractor Master grid starts
	if(master_flow === 'contractor_master'){
		
		$scope.contractorLicenseNumberTooltipHtml = $sce.trustAsHtml('EX: <br>[%] => ...<br>[ABC] => ABC<br>[ABC%] => ABC...<br>[%ABC] => ...ABC<br>[%ABC%] => ...ABC...');
		$scope.contractorNameTooltipHtml = $sce.trustAsHtml('EX: <br>[%] => ...<br>[ABC] => ABC<br>[ABC%] => ABC...<br>[%ABC] => ...ABC<br>[%ABC%] => ...ABC...');
		
		var $licenseNumber = $('#contractor-licsence-number');
		var $contractorName = $('#contractor-name');
		
		
		$scope.load_contractor_details = function(){
			
			if($licenseNumber.val().trim() == '') {
				$licenseNumber.val('%');
			}
			if($contractorName.val().trim() == '') {
				$contractorName.val('%');
			}
			
			var request = {
					"location_code" : $rootScope.user.location_code,
					"license_number" : $licenseNumber.val().trim(),
					"contractor_name" : $contractorName.val().trim()
				}
				remote.load("getcontractormaster", function(response){
					$scope.contractorMasterDetailsGridOptions.data = response.contractor_master_details;
				}, request , 'POST');
		};
		
		
		$scope.contractorMasterDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			   {field: 'row_num', displayName: '#', width : '5%', hide : true},
			   {field: 'licensce_no', displayName: 'License Number', required: true, alphanumeric: true},
			   {field: 'contr_name', displayName: 'Contractor Name', required: true, alphanumeric: true},
			   {field: 'address1', displayName: 'Address1', required: true, alphanumeric: true},
			   {field: 'address2', displayName: 'Address2', required: true, alphanumeric: true},
			   {field: 'phone_no', displayName: 'Phone Number', required: true, numeric: true},
			   {field: 'email', displayName: 'Email Address'},
			   {field: 'status_description', displayName: 'Status', field_key: 'status', required: true},
			   {field: 'userid', displayName: 'User ID', hide : true},
			   {field: 'tmpstp', displayName: 'Time Stamp', hide : true}
			],
			data: [],
	        onRegisterApi: function( gridApi ) { 
	             $scope.contractorMasterGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_contractor_master_details($event,row)" title="Edit"></button></div>';
	             $scope.contractorMasterGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		var status_options = [{'key' : 'Y','value' : 'Active'}, {'key' : 'N','value' : 'InActive'}];
		$scope.contractorMasterDetailsGridOptions.columnDefs[7]['options'] = status_options;
		
		$scope.contractor_master_clear = function(e){
			$licenseNumber.val('').focus();
			$contractorName.val('');
			$scope.contractorMasterDetailsGridOptions.data = [];
		};
		
		$scope.edit_contractor_master_details = function(e,row){
			var editContractorMasterModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Contractor Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		$scope.data.status_description = $('.status_description').find('select').find('option[value="'+$('.status_description').find('select').val()+'"]').text();
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			location_code : $rootScope.user.location_code,
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertcontractormasterdetails", function(response){
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
			editContractorMasterModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-alphanumeric']);
			});
		}
		$scope.add_contractor_master_details = function(e){
			var addContractorMasterModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add Contractor Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		location_code : $rootScope.user.location_code,
			    		userid : $rootScope.user.user_id,
			    		status: "Y"
			    	};

			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertcontractormasterdetails", function(response){
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
			        	return $scope.contractorMasterDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
				addContractorMasterModalInstance.result.then(function (newRecord) {
				$licenseNumber.val(newRecord.licensce_no);
				$contractorName.val(newRecord.contr_name);
				$scope.load_contractor_details();
			});
				addContractorMasterModalInstance.rendered.then(function(){
					webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-alphanumeric']);
				});	
		};
		
	}


	//form Meter Reader Details grid starts
	if(master_flow === 'meter_reader_master'){
		
		var $omCode = $('#meter-readed-master-om-code');
		var $mrCode = $('#meter-readed-master-mr-code');
		
		//getomcodelist
		var request = {
			"Conn_Type": $rootScope.user.connection_type,
			"Location_Code": $rootScope.user.location_code
		}
		remote.load("getomunitlist", function(response){
			$scope.om_list = response.OM_LIST;
			$scope.meterReaderMasterDetailsGridOptions.columnDefs[1]['options'] = response.OM_LIST;
			console.log('OM_LIST:',response.OM_LIST);
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
		
		$scope.load_meter_reader_details = function(e){
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"om_code" : $omCode.val(),
				"mr_code" : $mrCode.val()
			}
		   console.log("request",request)
		   remote.load("getmeterreaderdetails", function(response){
			   $scope.meterReaderMasterDetailsGridOptions.data = response.meter_reader_details;
		   }, request , 'POST');
		};
		
		
		$scope.meterReaderMasterDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			 {field: 'row_num', displayName: '#', width : '5%', hide: true},
			 {field: 'om_name', displayName: 'O&M Unit', field_key: 'om_cd', width : '18%', required: true},
			 {field: 'mr_cd', displayName: 'MR Code', width : '8%', required: true, alphanumeric: true},
			 {field: 'rdg_day', displayName: 'Reading Day', width : '10%', required: true, numeric: true},
			 {field: 'mr_name', displayName: 'MR Name', width : '12%', required: true, alphanumeric: true},
			 {field: 'mr_description', displayName: 'Description', width : '18%', required: true, alphanumeric: true},
			 {field: 'all_rdg_day', displayName: 'All Reading Days', visible: false, type: 'checkbox'},
			 {field: 'userid', displayName: 'User ID', width : '10%', hide: true},
			 {field: 'tmpstp', displayName: 'Time Stamp', width : '13%', hide: true}
			],
			data: [],
	        onRegisterApi: function( gridApi ) { 
	             $scope.meterReaderDetailsGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_meter_reader_master_details($event,row)" title="Edit"></button></div>';
	             $scope.meterReaderDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.meter_reader_master_clear = function(e){
			$omCode.val('').focus();
			$mrCode.val('');
			$scope.meterReaderMasterDetailsGridOptions.data = [];
		};
		
		$scope.edit_meter_reader_master_details = function(e,row){
			var editMeterReaderDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Meter Reader Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,2,3];
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
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type,
			    			all_rdg_day : ($scope.data.all_rdg_day) ? 'all_days' : 'N'
			    		});
			    		console.log(request);
		    			remote.load("upsertmeterreaderdetails", function(response){
		    				$uibModalInstance.close($scope.data);
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
			editMeterReaderDetailsModalInstance.result.then(function (newRecord) {
				$omCode.val(newRecord.om_cd);
				$scope.MeterReaderCode.push({
					key: newRecord.mr_cd,
					value : newRecord.mr_cd
				});
				$timeout(function(){
					$mrCode.val(newRecord.mr_cd);
					$scope.load_meter_reader_details();
				});
			});
			editMeterReaderDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-alphanumeric']);
			});	
		}
		$scope.add_meter_reader_master_details = function(e){
			var addMeterReaderDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add Meter Reader Details";
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
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type,
			    			all_rdg_day : ($scope.data.all_rdg_day) ? 'all_days' : 'N'
			    		});
		    			remote.load("upsertmeterreaderdetails", function(response){
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
			        	return $scope.meterReaderMasterDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addMeterReaderDetailsModalInstance.result.then(function (newRecord) {
				$omCode.val(newRecord.om_cd);
				$scope.MeterReaderCode.push({
					key: newRecord.mr_cd,
					value : newRecord.mr_cd
				});
				$timeout(function(){
					$mrCode.val(newRecord.mr_cd);
					$scope.load_meter_reader_details();
				});
			});
			addMeterReaderDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric','web-alphanumeric']);
			});
		};
		
	}
	
	if(master_flow === 'pre_dominant_master'){

		$scope.pre_dominant_master_details = [];
		
		$scope.load_pre_diminant_master_details = function(e){
			var request = {
					"location_code" : $rootScope.user.location_code,					
					"date" : $scope.preDominantMasterMonthYear
				}
				remote.load("getpredominantdetails", function(response){
					$scope.pre_dominant_master_details = response.pre_dominant_details;
					$scope.preDominantMasterDetailsGridOptions.data = $scope.pre_dominant_master_details;
				}, request , 'POST');
		};
		
		
		$scope.preDominantMasterDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
			 {field: 'row_num', displayName: '#', width : '5%'},
			 {field: 'station_name', displayName: 'Station', width : '23%'},
			 {field: 'feeder_name', displayName: 'Feeder', width : '25%'},
			 {field: 'no_of_intls', displayName: 'Installation Count', width : '12%'},
			 {field: 'units', displayName: 'Pre-Dominant Units', width : '12%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input units" station_cd="{{row.entity.station_cd}}" feeder_cd="{{row.entity.feeder_cd}}" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
			 {field: 'userid', displayName: 'User ID', width : '10%'},
			 {field: 'tmpstp', displayName: 'Time Stamp', width : '13%'}
			],
			data: []
		};
		
		$scope.hitTab = function(e){
			if(e.which === 13){
				var $el = $(e.target);
				$el.closest('.ui-grid-row').next('.ui-grid-row').find('.units').focus();
			}
		}
		
		$scope.save_pre_diminant_master = function(){
			var $rows_edited = $('#master').find('#preDominantMasterDetailsGrid').find('.units.ng-dirty');
			if(!$rows_edited.length){
				notify.warn('No changes to save');
				return;
			}
			var rows_to_update = [];
			$rows_edited.each(function( key, el){
				var $el = $(el);
				if($el.val()){
					rows_to_update.push({
						station : $el.attr('station_cd'),
						feeder : $el.attr('feeder_cd'),
						units : $el.val()
						
					});
				}
			});
			var request = {
				location_code : $rootScope.user.location_code,
    			userid : $rootScope.user.user_id,
    			conn_type : $rootScope.user.connection_type,
    			month : $scope.preDominantMasterMonthYear,
    			data : rows_to_update
    		};
			
    		console.log(request);
    		remote.load("upsertpredominantdetails", function(response){
    			//$rows_edited.removeClass('ng-dirty');
    			$scope.preDominantMasterDetailsForm.$setPristine();
    			$scope.load_pre_diminant_master_details();
			}, request ,'POST');
		}
		
		$scope.pre_dominant_master_clear = function(e){
			$scope.pre_dominant_master_details = [];
			$('.pre-dominant-master-details').val('');
			$scope.preDominantMasterDetailsGridOptions.data = [];
			$scope.$apply();
		};
	}
	
	if(master_flow === 'appeal_amount'){
		
		$scope.apealAmountDetailsRRNoTooltipHtml = $sce.trustAsHtml('EX: <br>[%] => ...<br>[ABC] => ABC<br>[ABC%] => ABC...<br>[%ABC] => ...ABC<br>[%ABC%] => ...ABC...');
		var $rrNo = $('#appeal-amount-rr-number');
		var $slNo = $('#appeal-amount-serial-number');
		var $type = $('#appeal-amount-type');
		
		
		//load Apeal Types
    	var request = {
			conn_type : $rootScope.user.connection_type,
			code_type : 'APEAL_TYPE'
		}
		remote.load("getcodedetailsfordropdowns", function(response){
			$scope.ApealTypeList = response.CodeDetailsDropDownList;
			$scope.appealAmountDetailsGridOptions.columnDefs[4]['options'] = response.CodeDetailsDropDownList;
		}, request , 'POST');
    	
		$scope.load_appeal_amount_details = function(e){
			if($rrNo.val().trim() == '') {
				$rrNo.val('%');
			}
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"rr_number": $rootScope.user.location_code + $rrNo.val().trim(),
				"serial_number" : $slNo.val().trim(),
				"charge_code" : $type.val()
			}
			console.log("request:",request)
			$scope.appealAmountDetailsGridOptions.data = [];
			remote.load("getappealamount", function(response){
				$scope.appealAmountDetailsGridOptions.data = response.appeal_amount_details;
			}, request , 'POST');
		};

		$scope.appealAmountDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			 {field: 'row_num', displayName: '#', width : '5%', hide: true},
			 {field: 'rr_no', displayName: 'RR Number', width : '10%', required: true},
			 {field: 'sl_no', displayName: 'Serial Number', width : '10%'},
			 {field: 'tariff', displayName: 'Tariff', width : '10%', hide: true},
			 {field: 'appl_cd_description', field_key: 'appl_cd', displayName: 'Type', width : '10%', required: true},
			 {field: 'from_dt', displayName: 'From Date', width : '10%', type : 'date', required: true},
			 {field: 'to_dt', displayName: 'To Date', width : '10%', type : 'date'},
			 {field: 'amt', displayName: 'Amount', width : '8%', required: true, float: true},
			 {field: 'pre_dep_amt', displayName: 'Pre-Deposit Amount', width : '12%', required: true, float: true},
			 {field: 'rcpt_no', displayName: 'Receipt Number', width : '10%'},
			 {field: 'rcpt_dt', displayName: 'Receipt Date', width : '10%', type : 'date'},
			 {field: 'appl_cd_by', displayName: 'Applied By', width : '8%'},
			 {field: 'appl_disp_by', displayName: 'Case Status', width : '10%'},
			 {field: 'remarks', displayName: 'Remarks', width : '15%'},
			 {field: 'userid', displayName: 'User ID', width : '10%', hide: true},
			 {field: 'tmpstp', displayName: 'Time Stamp' , width : '13%', hide: true}
			],
			data: [],
	        onRegisterApi: function( gridApi ) { 
	             $scope.apealAmountDetailsGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_appeal_amount_details($event,row)" title="Edit"></button></div>';
	             $scope.apealAmountDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.appeal_amount_grid_clear = function(e){
			$rrNo.val('').focus();
			$slNo.val('');
			$type.val('');
			$scope.appealAmountDetailsGridOptions.data = [];
		};
		
		$scope.edit_appeal_amount_details = function(e,row){
			var editApealAmountDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Apeal Amount Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,2,5];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
			    		$scope.data.appl_cd_description = $('.appl_cd_description').find('select').find('option[value="'+$('.appl_cd_description').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
		    			remote.load("upsertapealamountdetails", function(response){
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
			editApealAmountDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-float']);
			});
		}
		$scope.add_appeal_amount_details = function(e){
			var addApealAmountDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add Apeal Amount Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
		    			from_dt : $filter('date')(new Date(), 'dd/MM/yyyy')
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
						
			    		$scope.data.appl_cd_description = $('.appl_cd_description').find('select').find('option[value="'+$('.appl_cd_description').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type,
			    			rr_no : $rootScope.user.location_code + $scope.data.rr_no
			    		});
		    			remote.load("upsertapealamountdetails", function(response){
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
			        	return $scope.appealAmountDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addApealAmountDetailsModalInstance.result.then(function (newRecord) {
				$rrNo.val(newRecord.rr_no);
				$slNo.val(newRecord.sl_no);
				$type.val(newRecord.appl_cd);
				$scope.load_appeal_amount_details();
			});
			addApealAmountDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-float']);
			});
		};
		
	}
	
	if(master_flow === 'designation_details'){
		
		var $designation_type = $('#designation-type');
		
		//load Desination Types
    	var request = {
			conn_type : $rootScope.user.connection_type,
			code_type : 'DESG_TYPE'
		}
		remote.load("getcodedetailsfordropdowns", function(response){
			$scope.DesignationTypeList = response.CodeDetailsDropDownList;
			
			$scope.designationDetailsGridOptions.columnDefs[3]['options'] = response.CodeDetailsDropDownList;
			
			var status_options = [{'key' : 'N','value' : 'Active'}, {'key' : 'Y','value' : 'InActive'}];
			$scope.designationDetailsGridOptions.columnDefs[4]['options'] = status_options;
			
		}, request , 'POST');
    	
		$scope.load_designation_details = function(e){
			var request = {
				"designation_type": (($designation_type.val()) ? $designation_type.val() : ''),
				conn_type : $rootScope.user.connection_type
			}
			console.log("request:",request)
			$scope.designationDetailsGridOptions.data = [];
			remote.load("getdesignationdetails", function(response){
			$scope.designationDetailsGridOptions.data = response.designation_details;
			}, request , 'POST');
		};

		$scope.designationDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			 {field: 'row_num', displayName: '#', width : '4%', hide: true},
			 {field: 'dsg_cd', displayName: 'Code', width : '10%', required: true},
			 {field: 'dsg_descr', displayName: 'Description', width : '35%', required: true},
			 {field: 'dsg_categ_description', displayName: 'Type', field_key: 'dsg_categ', width : '10%', required: true},
			 {field: 'dsg_del_flg_descr', displayName: 'Status', field_key: 'dsg_del_flg', width : '10%', required: true},
			 {field: 'userid', displayName: 'User ID', width : '10%', hide: true},
			 {field: 'tmpstp', displayName: 'Time Stamp' , width : '16%', hide: true}
			],
			data: [],
	        onRegisterApi: function( gridApi ) { 
	             $scope.designationDetailsGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_designation_details($event,row)" title="Edit"></button></div>';
	             $scope.designationDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		$scope.designation_details_clear = function(e){
			$designation_type.val('').focus();
			$scope.designationDetailsGridOptions.data = [];
		};
		
		$scope.edit_designation_details = function(e,row){
			var editDesignationDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Designation Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,2];
			    	for(var i=0; i< readOnly.length;i++){
			    		$scope.configs[readOnly[i]]['readOnly'] = true;
			    	}
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
			    		$scope.data.dsg_categ_description = $('.dsg_categ_description').find('select').find('option[value="'+$('.dsg_categ_description').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertdesignationdetails", function(response){
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
			editDesignationDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric']);
			});
		}
		$scope.add_designation_details = function(e){
			var addDesignationDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote, notify){
			    	$scope.header = "Add Designation Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		dsg_del_flg : 'N'
			    	};
			    	
			    	$scope.ok = function(){
			    		
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
						
						$scope.data.dsg_categ_description = $('.dsg_categ_description').find('select').find('option[value="'+$('.dsg_categ_description').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    		});
		    			remote.load("upsertdesignationdetails", function(response){
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
			        	return $scope.designationDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addDesignationDetailsModalInstance.result.then(function (newRecord) {
				$designation_type.val(newRecord.dsg_categ);
				$scope.load_designation_details();
			});
			addDesignationDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-numeric']);
			});
		};
		
	}
	
	if(master_flow === 'hhd_down_and_upload_view'){
		
		$scope.load_download_and_upload_view = function(){
			if(!$scope.rr_number || !$scope.bill_date || !$scope.view_type){
				notify.warn('All fields are mandatory...');
				return;
			}
			$scope['load_' + $scope.view_type + '_details']();
		}
    	
		$scope.load_download_details = function(){
			var request = {
				rr_number: $scope.rr_number,
				bill_date: $scope.bill_date,
				conn_type : $rootScope.user.connection_type,
				location_code : $rootScope.user.location_code
			}
			$scope.hhdDownloadAndUploadViewGridOptions.data = [];
			remote.load("gethhdddownloaddetails", function(response){
				$scope.hhdDownloadAndUploadViewGridOptions.data = response.hhd_download_details;
			}, request , 'POST');
		};
		
		$scope.load_upload_details = function(){
			var request = {
				rr_number: $scope.rr_number,
				bill_date: $scope.bill_date,
				conn_type : $rootScope.user.connection_type,
				location_code : $rootScope.user.location_code
			}
			$scope.hhdDownloadAndUploadViewGridOptions.data = [];
			remote.load("gethhdduploaddetails", function(response){
				$scope.hhdDownloadAndUploadViewGridOptions.data = response.hhd_upload_details;
			}, request , 'POST');
		};

		$scope.hhdDownloadAndUploadViewGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
			     {field: 'row_num', displayName: '#', width : '4%', hide: true},
				 {field: 'field', displayName: 'Field', width : '40%', required: true},
				 {field: 'value', displayName: 'Value', width : '56%', required: true}
			],
			data: []
		};
		
		$scope.hhd_down_and_upload_view_clear = function(e){
			$scope.rr_number = '';
			$scope.bill_date = '';
			$scope.view_type = '';
			$designation_type.val('').focus();
			$scope.hhdDownloadAndUploadViewGridOptions.data = [];
		};
	}
	
}]);