var energy_audit_controller = angular.module('energy_audit_controller',[]);

energy_audit_controller.controller('energy_audit_controller',['$scope','$rootScope','remote','$filter','webValidations','notify','$uibModal',function($scope,$rootScope,remote,$filter,webValidations,notify,$uibModal){
	
	var energy_audit_flow = $rootScope.breadcrumb[$rootScope.breadcrumb.length-1];
	
	if(energy_audit_flow === 'transformer_meter_master'){
		
		
		$omCode = $('#transformer-meter-master-om-code');
		$stationCode = $('#transformer-meter-master-station-code');
		$feederCode = $('#transformer-meter-master-feeder-code');
		$transformerCode = $('#transformer-meter-master-transformer-code');
		
		
		
		//getomcodelist
		var request = {
			"Conn_Type": $rootScope.user.connection_type,
			"Location_Code": $rootScope.user.location_code
		}
		remote.load("getomunitlist", function(response){
			$scope.om_list = response.OM_LIST;
			$scope.transformerMeterMasterDetailsGridOptions.columnDefs[3]['options'] = response.OM_LIST;
		}, request , 'POST', false, false, true);
		
		//getstationlist
		var request = {
			"conn_type": $rootScope.user.connection_type,
			"location": $rootScope.user.location_code
		}
		remote.load("getStationList", function(response){
			$scope.StationCodeList = response.StationCodeList;
			$scope.transformerMeterMasterDetailsGridOptions.columnDefs[1]['options'] = response.StationCodeList;
		}, request , 'POST');
		
		$scope.get_feeder_info = function(){
			var request = {
				"stationCode": $scope.StationCode,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getFeederList", function(response){
				$scope.FeederCodeList = response.FeederCodeList;
				$scope.transformerMeterMasterDetailsGridOptions.columnDefs[2]['options'] = response.FeederCodeList;
			}, request , 'POST');
		}	
		
		$scope.get_transformer_info = function(){
			var request = {
				"stationCode": $scope.StationCode,
				"feederCode": $scope.FeederCode,
				"location": (($omCode.val()) ? $omCode.val() : $rootScope.user.location_code), 
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getTransformerList", function(response){
				$scope.TransformerCodeList = response.TransformerCodeList;
				$scope.transformerMeterMasterDetailsGridOptions.columnDefs[4]['options'] = response.TransformerCodeList;
			}, request , 'POST');
		}
		
		//load meter make details
    	var request = {
			conn_type : $rootScope.user.connection_type,
			code_type : 'MTR_MAKE'
		}
		remote.load("getcodedetailsfordropdowns", function(response){
			$scope.transformerMeterMasterDetailsGridOptions.columnDefs[6]['options'] = response.CodeDetailsDropDownList;
		}, request , 'POST');
    	
    	//load meter type
    	var request = {
			conn_type : $rootScope.user.connection_type,
			code_type : 'MTR_TYP'
		}
		remote.load("getcodedetailsfordropdowns", function(response){
			$scope.transformerMeterMasterDetailsGridOptions.columnDefs[7]['options'] = response.CodeDetailsDropDownList;
		}, request , 'POST');
    	
    	//load meter phase
    	var request = {
			conn_type : $rootScope.user.connection_type,
			code_type : 'REQ_PHASE'
		}
		remote.load("getcodedetailsfordropdowns", function(response){
			$scope.transformerMeterMasterDetailsGridOptions.columnDefs[8]['options'] = response.CodeDetailsDropDownList;
		}, request , 'POST');
    	
    	//load votage
    	var request = {
			conn_type : $rootScope.user.connection_type,
			code_type : 'REQ_VOLTAGE'
		}
		remote.load("getcodedetailsfordropdowns", function(response){
			$scope.transformerMeterMasterDetailsGridOptions.columnDefs[9]['options'] = response.CodeDetailsDropDownList;
		}, request , 'POST');
	
		$scope.load_transformer_meter_master_details = function(e){
			var request = {
				"conn_type": $rootScope.user.connection_type,	
				"location_code" : $rootScope.user.location_code,					
				"station_code": (($stationCode.val()) ? $stationCode.val() : ''),
				"feeder_code" : (($feederCode.val()) ? $feederCode.val() : ''),
				"om_code" : (($omCode.val()) ? $omCode.val() : ''),
				"dtc_code" : (($transformerCode.val()) ? $transformerCode.val() : '')
			}
			console.log(request);
			remote.load("getdtcmetermaster", function(response){
				$scope.transformerMeterMasterDetailsGridOptions.data = response.dtc_meter_master_details;
			}, request , 'POST');
		};

		$scope.transformerMeterMasterDetailsGridOptions = {
			showGridFooter: true,
			columnDefs: [
				{field: 'row_num', displayName: '#', width : '4%', hide : true},
				{field: 'stn_name', displayName: 'Station', field_key : 'stn_cd', width : '12%', required: true},
				{field: 'fdr_name', displayName: 'Feeder', field_key : 'fdr_cd', width : '12%', required: true},
				{field: 'om_name', displayName: 'O&M Unit', field_key : 'om_cd', width : '12%', required: true},
				{field: 'dtc_name', displayName: 'Transformer', field_key : 'dtc_cd', width : '12%', required: true},
				{field: 'dtc_sl_no', displayName: 'Mtr Sl.No', width : '8%', required: true, alphanumeric: true},
				{field: 'dtc_mtr_make_descr', displayName: 'Mtr Make', field_key : 'dtc_mtr_make', width : '8%', required: true},
				{field: 'dtc_mtr_type_descr', displayName: 'Mtr Type', field_key : 'dtc_mtr_type', width : '10%', required: true},
				{field: 'no_of_ph_descr', displayName: 'Phase', field_key : 'no_of_ph', width : '9%', required: true},
				{field: 'mtr_volt_descr', displayName: 'Voltage', field_key : 'mtr_volt', width : '6%', required: true},
				{field: 'mtr_amp', displayName: 'Amps', width : '6%', required: true, numeric: true},
				{field: 'assign_dt', displayName: 'Assign Date', width : '8%', type : 'date', required: true},
				{field: 'release_dt', displayName: 'Release Date', width : '9%', type : 'date'},
				{field: 'init_rdg', displayName: 'Initial Rdg', width : '8%', required: true, float: true},
				{field: 'final_rdg', displayName: 'Final Rdg', width : '8%'},
				{field: 'ct_ratio', displayName: 'CT Ratio', width : '6%', required: true},
				{field: 'mult_const', displayName: 'Mtr Const', width : '7%', required: true, numeric: true},
				{field: 'max_mtr_no', displayName: 'Max Rdg', width : '8%', required: true, float: true},
				{field: 'mtr_sts_descr', displayName: 'Status', field_key : 'mtr_sts', width : '6%', required: true},
				{field: 'remarks', displayName: 'Remarks', width : '15%'},
				{field: 'userid', displayName: 'User ID', width : '10%', hide : true},
				{field: 'tmpstp', displayName: 'Time Stamp', width : '13%', hide : true}

	        ],
	        data: [],
	        onRegisterApi: function( gridApi ) { 
	             $scope.transformerMeterMasterDetailsGridApi = gridApi;
	             var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_transformer_meter_master_details($event,row)" title="Edit"></button></div>';
	             $scope.transformerMeterMasterDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		
		
		// meter status
		var meter_status_options = [{'key' : 'Y','value' : 'Active'},{'key' : 'N','value' : 'InActive'}];
		$scope.transformerMeterMasterDetailsGridOptions.columnDefs[18]['options'] = meter_status_options;
		
		$scope.transformer_meter_master_details_clear = function(e){
			$scope.transformerMeterMasterDetailsGridOptions.data = [];
			$omCode.val('').focus();
			$stationCode.val('');
			$feederCode.val('');
			$transformerCode.val('');
		};
		
		$scope.edit_transformer_meter_master_details = function(e,row){
			var editTransformerMeterMasterDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Transformer Meter Details";
			    	$scope.ok_text = "Update";
			    	$scope.configs = angular.copy(configs);
			    	//loading readOnly property to fields(edit mode)
			    	var readOnly = [1,2,3,4,5,6,11,13];
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
		    			remote.load("upsertdtcmetermasterdetails", function(response){
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
			editTransformerMeterMasterDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric','web-float']);
			});
		}
		
		$scope.add_transformer_meter_master_details = function(e){
			var addTransformerMeterMasterDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add Transformer Meter Details";
			    	$scope.ok_text = "Add";
			    	$scope.configs = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
		    			mtr_sts : 'Y',
		    			no_of_ph : '3',
		    			dtc_mtr_type : '10',
		    			mtr_volt : '1',
		    			mtr_amp : '25',
		    			assign_dt : $filter('date')(new Date(), 'dd/MM/yyyy'),
		    			max_mtr_no : '99999'
			    	};
			    	
			    	$scope.configs[2]['options'] =[];
			    	$scope.configs[4]['options'] =[];
					
					$scope.$watch('data.stn_cd',function(new_val, old_val){
						if(new_val && old_val !== new_val){
							var request = {
								"stationCode": new_val,
								"location": $rootScope.user.location_code,
								"conn_type": $rootScope.user.connection_type
							}
							remote.load("getFeederList", function(response){
								$scope.configs[2]['options'] = response.FeederCodeList;
							}, request , 'POST');
						}
					});
					
					$scope.$watch('data.om_cd',function(new_val, old_val){
						if(new_val && old_val !== new_val){
							var request = {
								"stationCode": $scope.data.stn_cd,
								"feederCode": $scope.data.fdr_cd,
								"location": new_val, 
								"conn_type": $rootScope.user.connection_type
							}
							$scope.configs[4]['options'] =[];
							remote.load("getTransformerList", function(response){
								$scope.configs[4]['options'] = response.TransformerCodeList;
							}, request , 'POST');
						}
					});
					
					$scope.$watch('data.fdr_cd',function(new_val, old_val){
						if(new_val && old_val !== new_val){
							var request = {
								"stationCode": $scope.data.stn_cd,
								"feederCode": new_val,
								"location": $scope.data.om_cd, 
								"conn_type": $rootScope.user.connection_type
							}
							$scope.configs[4]['options'] =[];
							remote.load("getTransformerList", function(response){
								$scope.configs[4]['options'] = response.TransformerCodeList;
							}, request , 'POST');
						}
					});
			    	
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
		    			remote.load("upsertdtcmetermasterdetails", function(response){
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
			        	return $scope.transformerMeterMasterDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addTransformerMeterMasterDetailsModalInstance.result.then(function (newRecord) {
				//$rrNo.val(newRecord.rr_no);
				//$rebateType.val(newRecord.rebate_code);
				$scope.load_transformer_meter_master_details();
			});

			addTransformerMeterMasterDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric','web-float']);
			});
		};
		
	}

	if(energy_audit_flow === 'transformer_meter_reading'){
		
		$scope.readingDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		
		$omCode = $('#transformer-meter-reading-details-om-code');
		$stationCode = $('#transformer-meter-reading-details-station-code');
		$feederCode = $('#transformer-meter-reading-details-feeder-code');
		
		
		//getomcodelist
		var request = {
			"Conn_Type": $rootScope.user.connection_type,
			"Location_Code": $rootScope.user.location_code
		}
		remote.load("getomunitlist", function(response){
			$scope.om_list = response.OM_LIST;
		}, request , 'POST', false, false, true);
		
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
		
		$scope.load_transformer_meter_reading_details = function(e){
			var request = {
				"conn_type": $rootScope.user.connection_type,	
				"location_code" : $rootScope.user.location_code,					
				"station_code": (($stationCode.val()) ? $stationCode.val() : ''),
				"feeder_code" : (($feederCode.val()) ? $feederCode.val() : ''),
				"om_code" : (($omCode.val()) ? $omCode.val() : ''),
				"reading_date" : (($scope.readingDate) ? $scope.readingDate : '')
			}
			console.log(request);
			remote.load("getdtcmeterreading", function(response){
				$scope.transformerMeterReadingDetailsGridOptions.data = response.dtc_meter_reading_details;
			}, request , 'POST');
		};

		$scope.transformerMeterReadingDetailsGridOptions = {
			showGridFooter: true,
			columnDefs: [

			    {field: 'row_num', displayName: '#', width : '4%'},
			    {field: 'stn_name', displayName: 'Station', filed_key : 'stn_cd', width : '12%'},
				{field: 'fdr_name', displayName: 'Feeder', filed_key : 'fdr_cd', width : '12%'},
				{field: 'om_name', displayName: 'O&M Unit', filed_key : 'om_cd', width : '12%'},
				{field: 'dtc_name', displayName: 'Transfermer', filed_key : 'dtc_cd', width : '15%'},
				{field: 'no_of_intl', displayName: 'No.Of Instl', width : '8%'},
				{field: 'prev_rdg_dt', displayName: 'Prev Rdg Date', width : '9%'},
				{field: 'prev_rdg', displayName: 'Prev Rdg', width : '8%'},
				{field: 'pres_rdg', displayName: 'Pres Rdg', width : '9%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
				{field: 'rollover_descr', displayName: 'R/C Flag', filed_key : 'rollover', width : '8%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},

	        ],
	        data: [],
	        rowTemplate: rowTemplate() 
		};
		
		function rowTemplate() {    //custom rowtemplate to enable double click and right click menu options

	        return ' <div ng-dblclick="grid.appScope.rowDblClick(row)"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" ' +
	        	   ' class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell context-menu="grid.appScope.contextmenuOptions(row)" '+
	        	   ' data-target="myMenu" ></div>'

	    }
	    
		$scope.modal= {};
	    $scope.rowDblClick = function( row) {
	       //alert('Row double-clicked!\n'+'Full Name  --> '+row.entity.stn_name+' '+row.entity.fdr_name) 
	       //add code here 
	    	
	    	$scope.assessedconsumptiondetails = {};
	    	
	    	$scope.modal.transformername = row.entity.dtc_name;
	    	$scope.modal.readingdate = row.entity.prev_rdg_dt;
	    	$scope.modal.omsection = row.entity.om_name;
	    	$scope.modal.stationname = row.entity.stn_name;
	    	$scope.modal.feedername = row.entity.fdr_name;
	    	
	    	var request = {
					"conn_type": $rootScope.user.connection_type,	
					"location_code" : $rootScope.user.location_code,					
					"station_code": row.entity.stn_cd,
					"feeder_code" : row.entity.fdr_cd,
					"om_code" : row.entity.om_cd,
					"reading_date" : row.entity.prev_rdg_dt,
					"transformer_code":row.entity.dtc_cd
				}
				remote.load("getentryrecordsforassessed", function(response){
					$scope.assessedconsumptiondetails = response.dtc_assessedentry_details;
				}, request , 'POST');
	    	
	       $('#assessedModal').modal('toggle');
	       
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
		
		$scope.transformer_meter_reading_details_clear = function(e){
			$scope.transformerMeterReadingDetailsGridOptions.data = [];
			$omCode.val('').focus();
			$stationCode.val('');
			$feederCode.val('');
			$scope.readingDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		};
	}
	
if(energy_audit_flow === 'feeder_energy_audit'){
		
		$scope.monthYear = $filter('date')(new Date(), 'dd/MM/yyyy');
		
		$stationCode = $('#feeder-energy-audit-details-station-code');
		$feederCode = $('#feeder-energy-audit-details-feeder-code');
		
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
		
		$scope.load_feeder_energy_audit_details = function(e){
			var request = {
				"conn_type": $rootScope.user.connection_type,	
				"location_code" : $rootScope.user.location_code,					
				"station_code": (($stationCode.val()) ? $stationCode.val() : ''),
				"feeder_code" : (($feederCode.val()) ? $feederCode.val() : ''),
				"month_year" : (($scope.monthYear) ? $scope.monthYear : ''),
				"conn_type" : $rootScope.user.connection_type
			}
			remote.load("getfeederenergyaudit", function(response){
				$scope.feederEnergyAuditDetailsGridOptions.data = response.feeder_energy_audit_details;
			}, request , 'POST');
		};

		$scope.feederEnergyAuditDetailsGridOptions = {
			showGridFooter: true,
			columnDefs: [
			             
				{field: 'row_num', displayName: '#', width : '4%'},
				{field: 'stn_name', displayName: 'Station', field_key : 'stn_cd', width : '15%'},
				{field: 'fdr_name', displayName: 'Feeder', field_key : 'fdr_cd', width : '15%'},
				{field: 'billed_units', displayName: 'LT Billed Units', width : '10%'},
				{field: 'ht_billed_unis', displayName: 'HT Billed Unis', width : '10%'},
				{field: 'ht_demand', displayName: 'HT Demand', width : '10%'},
				{field: 'ht_collection', displayName: 'HT Collection', width : '10%'},
				{field: 'assessed_units', displayName: 'Feeder Recorded Units', width : '15%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input assessed_units" stn_cd="{{row.entity.stn_cd}}" fdr_cd="{{row.entity.fdr_cd}}" remarks="{{row.entity.remarks}}" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
				{field: 'remarks', displayName: 'Remarks', width : '10%', cellTemplate: '<div class="ui-grid-cell-contents"><input type="text" class="text-input remarks" ng-model="row.entity[col.field]" ng-keyup="grid.appScope.hitTab($event)" /></div>'},
				{field: 'userid', displayName: 'User ID', width : '10%'},
				{field: 'tmpstp', displayName: 'Time Stamp', width : '13%'}
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
		
		
		$scope.feeder_energy_audit_details_save = function(){
			var $rows_edited = $('#energy_audit').find('#feederEnergyAuditDetailsGrid').find('.assessed_units.ng-dirty');
			if(!$rows_edited.length){
				notify.warn('No changes to save');
				return;
			}
			var rows_to_update = [];
			$rows_edited.each(function(key, el){
				var $el = $(el);
				if($el.val()){
					rows_to_update.push({
						station : $el.attr('stn_cd'),
						feeder : $el.attr('fdr_cd'),
						units : $el.val(),
						remarks : $el.attr('remarks')
						
					});
				}
			});
			var request = {
				location_code : $rootScope.user.location_code,
    			userid : $rootScope.user.user_id,
    			conn_type : $rootScope.user.connection_type,
    			month : $scope.monthYear,
    			data : rows_to_update
    		};
    		remote.load("upsertfeederenergyauditdetails", function(response){
    			$scope.feederEnergyAuditForm.$setPristine();
    			$scope.load_feeder_energy_audit_details();
			}, request ,'POST');
		}
		
		$scope.feeder_energy_audit_details_clear = function(e){
			$scope.feederEnergyAuditDetailsGridOptions.data = [];
			$stationCode.val('').focus();
			$feederCode.val('');
			$scope.readingDate = $filter('date')(new Date(), 'dd/MM/yyyy');
		};
		
		$scope.feeder_energy_audit_details_print = function(){
			// TODO
		};
	}


	
}]);