# README
## Intro
Filmanalytics uses ruby on rails to fetch information about movies in a mySQL database and display them as a fancy D3 animated chart.

The goal of this project is to identify a correlation between month of release and success of the picture, according to user rankings instead of the usual movie grossing.


## Set up

#### MySQL
Install mysql

```
sudo apt-get install mysql-server
```

Test & create initial db

```
mysql -u root -p
mysql> CREATE DATABASE films;
mysql> CREATE USER 'me'@'localhost' IDENTIFIED BY 'me';
mysql> USE films;
mysql> GRANT ALL ON films.* TO 'me'@'localhost';
mysql> quit
```

#### Ruby on Rails
Install ruby & rails

```
\curl -L https://get.rvm.io | 
  bash -s stable --ruby=2.3.0 --rails --autolibs=enable --auto-dotfiles
rvm autolibs enable
rvm reinstall all --force
```

Try this if the previous failed

```
rvm install 2.3.0
/bin/bash --login
rvm --default use 2.3.0
rvm rubygems latest 
gem install rails
```

Install mysql gem

```
sudo apt-get install libmysqlclient-dev
gem install mysql2
```

#### Films analytics config
Get the app

```
git clone https://github.com/TTalex/filmanalytics.git
```

Edit the "default: password:" line in config/database.yml to match your mySQL install

Seed the db with some data

```
rake db:seed
```

Launch the rails server

```
rails server --binding=server_public_IP
```

## Usage
After accessing the page, users can see the number of films out for each week/month out of the top 1000 ranked films of IMDB.

Users can also click on one of the rectangles to get a list of the corresponding films.

Users can input a start and an end year to display more precise information.
