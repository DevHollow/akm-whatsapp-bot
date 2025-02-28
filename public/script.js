//stop and login
$(function () {
  $.ajax({
    url: "/isconnected",
    method: "get",
    success: function final(res) {
      console.log("site received connection state - " + res);
      if (res == "close") {
        $("#stop").addClass("hidden");
        $("#login").removeClass("hidden");
      } else if (res == "open") {
        $("#login").prop("disabled", true);
        $("#stop").removeClass("hidden");
        $("#login").text("connected");
      } else if (res == "connecting") {
        $("#login").removeClass("hidden");
        $("#stop").removeClass("hidden");
      }
    },
  });
  $.ajax({
    url: "/isauthenticationfilepresent",
    method: "get",
    success: function final(res) {
      console.log("site received isauthenticationfilepresent - " + res);
      if (res == "present") {
        $("#logout").removeClass("hidden");
        $("#qrcode").removeAttr("src");
      } else {
        $("#logout").addClass("hidden");
      }
    },
  });
});

//restart
$("#restart").click(function (e) {
  $("#restart").text("Restarting...");
  $("#logout").prop("disabled", true);
  $("#login").prop("disabled", true);
  $("#stop").prop("disabled", true);
  $("#database").prop("disabled", true);
  $("#restart").prop("disabled", true);
  e.preventDefault();
  $.ajax({
    url: "/restart",
    method: "get",
    success: function () {},
  });
  setTimeout(location.reload(), 8000);
});

///////login////////
let myVar;
$("#login").click(function (e) {
  window.alert(
    "Make sure that multi-device beta is off before scanning the qr code!"
  );
  $("#login").text("connecting...");
  $("#stop").text("stop bot");
  $("#stop").removeClass("hidden");
  $("#logout").prop("disabled", true);
  $("#login").prop("disabled", true);
  $("#database").prop("disabled", true);
  $("#restart").prop("disabled", true);
  e.preventDefault();
  $.ajax({
    url: "/login",
    method: "get",
    success: function final(res) {
      console.log(res);
      if (res == "present") {
        $("#login").text("connected");
        $("#logout").prop("disabled", false);
        $("#login").prop("disabled", true);
        $("#logout").removeClass("hidden");
        $("#stop").removeClass("hidden");
        $("#database").prop("disabled", false);
        $("#restart").prop("disabled", false);
        $("#qrcode").removeAttr("src");
      } else if (res == "absent") {
        $("#login").text("Generating Qr");
        myVar = setInterval(function () {
          $.ajax({
            url: "/qr",
            method: "get",
            success: function qr(qr) {
              $("#login").text("scan Qr");
              $.ajax({
                url: "/isconnected",
                method: "get",
                success: function (ima) {
                  console.log("ima " + ima);
                  if (ima == "open") {
                    $("#login").text("conected");
                    $("#logout").prop("disabled", false);
                    $("#login").prop("disabled", false);
                    $("#logout").removeClass("hidden");
                    $("#stop").removeClass("hidden");
                    $("#database").prop("disabled", false);
                    $("#restart").prop("disabled", false);
                    clearInterval(myVar);
                    $("#qrcode").removeAttr("src");
                    var win = window.open(
                      "https://github.com/akm-akm/akm-whatsapp-bot/blob/master/docs/heroku-hosting.md#%EF%B8%8F-failing-to-do-the-below-step-will-stop-the-bot-from-working",
                      "_blank"
                    );
                    if (win) {
                      win.focus();
                    } else {
                      window.location.replace(
                        "https://github.com/akm-akm/akm-whatsapp-bot/blob/master/docs/heroku-hosting.md#%EF%B8%8F-failing-to-do-the-below-step-will-stop-the-bot-from-working"
                      );
                    }
                  }
                },
              });
              $("#qrcode").attr("src", qr + "?" + new Date().getTime());
            },
          });
        }, 2000);
      }
      // $("#login").text("connecting...");
    },
  });
});

//stop////////////
$("#stop").click(function (e) {
  $("#stop").text("stoping...");
  $("#logout").prop("disabled", true);
  $("#login").prop("disabled", true);
  $("#stop").prop("disabled", true);
  $("#database").prop("disabled", true);
  $("#restart").prop("disabled", true);
  e.preventDefault();

  $.ajax({
    url: "/stop",
    method: "get",
    success: function final(res) {
      console.log(res);
      clearInterval(myVar);
      $("#qrcode").removeAttr("src");
      $("#logout").prop("disabled", false);
      $("#login").prop("disabled", false);
      $("#stop").prop("disabled", false);
      $("#database").prop("disabled", false);
      $("#restart").prop("disabled", false);
      $("#login").text("start bot");
      $("#stop").addClass("hidden");
    },
  });
});

////logout
$("#logout").click(function (e) {
  e.preventDefault();
  $("#logout").text("Refresh in a minute..");
  $("#logout").prop("disabled", true);
  $("#login").prop("disabled", true);
  $("#stop").prop("disabled", true);
  $("#database").prop("disabled", true);
  $("#restart").prop("disabled", true);
  $.ajax({
    url: "/logout",
    method: "get",
    success: function final(res) {
      console.log(res);
      $("#logout").prop("disabled", false);
      $("#login").prop("disabled", false);
      $("#stop").prop("disabled", false);
      $("#database").prop("disabled", false);
      $("#restart").prop("disabled", false);
      $("#stop").addClass("hidden");
      $("#login").text("start bot");
      $("#logout").text("Log out");
      $("#logout").addClass("hidden");
    },
  });
});

////sitelogin//////

$("#submitauth").click(function (e) {
  e.preventDefault();
  if ($("#session").val() == "")
    return $("#session").attr("placeholder", "Enter password");
  $("#submitauth").text("Loading");

  $("#submitauth").prop("disabled", true);
  $.ajax({
    url: "/auth",
    method: "post",
    success: function final(res) {
      console.log(res);
      if (res == "true") {
        $(".container1").addClass("hidden");
        $(".container2").removeClass("hidden");
      } else if (res == "false") {
        $("#session").val("");
        $("#session").attr("placeholder", "Wrong password");
        $("#submitauth").prop("disabled", false);
        $("#submitauth").text("login");
      }
    },
    data: {
      pass: $("#session").val(),
      siteurl: window.location.origin,
    },
  });
});
