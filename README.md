## Members Only
A message board app utilizing passportjs to authenticate users. Users are given different levels of access depending on their authority, which is confirmed via secret passwords.


## Project Screen Shot(s)


## Installation and Setup 


Requirements: `node` and `npm` installed globally on your machine.  


Clone this repository. 


.env file contents:

Set MONGODB_URI with your own mongodb link. 

Set SESSION_SECRET with any string (the longer and more varied characters the better!).

Set MEMBER_PASSWORD and ADMIN_PASSWORD with the secret phrases you’d like for the user to become a member or an admin.


Installation:


`npm install`  


To Start Server:


`npm start`  


To Visit App:


`localhost:3000`  


## Reflection
In order to practice user authentication, I set out to build an app that would change in functionality if the user is logged in and according to different authentication levels. To keep it simple, authentication levels are granted if the user enters a secret phrase on the appropriate page. 

The authority levels, features, and their associated secret phrases are as follows:
**Admin**
Secret phrase: UltimateLordOverAll
Has all permissions granted to members. 
Able to delete posts
**Member** 
Secret phrase: justtrustme
Has all permissions granted to non-members
Able to see usernames and post dates
**Non-members (signed in)**
Has all permissions granted to signed out non-members
Able to create posts
**Non-members (signed out)**
Able to see main content of posts

In implementing this, I went with a MVC structure using Express.js, Node.js, Mongoose and pug. In addition to restricted access to the mongoDB database, I also set conditional statements in the pug templates for different displays depending on the access level. To make the authentication more secure, I also used bcryptJS to hash and salt the users’ passwords. This means that not even I know any account passwords on this site, so feel free to make it as skeptical as you’d like!
