$(document).ready(function(){
	view_button_create();
	$(".select2-search__field").attr('placeholder',"-- Select Employee --");
}); 

function view_button_create(){
	strAppend = " <button type='button' onclick='id_card_print_button()' class='btn btn-primary btn-eql-wid btn-animate ' style='left: 518px;'>Print</button>"
		$('#id_card_print_btn').html(strAppend);
}

function id_card_print_button(){
	var employee_id_list = [];
	$.each($("#card_employee_id option:selected"), function(){     
		employee_id_list.push($(this).val());
	});
	if(employee_id_list.length>0){
		$.ajax({
			url : "/id_card_emploee_id/",
			type : "POST",
			data : {'id':JSON.stringify(employee_id_list)},
			async:false,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			//console.log(data.employee_data)
			pdf_employee_data(data.employee_data)
		});
	}else{
		alert_lobibox("error", "Please select one employee");
	}

}

function select_all_employee(employee_val){

	if (employee_val.checked == true){
		/*	$("#card_employee_id").select2({
	        dropdownParent: $("#select_employee")
	});*/

		$('#card_employee_id').each(function () {
			$('#card_employee_id option').attr("selected", true).trigger('change');
		});


	}else{
		$('#card_employee_id').each(function () {
			$('#card_employee_id option').attr("selected", false).trigger('change');
		});
		$("card_employee_id").select2("refresh")
		//	 $('#card_employee_id option').attr("selected", false).trigger('change');
//		$('#card_employee_id').val(0).trigger('change');
		$(".select2-search__field").attr('placeholder',"-- Select Employee --");
	}

	//$('#select_employee option').prop('selected', true);
}

function pdf_employee_data(data){
	//var doc = new jsPDF('p', 'pt', 'a4');
	var pdf_datas = []
	let front_content = '';
	let back_content = '';
	count = 0;
	let div_status = 0
	let page_no = 1;
	first = ''
	second =  '';
	third =  '';
	fourth =  '';
	fifth =  '';
	sixth =  '';
	seventh = ''
	eighth= '';
	ninth ='';
	for(var i=0;i<data.length;i++){
		if(count == 9){
			page_no += 1;
			front_content += front_pdf(data[i].employee_name,data[i].last_name,data[i].employee_id,data[i].image_name,data[i].emp_id)+'</div><div class="page-break"></div><p style="text-align:center">Page No - '+page_no+'</p>';
			back_content += back_pdf(data,i)+'</div><div class="page-break"></div><p style="text-align:center">Page No - '+page_no+'</p>';
			count = 0;
		}else{
			if(count == 0){
				front_content += '<div class="overall-outer-div">'+front_pdf(data[i].employee_name,data[i].last_name,data[i].employee_id,data[i].image_name,data[i].emp_id)
				//back_content += '<div class="overall-outer-div">'+back_pdf(data,i)
				//first = '<div class="overall-outer-div">'+back_pdf(data,i)
				first = back_pdf(data,i)+'</div>'
			}else{

				front_content += front_pdf(data[i].employee_name,data[i].last_name,data[i].employee_id,data[i].image_name,data[i].emp_id)
				//back_content += back_pdf(data,i)
				if (count==1)
				second =  back_pdf(data,i);
				else if (count==2)
				third =  '<div class="overall-outer-div">'+back_pdf(data,i);
				else if (count==3)
				fourth =  back_pdf(data,i)+'</div>';
				else if (count==4)
				fifth =  back_pdf(data,i);
				else if (count==5)
				sixth =  '<div class="overall-outer-div">'+back_pdf(data,i);
				else if (count==6)
					seventh =  back_pdf(data,i)+'</div>';
				else if (count==7)
					eighth =  back_pdf(data,i);
				else if (count==8)
					ninth =  '<div class="overall-outer-div">'+back_pdf(data,i);
			}
			count += 1
		}
		
	}
	//back_content = first+second+third+fourth+fifth+sixth;
	back_content = third+second+first;
	back_content = back_content +sixth+fifth+fourth;
	back_content = back_content +ninth+eighth+seventh
	//console.log(back_content)
	//console.log('cccc',front_content)
	//let html_front_data = '<div class="ID-Cards"><p style="text-align:center">Page No - '+1+'</p>'+front_content+'</div>'
	//let html_back_data = '<div class="ID-Cards back_side"><p style="text-align:center">Page No - '+1+'</p><div class="overall-outer-div">'+back_content+'</div>'
	let html_front_data = front_content+'<div class="clearfix"></div>'
	 html_back_data = back_content
	let html_data = html_front_data+'<div class="page-break"></div>'+html_back_data
	/*$('#test').html(html_data);
	$('#test .back_side #overall-outer-div>.back-page-sec').each(function(){
		
	});*/
	if (html_data){
		$.ajax({
			url : "/pdf_data/",
			type : "POST",
			data : {'pdf_data':JSON.stringify(html_data)},
			async : true,
		}).done( function(json_data) {
			data = JSON.parse(json_data);
			let path = '/media/'+data.path
			var file_name = '<a  title="Download Offer" id="employee_id_card_download" class="btn btn-success btn-eql-wid btn-animate" href="'
				+ path
				+ '" download="'
				+ 'Employee_ID_Cards.pdf'
				+ '"><i class="offer_report nf nf-download"></i></a>';
			$('#pdf_download').html(file_name);
			alert_lobibox("success", "Employee ID PDF Generated Successfully. Please wait few seconds.");
			setTimeout(function(){$('#employee_id_card_download')[0].click(); }, 1000);
		});
	}

	//pdf_datas.push(pdf_content)
}

