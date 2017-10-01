/**
 * Created by aletuna on 10/08/17.
 */

/**
 * EXPORTS
 */

exports.execute = function (args)
{
    // Only first input is considered
    let iAmount  = args.arguments[0];
    let oChannel = args.msg.channel;

    args.msg.delete()
        .then(() => deleteMessages(oChannel, iAmount));
};

exports.isUsingArguments = function ()
{
    return false;
};

exports.getDescription = function ()
{
    return {
        name: "deleteLast",
        desc: "Deletes last X messages in current channel",
        args: [{
            name: 'None. Just pass after command name',
            desc: 'Amount of messages to delete. Please note: Max 100!',
            type: 'integer',
            required: true
        }],
        example: "-sb deleteLast 5"
    };
};

/**
 * Private Functions
 */

deleteMessages = function (oChannel, iAmount)
{
    oChannel.startTyping();
    if (isNaN(iAmount) || iAmount <= 0)
    {
        oChannel.send("Invalid argument! Must be a number.")
                .then((message) =>
                      {
                          setTimeout((message) => {message.delete();}, 10000, message);
                          oChannel.stopTyping();
                      });
        return;
    }

    if(iAmount > 100)
    {
        oChannel.send("Maximum 100 messages! Aborting...")
                .then((message) =>
                      {
                          setTimeout((message) => {message.delete();}, 10000, message);
                          oChannel.stopTyping();
                      });
        return;
    }

    oChannel.fetchMessages({limit: iAmount})
            .then((messages) =>
                  {
                      let iCount = messages.size - 1; // Starting from 0!
                      messages.deleteAll()[iCount]
                          .then(() =>
                                {
                                    let sText = iCount + 1 === parseInt(iAmount) ? "Deleted last " + iAmount + " messages." : "Amount exceeded message count so deleted all messages! (" + (iCount + 1) +")";
                                    oChannel.send(sText)
                                            .then((message) =>
                                                  {
                                                      setTimeout((message) => {message.delete();}, 10000, message);
                                                      oChannel.stopTyping();
                                                  });

                                });
                  })
            .catch(console.error);
};