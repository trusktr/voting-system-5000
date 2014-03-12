



console.log('Setting up Pages controller.');

var locomotive = require('locomotive'),
	PagesController = new locomotive.Controller();

PagesController.all = function() {
	console.log('### All...');
	var subdomains = [
			// 'find.sk8.shops.on',
			// 'find.sk8.spots.on',
			'lets.go',
			// 'sk8.every.spot.on',
			'sk8.or.die.on',
			// 'we.live.on',
			'we.live.to',
			'we.will.forever'
			// 'welcome.to'
		],
		randomSubdomain = subdomains[Math.floor(Math.random()*subdomains.length)];
	if (this.req.headers.host == "voting-system-5000.com" || this.req.headers.host == "www.voting-system-5000.com") {
		this.res.redirect('http://'+randomSubdomain+'.'+'voting-system-5000.com'+this.req.url); return;
	}
	return this.next();
};

PagesController.main = function() {
	console.log('### Main...');
	this.title = 'voting-system-5000.';
	this.render();
};

module.exports = PagesController;

console.log('Done setting up Pages controller.');






