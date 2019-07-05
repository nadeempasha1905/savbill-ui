var cb_app = angular.module('sav_bill',[
                                          'ngRoute','ngTouch','ui.bootstrap','ui.grid','ui.grid.exporter',
                                          'ui.grid.selection','ui.grid.expandable','ui.grid.pinning',
                                          'ui.grid.autoResize',
                                          'initiate_ui','cb_controllers','cb_config','cb_directives',
                                          'cb_utility','cb_validations'
                                         ]);

cb_app.controller('cb_controller',function($scope,$rootScope,$location,$route,$timeout,load_ui,remote,cookie,$window){
	
	if(cookie.check('cb_user')){
		load_ui.routing();
		$rootScope.user = JSON.parse(cookie.get('cb_user'));
		remote.load("validateuserRefresh", function(response){
			$rootScope.menu = response.menus;
			load_ui.scroll();
			load_ui.wow();
		}, {
			userID : $rootScope.user.user_id,
			sessionId : $rootScope.user.SESSION_ID+"",
			userRole : $rootScope.user.role,
			connType : $rootScope.user.connection_type
		}, 'POST', false, false, true);
	}else{
		$rootScope.password_mode = false;
	    $location.path('/login');
	}
	
	 $scope.isCollapsed = true;
	$rootScope.$on('$locationChangeSuccess',function(){
		console.log("19191");
		 $scope.isCollapsed = true;
		 $rootScope.breadcrumb = (window.location.hash).replace('#/','').split('/');	
	});
	
	$rootScope.logout = function(){
		if(cookie.check('cb_user')){
			remote.load("logout", function(response){
				cookie.remove('cb_user');
				$rootScope.user = {};
				$rootScope.menu = {};
				$rootScope.password_mode = false;
				load_ui.loginRouting();
				$window.location.reload();
			}, {
				SESSION_ID : $rootScope.user.SESSION_ID+""
			}, 'POST');
		}else{
			
		}
	}
	
	/*$rootScope.menustoggle = function(menuid,menulength){
		
		for(var i=1;i<menulength;i++){
			$scope.dd+''+i = false;
		}
		
	};*/
	
});