function front_pdf(first_name,last_name,id,image,emp_id){
	let front_content = `
	<div class="front-page-sec">
    <div class="two-div-sec">
       <div class="emp_info">
          <h2 class="left-name-sec"> ${first_name} <span style="color:#c0bebe">${last_name}</span></h2>
          <h4 class="left-name-sec2"><span style="color:#c0bebe">EMP ID </span> ${id}</h4>
       </div>
       <div class="right-img-sec"><img src="/home/next/HCMS-next_hcms/static/employee_id_card_photos/${emp_id}.png"/></div>
    </div>
    <footer><img src="/home/next/HCMS-next_hcms/static/new_id_card_images/footer.jpg"></footer>
 </div>`
 
	return front_content;
}

function back_pdf(data,i){
	return back_content = `<div class="back-page-sec">
	<div class="two-div-sec">
	<div class="for-you">
	<h2><b>For You</b></h2>
	<span style="font-size: 6px; color:#666565;">In case of emergency <br> Please contact </span><br>
	<span style="font-size: 6px; color:#666565;">My Permanent address</span><br>
	<span style="font-size: 6px; font-weight: bold;">${data[i].permanent_address}</span><br><br>
	<span style="font-size: 6px; color:#666565;"> Emergency Contact No</span><br>
	<span style="font-size: 6px; font-weight: bold;">+91 ${data[i].emer_contact1}</span><br>
	<span style="font-size: 6px; font-weight: bold;">+91 ${data[i].emer_contact2}</span><br>
	<span style="font-size: 6px; font-weight: bold;">+91 ${data[i].emer_contact3}</span><br><br>
	<span style="font-size: 6px; color:#666565;">My Blood group</span><br>
	<span class="blood">${data[i].blood_group}</span>
		</div>
		<div class="myself">
		<h2><b>Myself</b></h2>
		<span style="font-size: 6px; color:#666565;">Date of Birth</span><br>
		<span style="font-size: 6px; font-weight: bold; display:block; margin-bottom:5px;">${data[i].date_of_birth} <br></span>
		<span style="font-size: 6px; color:#666565;">Date of Joining</span><br>
		<span style="font-size: 6px; font-weight: bold; display:block; margin-bottom:5px;">${data[i].date_of_join} <br></span>
		<span style="font-size: 6px; color:#666565;">My Contact no</span><br>
		<span style="font-size: 6px; font-weight: bold;">+91 ${data[i].work_mobile} <br></span><br><br><br>
		<span style="font-size: 6px; color:#666565; display:block; margin-bottom:5px;">Authorised Signature</span>
		<span style="font-size: 6px; color:#666565;">Company contact address</span><br>
		<span style="font-size: 6px; font-weight: bold;"><b>NEXT Techno Enterprises PVT LTD</b></span><br>
		<span style="font-size: 6px; font-weight: 500;">Module No: 308/1, Third Floor<br>
		ELCOT IT/ITES-SEZ,TIDEL PARK<br>
		Coimbatore - 641 014, Tamil Nadu<br>
		+91 422-2971111/1112/1113 <img src="/home/next/HCMS-next_hcms/static/new_id_card_images/phone.png" width="4%" /><br>www.nexttechnosolutions.com <img src="/home/next/HCMS-next_hcms/static/new_id_card_images/web.png" width="4%" /> <br></span><br><br>
		</div>
		</div>
		<div class="back-footer"><img src="/home/next/HCMS-next_hcms/static/new_id_card_images/footer.jpg"></div>
		</div>`

}




