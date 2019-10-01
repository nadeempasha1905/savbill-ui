var infrastructure_controller = angular.module('infrastructure_controller',[]);

infrastructure_controller.controller('infrastructure_controller',['$scope','$rootScope','remote','$timeout','$uibModal','$filter','$compile','webValidations','notify', function($scope,$rootScope,remote,$timeout,$uibModal,$filter,$compile,webValidations,notify){
	
	var infrastructure_flow = $rootScope.breadcrumb[$rootScope.breadcrumb.length-1];
	
	if(infrastructure_flow === 'station_details'){
		var $stationCode = $('#station-details-station-code');
		var $stationType = $('#station-details-station-type');
		
		//load station details
		var request = {
			conn_type : $rootScope.user.connection_type,
			location : $rootScope.user.location_code
		}
		remote.load("getStationList", function(response){
			 $scope.StationCodeList = response.StationCodeList;
		}, request , 'POST');
		
		//load station types
		var request = {
			conn_type : $rootScope.user.connection_type,
			code_type : 'STN_TYP'
		}
		remote.load("getcodedetailsfordropdowns", function(response){
			 $scope.StationTypeList = response.CodeDetailsDropDownList;
			 $scope.stationDetailsGridOptions.columnDefs[3]['options'] = response.CodeDetailsDropDownList;
		}, request , 'POST');
		
		
		$scope.load_station_details = function(e){
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"station_code": $stationCode.val().trim(),
				"station_type" : $stationType.val().trim(),
				"conn_type" : $rootScope.user.connection_type
			}
			$scope.stationDetailsGridOptions.data =[];
			remote.load("getstationdetails", function(response){
				$scope.stationDetailsGridOptions.data = response.station_details;
			}, request , 'POST');
		};

		$scope.stationDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	            {field: 'row_num', displayName: '#', width : '5%', hide : true},
	            {field: 'stn_cd', displayName: 'Code', width : '10%'},
	            {field: 'stn_name', displayName: 'Name', width : '20%'},
	            {field: 'stn_typ_name', displayName: 'Type', field_key: 'stn_typ', width : '10%'},
	            {field: 'comm_dt', displayName: 'Commencing Date', width : '12%', type : 'date'},
	            {field: 'dvn_name', displayName: 'Division', field_key: 'dvn_cd', width : '15%'},
	            {field: 'circle_name', displayName: 'Circle', field_key: 'circle_cd', width : '15%'},
	            {field: 'zone_name', displayName: 'Zone', field_key: 'zone_cd', width : '15%'},
	            {field: 'taluk_name', displayName: 'Taluk', field_key: 'taluk_cd', width : '15%'},
	            {field: 'district_name', displayName: 'District', field_key: 'district_cd', width : '15%'},
	            {field: 'region_name', displayName: 'Region', field_key: 'region_cd', width : '20%'},
	            {field: 'state_constcy_name', displayName: 'State Constituency', field_key: 'state_constcy_cd', width : '15%'},
	            {field: 'centrl_constcy_name', displayName: 'Central Constituency', field_key: 'centrl_constcy_cd', width : '15%'},
	            {field: 'hotline_no', displayName: 'Hotline No', width : '15%'},
	            {field: 'tel_no', displayName: 'P & T No', width : '15%'},
	            {field: 'fax_no', displayName: 'Fax No', width : '13%'},
	            {field: 'pabx_no', displayName: 'Postbox No', width : '13%'},
	            {field: 'plcc_no', displayName: 'PLCC No', width : '13%'},
	            {field: 'misc_no', displayName: 'Miscellaneous No', width : '15%'},
	            {field: 'peak_ld', displayName: 'Peak-load', width : '10%'},
	            {field: 'peak_ld_dt', displayName: 'Peak-load Date', width : '12%', type : 'date'},
	            {field: 'pm_schd_gen_flg_description', displayName: 'Generation Flag', field_key: 'pm_schd_gen_flg', width : '10%'},
	            {field: 'gen_mode_name', displayName: 'Generation Mode', field_key: 'gen_mode', width : '15%'},
	            {field: 'dc_ctrl_volt1', displayName: 'DCCV1(V)', width : '8%'},
	            {field: 'dc_ctrl_volt2', displayName: 'DCCV2(V)', width : '8%'},
	            {field: 'installed_cap', displayName: 'Installed Capacity', width : '15%'},
	            {field: 'stn_area', displayName: 'Area(Acers)', width : '10%'},
	            {field: 'est_cost', displayName: 'Estimated Cost(Rs)', width : '15%'},
	            {field: 'remarks', displayName: 'Remarks', width : '20%'},
	            {field: 'userid', displayName: 'User ID', width : '10%', hide : true},
	            {field: 'tmpstp', displayName: 'Time Stamp', width : '15%', hide : true}
            ],
            data: [],
 	        onRegisterApi: function( gridApi ) { 
	            $scope.stationDetailsGridApi = gridApi;
	            var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_station_details($event,row)" title="Edit"></button></div>';
	            $scope.stationDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	        }
		};
		$scope.addEditModalConfig = [
		     {
		    	 'header': 'Primary Details',
		    	 'config': [
    	            {field: 'stn_cd', displayName: 'Code', required: true},
    				{field: 'stn_name', displayName: 'Name', required: true},
    				{field: 'stn_typ_name', displayName: 'Type', field_key: 'stn_typ', required: true},
    				{field: 'comm_dt', displayName: 'Commencing Date', type : 'date', required: true}
	    	     ]
		     },{
		    	 'header': 'Location Details',
		    	 'config': [
					{field: 'zone_name', displayName: 'Zone', field_key: 'zone_cd'},
					{field: 'district_name', displayName: 'District', field_key: 'district_cd'},
					{field: 'circle_name', displayName: 'Circle', field_key: 'circle_cd'},
					{field: 'taluk_name', displayName: 'Taluk', field_key: 'taluk_cd'},
					{field: 'dvn_name', displayName: 'Division', field_key: 'dvn_cd'},
					{field: 'centrl_constcy_name', displayName: 'Central Constituency', field_key: 'centrl_constcy_cd'},
					{field: 'region_name', displayName: 'Region', field_key: 'region_cd'},
					{field: 'state_constcy_name', displayName: 'State Constituency', field_key: 'state_constcy_cd'}		    	    
	    	     ]
		     },{
		    	 'header': 'Communication Details',
		    	 'config': [
    	            {field: 'hotline_no', displayName: 'Hotline No',numeric : true},
    	            {field: 'pabx_no', displayName: 'Postbox No',numeric : true},
    	            {field: 'plcc_no', displayName: 'PLCC No',numeric : true},
    	            {field: 'tel_no', displayName: 'P & T No',numeric : true},
    	            {field: 'fax_no', displayName: 'Fax No',numeric : true},
    	            {field: 'misc_no', displayName: 'Miscellaneous No',numeric : true}
	    	     ]
		     },{
		    	 'header': 'Peak Load Details',
		    	 'config': [
		    	    {field: 'peak_ld', displayName: 'Peak-load', float: true},
		    	    {field: 'peak_ld_dt', displayName: 'Peak-load Date', type : 'date'}
	    	     ]
		     },{
		    	 'header': 'Technical Details',
		    	 'config': [
    	            {field: 'pm_schd_gen_flg_description', displayName: 'Generation Flag', field_key: 'pm_schd_gen_flg'},
    	            {field: 'gen_mode_name', displayName: 'Generation Mode', field_key: 'gen_mode'},
    	            {field: 'dc_ctrl_volt1', displayName: 'DCCV1(V)', float: true},
    	            {field: 'dc_ctrl_volt2', displayName: 'DCCV2(V)', float: true}
	    	     ]
		     },{
		    	 'header': 'Other Details',
		    	 'config': [
    	            {field: 'installed_cap', displayName: 'Installed Capacity', float: true},
    	            {field: 'stn_area', displayName: 'Area(Acers)', float: true},
    	            {field: 'est_cost', displayName: 'Estimated Cost(Rs)', float: true},
    	            {field: 'remarks', displayName: 'Remarks'},
	    	     ]
		     }
		];
		
		$scope.station_details_clear = function(e){
			$stationCode.val('').focus();
			$stationType.val('');
			$scope.stationDetailsGridOptions.data = [];
		};
		
		$scope.edit_station_details = function(e,row){
			var editStationDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
			    templateUrl: templates.modal.edit_frames,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Station Details";
			    	$scope.ok_text = "Update";
			    	$scope.frames = angular.copy(configs);
			    	$scope.frames[0].config[0]['readOnly'] = true;

			    	//load station types
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'STN_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[2]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load station Zone
					var request = {
						conn_type : $rootScope.user.connection_type,
						location_code : $rootScope.user.location_code,
						location_type : 'ZN'
					}
					remote.load("getlocationdetails", function(response){
						 $scope.frames[1].config[0]['options'] = response.location_details;
					}, request , 'POST');
					
					//load station Circle
					var request = {
						conn_type : $rootScope.user.connection_type,
						location_code : $rootScope.user.location_code,
						location_type : 'CR'
					}
					remote.load("getlocationdetails", function(response){
						 $scope.frames[1].config[2]['options'] = response.location_details;
					}, request , 'POST');
					
					//load station division
					var request = {
						conn_type : $rootScope.user.connection_type,
						location_code : $rootScope.user.location_code,
						location_type : 'DV'
					}
					remote.load("getlocationdetails", function(response){
						 $scope.frames[1].config[4]['options'] = response.location_details;
					}, request , 'POST');
					
					//load DISTRICT
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'DISTRICT'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[1].config[1]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load TALUK 
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'TALUK'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[1].config[3]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load REG_TYP
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'REG_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[1].config[6]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load Central Constituency
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'C_CONSTCY'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[1].config[5]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load State Constituency
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'S_CONSTCY'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[1].config[7]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load gen flag
					var gen_flg_options= [{'key':'Y', value : 'Yes'},{'key':'N', value : 'No'}];
					$scope.frames[4].config[0]['options'] = gen_flg_options;
					
					//load gen Mode
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'GEN_MODE'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[4].config[1]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditFramesForm.$error)){
							return;
						}
						$scope.data.stn_typ_name = $('.stn_typ_name').find('select').find('option[value="'+$('.stn_typ_name').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			location_code : $rootScope.user.location_code
			    		});
			    		console.log(request);
		    			remote.load("upsertstationdetails", function(response){
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
			        	return $scope.addEditModalConfig;
			        },
			        data: function() {
			        	return row.entity;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			editStationDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditFramesForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric','web-float']);
			});
		}
		$scope.add_station_details = function(e){
			var addStationDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
			    templateUrl: templates.modal.add_frames,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add Station Details";
			    	$scope.ok_text = "Add";
			    	$scope.frames = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		comm_dt : $filter('date')(new Date(), 'dd/MM/yyyy')
			    	};
			    	
			    	//load station types
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'STN_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[2]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load station Zone
					var request = {
						conn_type : $rootScope.user.connection_type,
						location_code : $rootScope.user.location_code,
						location_type : 'ZN'
					}
					remote.load("getlocationdetails", function(response){
						 $scope.frames[1].config[0]['options'] = response.location_details;
					}, request , 'POST');
					
					//load station Circle
					var request = {
						conn_type : $rootScope.user.connection_type,
						location_code : $rootScope.user.location_code,
						location_type : 'CR'
					}
					remote.load("getlocationdetails", function(response){
						 $scope.frames[1].config[2]['options'] = response.location_details;
					}, request , 'POST');
					
					//load station division
					var request = {
						conn_type : $rootScope.user.connection_type,
						location_code : $rootScope.user.location_code,
						location_type : 'DV'
					}
					remote.load("getlocationdetails", function(response){
						 $scope.frames[1].config[4]['options'] = response.location_details;
					}, request , 'POST');
					
					//load DISTRICT
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'DISTRICT'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[1].config[1]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load TALUK 
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'TALUK'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[1].config[3]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load REG_TYP
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'REG_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[1].config[6]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load Central Constituency
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'C_CONSTCY'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[1].config[5]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load State Constituency
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'S_CONSTCY'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[1].config[7]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load gen flag
					var gen_flg_options= [{'key':'Y', value : 'Yes'},{'key':'N', value : 'No'}];
					$scope.frames[4].config[0]['options'] = gen_flg_options;
					
					//load gen Mode
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'GEN_MODE'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[4].config[1]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditFramesForm.$error)){
							return;
						}
						$scope.data.stn_typ_name = $('.stn_typ_name').find('select').find('option[value="'+$('.stn_typ_name').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			location_code : $rootScope.user.location_code
			    		});
			    		console.log(request);
		    			remote.load("upsertstationdetails", function(response){
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
			        	return $scope.addEditModalConfig;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addStationDetailsModalInstance.result.then(function (newRecord) {
				$stationCode.val(newRecord.stn_cd);
				$stationType.val(newRecord.stn_typ);
				$scope.load_station_details();
			});
			addStationDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditFramesForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric','web-float']);
			});
			
		};
	}
	
	if(infrastructure_flow === 'feeder_details'){
		
		$stationCode = $('#feeder-details-station-code');
		$feederCode = $('#feeder-details-feeder-code');

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
		
		$scope.load_feeder_details = function(e){
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"station_code": (($stationCode.val()) ? $stationCode.val() : ''),
				"feeder_code" : (($feederCode.val()) ? $feederCode.val() : ''),
				"conn_type" : $rootScope.user.connection_type
			}
			remote.load("getfeederdetails", function(response){
				$scope.feederDetailsGridOptions.data =  response.feeder_details;
			}, request , 'POST');
		};

		$scope.feederDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#', width : '4%'},
	             {field: 'fdr_no', displayName: 'Feeder Code', width : '10%'},
	             {field: 'fdr_name', displayName: 'Feeder Name', width : '15%'},
	             {field: 'fdr_typ_descr', displayName: 'Feeder Type', width : '15%'},
	             {field: 'stn_cd', displayName: 'Station Code', width : '10%'},
	             {field: 'stn_name', displayName: 'Station Name', width : '15%'},
	             {field: 'comm_dt', displayName: 'Commensing Date', width : '12%'},
	             {field: 'fdr_len', displayName: 'Feeder Length', width : '10%'},
	             {field: 'fdr_volt_descr', displayName: 'Feeder Volts', width : '10%'},
	             {field: 'fdr_source_descr', displayName: 'Feeder Source', width : '10%'},
	             {field: 'fdr_cap', displayName: 'Feeder Capacity', width : '10%'},
	             {field: 'conn_ld', displayName: 'Connected Load', width : '10%'},
	             {field: 'peak_ld', displayName: 'Peak Load', width : '10%'},
	             {field: 'peak_ld_dt', displayName: 'Peak Load Date', width : '10%'},
	             {field: 'reserve_ld', displayName: 'Reserve Load', width : '10%'},
	             {field: 'load_typ_descr', displayName: 'Load Type', width : '10%'},
	             {field: 'cable_size', displayName: 'Cabel Size', width : '10%'},
	             {field: 'cond_typ_descr', displayName: 'Cond Type', width : '10%'},
	             {field: 'schd_gen_flg_descr', displayName: 'Generation Flag', width : '10%'},
	             {field: 'last_maint_dt', displayName: 'Last Main Date', width : '10%'},
	             {field: 'remarks', displayName: 'Remarks', width : '15%'},
	             {field: 'sts_cd_descr', displayName: 'Status', width : '10%'},
	             {field: 'userid', displayName: 'User ID', width : '10%'},
	             {field: 'tmpstp', displayName: 'Time Stamp', width : '15%'}
	        ],
	        data: [],
 	        onRegisterApi: function( gridApi ) { 
	            $scope.feederDetailsGridApi = gridApi;
	            var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_feeder_details($event,row)" title="Edit"></button></div>';
	            $scope.feederDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
 	        }
		};
		
		$scope.addEditModalConfig = [
		     {
		    	 'header': 'Primary Details',
		    	 'config': [
		            {field: 'fdr_no', displayName: 'Feeder Code', required: true},
		            {field: 'fdr_name', displayName: 'Feeder Name', required: true},
		            {field: 'stn_name', displayName: 'Station', field_key: 'stn_cd', required: true},
		            {field: 'fdr_typ_descr', displayName: 'Feeder Type', field_key: 'fdr_type', required: true},
					{field: 'comm_dt', displayName: 'Commensing Date', type : 'date', required: true},
					{field: 'sts_descr', displayName: 'Status', field_key: 'sts_cd', required: true},
					
	    	     ]
		     },{
		    	 'header': 'Load Details',
		    	 'config': [
					{field: 'fdr_cap', displayName: 'Capacity Load(KV)', numeric: true},
					{field: 'conn_ld', displayName: 'Connected Load(KV)', numeric: true},
					{field: 'reserve_ld', displayName: 'Reserve Load(KV)', numeric: true},
					{field: 'last_maint_dt', displayName: 'Last Maintained Date', type : 'date'},
					{field: 'peak_ld', displayName: 'Peak Load(KV)', numeric: true},
					{field: 'peak_ld_dt', displayName: 'Peak Load Date', type : 'date'}

	    	     ]
		     },{
		    	 'header': 'Technical Details',
		    	 'config': [
    	            {field: 'fdr_len', displayName: 'Feeder Length', numeric: true},
    	            {field: 'cable_size', displayName: 'Cabel Size', numeric: true},
    	            {field: 'schd_gen_flg_descr', displayName: 'Generation Flag', field_key: 'schd_gen_flg'},
		            {field: 'fdr_volt_descr', displayName: 'Feeder Volts', field_key: 'fdr_volt'},
					{field: 'fdr_source_descr', displayName: 'Feeder Source', field_key: 'fdr_source'},
					{field: 'load_typ_descr', displayName: 'Load Type', field_key: 'load_typ'},
					{field: 'cond_typ_descr', displayName: 'Conductor Type', field_key: 'cond_typ'},
					{field: 'remarks', displayName: 'Remarks'}
	    	     ]
		     }
		];
		
		$scope.feeder_details_clear = function(e){
			$scope.feederDetailsGridOptions.data = [];
			$stationCode.val('').focus();
			$feederCode.val('');
		};
		$scope.edit_feeder_details = function(e,row){
			var editFeederDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
			    templateUrl: templates.modal.edit_frames,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Feeder Details";
			    	$scope.ok_text = "Update";
			    	$scope.frames = angular.copy(configs);
			    	
			    	//getstationlist
					var request = {
						"conn_type": $rootScope.user.connection_type,
						"location": $rootScope.user.location_code
					}
					remote.load("getStationList", function(response){
						//$scope.StationCodeList = response.StationCodeList;
						$scope.frames[0].config[2]['options'] = response.StationCodeList;
					}, request , 'POST');
					
					//load feeder types
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'FDR_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[3]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load feeder status
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'F_T_STS_CD'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[5]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load gen flag
					var gen_flg_options= [{'key':'Y', value : 'Yes'},{'key':'N', value : 'No'}];
					$scope.frames[2].config[2]['options'] = gen_flg_options;
					
					//load feeder volts
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'FDR_VOLT'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[2].config[3]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load feeder source
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'FDR_SOURCE'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[2].config[4]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load feeder load type
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'FDR_LD_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[2].config[5]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load feeder Conductor Type
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'COMC_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[2].config[6]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
			    	$scope.frames[0].config[0]['readOnly'] = true;

			    	$scope.data = data;
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditFramesForm.$error)){
							return;
						}
						//$scope.data.stn_typ_name = $('.stn_typ_name').find('select').find('option[value="'+$('.stn_typ_name').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			location_code : $rootScope.user.location_code
			    		});
			    		console.log(request);
		    			remote.load("upsertfeederdetails", function(response){
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
			        	return $scope.addEditModalConfig;
			        },
			        data: function() {
			        	return row.entity;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			editFeederDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditFramesForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric','web-float']);
			});
		}
		
		$scope.add_feeder_details = function(e){
			var addFeederDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
			    templateUrl: templates.modal.add_frames,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add Feeder Details";
			    	$scope.ok_text = "Add";
			    	$scope.frames = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		comm_dt : $filter('date')(new Date(), 'dd/MM/yyyy'),
			    		sts_cd : '1'
			    	};
			    	
			    	//getstationlist
					var request = {
						"conn_type": $rootScope.user.connection_type,
						"location": $rootScope.user.location_code
					}
					remote.load("getStationList", function(response){
						//$scope.StationCodeList = response.StationCodeList;
						$scope.frames[0].config[2]['options'] = response.StationCodeList;
					}, request , 'POST');
					
					//load feeder types
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'FDR_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[3]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load feeder status
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'F_T_STS_CD'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[5]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load gen flag
					var gen_flg_options= [{'key':'Y', value : 'Yes'},{'key':'N', value : 'No'}];
					$scope.frames[2].config[2]['options'] = gen_flg_options;
					
					//load feeder volts
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'FDR_VOLT'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[2].config[3]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load feeder source
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'FDR_SOURCE'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[2].config[4]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load feeder load type
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'FDR_LD_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[2].config[5]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load feeder Conductor Type
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'COMC_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[2].config[6]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditFramesForm.$error)){
							return;
						}
						//$scope.data.stn_typ_name = $('.stn_typ_name').find('select').find('option[value="'+$('.stn_typ_name').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			location_code : $rootScope.user.location_code
			    		});
			    		console.log(request);
		    			remote.load("upsertfeederdetails", function(response){
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
			        	return $scope.addEditModalConfig;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addFeederDetailsModalInstance.result.then(function (newRecord) {
				/*$stationCode.val(newRecord.stn_cd);
				$stationType.val(newRecord.stn_typ);
				$scope.load_station_details();*/
			});
			addFeederDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditFramesForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric','web-float']);
			});
		};
	}
	
	if(infrastructure_flow === 'transformer_details'){
		
		$omCode = $('#transformer-details-om-code');
		$stationCode = $('#transformer-details-station-code');
		$feederCode = $('#transformer-details-feeder-code');
		$transformerCode = $('#transformer-details-transformer-code');
		
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
		$scope.get_transformer_info = function(){
			var request = {
				"stationCode": $scope.StationCode,
				"feederCode": $scope.FeederCode,
				"location": (($omCode.val()) ? $omCode.val() : $rootScope.user.location_code), 
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getTransformerList", function(response){
				$scope.TransformerCodeList = response.TransformerCodeList;
			}, request , 'POST');
		}
		
		$scope.load_transformer_details = function(e){
			var request = {
				"location_code" : $rootScope.user.location_code,					
				"station_code": (($stationCode.val()) ? $stationCode.val() : ''),
				"feeder_code" : (($feederCode.val()) ? $feederCode.val() : ''),
				"om_code" : (($omCode.val()) ? $omCode.val() : ''),
				"dtc_code" : (($transformerCode.val()) ? $transformerCode.val() : ''),
				"conn_type" : $rootScope.user.connection_type
			}
			remote.load("getdtcdetails", function(response){
				$scope.transformerDetailsGridOptions.data = response.dtc_details;
			}, request , 'POST');
		};

		$scope.transformerDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
	             {field: 'row_num', displayName: '#', width : '4%', hide : true},
	             {field: 'dtc_cd', displayName: 'DTC Code', width : '12%'},
	             {field: 'dtc_name', displayName: 'DTC Name', width : '15%'},
	             {field: 'loc_name', displayName: 'O&M Unit', field_key: 'loc_cd', width : '10%'},
	             {field: 'fdr_cd', displayName: 'Feeder Code', width : '10%', hide : true},
	             {field: 'fdr_name', displayName: 'Feeder Name', field_key: 'fdr_cd', width : '15%'},
	             {field: 'stn_cd', displayName: 'Station Code', width : '10%', hide : true},
	             {field: 'stn_name', displayName: 'Station Name', field_key: 'stn_cd', width : '15%'},
	             {field: 'sts_flg_descr', displayName: 'DTC Type', width : '10%'},
	             {field: 'comm_dt', displayName: 'Commensing Date', width : '12%'},
	             {field: 'region_descr', displayName: 'Region', width : '15%'},
	             {field: 'taluk_descr', displayName: 'Taluk', width : '15%'},
	             {field: 'district_descr', displayName: 'District', width : '15%'},
	             {field: 'make_descr', displayName: 'DTC Make', width : '10%'},
	             {field: 'sl_no', displayName: 'DTC Serial #', width : '10%'},
	             {field: 'po_no', displayName: 'PO Number', width : '10%'},
	             {field: 'po_dt', displayName: 'PO Date', width : '10%'},
	             {field: 'supply_dt', displayName: 'Supply Date', width : '10%'},
	             {field: 'volt_rating_cd', displayName: 'Rating Voltage', width : '10%'},
	             {field: 'dtc_cap', displayName: 'Capacity(KVA)', width : '12%'},
	             {field: 'dtc_conn_ld', displayName: 'Connected Load(KVA)', width : '12%'},
	             {field: 'dtc_reserve_ld', displayName: 'Reserved Load(KVA)', width : '12%'},
	             {field: 'gnt_upto', displayName: 'Guarantee Upto', width : '10%'},
	             {field: 'peak_ld', displayName: 'Peak Load', width : '10%'},
	             {field: 'peak_ld_dt', displayName: 'Peak Load Date', width : '12%'},
	             {field: 'last_maint_dt', displayName: 'Last Maintain Date', width : '12%'},
	             {field: 'ntr_sts_cd_descr', displayName: 'Status', width : '10%'},
	             {field: 'town_cd_descr', displayName: 'Town',width : '20%'},
	             {field: 'dtc_instls', displayName: 'No.Of Instls', width : '10%'},
	             {field: 'remarks', displayName: 'Remarks', width : '15%'},
	             {field: 'userid', displayName: 'User ID', width : '10%', hide : true},
	             {field: 'tmpstp', displayName: 'Time Stamp', width : '15%', hide : true}
	        ],
	        data: [],
	        onRegisterApi: function( gridApi ) { 
	            $scope.transformerDetailsGridApi = gridApi;
	            var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_transformer_details($event,row)" title="Edit"></button></div>';
	            $scope.transformerDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
	 	    }
		};
		
		$scope.addEditModalConfig = [
		     {
		    	 'header': 'Primary Details',
		    	 'config': [
    	            {field: 'dtc_cd', displayName: 'Transformer Code', required: true, numeric: true},
    	            {field: 'dtc_name', displayName: 'Transformer Name', required: true},
    	            {field: 'sts_flg_descr', displayName: 'Transformer Type', field_key: 'sts_flg', required: true},
    	            {field: 'loc_name', displayName: 'O&M Unit', field_key: 'loc_cd', required: true},
    	            {field: 'stn_name', displayName: 'Station', field_key: 'stn_cd', required: true},
    	            {field: 'fdr_name', displayName: 'Feeder', field_key: 'fdr_cd', required: true},
					{field: 'comm_dt', displayName: 'Commensing Date', type : 'date', required: true},
					{field: 'region_descr', displayName: 'Region', field_key: 'region_cd'},
					{field: 'district_descr', displayName: 'District', field_key: 'district_cd'},
					{field: 'taluk_descr', displayName: 'Taluk', field_key: 'taluk_cd'},
					{field: 'sts_cd_descr', displayName: 'Status', field_key: 'sts_cd', required: true},
					{field: 'town_cd_descr', displayName: 'Town', field_key: 'town_cd'},
	    	     ]
		     },{
		    	 'header': 'Technical Details',
		    	 'config': [
     	            {field: 'volt_rating_cd', displayName: 'Rated Voltage', alphanumeric: true},
	   	            {field: 'dtc_cap', displayName: 'Capacity(KVA)', float: true},
	   	            {field: 'dtc_conn_ld', displayName: 'Connected Load(KVA)', float: true},
	   	            {field: 'dtc_reserve_ld', displayName: 'Reserved Load(KVA)', float: true},
	   	            {field: 'peak_ld', displayName: 'Peak Load(KVA)', float: true},
	   	            {field: 'peak_ld_dt', displayName: 'Peak Load Date', type : 'date'},
	   	            {field: 'last_maint_dt', displayName: 'Last Maintain Date', type : 'date'},
	   	            {field: 'remarks', displayName: 'Remarks'},
	   	            {field: 'dtc_instls', displayName: 'No.Of Instls',readOnly : true}
	    	     ]
		     },{
		    	 'header': 'Purchase Details',
		    	 'config': [
    	            {field: 'make_descr', displayName: 'Transformer Make', field_key: 'make_cd'},
    	            {field: 'sl_no', displayName: 'Transformer Sl.No', alphanumeric: true},
					{field: 'po_no', displayName: 'PO Number'},
					{field: 'po_dt', displayName: 'PO Date', type : 'date'},
					{field: 'supply_dt', displayName: 'Supply Date', type : 'date'},
					{field: 'gnt_upto', displayName: 'Guarantee Upto', type : 'date'}
	    	     ]
		     }
		];
		
		$scope.transformer_details_clear = function(e){
			$scope.transformerDetailsGridOptions.data = [];
			$omCode.val('').focus();
			$stationCode.val('');
			$feederCode.val('');
			$transformerCode.val('');
		};
		
		$scope.edit_transformer_details = function(e,row){
			var editTransformerDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
			    templateUrl: templates.modal.edit_frames,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit Transformer Details";
			    	$scope.ok_text = "Update";
			    	$scope.frames = angular.copy(configs);
			    	$scope.frames[0].config[0]['readOnly'] = true;

			    	//load transformer type
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'STS_FLG'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[2]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
			    	//getomcodelist
					var request = {
						"Conn_Type": $rootScope.user.connection_type,
						"Location_Code": $rootScope.user.location_code
					}
					remote.load("getomunitlist", function(response){
						$scope.frames[0].config[3]['options'] = response.OM_LIST;
					}, request , 'POST', false, false, true);
					
			    	
			    	//getstationlist
					var request = {
						"conn_type": $rootScope.user.connection_type,
						"location": $rootScope.user.location_code
					}
					remote.load("getStationList", function(response){
						$scope.StationCodeList = response.StationCodeList;
						$scope.frames[0].config[4]['options'] = response.StationCodeList;
					}, request , 'POST');
					
					$scope.$watch('data.stn_cd',function(new_val, old_val){
						if(new_val && old_val !== new_val){
							var request = {
								"stationCode": new_val,
								"location": $rootScope.user.location_code,
								"conn_type": $rootScope.user.connection_type
							}
							remote.load("getFeederList", function(response){
								$scope.frames[0].config[5]['options'] = response.FeederCodeList;
							}, request , 'POST');
						}
					});
					
					//load REG_TYP
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'REG_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[7]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load DISTRICT
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'DISTRICT'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[8]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load TALUK 
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'TALUK'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[9]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load transformer Status
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'EQP_STS'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[10]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//gettowndetails list
					var request = {
						"conn_type": $rootScope.user.connection_type,
						"type": 'T'
					}
					remote.load("gettowndetails", function(response){
						$scope.Town_List = response.Town_List;
						 $scope.frames[0].config[11]['options'] = response.Town_List;
					}, request , 'POST');
					
					//load transformer Make
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'MAKE'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[2].config[0]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
			    	$scope.data = data;
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditFramesForm.$error)){
							return;
						}
						//$scope.data.stn_typ_name = $('.stn_typ_name').find('select').find('option[value="'+$('.stn_typ_name').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'UPDATE',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			location_code : $rootScope.user.location_code
			    		});
			    		console.log(request);
		    			remote.load("upsertdtcdetails", function(response){
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
			        	return $scope.addEditModalConfig;
			        },
			        data: function() {
			        	return row.entity;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			editTransformerDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditFramesForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric','web-float']);
			});
			
		}
		$scope.add_transformer_details = function(e){
			var addTransformerDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
			    templateUrl: templates.modal.add_frames,
			    controller: function($scope, $uibModalInstance, configs, remote){
			    	$scope.header = "Add Transformer Details";
			    	$scope.ok_text = "Add";
			    	$scope.frames = configs;
			    	$scope.data = {
			    		userid : $rootScope.user.user_id,
			    		comm_dt : $filter('date')(new Date(), 'dd/MM/yyyy'),
			    		sts_cd : '1'
			    	};
			    	$scope.frames[0].config[5]['options'] = [];
			    	
			    	//load transformer type
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'STS_FLG'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[2]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
			    	//getomcodelist
					var request = {
						"Conn_Type": $rootScope.user.connection_type,
						"Location_Code": $rootScope.user.location_code
					}
					remote.load("getomunitlist", function(response){
						$scope.frames[0].config[3]['options'] = response.OM_LIST;
					}, request , 'POST', false, false, true);
					
			    	
			    	//getstationlist
					var request = {
						"conn_type": $rootScope.user.connection_type,
						"location": $rootScope.user.location_code
					}
					remote.load("getStationList", function(response){
						$scope.StationCodeList = response.StationCodeList;
						$scope.frames[0].config[4]['options'] = response.StationCodeList;
					}, request , 'POST');
					
					$scope.$watch('data.stn_cd',function(new_val, old_val){
						if(new_val && old_val !== new_val){
							var request = {
								"stationCode": new_val,
								"location": $rootScope.user.location_code,
								"conn_type": $rootScope.user.connection_type
							}
							remote.load("getFeederList", function(response){
								$scope.frames[0].config[5]['options'] = response.FeederCodeList;
							}, request , 'POST');
						}
					});
					
					//load REG_TYP
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'REG_TYP'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[7]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load DISTRICT
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'DISTRICT'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[8]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load TALUK 
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'TALUK'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[9]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//load transformer Status
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'EQP_STS'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[0].config[10]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
					
					//gettowndetails list
					var request = {
						"conn_type": $rootScope.user.connection_type,
						"type": 'T'
					}
					remote.load("gettowndetails", function(response){
						$scope.Town_List = response.Town_List;
						 $scope.frames[0].config[11]['options'] = response.Town_List;
					}, request , 'POST');
					
					//load transformer Make
					var request = {
						conn_type : $rootScope.user.connection_type,
						code_type : 'MAKE'
					}
					remote.load("getcodedetailsfordropdowns", function(response){
						 $scope.frames[2].config[0]['options'] = response.CodeDetailsDropDownList;
					}, request , 'POST');
			    	
			    	$scope.ok = function(){
			    		$scope.$broadcast('required-check-validity');
						if(!$.isEmptyObject($scope.addEditFramesForm.$error)){
							return;
						}
						//$scope.data.stn_typ_name = $('.stn_typ_name').find('select').find('option[value="'+$('.stn_typ_name').find('select').val()+'"]').text();
		    			var request = angular.copy($scope.data);
			    		angular.extend(request, {
			    			option : 'ADD',
			    			userid : $rootScope.user.user_id,
			    			conn_type : $rootScope.user.connection_type,
			    			location_code : $rootScope.user.location_code
			    		});
			    		console.log(request);
		    			remote.load("upsertdtcdetails", function(response){
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
			        	return $scope.addEditModalConfig;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			addTransformerDetailsModalInstance.result.then(function (newRecord) {
				/*$stationCode.val(newRecord.stn_cd);
				$stationType.val(newRecord.stn_typ);
				$scope.load_station_details();*/
			});
			addTransformerDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditFramesForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric','web-float']);
			});
		};
	}
	
	if(infrastructure_flow === 'section_details'){
		
		//load City type
		var request = {
			conn_type : $rootScope.user.connection_type,
			code_type : 'CITY_TYP'
		}
		remote.load("getcodedetailsfordropdowns", function(response){
			$scope.code_details = response.CodeDetailsDropDownList;
		}, request , 'POST');
		
		$scope.load_om_details = function(){
			
			var request = {
					conn_type : $rootScope.user.connection_type,
					location_code: $rootScope.user.location_code
			}
			remote.load("getomdetails", function(response){
				$scope.omDetailsGridOptions.columnDefs[10]['options'] = $scope.code_details;
				var office_type_options = [{'key' : 'OM','value' : 'OM UNIT'},{'key' : 'AC','value' : 'ACCOUNTING SECTION'}, {'key' : 'SD','value' : 'SUB-DIVISION OFFICE'}];
				$scope.omDetailsGridOptions.columnDefs[3]['options'] = office_type_options;
				var flag_options = [{'key' : 'Y','value' : 'Yes'},{'key' : 'N','value' : 'No'}];
				$scope.omDetailsGridOptions.columnDefs[4]['options'] = flag_options;
				$scope.om_details = response.om_details;
				$scope.omDetailsGridOptions.data = $scope.om_details;
			}, request , 'POST');
		};
		
		$scope.omDetailsGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
			     {field: 'row_num', displayName: '#', width : '4%', hide : true},
			     {field: 'om_code', displayName: 'O&M Code', width : '10%', required: true, numeric: true},
			     {field: 'om_name', displayName: 'O&M Name', width : '15%', required: true},
			     {field: 'office_typ_descr', displayName: 'Office Type',field_key: 'office_typ', width : '15%', required: true},
			     {field: 'acctng_flag_descr', displayName: 'Accounting Flag',field_key: 'acctng_flag', width : '10%', required: true},
			     {field: 'addr1', displayName: 'Address1', width : '15%', required: true},
			     {field: 'addr2', displayName: 'Address2', width : '15%'},
			     {field: 'addr3', displayName: 'Address3', width : '15%'},
			     {field: 'addr4', displayName: 'Address4', width : '15%'},
			     {field: 'town_city', displayName: 'Town/City', width : '15%', required: true},
			     {field: 'city_typ_descr', displayName: 'Town/City Type',field_key : 'city_typ', width : '10%', required: true},
			     {field: 'pin_code', displayName: 'Pincode', width : '8%', required: true, numeric: true},
			     {field: 'auth_officer', displayName: 'Authorized Officer', width : '12%'},
			     {field: 'nature_of_loc', displayName: 'Location Nature', width : '15%'},
			     {field: 'accting_cd', displayName: 'Accounting Code', width : '10%'},
			     {field: 'org_cd', displayName: 'Organization Code', width : '12%'} ,
			     {field: 'compilation_cd', displayName: 'Compilation Code', width : '12%'},
			     {field: 'userid', displayName: 'User ID', width : '10%', hide : true},
	             {field: 'tmpstp', displayName: 'Time Stamp', width : '13%', hide : true}
			 ],
			 data: [],
		        onRegisterApi: function( gridApi ) { 
		            $scope.omDetailsGridApi = gridApi;
		            var cellTemplate = '<div class="ui-grid-cell-contents text-center"><button class="glyphicon glyphicon-edit" ng-click="grid.appScope.edit_om_details($event,row)" title="Edit"></button></div>';
		            $scope.omDetailsGridApi.core.addRowHeaderColumn({ name: 'Edit', displayName: '', width: '3%', cellTemplate: cellTemplate } );
		 	    }
		};
		
		$scope.load_om_details();
		
		// add function
		$scope.add_om_details = function(e){
			var addOMDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.add,
			    controller: function($scope, $uibModalInstance, $filter, configs, remote){
			    	$scope.header = "Add O&M Details";
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
			    				addr1 : 'O/O THE ASSISTANT EXECUTIVE ENGINEER(EL).',
			    				auth_officer : 'ASSISTANT EXECUTIVE ENGINEER(EL).'
			    			});
			    		}else {
			    			angular.extend($scope.data, {
			    				addr1 : 'O/O THE ASSISTANT ENGINEER(EL).',
			    				auth_officer : 'ASSISTANT ENGINEER(EL).'
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
			    			conn_type : $rootScope.user.connection_type,
			    			location_code: $rootScope.user.location_code
			    		});
			    		console.log(request);
		    			remote.load("upsertomdetails", function(response){
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
			        	return $scope.omDetailsGridOptions.columnDefs;
			        },
			        remote: function(){
			        	return remote;
			        }
			    }
			});
			
			addOMDetailsModalInstance.result.then(function (newRecord) {
				$scope.load_om_details();
			});
			addOMDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric','web-float']);
			});
		};
		
		// edit/update function
		$scope.edit_om_details = function(e,row){
			var editOMDetailsModalInstance = $uibModal.open({
				animation: true,
				backdrop: 'static',
				keyboard: false,
			    templateUrl: templates.modal.edit,
			    controller: function($scope, $uibModalInstance, configs, data, remote){
			    	var data_backup =  angular.copy(data);
			    	$scope.header = "Edit O&M Details";
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
			    				addr1 : 'O/O THE ASSISTANT EXECUTIVE ENGINEER(EL).',
			    				auth_officer : 'ASSISTANT EXECUTIVE ENGINEER(EL).'
			    			});
			    		}else {
			    			angular.extend($scope.data, {
			    				addr1 : 'O/O THE ASSISTANT ENGINEER(EL).',
			    				auth_officer : 'ASSISTANT ENGINEER(EL).'
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
			    			conn_type : $rootScope.user.connection_type,
			    			location_code: $rootScope.user.location_code
			    		});
			    		remote.load("upsertomdetails", function(response){
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
			editOMDetailsModalInstance.rendered.then(function(){
				webValidations.load('addEditForm', $rootScope.popupScope, ['web-required','web-alphanumeric','web-numeric','web-float']);
			});
		}
	}
	
	if(infrastructure_flow === 'transformer_town_mapping'){
		
		$omCode = $('#transformer-town-mapped-details-om-code');
		$stationCode = $('#transformer-town-mapped-details-station-code');
		$feederCode = $('#transformer-town-mapped-details-feeder-code');
		$townCode = $('#transformer-town-mapped-details-town-code');
		
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
		
		//load town details
		var request = {
			conn_type : $rootScope.user.connection_type,
			type : 'T'
		}
		remote.load("gettowndetails", function(response){
			 $scope.Town_List = response.Town_List;
		}, request , 'POST');
		
		$scope.load_transformer_town_mapped_details = function(){
			
			var request = {
					"location_code": $rootScope.user.location_code,
					"om_code" : $omCode.val().trim(),
					"station_code": $stationCode.val().trim(),
					"feeder_code" : $feederCode.val().trim(),
					"conn_type" : $rootScope.user.connection_type
			}
			console.log(request);
			remote.load("getdtctmapdetails", function(response){
				$scope.transformer_town_mapping_details = response.dtc_townmap_details;
				$scope.transformerTownMappingGridOptions.data = response.dtc_townmap_details;
			}, request , 'POST');
		};
		
		$scope.transformerTownMappingGridOptions = {
				showGridFooter: true,
				gridFooterHeight: 20,
				columnDefs: [
		             {field: 'row_num', displayName: '#', width : '4%'},
		             {field: 'dtc_cd', displayName: 'Transformer Code', width : '12%'},
		             {field: 'dtc_name', displayName: 'Transformer Name'},
		             {field: 'town_descr', displayName: 'Town Name',field_key : 'town_cd'},
		             {field: 'userid', displayName: 'User ID', width : '10%'},
		             {field: 'tmpstp', displayName: 'Time Stamp', width : '13%'}
		             
		             ],
		             data: [],
		             onRegisterApi : function(gridApi){
			             	$scope.gridApi = gridApi;
			         }
		};
		
		$scope.transformer_town_mapping_save = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			if(!selected_rows.length){
				notify.warn('Select Trnsformers to Map Town ...');
				return;
			}else if(!$scope.townCode){
				notify.warn('Select Town to Map ...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				userid : $rootScope.user.user_id,
				town_code : $scope.townCode,
				data: selected_rows
			};
			console.log(request);
			remote.load("mapdtctown", function(response){
				$scope.load_transformer_town_mapped_details();
			}, request, 'POST');
		}

		$scope.transformer_town_mapping_clear = function(e){
			$scope.transformer_town_mapping_details = [];
			$scope.transformerTownMappingGridOptions.data = [];
			$omCode.val('').focus();
			$stationCode.val('');
			$feederCode.val('');
			$townCode.val('');
		};
	}
	
	if(infrastructure_flow === 'transformer_transfer'){
		
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
		
		//getrdgdaylist
		var request = {
			"CONN_TYPE": $rootScope.user.connection_type,
			"LOCATION_CODE": $rootScope.user.location_code
		}
		remote.load("getmeterreadingdaylist", function(response){
			$scope.METER_READING_DAY = response.METER_READING_DAY;
		}, request , 'POST');
		
		$scope.get_from_feeder_info = function(){
			var request = {
				"stationCode": $scope.from_station_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			console.log(request);
			remote.load("getFeederList", function(response){
				$scope.fromFeederCodeList = response.FeederCodeList;
			}, request , 'POST');
		}
		
		$scope.get_to_feeder_info = function(){
			var request = {
				"stationCode": $scope.to_station_code,
				"location": $rootScope.user.location_code,
				"conn_type": $rootScope.user.connection_type
			}
			console.log(request);
			remote.load("getFeederList", function(response){
				$scope.toFeederCodeList = response.FeederCodeList;
			}, request , 'POST');
		}
		
		$scope.get_from_transformer_info = function(){
			var request = {
				"stationCode": $scope.from_station_code,
				"feederCode": $scope.from_feeder_code,
				"location": (($scope.from_om_code) ? $scope.from_om_code : $rootScope.user.location_code), 
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getTransformerList", function(response){
				$scope.fromTransformerCodeList = response.TransformerCodeList;
			}, request , 'POST');
		}
		

		$scope.get_to_transformer_info = function(){
			var request = {
				"stationCode": $scope.to_station_code,
				"feederCode": $scope.to_feeder_code,
				"location": (($scope.to_om_code) ? $scope.to_om_code : $rootScope.user.location_code), 
				"conn_type": $rootScope.user.connection_type
			}
			remote.load("getTransformerList", function(response){
				$scope.toTransformerCodeList = response.TransformerCodeList;
			}, request , 'POST');
		}
		
		//LOAD dtc details fortransfer
		$scope.load_transformer_transfer_details = function(){
			
			$scope.transformerTransferGridOptions.data = [];
			
			if(!$scope.from_station_code){
				notify.warn('Please Select From Station..!');
				return;
			}else if(!$scope.from_feeder_code){
				notify.warn('Please Select From Feeder..!');
				return;
			}else if(!$scope.from_om_code){
				notify.warn('Please Select From O&M Unit..!');
				return;
			}else if(!$scope.from_transformer_code){
				notify.warn('Please Select From Transformer..!');
				return;
			}else if(!$scope.from_reading_day){
				notify.warn('Please Select From Reading Day..!');
				return;
			}
			
			var request = {
					"conn_type": $rootScope.user.connection_type,
					"location_code": $rootScope.user.location_code,
					"station_code": $scope.from_station_code,
					"feeder_code" : $scope.from_feeder_code,
					"om_code" : $scope.from_om_code,
					"dtc_code" : $scope.from_transformer_code,
					"reading_day" : $scope.from_reading_day
			}
			console.log(request);
			remote.load("getdtcdetailsfortransfer", function(response){
				$scope.transformer_town_mapping_details = response.dtc_rrno_details;
				$scope.transformerTransferGridOptions.data = response.dtc_rrno_details;
			}, request , 'POST');
		};
		
		
		
		$scope.transformerTransferGridOptions = {
			showGridFooter: true,
			gridFooterHeight: 20,
			columnDefs: [
				{field: 'row_num', displayName: '#', width : '4%'},
				{field: 'rr_no', displayName: 'RR No', width : '10%'},
				{field: 'mr_cd', displayName: 'MR Code', width : '8%'},
				{field: 'rdg_day', displayName: 'Rdg Day', width : '7%'},
				{field: 'spot_folio', displayName: 'Spot Folio', width : '8%'},
				{field: 'pole_no', displayName: 'Pole No', width : '8%'},
				{field: 'status', displayName: 'Status', width : '14%'},
				{field: 'tariff', displayName: 'Tariff', width : '12%'},
				{field: 'load_kw', displayName: 'Load KW', width : '8%'},
				{field: 'load_hp', displayName: 'Load HP', width : '8%'},
				{field: 'load_kva', displayName: 'Load KVA', width : '10%'}

             ],
             data: [],
             onRegisterApi : function(gridApi){
	             $scope.gridApi = gridApi;
	         }
		};
		
		$scope.transformer_transfer_save = function(){
			var selected_rows = $scope.gridApi.selection.getSelectedRows();
			var stn_cd = $scope.to_station_code;
			var fdr_cd = $scope.to_feeder_code;
			var om_cd = $scope.to_om_code;
			var dtc_cd = $scope.to_transformer_code;
			var rdg_day = $scope.to_reading_day;
			if(!selected_rows.length){
				notify.warn('Select RR Numbers to Transfer ...');
				return;
			}else if(!stn_cd){
				notify.warn('Select To Station to Transfer ...');
				return;
			}else if(!fdr_cd){
				notify.warn('Select To Feeder to Transfer ...');
				return;
			}else if(!om_cd){
				notify.warn('Select To O&M Unit to Transfer ...');
				return;
			}else if(!dtc_cd){
				notify.warn('Select To Transformer to Transfer ...');
				return;
			}else if(!rdg_day){
				notify.warn('Select To Reading Day to Transfer ...');
				return;
			}
			var request = {
				conn_type: $rootScope.user.connection_type,
				userid : $rootScope.user.user_id,
				to_station_code : stn_cd,
				to_feeder_code : fdr_cd,
				to_om_code : om_cd,
				to_transformer_code : dtc_cd,
				to_reading_day : rdg_day,
				data: selected_rows
			};
			console.log(request);
			remote.load("dtctransfer", function(response){
				$scope.load_transformer_transfer_details();
			}, request, 'POST');
		}
		
		$scope.transformer_transfer_clear = function(e){
			$scope.dtc_rrno_details = [];
			$scope.transformerTransferGridOptions.data = [];
			$scope.from_station_code = '';
			$scope.to_station_code = '';
			$scope.from_feeder_code = '';
			$scope.to_feeder_code = '';
			$scope.from_om_code = '';
			$scope.to_om_code = '';
			$scope.from_transformer_code = '';
			$scope.to_transformer_code = '';
			$scope.from_reading_day = '';
			$scope.to_reading_day = '';
		};
		
	}

if(infrastructure_flow === 'transformer_meter_master'){
		
		
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

	if(infrastructure_flow === 'transformer_meter_reading'){
		
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
		var assessedconsumptiondetails_temp = [];
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
					assessedconsumptiondetails_temp = angular.copy(response.dtc_assessedentry_details);
				}, request , 'POST');
	    	
	       $('#assessedModal').modal('toggle');
	       
	    };
	    
	    $scope.save_assessed_consumption_details = function(){
	    	
	    	//console.log(1,$scope.assessedconsumptiondetails);
	    //	console.log(2,assessedconsumptiondetails_temp	 );
	    	
	    	if(angular.equals($scope.assessedconsumptiondetails, assessedconsumptiondetails_temp)){
	    		notify.warn("Please do changes to save details !!!");
	    	}else{
	    		
		    	var request = {
						"conn_type": $rootScope.user.connection_type,	
						"location_code" : $rootScope.user.location_code,					
						"assessedconsumptiondetails":$scope.assessedconsumptiondetails
					}
					remote.load("save_assessed_consumption_details", function(response){
						
					}, request , 'POST');
	    		
	    	}
	    	
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
	
if(infrastructure_flow === 'feeder_energy_audit'){
		
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