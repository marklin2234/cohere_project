## SupplyEye - Inventory Management System

App is hosted on Replit: https://inventory-app-shopify--mding8166.repl.co/

 ![Logo](/src/img/bot.png).

## Background

I leveraged my background in Django from a previous internship (and also had a refresher for frontend HTML) to build this project. To goal is to distribute this application en masse to help local store owners keep track of their item inventory by implementing multiple backend operations for their store items and using a common datastore like SQLite to keep track of items.

### Functionality

I've implemented the following features, you should be able to:
* Create inventory items
* Edit Them
* Delete Them
* View a list of them
* When deleting, allow deletion comments and undeletion

### Technology Choices

Because of the scale of this application, I decided that it would be be best data storage solution would be SQLite, which also integrates nicely with Django through the Django ORM model. Although writing to database in this situation is exclusive locked to multiple threads, this design choice should be sufficient for our needs of single user applications.

Django was used as the backend of choice due to the development and somewhat structured nature offered by the web framework. Database migrations are easy and allow for significant leeway in implementing now and applying modifications in the future.
