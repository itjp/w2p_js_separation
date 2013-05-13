(function ($, undefined) {
  /*
   * Unobtrusive scripting adapter for jQuery, largely taken from
   * the wonderful https://github.com/rails/jquery-ujs
   *
   *
   * Released under the MIT license
   *
   */

  String.prototype.reverse = function () {
    return this.split('').reverse().join('');
  };
  var web2py;

  $.web2py = web2py = {

    popup: function (url) {
      newwindow = window.open(url, 'name', 'height=400,width=600');
      if(window.focus) newwindow.focus();
      return false;
    },
    collapse: function () {
      $('#' + id).slideToggle();
    },
    fade: function (id, value) {
      if(value > 0) $('#' + id).hide().fadeIn('slow');
      else $('#' + id).show().fadeOut('slow');
    },
    ajax: function (u, s, t) {
      query = '';
      if(typeof s == "string") {
        d = $(s).serialize();
        if(d) {
          query = d;
        }
      } else {
        pcs = [];
        if(s != null && s != undefined) for(i = 0; i < s.length; i++) {
            q = $("[name=" + s[i] + "]").serialize();
            if(q) {
              pcs.push(q);
            }
        }
        if(pcs.length > 0) {
          query = pcs.join("&");
        }
      }
      $.ajax({
        type: "POST",
        url: u,
        data: query,
        success: function (msg) {
          if(t) {
            if(t == ':eval') eval(msg);
            else if(typeof t == 'string') $("#" + t).html(msg);
            else t(msg);
          }
        }
      });
    },
    ajax_fields: function (target) {
      /*this attaches something to a newly loaded fragment/page
       * Ideally all events should be bound to the document, so we can avoid calling
       * this over and over... all will be bound to the document
       */
      var date_format = (typeof w2p_ajax_date_format != 'undefined') ? w2p_ajax_date_format : "%Y-%m-%d";
      var datetime_format = (typeof w2p_ajax_datetime_format != 'undefined') ? w2p_ajax_datetime_format : "%Y-%m-%d %H:%M:%S";
      $("input.date", target).each(function () {
        Calendar.setup({
          inputField: this,
          ifFormat: date_format,
          showsTime: false
        });
      });
      $("input.datetime", target).each(function () {
        Calendar.setup({
          inputField: this,
          ifFormat: datetime_format,
          showsTime: true,
          timeFormat: "24"
        });
      });
      $("input.time", target).each(function () {
        $(this).timeEntry();
      });
      /*no more inline javascript for PasswordWidget*/
      $('input[type=password][data-w2p_entropy]', target).each(function () {
        web2py.validate_entropy($(this));
      });
      /*no more inline javascript for ListWidget*/
      $('ul.w2p_list', target).each(function () {
        function pe(ul, e) {
          var new_line = ml(ul);
          rel(ul);
          if($(e.target).parent().is(':visible')) {
            //make sure we didn't delete the element before we insert after
            new_line.insertAfter($(e.target).parent());
          } else {
            //the line we clicked on was deleted, just add to end of list
            new_line.appendTo(ul);
          }
          new_line.find(":text").focus();
          return false;
        }

        function rl(ul, e) {
          if($(ul).children().length > 1) {
            //only remove if we have more than 1 item so the list is never empty
            $(e.target).parent().remove();
          }
        }

        function ml(ul) {
          var line = $(ul).find("li:first").clone(true);
          line.find(':text').val('');
          return line;
        }

        function rel(ul) {
          $(ul).find("li").each(function () {
            var trimmed = $.trim($(this.firstChild).val());
            if(trimmed == '') $(this).remove();
            else $(this.firstChild).val(trimmed);
          });
        }
        var ul = this;
        $(ul).find(":text").after('<a href="#">+</a>&nbsp;<a href="#">-</a>').keypress(function (e) {
          return(e.which == 13) ? pe(ul, e) : true;
        }).next().click(function (e) {
          pe(ul, e);
          e.preventDefault();
        }).next().click(function (e) {
          rl(ul, e);
          e.preventDefault();
        });
      });

    },
    ajax_init: function (target) {
      $('.hidden', target).hide();
      $('.error', target).hide().slideDown('slow');
      web2py.ajax_fields(target);
    },
    event_handlers: function () {
      /* This is called once for page
       * Ideally it should bound all the things that are needed
       */
      var doc = $(document);
      doc.on('click', '.flash', function (e) {
        var t = $(this);
        if(t.css('top') == '0px') t.slideUp('slow');
        else t.fadeOut();
        e.preventDefault();
      });
      doc.on('keyup', 'input.integer', function () {
        this.value = this.value.reverse().replace(/[^0-9\-]|\-(?=.)/g, '').reverse();
      });
      doc.on('keyup', 'input.double, input.decimal', function () {
        this.value = this.value.reverse().replace(/[^0-9\-\.,]|[\-](?=.)|[\.,](?=[0-9]*[\.,])/g, '').reverse();
      });
      var confirm_message = (typeof w2p_ajax_confirm_message != 'undefined') ? w2p_ajax_confirm_message : "Are you sure you want to delete this object?";
      doc.on('click', "input[type='checkbox'].delete", function () {
        if(this.checked) if(!web2py.confirm(confirm_message)) this.checked = false;
      });

      doc.ajaxSuccess(function (e, xhr) {
        var redirect = xhr.getResponseHeader('web2py-redirect-location');
        var command = xhr.getResponseHeader('web2py-component-command');
        var flash = xhr.getResponseHeader('web2py-component-flash');
        if(redirect !== null) {
          window.location = redirect;
        };
        if(command !== null) {
          eval(decodeURIComponent(command));
        }
        if(flash) {
          $('.flash')
            .html(decodeURIComponent(flash))
            .append('<span id="closeflash"> &times; </span>')
            .slideDown();
        }
      });

      doc.ajaxError(function (e, xhr, settings, exception) {
        doc.off('click', '.flash')
        switch(xhr.status) {
        case 500:
          $('.flash').html(ajax_error_500).slideDown();
        }
      });
    },
    trap_form: function (action, target) {
      $('#' + target + ' form').each(function (i) {
        var form = $(this);
        if(!form.hasClass('no_trap'))
          form.submit(function (e) {
            $('.flash').hide().html('');
            web2py.ajax_page('post', action, form.serialize(), target);
            e.preventDefault();
          });
      });
    },
    trap_link: function (target) {
      $('#' + target + ' a.w2p_trap').each(function (i) {
        var link = $(this);
        link.click(function (e) {
          $('.flash').hide().html('');
          web2py.ajax_page('get', link.attr('href'), [], target);
          e.preventDefault();
        });
      });
    },
    ajax_page: function (method, action, data, target, element) {
      //element is a new parameter, but should be put be put in front
      if(element == undefined) element = $(document);
      if(web2py.fire(element, 'ajax:before')) { //test a usecase, should stop here if returns false
        $.ajax({
          'type': method,
          'url': action,
          'data': data,
          'beforeSend': function (xhr, settings) {
            //added
            web2py.fire(element, 'ajax:beforeSend', [xhr, settings]); //test a usecase, should stop here if returns false
            xhr.setRequestHeader('web2py-component-location', document.location);
            xhr.setRequestHeader('web2py-component-element', target);
          },
          //added
          'success': function (data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          //added
          'error': function (xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          'complete': function (xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
            var html = xhr.responseText;
            var content = xhr.getResponseHeader('web2py-component-content');
            var t = $('#' + target);
            if(content == 'prepend') t.prepend(html);
            else if(content == 'append') t.append(html);
            else if(content != 'hide') t.html(html);
            web2py.trap_form(action, target);
            web2py.trap_link(target);
            web2py.ajax_init('#' + target);
          }
        });
      }
    },
    component: function (action, target, timeout, times, el) {
      //element is a new parameter, but should be put be put in front
      $(function () {
        var jelement = $("#" + target);
        var element = jelement.get(0);
        var statement = "jQuery('#" + target + "').get(0).reload();";
        element.reload = function () {
          // Continue if times is Infinity or
          // the times limit is not reached
          if(this.reload_check()) {
            web2py.ajax_page('get', action, null, target, el);
          }
        }; // reload
        // Method to check timing limit
        element.reload_check = function () {
          if(jelement.hasClass('w2p_component_stop')) {
            clearInterval(this.timing);
            return false;
          }
          if(this.reload_counter == Infinity) {
            return true;
          } else {
            if(!isNaN(this.reload_counter)) {
              this.reload_counter -= 1;
              if(this.reload_counter < 0) {
                if(!this.run_once) {
                  clearInterval(this.timing);
                  return false;
                }
              } else {
                return true;
              }
            }
          }
          return false;
        }; // reload check
        if(!isNaN(timeout)) {
          element.timeout = timeout;
          element.reload_counter = times;
          if(times > 1) {
            // Multiple or infinite reload
            // Run first iteration
            web2py.ajax_page('get', action, null, target, el);
            element.run_once = false;
            element.timing = setInterval(statement, timeout);
            element.reload_counter -= 1;
          } else if(times == 1) {
            // Run once with timeout
            element.run_once = true;
            element.setTimeout = setTimeout;
            element.timing = setTimeout(statement, timeout);
          }
        } else {
          // run once (no timeout specified)
          element.reload_counter = Infinity;
          web2py.ajax_page('get', action, null, target, el);
        }
      });
    },
    calc_entropy: function (mystring) {
      //calculate a simple entropy for a given string
      var csets = new Array(
        'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        '0123456789', '!@#$\%^&*()', '~`-_=+[]{}\|;:\'",.<>?/',
        '0123456789abcdefghijklmnopqrstuvwxyz');
      var score = 0,
        other = {}, seen = {}, lastset = null,
        mystringlist = mystring.split('');
      for(var i = 0; i < mystringlist.length; i++) { // classify this character
        var c = mystringlist[i],
          inset = 5;
        for(var j = 0; j < csets.length; j++)
          if(csets[j].indexOf(c) != -1) {
            inset = j;
            break;
          }
          //calculate effect of character on alphabet size
        if(!(inset in seen)) {
          seen[inset] = 1;
          score += csets[inset].length;
        } else if(!(c in other)) {
          score += 1;
          other[c] = 1;
        }
        if(inset != lastset) {
          score += 1;
          lastset = inset;
        }
      }
      var entropy = mystring.length * Math.log(score) / 0.6931471805599453;
      return Math.round(entropy * 100) / 100
    },
    validate_entropy: function (myfield, req_entropy) {
      //added
      if(myfield.data('w2p_entropy') != undefined) req_entropy = myfield.data('w2p_entropy');
      var validator = function () {
        var v = (web2py.calc_entropy(myfield.val()) || 0) / req_entropy;
        var r = 0,
          g = 0,
          b = 0,
          rs = function (x) {
            return Math.round(x * 15).toString(16)
          };
        if(v <= 0.5) {
          r = 1.0;
          g = 2.0 * v;
        } else {
          r = (1.0 - 2.0 * (Math.max(v, 0) - 0.5));
          g = 1.0;
        }
        var color = '#' + rs(r) + rs(g) + rs(b);
        myfield.css('background-color', color);
        entropy_callback = myfield.data('entropy_callback');
        if(entropy_callback) entropy_callback(v);
      }
      if(!myfield.hasClass('entropy_check')) myfield.on('keyup', validator).on('keydown', validator).addClass('entropy_check');
    },
    web2py_websocket: function (url, onmessage, onopen, onclose) {
      if("WebSocket" in window) {
        var ws = new WebSocket(url);
        ws.onopen = onopen ? onopen : (function () {});
        ws.onmessage = onmessage;
        ws.onclose = onclose ? onclose : (function () {});
        return true; // supported
      } else return false; // not supported

    },
    /* new from here */
    // Triggers an event on an element and returns false if the event result is false
    fire: function (obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },
    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function (e) {
      $(e.target).trigger('w2p:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },
    confirm: function (message) {
      return confirm(message);
    },
    // replace element's html with the 'data-disable-with' after storing original html
    // and prevent clicking on it
    disableElement: function (el) {
	  el.addClass('disabled');
      el.data('w2p:enable-with', el.html()); // store enabled state
      /* little addition by default*/
      if(el.data('w2p_disable_with') == 'default') {
        el.data('w2p_disable_with', 'Working...');
      }
      el.html(el.data('w2p_disable_with')); // set to disabled state
      el.bind('click.w2pDisable', function (e) { // prevent further clicking
        return web2py.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function (el) {
      if(el.data('w2p:enable-with') !== undefined) {
        el.html(el.data('w2p:enable-with')); // set to old enabled state
        el.removeData('w2p:enable-with'); // clean up cache
      }
	  el.removeClass('disabled');
      el.unbind('click.w2pDisable'); // enable element
    },
    //convenience wrapper, internal use only
    simple_component: function (action, target, element) {
      web2py.component(action, target, 0, 1, element);
    },
    a_handler: function (el, e) {
      e.preventDefault();
      var method = el.data('w2p_method');
      var action = el.attr('href');
      var target = el.data('w2p_target');
      var confirm_message = el.data('w2p_confirm');

      var pre_call = el.data('w2p_pre_call');
      if(pre_call != undefined) {
        eval(pre_call);
      }
      if(confirm_message != undefined) {
        if(confirm_message == 'default') confirm_message = w2p_ajax_confirm_message || 'Are you sure you want to delete this object?';
        if(!web2py.confirm(confirm_message)) {
          web2py.stopEverything(e);
          return;
        }
      }
      if(target == undefined) {
        if(method == 'GET') {
          web2py.simple_component(action, el.attr('id'), el); //not working with original
        } else if(method == 'POST') {
          //should be web2py.ajax(action, [], ''); but it's too simple
          web2py.ajax_page('post', action, [], 'bogus', el); //fixme?
        }
      } else {
        if(method == 'GET') {
          web2py.simple_component(action, target, el);
        } else if(method == 'POST') {
          //should be web2py.ajax(action, [], target); but it's too simple
          web2py.ajax_page('post', action, [], target, el);
        }
      }
      /*this should happen only on ajaxsuccess
      * and should block subsequent clicks until ajaxcomplete
      * NB: introduce the first incompatibility because normally
      * the element would be removed in either case
      /* removal code moved to the ajax:success event - START
      if(toremove != undefined) {
        toremove = el.closest(toremove);
        if(!toremove.length) {
          //this enables removal of whatever selector if a closest is not found
          toremove = $(toremove);
        }
        toremove.remove();
      }
      /* removal code moved to the ajax:success event - END */
    },
    a_handlers: function () {
      var el = $(document);
      el.on('click', 'a[data-w2p_method]', function (e) {
        web2py.a_handler($(this), e);
      });
      /* removal of element should happen only on success */
      el.on('ajax:success', 'a[data-w2p_method][data-w2p_remove]', function (e) {
        var el = $(this);
        var toremove = el.data('w2p_remove');
        if(toremove != undefined) {
          toremove = el.closest(toremove);
          if(!toremove.length) {
            //this enables removal of whatever selector if a closest is not found
            toremove = $(toremove);
          }
          toremove.remove();
        }
      });
      el.on('ajax:beforeSend', 'a[data-w2p_method][data-w2p_disable_with]', function (e) {
        web2py.disableElement($(this));
      });
      /*re-enable click on completion*/
      el.on('ajax:complete', 'a[data-w2p_method][data-w2p_disable_with]', function (e) {
        web2py.enableElement($(this));
      });
    }
  }

  //end of functions
  //main hook
  $(function () {
    var flash = $('.flash');
    flash.hide();
    if(flash.html()) flash.append('<span id="closeflash"> &times; </span>').slideDown();
    web2py.ajax_init(document);
    web2py.event_handlers();
    web2py.a_handlers();
  });

})(jQuery);

/* compatibility code - start */
ajax = $.web2py.ajax;
web2py_component = $.web2py.component;
web2py_websocket = $.web2py.websocket;
web2py_ajax_page = $.web2py.ajax_page;
web2py_validate_entropy = $.web2py.validate_entropy;
web2py_ajax_fields = $.web2py.ajax_fields;
/*undocumented - rare*/
popup = $.web2py.popup;
collapse = $.web2py.collapse;
fade = $.web2py.fade;

/* internals - shouldn't be needed

web2py_ajax_init = $.web2py.ajax_init;
web2py_event_handlers = $.web2py.event_handlers;
web2py_trap_form = $.web2py.trap_form;
web2py_trap_link = $.web2py.trap_link;
web2py_calc_entropy = $.web2py.calc_entropy;
*/
/* compatibility code - end*/