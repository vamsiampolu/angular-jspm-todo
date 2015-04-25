# angular-jspm-todo
A simple todo app with angular,jspm and semantic-ui.Will also try and build a gulp config here

The project is my attempt to build a todo app that is

1. beautiful and simple to understand,in order to accomplish this I use semantic ui to build the site using easy to follow markup
   and angularjs to build stuff with two way data-binding and a beautiful seperation of concerns.
   
2. offline i believe that building an offline app experience is beautiful,I hope to use couchdb-pouchdb replication to do both 
   live updates and offline data storage in one stroke. I hope to go through the treacherous forests of AppCache to accomplish 
   and the offline and online events to display the UI with an indication of connectivity(I am told that this does not work 
   in some browsers such as Firefox).

3. I want to have fun building this and learning to use gulp,angular,pouchdb,semantic-ui,jspm and ofcourse couchdb on the backend.

This project's dependencies must be installed by doing:

jspm install

npm install

To start serving the files using browser-sync either of the two commands listed below can be used:

gulp serve //(just starts browser-sync)
gulp watch //(performs some additional stuff)

The gulp watch and serve tasks are currently a bit erratic,they sometimes do not reload the page when a change is made to
app/app.js.

Also,if you are a fan of writing karma and protractor tests,I have not started testing the project(I read the Angularjs book
by Green and Seshadri and I still find karma confusing)
