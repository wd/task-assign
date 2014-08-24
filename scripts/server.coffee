http = require 'http'
url = require 'url'

getTasks = () ->
    [
        { id: 1, no: 'Q-T-2345', name: 'just a test task', pm: { id:1, name: '王冬' }, assignTo: { id:1, name: '王冬' }, startFrom: '2014-08-03', dueTo: '2014-08-09', qaDate: '2014-08-06', releaseDate: '2014-08-06', notes: '' }
        { id: 2, no: '', name: 'just an test task', pm: { id:1, name:'王冬'} , assignTo: { id: 1, name: '王冬' }, startFrom: '2014-08-03', dueTo: '2014-08-09', qaDate: '2014-08-06', releaseDate: '2014-08-06', notes: '' }
    ]

getPeoples = () ->
    [
        { id:1, name: '王冬'}
        {id:2, name: '测试'}
    ]

getPms = () ->
    [
        { id:1, name: '王冬'}
        {id:2, name: '测试'}
    ]

getHasAssigned = () ->
    [
        { people: { id:1, name: '王冬' }, dueTo: '2014-08-09', startFrom: '2014-08-10' }
        { people: { id:2, name: '王冬' }, dueTo: '2014-08-09', startFrom: '2014-08-10' }
    ]
    
    
routes = 
    '/task/getpeoples': getPeoples
    '/task/getpms': getPms
    '/task/gettasks': getTasks
    '/task/gethasassigned': getHasAssigned

server = http.createServer (req, res) ->
    _url = url.parse(req.url, true)
    
    fn = routes[_url.pathname]

    console.log req.method, req.url
    
    if fn
        value = JSON.stringify(fn())
    else
        value = 'not yet implemented'

    if callback =  _url.query['_c']
        value = callback + '(' + value + ')'

    res.writeHead 200,
        'Content-Type': 'application/json'
        'Content-Length': Buffer.byteLength(value, 'utf8') + 1
    res.write value + '\n'
    res.end()

server.listen 8000
