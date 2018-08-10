/*********************************************
*			Homework assignment  1			 *
*			The nodeJS Masterclass			 *
*********************************************/

//imports... wish we could use 'import'
const 	http = require("http"),
		url = require("url"),
		string_decoder = require("string_decoder");

let port = 3454;
for(let key in process.env){//allow for command-line config of port
	if(key.toLowerCase === "port"){
		let newPort = parseInt(process.env[key], 10);
		if(newPort)//lazy verification : was
			port = newPort
	}
}

const httpServer = http.createServer(handleRequest),
	  routes = {
	  	"hello" : (data, cb)=>{
	  		cb(200, "hello");
	  	},
	  	"default" : (data, cb)=>{
	  		cb(404);
	  	}
	  };

// Start the server
httpServer.listen(port,function(){
  console.log('The http server is up and running now');
});



// hoisted and deferred definitions
function handleRequest(req, res){
	//ignore query for now, this is a barebones API
	const   parsedURL = url.parse(req.url, false),
			//we are case insensitive for now
			pathName = parsedURL.pathname || "",
			X=console.log("pathName = ", pathName)
			path = sanitizePath(pathName).toLowerCase(),
			//we can safely assume that every (existing) route is a function/
			handler = routes[path] || routes.default,
			//in the future we'll pass some data to the handlers
			//but for now only the body of the request
			data = {payload : ""},
			decoder = new string_decoder.StringDecoder('utf-8');

	req.on('data', (data)=>{
		// request's DATA handler
	  	data.payload += decoder.write(data);
	});
	req.on('end', ()=>{
		// request's END handler
		data.payload += decoder.end();

		//here we can return our response safely
		handler(data, (status, payload = "")=>{
			//the callback passed to our handler
	        res.setHeader('Content-Type', 'text/plain');
	        res.writeHead(status);
	        res.end(payload);
	        console.log("Returning this response: ", status,payload);
		});
	});
}

//helper functions
const sanitizePath = path=>path.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");