



console.log('Setting up LinkController.');

var locomotive = require('locomotive'),
	LinkController = new locomotive.Controller();

LinkController.director = function() {
	console.log('### director...');
	
	if (this.req.url == '/lets-find-a-cure-for-ahmad') {
		this.res.redirect('https://secure.commonground.convio.com/debra/personalfundraising/project.html?personalFundraisingProjectId=a0qA00000020JFbIAM&showMessage=true');
		return;
	}
	
	this.next();
};

module.exports = LinkController;

console.log('Done setting up LinkController.');






