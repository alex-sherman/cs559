Class = {
    extend: function(args) {
        var init = args.init;
        init.prototype = Object.create(this.prototype || Object.prototype);
        init.extend = Class.extend;
        for(var prop in args) {
            init.prototype[prop] = args[prop];
            init[prop] = args[prop];
        }
        return init;
    }
}