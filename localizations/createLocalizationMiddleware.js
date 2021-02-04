const apiLocs = {
    "en": require("./api/en"),
    "fi": require("./api/fi")
}

const apiProxyHandler = {
    get: function(target, prop) {
        return prop in target ? target[prop] : prop; 
    }
}

module.exports = function createLocalizationMiddleware() {
    return function(req, res, next) {
        // This is very simple localization. Accept-Language could contain list of accepted langauges with weighting. But for demonstration purposes eventshuffle-api accepts only one.
        const lang = req.headers["accept-language"] && apiLocs.hasOwnProperty(req.headers["accept-language"]) ? req.headers["accept-language"] : "en"; 

        req.loc = {
            api: new Proxy(apiLocs[lang], apiProxyHandler)
        }

        next(); 
    }
}