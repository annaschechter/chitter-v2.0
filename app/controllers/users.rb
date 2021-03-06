get '/users' do
	content_type :json
	users = User.all
    return users.to_json
end

get '/users/:email/:password' do
	content_type :json
	email= params[:email] 
	password = params[:password]
	user = User.authenticate(email, password)
	return user.to_json
end 

get '/users/:id' do
	content_type :json
	id = params[:id] 
	user = User.first(:id => id)
	return user.to_json
end 

post '/users' do
	content_type :json
	user = User.create(:name => params[:name],
										:user_name => params[:user_name],
		                :email => params[:email],
		                :password => params[:password])
	return user.to_json
end
