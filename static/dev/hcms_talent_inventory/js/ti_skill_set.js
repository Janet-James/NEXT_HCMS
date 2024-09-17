var rd_skill_set_tech_table;
var rd_skill_set_func_table;
var rd_skill_set_behv_table;
$( document ).ready(function() {
	rd_skill_set_tech_table = basic_datatable('rd_skill_set_tech_tbl'); // 12-Feb-2018 || SMI || Data Table Formation for Technical Competencies
	rd_skill_set_func_table = basic_datatable('rd_skill_set_func_tbl'); // 12-Feb-2018 || SMI || Data Table Formation for Functional Competencies
	rd_skill_set_behv_table = basic_datatable('rd_skill_set_behv_tbl'); // 12-Feb-2018 || SMI || Data Table Formation for Functional Competencies
})

//27-Feb-2018 || MST || Radio Button On click event

$(".tech_check_box").click(function(){	
	var tech_name = $(this).attr('name');
	tech_name = tech_name.trim()
	var tech_val = tech_name.split("rd_ss_tech_applicable")[1];
	tech_val = tech_val.trim()
	jQuery('input[name="'+tech_name+'"]').change(function(){
		if (jQuery(this).is(':checked')) {
			jQuery(this).closest('tr').find('button').prop("disabled", false);
			jQuery('input[name="rd_ss_tech_lvl'+tech_val+'"]').prop("disabled", false);
		} else {
			jQuery(this).closest('tr').find('.comp_dept').multiselect("clearSelection");
			jQuery(this).closest('tr').find('button').prop("disabled", true);
			jQuery('input[name="rd_ss_tech_lvl'+tech_val+'"]').prop("disabled", true);
			jQuery('input[name="rd_ss_tech_lvl'+tech_val+'"]').prop("checked", false);
		}
	});
});

$(".func_check_box").click(function(){	
	var func_name = $(this).attr('name');
	func_name = func_name.trim()
	var func_val = func_name.split("rd_ss_func_applicable")[1];
	func_val = func_val.trim()
	jQuery('input[name="'+func_name+'"]').change(function(){
		if (jQuery(this).is(':checked')) {
			jQuery(this).closest('tr').find('button').prop("disabled", false);
			jQuery('input[name="rd_ss_func_lvl'+func_val+'"]').prop("disabled", false);
		} else {
			jQuery(this).closest('tr').find('.comp_dept').multiselect("clearSelection");
			jQuery(this).closest('tr').find('button').prop("disabled", true);
			jQuery('input[name="rd_ss_func_lvl'+func_val+'"]').prop("disabled", true);
			jQuery('input[name="rd_ss_func_lvl'+func_val+'"]').prop("checked",false);
		}
	});
});

$(".behv_check_box").click(function(){	
	var behv_name = $(this).attr('name');
	behv_name = behv_name.trim()
	var behv_val = behv_name.split("rd_ss_behv_applicable")[1];
	behv_val = behv_val.trim()
	jQuery('input[name="'+behv_name+'"]').change(function(){
		if (jQuery(this).is(':checked')) {
			jQuery(this).closest('tr').find('button').prop("disabled", false);
			jQuery('input[name="rd_ss_behv_lvl'+behv_val+'"]').prop("disabled", false);
		} else {
			jQuery(this).closest('tr').find('.comp_dept').multiselect("clearSelection");
			jQuery(this).closest('tr').find('button').prop("disabled", true);
			jQuery('input[name="rd_ss_behv_lvl'+behv_val+'"]').prop("disabled", true);
			jQuery('input[name="rd_ss_behv_lvl'+behv_val+'"]').prop("checked", false);
		}
	});
});