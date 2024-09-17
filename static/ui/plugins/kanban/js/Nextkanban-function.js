/* NEXT UX2.0 | NEXTKANBAN-FUNCTION.JS
// Version    0.2 | Build 0.1
// Released on | 25 Oct 2017
// © 2017-2018 | www.nexttechnosolutions.com
// ===================================================================================================================*/
//DEFAULT COLUMN DISIPLAY FUNCTION******************************************************************
 var KanbanTest = new Nextkanban({
        element : '#myKanban',
        gutter  : '20px',
        widthBoard : '360px',
        click : function(el){
            console.log(el);
        },
        boards  :[
            {
                "id" : "_project",
                "title"  : '<h3 contentEditable="true">Project</h3>',
                "class" : "primaryTask",
                "item"  : [
                    {
                        "title"  : '<h4 contentEditable="true">Task name</h4> <div class="taskLinks"><a href="#"><i class="fa fa-thumbs-up"></i></a> <a href="#"><i class="fa fa-trash"></i></a> <div class="dropdown pull-right"><a href="#" class="dropdown-toggle account" data-toggle="dropdown"><i class="fa fa-ellipsis-v"></i><ul class="dropdown-menu"><li> <a href="#"> <i class="fa fa-check-square"></i> <span>Select All</span> </a> </li><li> <a href="#"> <i class="fa fa-eye"></i> <span>Read</span> </a> </li><li> <a href="#"> <i class="fa fa-eye-slash"></i> <span>Unread</span> </a> </li><li> <a href="#"> <i class="fa fa-exclamation-triangle"></i> <span>Span</span> </a> </li></ul></div></a></div> <p contentEditable="true">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy </p>',
                    }
                ]
            },
            {
                "id" : "_assigned",
                "title"  : '<h3 contentEditable="true">Assigned</h3>',
               "class" : "infoTask",
                "item"  : [
                    {
                        "title"  : '<h4 contentEditable="true">Task name</h4> <div class="taskLinks"><a href="#"><i class="fa fa-thumbs-up"></i></a> <a href="#"><i class="fa fa-trash"></i></a> <div class="dropdown pull-right"><a href="#" class="dropdown-toggle account" data-toggle="dropdown"><i class="fa fa-ellipsis-v"></i><ul class="dropdown-menu"><li> <a href="#"> <i class="fa fa-check-square"></i> <span>Select All</span> </a> </li><li> <a href="#"> <i class="fa fa-eye"></i> <span>Read</span> </a> </li><li> <a href="#"> <i class="fa fa-eye-slash"></i> <span>Unread</span> </a> </li><li> <a href="#"> <i class="fa fa-exclamation-triangle"></i> <span>Span</span> </a> </li></ul></div></a></div> <p contentEditable="true">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy </p>',
                    }
                ]
            },
            {
                "id" : "_inprogress",
                "title"  : '<h3 contentEditable="true">Inprogress</h3>',
               "class" : "warningTask",
                "item"  : [
                    {
                        "title"  : '<h4 contentEditable="true">Task name</h4> <div class="taskLinks"><a href="#"><i class="fa fa-thumbs-up"></i></a> <a href="#"><i class="fa fa-trash"></i></a> <div class="dropdown pull-right"><a href="#" class="dropdown-toggle account" data-toggle="dropdown"><i class="fa fa-ellipsis-v"></i><ul class="dropdown-menu"><li> <a href="#"> <i class="fa fa-check-square"></i> <span>Select All</span> </a> </li><li> <a href="#"> <i class="fa fa-eye"></i> <span>Read</span> </a> </li><li> <a href="#"> <i class="fa fa-eye-slash"></i> <span>Unread</span> </a> </li><li> <a href="#"> <i class="fa fa-exclamation-triangle"></i> <span>Span</span> </a> </li></ul></div></a></div> <p contentEditable="true">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy </p>',
                    }
                ]
            },
            {
                "id" : "_completed",
                "title"  : '<h3 contentEditable="true">Completed</h3>',
               "class" : "successTask",
                "item"  : [
                    {
                        "title"  : '<h4 contentEditable="true">Task name</h4> <div class="taskLinks"><a href="#"><i class="fa fa-thumbs-up"></i></a> <a href="#"><i class="fa fa-trash"></i></a> <div class="dropdown pull-right"><a href="#" class="dropdown-toggle account" data-toggle="dropdown"><i class="fa fa-ellipsis-v"></i><ul class="dropdown-menu"><li> <a href="#"> <i class="fa fa-check-square"></i> <span>Select All</span> </a> </li><li> <a href="#"> <i class="fa fa-eye"></i> <span>Read</span> </a> </li><li> <a href="#"> <i class="fa fa-eye-slash"></i> <span>Unread</span> </a> </li><li> <a href="#"> <i class="fa fa-exclamation-triangle"></i> <span>Span</span> </a> </li></ul></div></a></div> <p contentEditable="true">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy </p>',
                    }
                ]
            }
        ]
    });

	$(".kanban-container a.add-links").unbind('click').bind('click', function() {
		id = $(this).parent().attr("data-id")
		KanbanTest.addElement(
			""+id+"",
			{
				"title":'<h4 contentEditable="true">Task name</h4> 	<p contentEditable="true">Your Comment</p>',
			}
		);	
	});
	
	/*$( ".del-links" ).click(function() {
	  $(this).parent().remove();
	});*/
//***********************************************************************************************************************************		
    
//ADD COLUMN FUNCTION******************************************************************
    var addBoardDefault = document.getElementById('addDefault');
	var indexVal = 1;
    addBoardDefault.addEventListener('click', function () {
        KanbanTest.addBoards(
            [{
                "id" : "_default_"+indexVal,
				"class" : "setDefault",
                "title"  : '<h3 contentEditable="true">Board</h3> ',
                "item"  : [
                   /* {
                        "title":"Default Item",
                    },
                    {
                        "title":"Default Item 2",
                    },
                    {
                        "title":"Default Item 3",
                    }*/
                ],
            }]
        );
		indexVal++;
		$(".kanban-container a.add-links").unbind('click').bind('click', function() {
		id = $(this).parent().attr("data-id")
		KanbanTest.addElement(
			""+id+"",
			{
				"title"  : '<h4 contentEditable="true">Your Name</h4> 	<p contentEditable="true">Your Comment</p>',
			}
		);	
		
		/*$( ".del-links" ).click(function() {
		  $(this).parent().remove();
		});*/
		
	});
	
    });
//************************************************************************************************************************************	
		
	
