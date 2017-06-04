# Aquarium Journal - ALPHA

The Aquarium Journal is a web based application for tracking your aquarium water chemistry, maintenance, feeding, and expenses.

Currently the application will allow you to enter basic information on your tanks and record water chemistry for those tanks.

# Technology

Durandal - I'm using the Durandal SPA framework for the web client.

NodeJS - I'm using a Node/Express server to host the SPA and REST server.  A future additon to this app is to build
a raspberry pi to act as an automated feeder and chemical analysis unit. The pi will act as a client as well and access 
the REST service to log pH, temp, turbidity, and more

SOLR - I have chosen to use SOLR (http://lucene.apache.org/solr/) to store the data for two reasons.  
First, it's a product we use at my work, so I'm using this application to get some experience.  
Second, SOLR works with the open source banana dashboard which I entend to configure to get some visualizations.  
NOTE: Since I'm using this application to learn different technology, it also has the beginnings of
MongoDB support built in.  I'm not pursuing building that out at this time, but may return to that in the future.

# Development Setup

Install NodeJS 6.9.4
Install SOLR 6.5.1
(Note, the above version represent my development environment. Later version of NodeJS and SOLR may work just fine)
Start SOLR 
Download the code
Run npm install
Run gulp

The default gulp task will run the Aquarium Journal with browser sync.

Enjoy.