cb_app.run(function($rootScope){
	$rootScope.password_mode = false;
	$rootScope.user = {};
	$rootScope.menu = {};
	$rootScope.breadcrumb = [];
	$rootScope.domain = domain;
	$rootScope.service_domain = service_domain;
	$rootScope.baseURL = baseURL;
	$rootScope.serviceURL = serviceURL;
	//$rootScope.menu = {"MENU":[{"name":"1000000","previlage":"1111","subMenuList":[{"name":"1000001","previlage":"1111","subMenuList":[],"title":"CODE MASTER"},{"name":"1000002","previlage":"1111","subMenuList":[],"title":"CLOUDBILL CONFIG"},{"name":"1000003","previlage":"1111","subMenuList":[],"title":"CLOUDBILL PARAMETER"},{"name":"1000004","previlage":"1111","subMenuList":[],"title":"FORM MASTER"},{"name":"1000005","previlage":"1111","subMenuList":[],"title":"REBATE MASTER"},{"name":"1000006","previlage":"1111","subMenuList":[],"title":"SUB DIVISION DETAILS"},{"name":"1000007","previlage":"1111","subMenuList":[],"title":"BANK DETAILS"},{"name":"1000008","previlage":"1111","subMenuList":[],"title":"USER PREVILEGES"},{"name":"1000009","previlage":"1111","subMenuList":[],"title":"POSTING PRIORITY"}],"title":"MASTER"},{"name":"2000000","previlage":"1111","subMenuList":[{"name":"2000001","previlage":"1111","subMenuList":[],"title":"CUSTOMER MASTER"},{"name":"2000002","previlage":"1111","subMenuList":[],"title":"CUSTOMER MASTER HISTORY"},{"name":"2000003","previlage":"1111","subMenuList":[],"title":"CUSTOMER MASTER SEARCH"},{"name":"2000004","previlage":"1111","subMenuList":[],"title":"CUSTOMER MASTER DETAILS"},{"name":"2000005","previlage":"1111","subMenuList":[],"title":"CUSTOMER REGISTRATION MAIN"},{"name":"2000006","previlage":"1111","subMenuList":[],"title":"CUSTOMER REGION MAPPING"},{"name":"2000007","previlage":"1111","subMenuList":[],"title":"ADD CUSTOMER UPDATIONS"},{"name":"2000008","previlage":"1111","subMenuList":[],"title":"VERIFY CUSTOMER UPDATIONS"},{"name":"2000009","previlage":"1111","subMenuList":[],"title":"APPROVE CUSTOMER UPDATIONS"}],"title":"CUSTOMER"},{"name":"3000000","previlage":"1111","subMenuList":[{"name":"3000001","previlage":"1111","subMenuList":[],"title":"CUSTOMER DEPOSITS"},{"name":"3000002","previlage":"1111","subMenuList":[],"title":"DEPOSIT REPORTS"},{"name":"3000003","previlage":"1111","subMenuList":[],"title":"DEPOSIT REFUND REPORT"},{"name":"3000004","previlage":"1111","subMenuList":[],"title":"GENERATE 3MMD AND SEC DEP INT"},{"name":"3000005","previlage":"1111","subMenuList":[],"title":"DEPOSIT INTEREST REPORT(APPROVED)"}],"title":"DEPOSITS"},{"name":"4000000","previlage":"1111","subMenuList":[{"name":"4000001","previlage":"1111","subMenuList":[],"title":"SEARCH PAYMENTS"},{"name":"4000002","previlage":"1111","subMenuList":[],"title":"LIST OF PAYMENT"},{"name":"4000003","previlage":"1111","subMenuList":[],"title":"UPLOAD RECEIPTS"},{"name":"4000004","previlage":"1111","subMenuList":[],"title":"POST TO RECEIPTS"},{"name":"4100000","previlage":"1111","subMenuList":[{"name":"4100001","previlage":"1111","subMenuList":[],"title":"AUTOMATIC RECEIPTS"},{"name":"4100002","previlage":"1111","subMenuList":[],"title":"RECEIPT CANCELLATION"},{"name":"4100003","previlage":"1111","subMenuList":[],"title":"CHEQUE/DD CANCELLATION"},{"name":"4100004","previlage":"1111","subMenuList":[],"title":"UPLOAD HRT RECEIPTS"},{"name":"4100005","previlage":"1111","subMenuList":[],"title":"HRT REPOTS"}],"title":"HRT"},{"name":"4200000","previlage":"1111","subMenuList":[{"name":"4200001","previlage":"1111","subMenuList":[],"title":"CASH COUNTER"},{"name":"4200002","previlage":"1111","subMenuList":[],"title":"MISCELLENEOUS"},{"name":"4200003","previlage":"1111","subMenuList":[],"title":"TARIFFWISE REMOTE PAYMENT"},{"name":"4200004","previlage":"1111","subMenuList":[],"title":"AMOUNT WISE PAYMENT DETAILS"},{"name":"4200005","previlage":"1111","subMenuList":[],"title":"B1 RECEIPT CANCEL REPORT"},{"name":"4200006","previlage":"1111","subMenuList":[],"title":"ABSTRACT/TARIFF/PURPOSE REPORT"},{"name":"4200007","previlage":"1111","subMenuList":[],"title":"ABSTRACT 3MMD MR/TRF WISE REPORT"},{"name":"4200008","previlage":"1111","subMenuList":[],"title":"REPOSTED RECEIPT REPORT"}],"title":"REPORTS"},{"name":"4300000","previlage":"1111","subMenuList":[{"name":"4300001","previlage":"1111","subMenuList":[],"title":"INITIALCASHBOOK"},{"name":"4300002","previlage":"1111","subMenuList":[],"title":"VIEW CASH BOOK"},{"name":"4300003","previlage":"1111","subMenuList":[],"title":"CASH BOOK TRANSACTION"},{"name":"4300004","previlage":"1111","subMenuList":[],"title":"CASHBOOK RECPT PAYMT REPORT"},{"name":"4300005","previlage":"1111","subMenuList":[],"title":"CASH BALANCE REPORT"}],"title":"CASH BOOK"}],"title":"CASH SECTION"},{"name":"5000000","previlage":"1111","subMenuList":[{"name":"5000001","previlage":"1111","subMenuList":[],"title":"VIEW BILLS"},{"name":"5000002","previlage":"1111","subMenuList":[],"title":"LIST BILL DETAILS"},{"name":"5000003","previlage":"1111","subMenuList":[],"title":"BILL CANCELLATION"},{"name":"5000004","previlage":"1111","subMenuList":[],"title":"FOLIO REGENERATION"},{"name":"5000005","previlage":"1111","subMenuList":[],"title":"FL SANCTION"},{"name":"5000006","previlage":"1111","subMenuList":[],"title":"REBATE DETAILS"},{"name":"5000007","previlage":"1111","subMenuList":[],"title":"REGULAR PENALTY"},{"name":"5000008","previlage":"1111","subMenuList":[],"title":"ECS MANDATE FORM"},{"name":"5000009","previlage":"1111","subMenuList":[],"title":"AWP SUSPENSE TRANSFER"},{"name":"5100000","previlage":"1111","subMenuList":[{"name":"5100001","previlage":"1111","subMenuList":[],"title":"READING ENTRY"},{"name":"5100002","previlage":"1111","subMenuList":[],"title":"READING MODIFICATION"},{"name":"5100003","previlage":"1111","subMenuList":[],"title":"READING SHEETS"},{"name":"5100004","previlage":"1111","subMenuList":[],"title":"ETV METER RDG ENTRY"},{"name":"5100005","previlage":"1111","subMenuList":[],"title":"ETV METER RDG MODIFICATION"},{"name":"5100006","previlage":"1111","subMenuList":[],"title":"METER DETAIL/ASSIGN"},{"name":"5100007","previlage":"1111","subMenuList":[],"title":"METER RATING DETAIL"}],"title":"METER READING"},{"name":"5200000","previlage":"1111","subMenuList":[{"name":"5200001","previlage":"1111","subMenuList":[],"title":"DEBIT DETAILS"},{"name":"5200002","previlage":"1111","subMenuList":[],"title":"APPROVE"},{"name":"5200003","previlage":"1111","subMenuList":[],"title":"JV DEBITS"}],"title":"DEBITS"},{"name":"5300000","previlage":"1111","subMenuList":[{"name":"5300001","previlage":"1111","subMenuList":[],"title":"CREDIT DETAILS"},{"name":"5300002","previlage":"1111","subMenuList":[],"title":"APPROVAL"},{"name":"5300003","previlage":"1111","subMenuList":[],"title":"APPROVAL(DEPOSIT INTEREST)"},{"name":"5300004","previlage":"1111","subMenuList":[],"title":"APPROVAL(BULK JVS)"}],"title":"CREDITS"},{"name":"5400000","previlage":"1111","subMenuList":[{"name":"5400001","previlage":"1111","subMenuList":[],"title":"WITHDRAWAL DETAILS"},{"name":"5400002","previlage":"1111","subMenuList":[],"title":"WITHDRAWAL APPROVAL"}],"title":"WITHDRAWAL"}],"title":"ACCOUNTS"},{"name":"6000000","previlage":"1111","subMenuList":[{"name":"6000001","previlage":"1111","subMenuList":[],"title":"BILLING EFFICIENCY"},{"name":"6000002","previlage":"1111","subMenuList":[],"title":"COLLECTION EFFICIENCY"},{"name":"6000003","previlage":"1111","subMenuList":[],"title":"BILLING CANCELLATION"},{"name":"6000004","previlage":"1111","subMenuList":[],"title":"DEBIT AND WITHDRAWAL"},{"name":"6000005","previlage":"1111","subMenuList":[],"title":"CREDIT REPORTS"},{"name":"6000006","previlage":"1111","subMenuList":[],"title":"ADJUSTMENT REPORT"},{"name":"6000007","previlage":"1111","subMenuList":[],"title":"REVENUE REPORT"},{"name":"6000008","previlage":"1111","subMenuList":[],"title":"DL & MNR REPORT"},{"name":"6000009","previlage":"1111","subMenuList":[],"title":"PRESENT READING LESSER THEN PREVIOUS"},{"name":"6100000","previlage":"1111","subMenuList":[{"name":"6100001","previlage":"1111","subMenuList":[],"title":"COMMERCIAL PARAMETER"},{"name":"6100002","previlage":"1111","subMenuList":[],"title":"ABNORMAL/SUBNORMAL CONSUMPTION ON LOAD REPORT"},{"name":"6100003","previlage":"1111","subMenuList":[],"title":"DOOR LOCK & FAULTY  MNR METER"},{"name":"6100004","previlage":"1111","subMenuList":[],"title":"ZERO CONSUMPTION INSTALLATION"}],"title":"COMMERCIAL WING AND TECHNICAL"}],"title":"REPORTS"},{"name":"7000000","previlage":"1111","subMenuList":[{"name":"7000001","previlage":"1111","subMenuList":[],"title":"BILL GENERATION"},{"name":"7000002","previlage":"1111","subMenuList":[],"title":"BILL PRINT"},{"name":"7000003","previlage":"1111","subMenuList":[],"title":"RECONCILIATION"},{"name":"7000004","previlage":"1111","subMenuList":[],"title":"TRANSFER"},{"name":"7000005","previlage":"1111","subMenuList":[],"title":"HHD DOWN/UPLOAD"},{"name":"7100000","previlage":"1111","subMenuList":[{"name":"7100001","previlage":"1111","subMenuList":[],"title":"ATP MASTER DATA EXTRACT"},{"name":"7100001","previlage":"1111","subMenuList":[],"title":"BILL MASTER DATA EXTRACT"},{"name":"7100001","previlage":"1111","subMenuList":[],"title":"CONSUMER MASTER DATA EXTRACT"},{"name":"7100001","previlage":"1111","subMenuList":[],"title":"ATP MASTER DATA EXTRACT"},{"name":"7100001","previlage":"1111","subMenuList":[],"title":"CONSUMER MASTER DATA EXTRACT"},{"name":"7100001","previlage":"1111","subMenuList":[],"title":"CONSUMER MASTER DATA EXTRACT"},{"name":"7100001","previlage":"1111","subMenuList":[],"title":"ATP MASTER DATA EXTRACT"},{"name":"7100001","previlage":"1111","subMenuList":[],"title":"BILL MASTER DATA EXTRACT"},{"name":"7100001","previlage":"1111","subMenuList":[],"title":"BILL MASTER DATA EXTRACT"}],"title":"DATA EXTRACT"}],"title":"MAIN"},{"name":"8000000","previlage":"1111","subMenuList":[{"name":"8000001","previlage":"1111","subMenuList":[],"title":"STATION DETAILS"},{"name":"8000002","previlage":"1111","subMenuList":[],"title":"FEEDER DETAILS"},{"name":"8000003","previlage":"1111","subMenuList":[],"title":"TRANSFORMER DETAILS"},{"name":"8000004","previlage":"1111","subMenuList":[],"title":"O&M DETAILS"},{"name":"8000005","previlage":"1111","subMenuList":[],"title":"TECHNICAL REPORTS"},{"name":"8000006","previlage":"1111","subMenuList":[],"title":"DTC REPORT"},{"name":"8000007","previlage":"1111","subMenuList":[],"title":"DTC TRANSFER"},{"name":"8000008","previlage":"1111","subMenuList":[],"title":"TRANSFORMER TOWN MAPPING"}],"title":"INFRASTRUCTURE"},{"name":"9000000","previlage":"1111","subMenuList":[{"name":"9000001","previlage":"1111","subMenuList":[],"title":"DTC MTR MASTER"},{"name":"9000002","previlage":"1111","subMenuList":[],"title":"DTC MTR READING ENTRY"},{"name":"9000003","previlage":"1111","subMenuList":[],"title":"DTC REPORT"},{"name":"9000004","previlage":"1111","subMenuList":[],"title":"TEAS ABSTRACT REPORT"},{"name":"9000005","previlage":"1111","subMenuList":[],"title":"FEEDER ENERGY AUDIT"}],"title":"ENERGY AUDIT"},{"name":"A000000","previlage":"1111","subMenuList":[{"name":"A000001","previlage":"1111","subMenuList":[],"title":"USER GROUP"},{"name":"A000002","previlage":"1111","subMenuList":[],"title":"USER MASTER"},{"name":"A000003","previlage":"1111","subMenuList":[],"title":"VIEW-MODIFY LOGIN STATUS"},{"name":"A000004","previlage":"1111","subMenuList":[],"title":"CHANGE PASSWORD"},{"name":"A000005","previlage":"1111","subMenuList":[],"title":"DELEGATE USER"}],"title":"USER"}]};
	//$rootScope.user = {'actual_role': "AAO",'circle': "FCS CIRCLE",'company': "MESCOM",'connection_type': "LT",'division': "FCS DIVISION",'location_code': "2110105",'name': "MELWIN DESOZA",'role': "AAO",'subDivision': "FCS SUB-DIVISION",'user_id': "AAO",'zone': "FCS ZONE"}
});
