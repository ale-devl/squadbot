(function () {

    let queue = [];
    let busy = false;
    worker = function () {
        busy = true;
        for (let i = 0; i < queue.length; ++i) {
            if (queue[i] != null) { /* catches null and undefined */
                queue[i].function.execute(queue[i].args); /* call queued function */
                queue[i] = null;
            }
        }
        busy = false;
    }

    module.exports.execute = function (func, args) {
        queue.push({
            'function': func,
            'args': args
        });
        if (!busy) {
            setTimeout(worker, 0); /* push it into an async state */
        }
    };



})();
