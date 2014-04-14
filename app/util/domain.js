exports.getUrl = function(subdomain, uri) {
    var isProduction = 'production' === process.env.NODE_ENV;

    if (isProduction) {
        return 'https://' + (subdomain ? subdomain + '.' : '') + 'battletrophy.com' + (uri ? '/' + uri : '');
    }
    else {
        if (subdomain) {
            return '/subdomain/' + subdomain + (uri ? '/' + uri : '');
        }
        else {
            return '/' + (uri ? uri : '');
        }
    }
}
