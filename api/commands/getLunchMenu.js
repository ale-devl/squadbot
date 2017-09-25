/**
 * Created by aletuna on 11/08/17.
 */
let oLunchMenu;

exports.execute = function (args)
{
    if (args.arguments[0])
    {
        postSpecificDay(args);
    } else
    {
        postAllDays(args);
    }
};

exports.isUsingArguments = function ()
{
    return false;
};

exports.getDescription = function ()
{
    return {
        name:    "getLunchMenu",
        desc:    "Displays the lunch menu of the current week or day if provided.",
        args:    [{
            name:     "None. Just pass after command name",
            desc:     "Weekday. [\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\"] NOTE: ONLY ONE AT A TIME FOR NOW",
            type:     "string",
            required: false
        }],
        example: "-sb getLunchMenu"
    };
};

function requestData()
{
    return new Promise((resolve, reject) =>
                       {
                           if (oLunchMenu)
                           {
                               resolve();
                           }

                           let url = "http://app.sap.eurest.de/mobileajax/data/35785f54c4f0fddea47b6d553e41e987/all.json";

                           const http = require("http");

                           http.get(url, (res) =>
                           {
                               let response = "";
                               res.on("data", (chunk) =>
                               {
                                   response += chunk;
                               });

                               res.on("end", () =>
                               {
                                   oLunchMenu           = {};
                                   response             = JSON.parse(response);
                                   oLunchMenu.monday    = {
                                       soup:    response.menu[0].counters[0].dishes[0].title.de,
                                       menu1:   response.menu[0].counters[1].dishes[0].title.de,
                                       menu2:   response.menu[0].counters[2].dishes[0].title.de,
                                       menu3:   response.menu[0].counters[3].dishes[0].title.de,
                                       side:    response.menu[0].counters[4].dishes,
                                       dessert: response.menu[0].counters[5].dishes
                                   };
                                   oLunchMenu.tuesday   = {
                                       soup:    response.menu[1].counters[0].dishes[0].title.de,
                                       menu1:   response.menu[1].counters[1].dishes[0].title.de,
                                       menu2:   response.menu[1].counters[2].dishes[0].title.de,
                                       menu3:   response.menu[1].counters[3].dishes[0].title.de,
                                       side:    response.menu[1].counters[4].dishes,
                                       dessert: response.menu[1].counters[5].dishes
                                   };
                                   oLunchMenu.wednesday = {
                                       soup:    response.menu[2].counters[0].dishes[0].title.de,
                                       menu1:   response.menu[2].counters[1].dishes[0].title.de,
                                       menu2:   response.menu[2].counters[2].dishes[0].title.de,
                                       menu3:   response.menu[2].counters[3].dishes[0].title.de,
                                       side:    response.menu[2].counters[4].dishes,
                                       dessert: response.menu[2].counters[5].dishes
                                   };
                                   oLunchMenu.thursday  = {
                                       soup:    response.menu[3].counters[0].dishes[0].title.de,
                                       menu1:   response.menu[3].counters[1].dishes[0].title.de,
                                       menu2:   response.menu[3].counters[2].dishes[0].title.de,
                                       menu3:   response.menu[3].counters[3].dishes[0].title.de,
                                       side:    response.menu[3].counters[4].dishes,
                                       dessert: response.menu[3].counters[5].dishes
                                   };
                                   oLunchMenu.friday    = {
                                       soup:    response.menu[4].counters[0].dishes[0].title.de,
                                       menu1:   response.menu[4].counters[1].dishes[0].title.de,
                                       menu2:   response.menu[4].counters[2].dishes[0].title.de,
                                       menu3:   response.menu[4].counters[3].dishes[0].title.de,
                                       side:    response.menu[4].counters[4].dishes,
                                       dessert: response.menu[4].counters[5].dishes
                                   };
                                   resolve();
                               });

                               res.on("error", (e) =>
                               {
                                   reject(e);
                               });
                           });
                       });
}

function postAllDays(args)
{
    requestData().then(
        () =>
        {
            let dayList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
            let aMenus  = [];

            for (let i = 0; i < dayList.length; ++i)
            {
                let sText = "";
                let oMenu = getLunchFor(dayList[i]);
                sText += "__**" + dayList[i] + "**__\n";
                sText += "```";
                sText += "Suppe:".padEnd(27) + oMenu.soup + "\n";
                sText += "Hauptgang 1:".padEnd(27) + oMenu.menu1 + "\n";
                sText += "Hauptgang 2:".padEnd(27) + oMenu.menu2 + "\n";
                sText += "Hauptgang 3:".padEnd(27) + oMenu.menu3 + "\n";
                for (let j = 0; j < oMenu.side.length; ++j)
                {
                    sText += ("Beilage " + (j + 1) + ":").padEnd(27) + oMenu.side[j].title.de + "\n";
                }
                for (let j = 0; j < oMenu.dessert.length; ++j)
                {
                    sText += ("Dessert " + (j + 1) + ":").padEnd(27) + oMenu.dessert[j].title.de + "\n";
                }
                sText += "```";
                aMenus.push(sText);
            }
            for (let i = 0; i < aMenus.length; ++i)
            {
                args.msg.channel.send(aMenus[i]);
            }
        });
}

function postSpecificDay(args)
{
    requestData().then(
        () =>
        {
            requestData().then(
                () =>
                {
                    let dayList = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
                    let aMenus  = [];
                    let aDays   = [];

                    for (let i = 0; i < args.arguments.length; ++i)
                    {
                        let index = dayList.findIndex(item => args.arguments[i].toLowerCase() === item.toLowerCase());
                        if (index !== -1)
                        {
                            aDays.push(dayList[index]);
                        }
                    }

                    for (let i = 0; i < aDays.length; ++i)
                    {
                        let sText = "";
                        let oMenu = getLunchFor(aDays[i]);
                        sText += "__**" + aDays[i] + "**__\n";
                        sText += "```";
                        sText += "Suppe:".padEnd(27) + oMenu.soup + "\n";
                        sText += "Hauptgang 1:".padEnd(27) + oMenu.menu1 + "\n";
                        sText += "Hauptgang 2:".padEnd(27) + oMenu.menu2 + "\n";
                        sText += "Hauptgang 3:".padEnd(27) + oMenu.menu3 + "\n";
                        for (let j = 0; j < oMenu.side.length; ++j)
                        {
                            sText += ("Beilage " + (j + 1) + ":").padEnd(27) + oMenu.side[j].title.de + "\n";
                        }
                        for (let j = 0; j < oMenu.dessert.length; ++j)
                        {
                            sText += ("Dessert " + (j + 1) + ":").padEnd(27) + oMenu.dessert[j].title.de + "\n";
                        }
                        sText += "```";
                        aMenus.push(sText);
                    }
                    for (let i = 0; i < aMenus.length; ++i)
                    {
                        args.msg.channel.send(aMenus[i]);
                    }
                });
        });
}

function getLunchFor(day)
{
    switch (day)
    {
        case "Monday":
            return oLunchMenu.monday;
        case "Tuesday":
            return oLunchMenu.tuesday;
        case "Wednesday":
            return oLunchMenu.wednesday;
        case "Thursday":
            return oLunchMenu.thursday;
        case "Friday":
            return oLunchMenu.friday;
    }
}