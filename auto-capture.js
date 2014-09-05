
var Capture = {
  
  eventsQueue: [],

  init: function() {
    this.Tools.addCSS('https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css');
    this.Tools.addCSS('http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css');

    $('body').prepend(
      '<div class="capture-js">' +
        '<section class="toolbar-icons">' +
          '<a href="#" class="btn btn-danger capture-record"><i class="fa fa-video-camera"></i>Record</a>' +
          '<a href="#" class="btn btn-warning capture-stop disabled"><i class="fa fa-stop"></i>Stop</a>' +
          '<a href="#" class="btn btn-success capture-save disabled"><i class="fa fa-file"></i>Save</a>' +
          '<a href="#" class="btn btn-info capture-play disabled"><i class="fa fa-play"></i>Play</a>' +
          '<span id ="aaa"></span>' +
        '</section>' +
      '</div>' +
      '<div style="height:64px"></div>'
      );

    $('.capture-js .capture-record').click(this.record);
    $('.capture-js .capture-stop').click(this.stop);
    $('.capture-js .capture-play').click(this.play);
    $('.capture-js .capture-save').click(this.save);

    $(document).mousemove(function(event){
        $("#aaa").text(event.pageX + ", " + event.pageY);
    });
  },

  record: function() {
    Capture.trackAppEvents();

    // Handle buttons UI
    $('.capture-js .capture-record').addClass('disabled');
    $('.capture-js .capture-record i').removeClass('fa-video-camera').addClass('fa-spinner fa-spin');
    $('.capture-js .capture-stop').removeClass('disabled');
  },

  stop: function() {
    Capture.clearAppEvents();

    // Hanlde buttons UI
    $('.capture-js .capture-record').removeClass('disabled');
    $('.capture-js .capture-record i').removeClass('fa-spinner fa-spin').addClass('fa-video-camera');
    $('.capture-js .capture-stop').addClass('disabled');
    $('.capture-js .capture-save').removeClass('disabled');
    $('.capture-js .capture-play').removeClass('disabled');
  },

  play: function() {
    $('.capture-js .capture-play i').removeClass('fa-play').addClass('fa-spinner fa-spin');

    $.each(Capture.eventsQueue, function(index, elementEvent) {
       var element = Capture.findElementByPositionString(elementEvent.positionString);

       if (element) {
        element.trigger(elementEvent.eventType);
       }      
    });

    $('.capture-js .capture-play i').removeClass('fa-spinner fa-spin').addClass('fa-play');
  },

  save: function() {
    var saveElement = document.createElement('a'),
        text = JSON.stringify(Capture.eventsQueue);

    saveElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    saveElement.setAttribute('download', 'data.json');
    saveElement.click();
  },

  load: function() {

  },

  trackAppEvents: function() {
    $('body').find('a, input[type="button"], li').on('click', this.trackElementChanges);
  },

  trackElementChanges: function(e) {
    var element = $(e.currentTarget),
        divParent = element.parents('div')[0];

    if (!$(divParent).hasClass('capture-js')) {
      var trackEvent = { positionString: Capture.getElementPositionString(element) ,eventType: e.type }
      Capture.eventsQueue.push(trackEvent);
    }
  },

  clearAppEvents: function() {
    $('body').find('a, input[type="button"], li').off('click', this.trackElementChanges);
  },

  getElementPositionString: function(element) {
    var positionString = '',
        currChild = element,
        currParent = element.parent();
      
    // Run until html top element
    while (currChild.prop('tagName').toLowerCase() != 'html') {
      var index = currParent.children().index(currChild);
      positionString = index + ':' + positionString;

      currChild = currParent;
      currParent = currParent.parent();
    }

    return (positionString);
  },

  findElementByPositionString: function(position) {
    var arrPosition = position.split(':'),
        currChild = $('html');

    for (var i = 0; i < arrPosition.length; i++) {
      if (arrPosition[i] != '') {
        currChild = $(currChild.children().get(parseInt(arrPosition[i])));
      }
    }

    return (currChild);
  },

  Tools: {
    addJS: function(src) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      $('head').append(script);
    },

    addCSS: function(src) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = src;
      $('head').append(link);
    }

    //test2

  }

}

window.Capture = Capture;

$(document).ready(function() {
   Capture.init();
});
