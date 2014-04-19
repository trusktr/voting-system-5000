# Voting System 5000

Voting System 5000 is a web-based voting system developed during Spring 2014 as a project for CSc 250 (Computer Security and Privacy) at California State University, Sacramento. The project has been sponsored by Dr. Isaac Ghansah.

Team Members:
----

    Hector Garcia, Christopher Lawson, Joseph Pea

Design Approach and Justification
-----------
>Our design approach was to develop Voting System 5000 as a secure web-based application. The requirements for the project specify the need for a multi-client, single-server application to manage the registration and voting parts of the electoral process, fundamentally based on an RPC framework. Web programs are essentially RPC programs if examined in depth. We believe we can create a web program that features a user-friendly interface, reliable and fast service, and eventually will satisfy the security requirements specified in future versions. We are using javascript on the back-end, utilizing node.js running server-side, a MongoDB database, and Mongoose database mapping. On the front-end, we are using the dust template engine, the Foundation web framework, which uses HTML/CSS/javascript. jQuery connects the front and back end. We are using GitLab for version control. We are using crypto-js for most of the cryptography, but also use node-bignumber for its RSA applications. One major assumption we have made is that each and every voter that would like to use our system has been issued a National Voter ID card, that contains a Public-Private key pair that has been created specifically for them.

Security Features
-----------
* Voting no more than once enforced on front and back end.
* Mutual authentication accomplished via use of HTTPS (server authentication) and a log-in system (client authentication).
* User passwords hashed before saving with SHA256. *in progress*
* Voters may only vote for a single candidate per office, and exclusively yes or no per proposition.
* Secrecy accomplished via HTTPS in transit, and a voters votes are encrypted via AES for storage in the server database.  *in progress*
* Vote integrity accomplished with RSA signatures, using the Voter ID card key pairs  *in progress*
* Opt-out possible for public officials; vote will be public record if legally required and properly configured at Registration. 
* Total vote count authenticated by server, using a private RSA key from a config file and a matching published public key.  *in progress*
* Encryption key config file secured with restricted unix file access to implement trust.
* Identity theft protection accomplished by combination of username, password, and Voter ID card.
* Access to functionality restricted by election status (Pre-election, Registration, Voting, Post-Election).  *in progress*


Advantages / Disadvantages of Approach for Location Transparency
-----------
>Due to the nature of our program being browser-based, location transparency is accomplished via the use of a single domain name. In the most secure deployment implementation we have theorized for future versions, the voting system kiosks would connect through a preconfigured Virtual Private Network tunnel to a secure local private DNS server, that will redirect to multiple redundant database servers around the country. These servers will also be connected together with each other on the VPN network. This system will use the existing infrastructure of the internet but will essentially be on its own network. In this version of the program, these security features have not yet been implemented, and the voting system will be accessible on the internet at a fixed domain address. 

Challenges and Lessons Learned
-----------
>For two of our team members, the technology stack our program is implemented with are almost entirely new. Thus, a major portion of the time spent on the project to this point has been familiarization with new languages and frameworks.

>Our security framework is not fully implemented as of 4/19/14. Note the Security Features fields above that are denoted  *in progress*. These will be completed as soon as possible. 


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
* https://code.google.com/p/crypto-js/ -crypto-js
* https://www.npmjs.org/package/big-number -node-bignumber

License
----

MIT

    
