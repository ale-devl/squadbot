(function () {

    let queue = [];
    let busy = false;
    worker = function () {
        busy = true;
        for (let i = 0; i < queue.length; ++i) {
            if (queue[i] != null) { /* catches null and undefined */
                queue[i].function(queue[i].args); /* call queued function */
                queue[i] = null;
            }
        }
        busy = false;
    }


    module.exports.getDescription = function () {
        return {
            name: "semp",
            desc: "Test for a semaphored command",
            args: [{
                name: 'None. Just pass after command name',
                desc: 'Command to do stuff',
                type: 'string',
                required: false
            }],
            example: "> semp stuff"
        };
    };

    const execute = function (args) {
        console.log(args);
    }

    module.exports.execute = function (args) {
        queue.push({
            'function': execute,
            'args': args
        });
        if (!busy) {
            setTimeout(worker, 0); /* push it into an async state */
        }
    };



})();
