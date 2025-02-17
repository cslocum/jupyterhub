// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

require(["jquery", "moment", "jhapi", "utils"], function(
  $,
  moment,
  JHAPI,
  utils
) {
  "use strict";

  var base_url = window.jhdata.base_url;
  var prefix = window.jhdata.prefix;
  var user = window.jhdata.user;
  var api = new JHAPI(base_url);

  // Named servers buttons

  function getRow(element) {
    while (!element.hasClass("home-server-row")) {
      element = element.parent();
    }
    return element;
  }

  function disableRow(row) {
    row
      .find(".btn")
      .attr("disabled", true)
      .off("click");
  }

  function enableRow(row, running) {
    // enable buttons on a server row
    // once the server is running or not
    row.find(".btn").attr("disabled", false);
    row.find(".stop-server").click(stopServer);
    row.find(".delete-server").click(deleteServer);

    if (running) {
      row.find(".start-server").addClass("hidden");
      row.find(".delete-server").addClass("hidden");
      row.find(".stop-server").removeClass("hidden");
      row.find(".server-link").removeClass("hidden");
    } else {
      row.find(".start-server").removeClass("hidden");
      row.find(".delete-server").removeClass("hidden");
      row.find(".stop-server").addClass("hidden");
      row.find(".server-link").addClass("hidden");
    }
  }

  function stopServer() {
    var row = getRow($(this));
    var serverName = row.data("server-name");

    // before request
    disableRow(row);

    // request
    api.stop_named_server(user, serverName, {
      success: function() {
        enableRow(row, false);
      },
    });
  }

  function deleteServer() {
    var row = getRow($(this));
    var serverName = row.data("server-name");

    // before request
    disableRow(row);

    // request
    api.delete_named_server(user, serverName, {
      success: function() {
        row.remove();
      },
    });
  }

  // initial state: hook up click events
  $("#stop").click(function() {
    $("#start")
      .attr("disabled", true)
      .attr("title", "Your server is stopping")
      .click(function() {
        return false;
      });
    api.stop_server(user, {
      success: function() {
        $("#stop").hide();
        $("#start")
          .text("Start My Server")
          .attr("title", "Start your default server")
          .attr("disabled", false)
          .off("click");
      },
    });
  });

  $(".new-server-btn").click(function() {
    var row = getRow($(this));
    var serverName = row.find(".new-server-name").val();
    window.location.href = "./spawn/" + user + "/" + serverName;
  });

  $(".stop-server").click(stopServer);
  $(".delete-server").click(deleteServer);

  // render timestamps
  $(".time-col").map(function(i, el) {
    // convert ISO datestamps to nice momentjs ones
    el = $(el);
    var m = moment(new Date(el.text().trim()));
    el.text(m.isValid() ? m.fromNow() : "Never");
  });
});
