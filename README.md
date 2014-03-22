# Voting System 5000

Voting System 5000 Report
=========

Voting System 5000 is a web-based voting system developed during Spring 2014 as a project for CSc 250 (Computer Security and Privacy) at California State University, Sacramento. The project has been sponsored by Dr. Isaac Ghansah.

Team Members:
----

    Hector Garcia, Christopher Lawson, Joseph Pea

Design Approach and Justification
-----------
>Our design approach was to develop Voting System 5000 as a secure web-based application. The requirements for the project specify the need for a multi-client, single-server application to manage the registration and voting parts of the electoral process. We believe we can create a program that features a user-friendly interface, reliable and fast service, and eventually will satisfy the security requirements specified in future versions. We are using javascript on the back-end, utilizing node.js running server-side, a MongoDB database, and Mongoose database mapping. On the front-end, we are using the dust template engine, the Foundation web framework, which uses HTML/CSS/javascript. jQuery connects the front and back end. We are using GitLab for version control. 

Advantages / Disadvantages of Approach for Location Transparency
-----------
>Due to the nature of our program being browser-based, location transparency is accomplished via the use of a single domain name. In the most secure deployment implementation we have theorized for future versions, the voting system kiosks would connect through a preconfigured Virtual Private Network tunnel to a secure local private DNS server, that will redirect to multiple redundant database servers around the country. These servers will also be connected together with each other on the VPN network. This system will use the existing infrastructure of the internet but will essentially be on its own network. In this initial version of the program, these security features have not yet been implemented, and the voting system will be accessible on the internet at a fixed domain address and per the requirements will provide only limited security. 

Challenges and Lessons Learned
-----------
>For two of our team members, the technology stack our program is implemented with are almost entirely new. Thus, a major portion of the time spent on the project to this point has been familiarization with new languages and frameworks. We have not yet determined if our security plan (more details to come in the next version report) is entirely feasible.


Team Roles
-----------
* Requirements and Initial Design: Hector Garcia, Joseph Pea, Christopher Lawson
* Development Lead: Joseph Pea
* Controller Development: Joseph Pea, Christopher Lawson
* Model Development: Christopher Lawson, Joseph Pea
* View Development: Joseph Pea, Hector Garcia, Christopher Lawson
* Documentation: Christopher Lawson
 

Installation
-----------
> This project requires a large amount of pre-installed dependencies. Our group will be providing in person guidance on the installation process either before or during the demonstration.

Voting System 5000 uses a number of open source projects to work properly:

* http://nodejs.org/ -node.js
* https://www.mongodb.org/ -MongoDB
* http://mongoosejs.com/ -Mongoose
* http://foundation.zurb.com/ -Foundation
* http://akdubya.github.io/dustjs/ -dust
* http://jquery.com/ -jQuery

License
----

MIT

    
