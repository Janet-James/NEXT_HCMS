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
                      "id" : "Open",
                      "title"  : '<h4 class="caption-subject  bold uppercase" contentEditable="true">Open</h4>',
                      "class" : "info",
                 
                  },
                  
                  {
                      "id" : "Close",
                      "title"  : '<h4 class="caption-subject  bold uppercase" contentEditable="true">Close</h4>',
                     "class" : "warning",
                     
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
		
	
