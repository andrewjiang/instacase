Template.footer_company.rendered = function(){
	return !function(d,s,id) {
           var js,fjs = d.getElementsByTagName(s)[0];
           if(!d.getElementById(id)){
             js=d.createElement(s);
             js.id=id;
             js.src="http://platform.twitter.com/widgets.js";
             fjs.parentNode.insertBefore(js,fjs);
           }
   }(document,"script","twitter-wjs");
};

Template.footer_company.events({
	'click #case-button': function(event){
		alert("test");
		$(this).toggleClass("selected");
	},
	'click #clipart-button': function(event){
		$("#sample-icon").toggleClass("invisible");
	},
	'click #text-button': function(event){
		$("#sample-text").toggleClass("invisible");
	}
});