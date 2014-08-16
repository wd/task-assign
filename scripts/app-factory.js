Myapp.factory('utils', function() {
    return {
            dateStrDiff: function( d1, d2 ) {
                var date1 = new Date(d1),
                    date2 = new Date(d2),
                    datediff = date1.getTime() - date2.getTime();
                return (datediff / (24*60*60*1000));
            },
            getUrl: function( url ) {
                var callback = '?' + (callback || '_c' ) + '=JSON_CALLBACK',
                    baseUrl = window.baseUrl || '/';
                return baseUrl + url + callback;
            },
            checkResp: function(resp) {
                if ( resp.status == 200 ) {
                    return resp.data;
                } else {
                    var url = resp.config.url,
                        msg = 'get ' + url + ' data error';
                    console.log(msg);
                    return null;
                }
            }
        };
    })
    .factory('remote', function($http, utils) {
        return {
            getPeoples: function() {
                return $http.jsonp(utils.getUrl('task/getpeoples'));
            }
        };
    });
