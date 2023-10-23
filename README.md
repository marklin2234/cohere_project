## AutoTLDR - your TLDR Chatbot buddy.


<p align="center">
  <img src="https://github.com/marklin2234/cohere_project/blob/main/src/img/bot.png?raw=true" alt="Logo"/>
</p>

## Info

* App is live! Check it out here: https://cohere-project.vercel.app/
* Backend repo can be found here: https://github.com/marklin2234/cohere_project_backend
* Authors: [@michael1ding](https://www.github.com/michael1ding) and [@marklin2234](https://www.github.com/marklin2234)

## Background

We leveraged our respective backgrounds writing Python apps and Javascript clients from previous projects and internships to build this Chatbot. The goal of this project was to make LLM technology more accessible to everyday technology users through a friendly user interface.

### Functionality

We've implemented the following features, you should be able to:
* Interact with the chat bot using text
* Toggle link pasting mode, where the link will be scraped and summarized

### Current Work

At the current moment, we are working on extending the backend Flask API to listen to an email inbox. This way, users can very easily forward emails or groups of emails to our bot and a daily/instant summary will be delivered straight to your index by our friendly bot.

### Technology Choices

Because of the scale of this application, we decided that we can handle the entire logic flow in memory on the virtual machine hosts. We still process web requests asynchronously with Javascript async/await syntax. This decision was made on the basis that our Cohere API is rate limited.

Flask was used as the backend of choice due to problems with CORS (Cross-origin resource sharing) policy when making XMLHTTP requests using Javascript. We have working with web scraping using Python in the past - paired with powerful regex abilities and compatibility with many frameworks this API backend was our ultimate choice. 
