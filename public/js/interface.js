$(document).ready(function() {

	var getPeeps = function() {
		$('#peeps').empty();
		$.getJSON('api/peeps',function(data){
			data.reverse();
			$.each(data, function(index, peep){
				$.getJSON('/users/'+peep.user_id, function(user) {
					peep.name = user.name;
					peep.user_name = user.name;
					var source = $("#peepTemplate").html();
					var template = Handlebars.compile(source);
					$('#peeps').append(template(peep));
					
				});
			});
		});
	};

	var getCurrentUser = function() {
			$.getJSON('/sessions', function(data) {
			if(data[0] === "" || "null") {
				$('#signed-in').hide();
			} else {
				$('#message').text(data[1]);
				$('#signed-in').show();
			};
		});
	};

	$('#signing-in').hide();
	$('#signing-up').hide();
	$('#sign-out').hide();
	$('#posting-peep').hide();
	getPeeps();
	getCurrentUser()

	$('#logo').on('click', function(){
		window.location = ("/");
	});

	$('#login').on('click', function(){
		$('#signing-up').hide();
		$('#posting-peep').hide()
		$('#signing-in').show();

	});

	$('#sign-in').on('click', function() {
		var email = $('#email').val();
		var password = $('#password').val();
		$.getJSON('/users/' + email + '/' + password, function(user) {
			if(user === null) {
				$('#errors').text("The email or password is incorrect");
			} else {
				var name = user.name;
				var user_name = user.user_name;
				var id = user.id;
				$.post('/sessions', {name: name, user_name: user_name, id: id});
				$('#message').text("You are signed in as " + name);
				$('#signing-in').hide();
				$('#sign-out').show();
			};
		});
	});
	
	$('#join').on('click', function(){
		$('#signing-in').hide();
		$('#posting-peep').hide()
		$('#signing-up').show();
	});

	$('#sign-up').on('click', function() {
		var name = $('#full_name').val();
		var user_name = $('#user_name').val();
		var email = $('#email_create').val();
		var password = $('#password_create').val();
		$.post('/users', {name: name, user_name: user_name, email: email, password: password}).done(function() {
			$.getJSON('/users/' + email + "/" + password, function (user) {
				if(user === null) {
					$('#errors').text("This username or email is already taken");
				 } else {
					$.post('/sessions', {name: name, user_name: user_name, id: user.id});
					$('#message').text("You are signed in as " + name);
					$('#signing-up').hide();
					$('#sign-out').show();
				};
			});
		});
	});
	

	$('#sign-out').on('click', function() {
		$.post('/sessions', {name: "", user_name: "", id: ""});
		$('#name-signed-in').text("");
		$('#signed-in').hide();
		window.location = ("/");
	});

	$('#post-a-peep').on('click', function() {
		$('#signing-in').hide();
		$('#signing-up').hide();
		$.getJSON('/sessions', function(data) {
			if(data[0] === "") {
				$('#errors').text("You need to be signed in to post on Chitter!!!");
			} else {
				$('#posting-peep').show();
				$('#post-a-peep').hide();
			};
		});

	});

	$('#post-this').on('click', function() {
		if($('#content').val() === "") $('#errors').text("You cannot post an empty message!")
		else {
			$.get('/sessions', function(data) {
				userId = data[2];
				$.post('/api/peeps', {message: $('#content').val(), user_id: userId});
			});
			$('#posting-peep').hide();
			$('#post-a-peep').show();
			getPeeps();
		};
	});

});
