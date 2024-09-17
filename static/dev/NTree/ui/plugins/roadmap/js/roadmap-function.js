/* NEXT UX2.0 | ROADMAP-FUNCTION.JS
// Version    0.2 | Build 2
// Released on | 25 Oct 2017
// © 2017-2018 | www.nexttechnosolutions.com
=====================================================*/

  // create groups
  var numberOfGroups = 3; 
  var groups = new vis.DataSet()
  for (var i = 0; i < numberOfGroups; i++) {
    groups.add({
      id: i,
      content: 'Event&nbsp;' + i
    })
  }
  
  // create items
  var numberOfItems = 10;
  var items = new vis.DataSet();
 
  var itemsPerGroup = Math.round(numberOfItems/numberOfGroups);
 
  for (var truck = 0; truck < numberOfGroups; truck++) {
    var date = new Date();
    for (var order = 0; order < itemsPerGroup; order++) {
      date.setHours(date.getHours() +  4 * (Math.random() < 0.2));
      var start = new Date(date);
 
      date.setHours(date.getHours() + 2 + Math.floor(Math.random()*4));
      var end = new Date(date);
 
      items.add({
        id: order + itemsPerGroup * truck,
        group: truck,
        start: start,
        end: end,
        content: 'Product Plan ' + order
      });
    }
  }
  
  // specify options
  var options = {
    stack: true,
    start: new Date(),
    end: new Date(1000*60*60*24 + (new Date()).valueOf()),
    editable: true,
    orientation: 'top'
  };
 
  // create a Timeline
  var container = document.getElementById('mytimeline');
  timeline1 = new vis.Timeline(container, items, groups, options);
 
  function handleDragStart(event) {
    dragSrcEl = event.target;
 
    event.dataTransfer.effectAllowed = 'move';
    var itemType = event.target.innerHTML.split('-')[1].trim();
    var item = {
      id: new Date(),
      type: itemType,
      content: event.target.innerHTML.split('-')[0].trim()
    };
 
    var isFixedTimes = (event.target.innerHTML.split('-')[2] && event.target.innerHTML.split('-')[2].trim() == 'fixed times')
    if (isFixedTimes) {
      item.start = new Date();
      item.end = new Date(1000*60*10 + (new Date()).valueOf());
    }
 
    event.dataTransfer.setData("text", JSON.stringify(item));
  }
 
  var items = document.querySelectorAll('.items .item');
 
  for (var i = items.length - 1; i >= 0; i--) {
    var item = items[i];
    item.addEventListener('dragstart', handleDragStart.bind(this), false);
  }