To install locally:

1. Add the submodule:

    git submodule init
    git submodule update

2. Install bundler (if needed)

    gem install bundler

3. Add the gems

    bundle install 

4. Create the database and import the initial data:

    rake db:create
    rake db:migrate
    rake db:seed

5. Run the server

    rails server
