var templates = {
	'login' : baseURL +'app/templates/login.html',
	'home' : baseURL +'app/templates/home.html',
	'header' : baseURL +'app/templates/header.html',
	'menu' : baseURL +'app/templates/menu.html',
	'breadcrumb' : baseURL +'app/templates/breadcrumb.html',
	'modal' : {
		'add' : baseURL +'app/templates/modal/add_edit_modal.html',
		'edit' : baseURL +'app/templates/modal/add_edit_modal.html',
		'add_frames' : baseURL +'app/templates/modal/add_edit_frames_modal.html',
		'edit_frames' : baseURL +'app/templates/modal/add_edit_frames_modal.html',
		'view_bill' : baseURL +'app/templates/modal/view_bill_modal.html',
		'meter_reading_entry' : baseURL +'app/templates/modal/meter_reading_entry_modal.html',
		'customer_master_temp_renewal' : baseURL + 'app/templates/modal/customer_master_temp_renewal_modal.html',
		'new_withdrawal_entry_modal' : baseURL + 'app/templates/modal/new_withdrawal_entry_modal.html',
		'assign_remove_meter_modal' : baseURL + 'app/templates/modal/assign_remove_meter_details.html'
	},
	'master' : {
		
		'code_master' : baseURL +'app/templates/master/code_master.html',
		'bill_config' : baseURL +'app/templates/master/cloudbill_config.html',
		'bill_parameter' : baseURL +'app/templates/master/cloudbill_parameter.html',
		'form_master' : baseURL +'app/templates/master/form_master.html',
		'form_previleges' : baseURL +'app/templates/master/form_previleges.html',
		'tariff_master' : baseURL +'app/templates/master/tariff_master.html',
		'sub_division_details' : baseURL +'app/templates/master/sub_division_details.html',
		'bank_details' : baseURL +'app/templates/master/bank_details.html',
		'rebate_master' : baseURL +'app/templates/master/rebate_master.html',
		'posting_priority' : baseURL +'app/templates/master/posting_priority.html',
		'cheque_dis_penalty' : baseURL +'app/templates/master/cheque_dis_penalty.html',
		'contractor_master' : baseURL +'app/templates/master/contractor_master.html',
		'meter_reader_master' : baseURL +'app/templates/master/meter_reader_master.html',
		'pre_dominant_master' : baseURL +'app/templates/master/pre_dominant_master.html',
		'appeal_amount' : baseURL +'app/templates/master/appeal_amount.html',
		'designation_details' : baseURL +'app/templates/master/designation_details.html',
		'hhd_down_and_upload_view' : baseURL +'app/templates/master/hhd_down_and_upload_view.html'
	},
	'customer' : {
		'customer_master' : baseURL +'app/templates/customer/customer_master.html',
		'customer_history' : baseURL +'app/templates/customer/customer_history.html',
		'customer_details' : baseURL +'app/templates/customer/customer_details.html',
		'customer_search' : baseURL +'app/templates/customer/customer_search.html',
		'add_customer_updations' : baseURL +'app/templates/customer/add_customer_updations.html',
		'verify_customer_updations' : baseURL +'app/templates/customer/verify_customer_updations.html', 
		'approve_customer_updations' : baseURL +'app/templates/customer/approve_customer_updations.html',
		'customer_region_mapping' : baseURL +'app/templates/customer/customer_region_mapping.html',
	},
	'deposits' : {
		'customer_deposits' : baseURL +'app/templates/deposits/customer_deposits.html',
		'generate_add_mmd_and_deposits_intrest' : baseURL +'app/templates/deposits/generate_add_mmd_and_deposits_intrest.html',
		'deposit_interest_approval' : baseURL +'app/templates/deposits/deposit_interest_approval.html'
	},
	'cash_section' : {
		'reports' : {
			'cash_counter' : baseURL +'app/templates/cash_section/reports/cash_counter.html'
		},
		'search_payments' : baseURL +'app/templates/cash_section/search_payments.html',
		'list_of_payment' : baseURL +'app/templates/cash_section/list_of_payment.html',
		'receipts_posting' : baseURL +'app/templates/cash_section/receipts_posting.html',
		'receipts_generation' : baseURL +'app/templates/cash_section/receipts_generation.html',
		'manual_receipts_generation' : baseURL +'app/templates/cash_section/manual_receipts_generation.html',
		'receipt_cheque_cancellation' : baseURL +'app/templates/cash_section/receipt_cheque_cancellation.html',
		'receipt_cheque_cancellation_hrt' : baseURL +'app/templates/cash_section/receipt_cheque_cancellation_hrt.html',
		'upload_manual_receipts' : baseURL +'app/templates/cash_section/upload_manual_receipts.html'
	},
	'accounts' : {
		'debits' : {
			'debit_details' : baseURL +'app/templates/accounts/debits/debit_details.html',
			'debits_approve' : baseURL +'app/templates/accounts/debits/debits_approve.html'
		},
		'credits' : {
			'credit_details' : baseURL +'app/templates/accounts/credits/credit_details.html',
			'credits_approval' : baseURL +'app/templates/accounts/credits/credits_approval.html',
			'bulk_credits_approval' : baseURL +'app/templates/accounts/credits/bulk_credits_approval.html'
		},
		'withdrawal' : {
			'withdrawal_details' : baseURL +'app/templates/accounts/withdrawal/withdrawal_details.html',
			'withdrawal_approval' : baseURL +'app/templates/accounts/withdrawal/withdrawal_approval.html'
		},
		'meter_reading' : {
			'reading_entry' : baseURL +'app/templates/accounts/meter_reading/reading_entry.html',
			'reading_modification' : baseURL +'app/templates/accounts/meter_reading/reading_entry.html',
			'meter_details' : baseURL +'app/templates/accounts/meter_reading/meter_details.html',
			'meter_rating_detail' : baseURL +'app/templates/accounts/meter_reading/meter_rating_detail.html'
		},
		'view_bills' : baseURL +'app/templates/accounts/view_bills.html',
		'view_bills_expansion' : baseURL +'app/templates/accounts/view_bills_expansion.html',
		'list_bill_details' : baseURL +'app/templates/accounts/list_bill_details.html',
		'fl_sanction' : baseURL +'app/templates/accounts/fl_sanction.html',
		'rebate_details' : baseURL +'app/templates/accounts/rebate_details.html',
		'regular_penalty' : baseURL +'app/templates/accounts/regular_penalty.html',
		'ecs_details' : baseURL +'app/templates/accounts/ecs_details.html',
		'cheque_dishonour' : baseURL +'app/templates/accounts/cheque_dishonour.html',
		'other_cheque_dishonour' : baseURL +'app/templates/accounts/other_cheque_dishonour.html',
		'manual_average_unit_fixation' : baseURL +'app/templates/accounts/manual_average_unit_fixation.html',
		'adjustments' : baseURL +'app/templates/accounts/adjustments.html',
		'disconnection' : baseURL +'app/templates/accounts/disconnection.html',
		'reconnection' : baseURL +'app/templates/accounts/reconnection.html',
		'bill_cancellation' : baseURL +'app/templates/accounts/bill_cancellation.html',
		'spot_folio_regeneration' : baseURL +'app/templates/accounts/spot_folio_regeneration.html'
	},
	'infrastructure' : {
		'station_details' : baseURL +'app/templates/infrastructure/station_details.html' ,
		'feeder_details' : baseURL +'app/templates/infrastructure/feeder_details.html' ,
		'transformer_details' : baseURL +'app/templates/infrastructure/transformer_details.html' ,
		'o&m_details' : baseURL +'app/templates/infrastructure/o&m_details.html' ,
		'transformer_town_mapping' : baseURL +'app/templates/infrastructure/transformer_town_mapping.html',
		'transformer_transfer' : baseURL +'app/templates/infrastructure/transformer_transfer.html'
	},
	'energy_audit' : {
		'transformer_meter_master' : baseURL +'app/templates/energy_audit/transformer_meter_master.html',
		'transformer_meter_reading' : baseURL +'app/templates/energy_audit/transformer_meter_reading.html',  
		'feeder_energy_audit' : baseURL +'app/templates/energy_audit/feeder_energy_audit.html' 
	},
	'user' : {
		'user_roles' : baseURL +'app/templates/user/user_roles.html',
		'user_master' : baseURL +'app/templates/user/user_master.html',
		'user_session_details' : baseURL +'app/templates/user/user_session_details.html',
		'change_password' : baseURL +'app/templates/user/change_password.html',
		'delegate_user' : baseURL +'app/templates/user/delegate_user.html'
	},
	'main' : {
		'bill_generation' : baseURL +'app/templates/main/bill_generation.html',
		'bill_print' : baseURL +'app/templates/main/bill_print.html',
		'transfer' : baseURL +'app/templates/main/transfer.html',
		'reconciliation' : baseURL +'app/templates/main/reconciliation.html',
		'process_details' : baseURL +'app/templates/main/process_details.html'
	},
	'reports' : {
		'reports' : baseURL +'app/templates/reports/reports_new.html',
		'billing_efficiency' : baseURL +'app/templates/reports/billingefficiency.html'
	}
}
