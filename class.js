Class = {
    extend: function(args) {
        var init = args.init;
        init.prototype = Object.create(this.prototype || Object.prototype);
        init.extend = Class.extend;
        init.typeName = args["type"];
        delete args["type"];
        for(var prop in args) {
            init.prototype[prop] = args[prop];
            init[prop] = args[prop];
        }
        init.prototype["getType"] = function() {
            return init;
        }
        return init;
    }
}