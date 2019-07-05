var user_controller = angular.module('user_controller',[]);

user_controller.controller('user_controller',['$scope','$rootScope','remote','$timeout','$compile','$uibModal','notify','$filter','webValidations',function($scope,$rootScope,remote,$timeout,$compile,$uibModal,notify,$filter,webValidations){
	var user_controller_flow = $rootScope.breadcrumb[$rootScope.breadcrumb.length-1];
	
	//User Roles Grid starts
	if(user_controller_flow === 'user_roles'){
		
		$scope.load_user_roles_details = function(){
			remote.load("getuserroles", function(response){
				var status_options = [{'key' : 'Y','value' : 'Active'}, {'key' : 'N','value' : 'InActive'}];
				$scope.userRolesDetailsGridOptions.columnDefs[3]['options'] = status_options;
				$scope.userRolesDetailsGridOptions.data = response.user_roles_details;
			}, {conn_type : $rootScope.user.connection_type} , 'POST');
		};
		
		$scope.load_user_roles_details();	
		
		$scope.userRolesDetailsGridOptions = {
			showGridFooter: true,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
	             {field: 'row_num', displayName: '#', width : '5%', hide : true },
	             {field: 'role_cd', displayName: 'Role Code', required: true},
	             {field: 'role_description', displayName: 'Role Description', required: true},
	             {field: 'role_sts_description', displayName: 'Status', field_key: 'role_sts', required: true},
	             {field: 'userid', displayName: 'User ID', hide : true},
	             {field: 'tmpstp', displayName: 'TimeStamp', hide : true}
            ],
            data: [],
 	        onRegisterApi: function( gridApi ) {
	             $scope.userRoleDetailsGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_user_role_details($event,row)" title="Edit"></button></div>';
	             $scope.userRoleDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
				
		$scope.edit_user_role_details = function(e,row){
			var editUserRoleDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit User Role Details";
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
			    		
			    		$scope.data.role_sts_description = $('.role_sts_description').find('select').find('option[value="'+$('.role_sts_description').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    		});
		    			remote.load("upsertuserroles", function(response){
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
			editUserRoleDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required']);
			});
		}
		$scope.add_user_role_details = function(e){
			var addUserRoleDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add User Role Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		role_sts : 'Y'
			    	};
			    	
			    	$scope.ok = function(){

			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditForm.$error)){
							return;
						}
			    		
			    		$scope.data.role_sts_description = $('.role_sts_description').find('select').find('option[value="'+$('.role_sts_description').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			conn_type : $rootScope.user.connection_type
			    			
			    		});
		    			remote.load("upsertuserroles", function(response){
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
			        	return $scope.userRolesDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addUserRoleDetailsModalInstance.result.then(function (newRecord) {
				$scope.load_user_roles_details();
			});
			addUserRoleDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required']);
			});
		};
	}
	
	//User Master Grid starts
	if(user_controller_flow === 'user_master'){
		
		remote.load("getuserroles", function(response){
			$scope.userMasterDetailsGridOptions.columnDefs[5]['options'] = response.user_roles_details;
		}, { conn_type : $rootScope.user.connection_type } , 'POST');
		
		
		$scope.load_user_master_details = function(){
			remote.load("getusermasterdetails", function(response){
				var status_options = [{'key' : 'Y','value' : 'Active'}, {'key' : 'N','value' : 'InActive'}];
				$scope.userMasterDetailsGridOptions.columnDefs[10]['options'] = status_options;
				var db_options = [{'key' : 'LT','value' : 'Low Tention'}, {'key' : 'HT','value' : 'High Tention'}];
				$scope.userMasterDetailsGridOptions.columnDefs[9]['options'] = db_options;
				$scope.userMasterDetailsGridOptions.data = response.user_master_details;
			}, {location_code: $rootScope.user.location_code,conn_type : $rootScope.user.connection_type} , 'POST');
		};
		
		$scope.load_user_master_details();	

		
		$scope.userMasterDetailsGridOptions = {
				showGridFooter: true,
				enableFiltering: false,
				enableCellEdit: false,
				columnDefs: [
		             {field: 'row_num', displayName: '#', width : '4%',hide : true},
		             {field: 'user_id', displayName: 'User ID', width : '10%', required: true},
		             {field: 'user_name', displayName: 'User Name', width : '20%', required: true},
		             {field: 'password', displayName: 'Password', visible: false, required : true},
		             {field: 'confirm_password', displayName: 'Confirm Password', visible: false, required : true},
		             {field: 'user_role_description', displayName: 'Role', field_key : 'user_role', width : '15%', required : true},
		             {field: 'user_email', displayName: 'Email', width : '15%', required : true, email : true},
		             {field: 'user_valid_from', displayName: 'Valid From', type : 'date', minDate :'+0D', width : '8%', required : true},
		             {field: 'user_valid_upto', displayName: 'Valid Upto', type : 'date', width : '8%'},
		             {field: 'user_db_setup_description', displayName: 'DB Assigned', field_key : 'user_db_setup', width : '8%'},
		             {field: 'user_status_description', displayName: 'Status', field_key: 'user_status', width : '8%'}
		             ],
		             data: [],
		  	        onRegisterApi: function( gridApi ) {
			             $scope.userMasterDetailsGridApi = gridApi;
			             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_user_master_details($event,row)" title="Edit"></button></div>';
			             $scope.userMasterDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
			             var deleteCellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-trash" ng-click="grid.appScope.delete_user_master_details($event,row.entity)" title="Delete"></button></div>';
				         $scope.userMasterDetailsGridApi.core.addRowHeaderColumn({ name: 'Delete', displayName: '', width: '3%', cellTemplate: deleteCellTemplate } );
			        }
				};
		
				$scope.delete_user_master_details = function(e,row){
					
					var request =  {
		    			id: row.id,
		    			user_id: row.user_id,
		    			location_code: $rootScope.user.location_code,
		    			userid : $rootScope.user.user_id,
		    			conn_type : $rootScope.user.connection_type
		    		};
	    			remote.load("deleteusermaster", function(response){
	    				$scope.load_user_master_details();
	    			}, request ,'POST');
				};
						
				$scope.edit_user_master_details = function(e,row){
					var editUserMasterDetailsModalInstance = $uibModal.open({
						animation: true,
						backdrop: 'static',
						keyboard: false,
					    templateUrl: templates.modal.edit,
					    controller: function($scope, $uibModalInstance, configs, data, remote){
					    	var data_backup =  angular.copy(data);
					    	$scope.header = "Edit User Details";
					    	$scope.ok_text = "Update";
					    	$scope.configs = angular.copy(configs);
					    	
					    	$scope.data = data;
					    	//loading readOnly property to fields(edit mode)
					    	var readOnly = [1,2,5,7,9];
					    	for(var i=0; i< readOnly.length;i++){
					    		$scope.configs[readOnly[i]]['readOnly'] = true;
					    	}
					    	
					    	$scope.ok = function(){
					    		
					    		$scope.$broadcast('required-check-validity');
								if(!$.isEmptyObject($scope.addEditForm.$error)){
									return;
								}
					    		$scope.data.user_status_description = $('.user_status_description').find('select').find('option[value="'+$('.user_status_description').find('select').val()+'"]').text();
				    			var request = angular.copy($scope.data);
					    		angular.extend(request, {
					    			option : 'UPDATE',
					    			location_code: $rootScope.user.location_code,
					    			userid : $rootScope.user.user_id,
					    			conn_type : $rootScope.user.connection_type,
					    		});
				    			remote.load("upsertusermaster", function(response){
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
					editUserMasterDetailsModalInstance.rendered.then(function(){
						webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-email']);
					});
				}
				$scope.add_user_master_details = function(e){
					var addUserMasterDetailsModalInstance = $uibModal.open({
						animation: true,
						backdrop: 'static',
						keyboard: false,
					    templateUrl: templates.modal.add,
					    controller: function($scope, $uibModalInstance, configs, remote){
					    	$scope.header = "Add User Details";
					    	$scope.ok_text = "Add";
					    	$scope.configs = configs;
					    	$scope.data = {
					    		userid : $rootScope.user.user_id,
					    		user_status : 'Y',
					    		user_valid_from :  $filter('date')(new Date(), 'dd/MM/yyyy'),
					    		user_db_setup : 'LT'
					    	};
					    	
					    	$scope.ok = function(){
					    		
					    		$scope.$broadcast('required-check-validity');
								if(!$.isEmptyObject($scope.addEditForm.$error)){
									return;
								}
					    		$scope.data.user_status_description = $('.user_status_description').find('select').find('option[value="'+$('.user_status_description').find('select').val()+'"]').text();
				    			var request = angular.copy($scope.data);
					    		angular.extend(request, {
					    			option : 'ADD',
					    			location_code: $rootScope.user.location_code,
					    			conn_type : $rootScope.user.connection_type
					    		});
				    			remote.load("upsertusermaster", function(response){
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
					        	return $scope.userMasterDetailsGridOptions.columnDefs;
					        },
					        remote: function(){
					        	return remote;
					        }
					    }
					});
					addUserMasterDetailsModalInstance.result.then(function (newRecord) {
						$scope.load_user_master_details();
					});
					addUserMasterDetailsModalInstance.rendered.then(function(){
						webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-email']);
					});
				};
			}
	
	//User Session Grid starts
	if(user_controller_flow === 'user_session_details'){

		$scope.user_session_details = [];
		
		$scope.load_user_session_details = function(){
			remote.load("getusersessiondetails", function(response){
				$scope.userSessionDetailsGridOptions.data = [];
				$scope.user_session_details = response.user_session_details;
				$scope.userSessionDetailsGridOptions.data = $scope.user_session_details;
			}, {
				"location_code": $rootScope.user.location_code
			} , 'POST');
		}
	
		$scope.load_user_session_details();
		
		$scope.userSessionDetailsGridOptions = {
			showGridFooter: true,
			enableFiltering: false,
			enableCellEdit: false,
			columnDefs: [
	             {field: 'row_num', displayName: 'Sl. No'},
	             {field: 'session_id', displayName: 'Session ID'},
	             {field: 'user_id', displayName: 'User ID'},
	             {field: 'login_tmpstp', displayName: 'Login Time Stamp'},
	             {field: 'logout_tmpstp', displayName: 'Logout Time Stamp'},
	             {field: 'login_ip_addrs', displayName: 'IP Address'},
	             {field: 'mac_addrs', displayName: 'MAC Address'},
	             {field: 'logout_sts', displayName: 'Logout Status'}
             ],
             data: [],
             onRegisterApi : function(gridApi){
             	$scope.gridApi = gridApi;
             }
		};
		
		$scope.update_user_session_details = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select user sessions to update...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				userid : $rootScope.user.user_id,
				data: selected_rows
			};
			remote.load("updateusersessions", function(response){
				$scope.load_user_session_details();
			}, request, 'POST');
		}
		
	}
	
	//change password
	if(user_controller_flow === 'change_password'){
		
		$scope.clear = function(){
			delete $scope.old_password;
			delete $scope.new_password
			delete $scope.new_password_confirm;
		}
		
		$scope.change_password = function(){
			
			if(!$scope.old_password || !$scope.new_password || !$scope.new_password_confirm){
				notify.warn("All fields are mandatory...");
				return;
			}
			
			if($scope.new_password != $scope.new_password_confirm){
				notify.warn("Confirm password doesn't match with New Password. Recheck the password you have entered...");
				$('#newPasswordConfirm').focus();
				return;
			}
			remote.load("changepassword", function(response){
				alert('Login again to complete the change password process...');
				$rootScope.logout();
			}, {
				location_code: $rootScope.user.location_code,
				userid: $rootScope.user.user_id,
				old_password: $scope.old_password,
				new_password: $scope.new_password
			} , 'POST');
		}
		
	}
	
	//delegate user
	if(user_controller_flow === 'delegate_user'){

		$scope.user_deligation_details = [];
		
		remote.load("getUserIdList", function(response){
			console.log("response.USERID_LIST",response.USERID_LIST);
			$scope.USERID_LIST = response.USERID_LIST;
			$scope.userDeligationDetailsGridOptions.columnDefs[1]['options'] = response.USERID_LIST;
		}, { conn_type : $rootScope.user.connection_type,location_code : $rootScope.user.location_code } , 'POST');
		
		$scope.load_user_deligation_details = function(){
			remote.load("getuserdeligationdetails", function(response){
				$scope.userDeligationDetailsGridOptions.data = [];
				$scope.user_deligation_details = response.user_deligation_details;
				$scope.userDeligationDetailsGridOptions.data = $scope.user_deligation_details;
			}, {
				"location_code": $rootScope.user.location_code
			} , 'POST');
		}
	
		$scope.load_user_deligation_details();
		
		$scope.userDeligationDetailsGridOptions = {
				showGridFooter: true,
				enableFiltering: false,
				enableCellEdit: false,
				columnDefs: [
	             {field: 'row_num', displayName: 'Sl. No',width : '4%', hide: true},
	             {field: 'user_descr', displayName: 'User ID',field_key : 'user_id',  required: true},
	             {field: 'user_name', displayName: 'User Name', required: true},
	             {field: 'user_role', displayName: 'User Role', required: true},
	             {field: 'deligated_role', displayName: 'Deligated Role', required: true},
	             {field: 'from_dt', displayName: 'From Date', type : 'date', required: true},
	             {field: 'to_dt', displayName: 'To Date', type : 'date'},
	             {field: 'deligated_by', displayName: 'Deligated By', hide: true},
	             {field: 'deligated_on', displayName: 'Deligated On', hide: true},
	             {field: 'deligation_updated_on', displayName: 'Deligation Updated On', hide: true}
	             
             ],
             data: [],
	        onRegisterApi: function( gridApi ) {
             $scope.userDeligationDetailsGridApi = gridApi;
             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_user_deligation($event,row)" title="Edit"></button></div>';
             $scope.userDeligationDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
             }
	};

				
	$scope.edit_user_deligation = function(e,row){
		var editUserDeligationDetailsModalInstance = $uibModal.open({
			animation: true,
			backdrop: 'static',
			keyboard: false,
		    templateUrl: templates.modal.edit,
		    controller: function($scope, $uibModalInstance, configs, data, remote){
		    	var data_backup =  angular.copy(data);
		    	$scope.header = "Update User Deligation";
		    	$scope.ok_text = "Update";
		    	$scope.configs = angular.copy(configs);
		    	
		    	$scope.data = data;
		    	//loading readOnly property to fields(edit mode)
		    	/*var readOnly = [1,2,5,7,9];
		    	for(var i=0; i< readOnly.length;i++){
		    		$scope.configs[readOnly[i]]['readOnly'] = true;
		    	}*/
		    	
		    	$scope.ok = function(){
		    		
		    		$scope.$broadcast('required-check-validity');
					if(!$.isEmptyObject($scope.addEditForm.$error)){
						return;
					}
		    		//$scope.data.user_status_description = $('.user_status_description').find('select').find('option[value="'+$('.user_status_description').find('select').val()+'"]').text();
	    			var request = angular.copy($scope.data);
		    		angular.extend(request, {
		    			option : 'UPDATE',
		    			location_code: $rootScope.user.location_code,
		    			userid : $rootScope.user.user_id,
		    			conn_type : $rootScope.user.connection_type,
		    		});
	    			remote.load("upsertuserdeligation", function(response){
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
		editUserDeligationDetailsModalInstance.rendered.then(function(){
			webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-email']);
		});
	}
	$scope.add_user_deligation = function(e){
		var addUserDeligationDetailsModalInstance = $uibModal.open({
			animation: true,
			backdrop: 'static',
			keyboard: false,
		    templateUrl: templates.modal.add,
		    controller: function($scope, $uibModalInstance, configs, remote){
		    	$scope.header = "Add User Deligation";
		    	$scope.ok_text = "Deligate";
		    	$scope.configs = configs;
		    	$scope.data = {
		    		userid : $rootScope.user.user_id,
		    		from_dt :  $filter('date')(new Date(), 'dd/MM/yyyy'),
		    		user_db_setup : 'LT'
		    	};
		    	
		    	$scope.ok = function(){
		    		
		    		$scope.$broadcast('required-check-validity');
					if(!$.isEmptyObject($scope.addEditForm.$error)){
						return;
					}
		    		//$scope.data.user_status_description = $('.user_status_description').find('select').find('option[value="'+$('.user_status_description').find('select').val()+'"]').text();
	    			var request = angular.copy($scope.data);
		    		angular.extend(request, {
		    			option : 'ADD',
		    			location_code: $rootScope.user.location_code,
		    			conn_type : $rootScope.user.connection_type,
		    			deligated_by : $rootScope.user.user_id
		    		});
	    			remote.load("upsertuserdeligation", function(response){
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
		        	return $scope.userDeligationDetailsGridOptions.columnDefs;
		        },
		        remote: function(){
		        	return remote;
		        }
		    }
		});
		addUserDeligationDetailsModalInstance.result.then(function (newRecord) {
			$scope.load_user_deligation_details();
		});
		addUserDeligationDetailsModalInstance.rendered.then(function(){
			webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-email']);
		});
	};
	}
	
}]);