//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require bootbox
//= require jquery.timeago
//= require heroku
//= require jwerty
//= require jquery.scrollTo
//= require jquery.ui.datepicker
//= require turbolinks

var page = 1;
var loading = false;
var el, prevHeight;

window.done = false;

var focus_message = null;

var scrollNextMessage = function() {
  focus_message = focus_message || $('.message').first();

  if ($(focus_message).next('.message').size() != 0) {
    focus_message = $(focus_message).next('.message');
  }
  $(document).scrollTo(focus_message, {offset: -30});
};

var scrollPreviousMessage = function() {
  focus_message = focus_message || $('.message').first();
  if (focus_message && $(focus_message).prev('.message').size() != 0) {
    focus_message = $(focus_message).prev('.message');
  }
  $(document).scrollTo(focus_message, {offset: -30});
};


jQuery(function($) {

  var options = {
    minDate: new Date(2012, 8 - 1, 13),
    maxDate: new Date(),
    dateFormat: 'yy-mm-dd',
    showButtonPanel: true,
    onSelect: function(day) {
      window.location = ('/?day=' + day);
    }
  };

  if (window.defaultDate) {
    options.defaultDate = window.defaultDate;
  }

  if (window.maxDate) {
    options.maxDate = window.maxDate;
  }

  $('.datepicker').datepicker(options);

  jwerty.key('j', function () {
    scrollNextMessage()
  });

  jwerty.key('k', function () {
    scrollPreviousMessage()
  });

  $('#status-jacob').popover({
    title: 'Jacob\'s Message Status',
    content: 'Stuff goes here...',
    trigger: 'hover',
    placement: 'bottom'
  });

  $('#status-kathryn').popover({
    title: 'Kathryn\'s Message Status',
    content: 'Stuff goes here...',
    trigger: 'hover',
    placement: 'bottom'
  });

  var pollMessages = function() {
    $.ajax({
      url: '/messages?since=' + window.since.toString(),
      type: 'get',
      dataType: 'script',
      success: function() {
        //$("abbr.timeago").timeago();
      }
    });
  };

  //setInterval(pollMessages, 10000);

  //$("abbr.timeago").timeago();

  PUBNUB.subscribe({
    channel    : "pubnub",
    restore    : false,              // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED
    callback   : function(message) { // RECEIVED A MESSAGE.
      message = $.parseJSON(message);
      switch (message.action) {
        case 'status':
          $('#status-' + message.data.uid).attr('src', '/assets/status/' + message.data.status + '.png');
          break;
        case 'message':
          bootbox.alert(message.data.message);
          break;
      }
    },
    disconnect : function() {},        // LOST CONNECTION.
    reconnect  : function() {},        // CONNECTION RESTORED.
    connect    : function() {},        // CONNECTION ESTABLISHED.
  });

});
