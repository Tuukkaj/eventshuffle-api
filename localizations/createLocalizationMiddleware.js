const apiLocs = {
    "en": require("./api/en"),
    "fi": require("./api/fi")
}

function apiTranslate(lang, key) {
    return apiLocs[lang].hasOwnProperty(key) ? apiLocs[lang][key] : key; 
}

module.exports = function createLocalizationMiddleware() {
    return function(req, res, next) {
        const lang = req.headers.lang && apiLocs.hasOwnProperty(req.headers.lang) ? req.headers.lang : "en"; 

        req.loc = {
            api: apiTranslate.bind(null, lang)
        }

        next(); 
    }
}