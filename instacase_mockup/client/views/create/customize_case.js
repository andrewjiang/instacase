Template.customize_case.events({
	'click #case-button': function(event){
		$(".button-wrap-filled").toggleClass("white-case");
		$(".button-wrap-filled").toggleClass("black-case");
	},
	'click #clipart-button': function(event){
		$("#sample-icon").toggleClass("invisible");
	},
	'click #text-button': function(event){
		$("#sample-text").toggleClass("invisible");
	}
});