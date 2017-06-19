/*
 * NASA Worldview
 *
 * This code was originally developed at NASA/Goddard Space Flight Center for
 * the Earth Science Data and Information System (ESDIS) project.
 *
 * Copyright (C) 2013 - 2014 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 */

var wv = wv || {};
wv.link = wv.link || {};

wv.link.ui = wv.link.ui || function(models, config) {

    var self = {};
    var id = "wv-link-button";
    var selector = "#" + id;
    var widgetCreate = React.createElement(WVC.Share);

    var widgetFactory = React.createFactory(WVC.Dialog);
    // var dialogCreate = React.createElement(WVC.Dialog);

    var updateLink  = function() {
      // this.props.updates(this.state.models.link.get());
        $('#permalink_content').val(models.link.get());
        $("#wv-link-shorten-check").iCheck("uncheck");
        $('#permalink_content').focus();
        $('#permalink_content').select();
    };

    var init = function() {
      var Widget;

      $button = $("<input></input>")
          .attr("type", "checkbox")
          .attr("id", "wv-link-button-check");
      $label = $("<label></label>")
          .attr("for", "wv-link-button-check")
          .attr("title", "Share this map");
      var $icon = $("<i></i>")
          .addClass("fa")
          .addClass("fa-share-square-o")
          .addClass("fa-2x");
      $label.append($icon);
      $(selector).append($label);
      $(selector).append($button);
      $button.button({
          text: false
      }).click(function() {
          var checked = $("#wv-link-button-check").prop("checked");
          WVC.GA.event('Link', 'Click', 'Share link Button');
          if ( checked ) {
              self.show();
          } else {
              wv.ui.closeDialog();
          }
      });

      models.link.events.on("update", replaceHistoryState);
    };

    self.show = function() {
      Widget = self.initWidget();
      self.reactComponent = ReactDOM.render(Widget, $('#wv-share-button')[0]);
    };

    self.initWidget = function() {
        return widgetFactory({
            urlShortening: config.features.urlShortening,
            config: config,
            models: models,
            updateLink: updateLink(),
            getModelsLink: models.link.get(),
            shortenModelsLink: models.link.shorten()
        });
    };

    //Calls toQueryString to fetch updated state and returns URL
    var replaceHistoryState = _.throttle(function() {
        if ( wv.util.browser.history ) {
            window.history.replaceState("", "@OFFICIAL_NAME@",
                    "?" + models.link.toQueryString());
        }
    }, 2000, {leading: true, trailing: true});

    init();
    return self;

};
