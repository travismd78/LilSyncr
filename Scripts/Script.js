/// <reference path="jquery-1.8.1-vsdoc.js" />

$(function () {

    // Search Fanciness
    function populateElement(selector, defvalue) {
        $(selector).each(function () {
            if ($.trim(this.value) == "") {
                this.value = defvalue;
            }
        }); // end each 
        $(selector).focus(function () {
            if (this.value == defvalue) {
                this.value = "";
            }
        }); // end focus
        $(selector).blur(function () {
            if ($.trim(this.value) == "") {
                this.value = defvalue;
            }
        }); // end blur
    } // end function
    populateElement('#filter', 'search');


    // Init Map
    $('#boxMap').goMap({
        address: 'Savannah, GA, USA',
        zoom: 10,
        maptype: 'ROADMAP',
        scaleControl: false,
        mapTypeControl: false
    }); // end goMap

    // GetPeople, get FB Pics, Create List
    $.getJSON('/GetPeople', function (data) {
        var people = data;
        var count = 0;
        $.each(people, function (index, person) {
            // Get Facebook Pics & Create List
            $.getJSON("https://graph.facebook.com/" + person.fbID + "/picture?callback=?", function (fbPic) {
                $('#peopleBox').append('<div class="peopleItem" id=' +
                    person.ID +
                    '><div id="detailPic"><img src=' +
                    fbPic +
                    '" alt="pic" width="35px" height="35px"/></div><div id="detailName"><h3>' +
                    person.FirstName + ' ' + person.LastName +
                    '</h3></div></div>');

            }); // end getJSON facebook pics

            // Put em on the map
            $.goMap.createMarker({
                address: person.Address + ", " + person.City + ", " + person.State + " " + person.ZipCode,
                html: "<h3>" + person.FirstName + " " + person.LastName + "</h3><p>" + person.Address + "</p><a id=" + person.ID + " href='#'>more details</a>",
                icon: person.fbPic
            }); // end createMarker
            count++;
        }); //end each

    }); // end GetPeople callback

    // Search
    $('#filter').keyup(function (event) {
        var filter = $(this).val(), count = 0;
        $(".peopleItem").each(function (event) {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).hide(); ;
            } else {
                $(this).show();
            }
        }); // end each
    }); // end keyup

    // Event Handlers

    //$("#peopleBox").hover(function () {

    // }); // end PeopleBox hover

    // custom populateDetails function
    function populateDetails(source) {
        // fade old details, then call fadeIn inside callback
        $(".detailBox, #col-Details h2").fadeOut(125, function () {

            $.getJSON('/GetPerson/' + $(source).attr('id'), function (data) {
                var person = data;
                var personActive = (person.Active == "Active") ? "positiveBox" : "negativeBox";
                var facebookFan = (person.fbFan == "True") ? "<img id='fbFan' width='50' height='50' alt='fbFan' src='../img/like_icon.png'></img>" : "";

                $("#col-Details h2").text(person.FirstName + ' ' + person.LastName).fadeIn();
                $("#ProfilePic").html("<img id='fbPic' class='" + personActive + "' src='" + person.fbPicBig + "' alt='profilepic'>" + facebookFan + "</img>").fadeIn();
                $("#Contact").html("<h4>" + person.Email + "</h4><h4>" + person.Phone + "</h4><br /><br /><h4>" + person.Address + "</h4><h4>" + person.City + ", " + person.State + "</h4><h4>" + person.ZipCode + "</h4>").fadeIn();
                $("#Notifications").html("<p class='serif'>last updated 7/2/2012</p>").fadeIn();
                if (person.K1FirstName == "" || person.K1FirstName == null) {
                    $("#Kid1").hide();
                } else {
                    $("#Kid1").html("<h5>" + person.K1FirstName + " " + person.K1LastName + " (" + person.K1Birthdate + ")" + "</h5><ul class='alignLeft'><li>Grade " + person.K1Grade + " at " + person.K1School + "</li><li>" + person.K1Years + " year(s) at ggsod</li><li>" + person.K1Tag + "</li></ul>").fadeIn();
                }
                if (person.K2FirstName == "" || person.K2FirstName == null) {
                    $("#Kid2").hide();
                } else {
                    $("#Kid2").html("<h5>" + person.K2FirstName + " " + person.K2LastName + " (" + person.K2Birthdate + ")" + "</h5><ul class='alignLeft'><li>Grade " + person.K2Grade + " at " + person.K2School + "</li><li>" + person.K2Years + " year(s) at ggsod</li><li>" + person.K2Tag + "</li></ul>").fadeIn();
                }
                if (person.K3FirstName == "" || person.K3FirstName == null) {
                    $("#Kid3").hide();
                } else {
                    $("#Kid3").html("<h5>" + person.K3FirstName + " " + person.K3LastName + " (" + person.K3Birthdate + ")" + "</h5><ul class='alignLeft'><li>Grade " + person.K3Grade + " at " + person.K3School + "</li><li>" + person.K3Years + " year(s) at ggsod</li><li>" + person.K3Tag + "</li></ul>").fadeIn();
                }
            }); // end GetPerson


        }); // end fadeOut transition
    };

    // BiggerMap click
    $("#biggerMap").click(function (event) {
        $("#col-Details").animate({ top: "150%" }, 500);
        $("#col-People,#col-Settings").animate({ left: "150%" }, 500);
        $("#col-Map").animate({ width: "90%" }, 500, function () {
            google.maps.event.trigger($.goMap.map, 'resize');
            $.goMap.fitBounds();
        }); // end animate
        $("#backButton").animate({ left: "50px" }, 500);
        $(this).fadeOut(500);
        event.preventDefault();
    }); // end Map header toggle

    // BoxMap moreDetails click
    $("#boxMap").on("click", ".gomapMarker a", function () {
        populateDetails(this);
        $("#col-People,#col-Settings").animate({ left: "150%" }, 500);
        $("#col-Map").animate({ width: "25%" }, 500);
        $("#col-Details").animate({ top: "0" }, 500);
        $("#backButton").animate({ left: "50px" }, 500);
        $("#biggerMap").fadeOut();
    }); // end boxMap moreDetails click

    // PeopleItem click
    $("#content").on("click", ".peopleItem", function (event) {
        // Get details
        populateDetails(this);
        // Animate
        $("#col-Map").animate({ left: "-100%" }, 500);
        $("#col-People").animate({ left: "0" }, 500);
        $("#col-Settings").animate({ left: "150%" }, 500);
        $("#col-Details").animate({ top: "0" }, 500);
        $("#backButton").animate({ left: "50px" }, 500);
    }); // end peopleItem click

    // BackButton click
    $("#backButton").click(function (event) {
        $("#col-Details").animate({ top: "150%" }, 500);
        $("#col-Map").animate({ left: "0", width: "25%" }, 500, function () {
            google.maps.event.trigger($.goMap.map, 'resize');
            $.goMap.fitBounds();
        });
        $("#col-Settings").animate({ left: "60%" }, 500);
        $("#col-People").animate({ left: "30%" }, 500);
        $("#backButton").animate({ left: "-50%" }, 500);
        $("#biggerMap").fadeIn();
    }); // end backbutton Click

    $("#statusTable tr").hide();
    $("#uploadButton").click(function () {
        alert("Herro");
        
    }); // end uploadButton

}); // end ready