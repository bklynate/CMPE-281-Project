var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var uri = "mongodb://Sparkling5:mongolab4@ds033097.mongolab.com:33097/mongolab";
var dbo;
var ejs = require("ejs");
mongo.connect(uri, function (err, db) 
{
	  if (err) 
	  {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  }
	  else 
	  {
		  dbo = db;
	  }
});

function getCard(/*callback*/req,res)
{
	//var cardId=req.params.cardId;
	var cardId=req.param('cardId');
	console.log(cardId+"cardId");
	//Query: db.multitenant.find({'kanban.cards.card_id':'Card_101_1'},{'kanban.cards.$.card_id':1});
	
	dbo.collection('multitenant', function(err, collection) {
		    
		    	
		       //collection.findOne({'kanban.cards.card_id' : 'Card_101_1'}, function(err, result)
		      //collection.find( function(err, result)
			collection.findOne({'kanban.cards.card_id':cardId},{'kanban.cards.$.card_id':1},function(err, result)
		    	{
		            if (err) 
		            {
		                console.log('Error updating scrum ' + err);
		                res.send({'error':'An error has occurred'});
		            }
		            else 
		            {
		                console.log('' + result + ' Doc Fetched!');
		                res.jsonp(result);
		                
		            }
		        });
		    });
		
}

function getCardsByQueue(/*callback*/req,res)
{
	var queue=req.param('queueName');
	console.log(queue+ " queue")
	//Need to use aggregate functio
/**Query
 * db.multitenant.aggregate([{
  $match: {
    _id: '101'
  }
}, {
  $unwind: "$kanban.cards"
}, {
  $project: {
    card_name: "$kanban.cards.card_name",
    card_id: "$kanban.cards.card_id",
    queue_name: "$kanban.cards.queue_name",
    user: {
      firstname: "$kanban.cards.user.firstname",
      lastname: "$kanban.cards.user.lastname"
    }
  }
}, {
  $match: {
    queue_name: {
      $in: ["Planned"]
    }
  }
}])
 */
	 
	dbo.collection('multitenant', function(err, collection) 
		    {
		    	

		       collection.aggregate([{
		    	   $match: {
		    		    _id: '101'
		    		  }
		    		}, {
		    		  $unwind: "$kanban.cards"
		    		}, {
		    		  $project: {
		    		    card_name: "$kanban.cards.card_name",
		    		    card_id: "$kanban.cards.card_id",
		    		    queue_name: "$kanban.cards.queue_name",
		    		    user: {
		    		      firstname: "$kanban.cards.user.firstname",
		    		      lastname: "$kanban.cards.user.lastname"
		    		    }
		    		  }
		    		}, {
		    		  $match: {
		    		    queue_name: {
		    		      $in: [queue]
		    		    }
		    		  }
		    		}],
		    		   function(err, result)
		    	{
		            if (err) 
		            {
		                console.log('Error updating scrum ' + err);
		                res.send({'error':'An error has occurred'});
		            }
		            else 
		            {
		                console.log('' + result + ' Doc Fetched!');
		                res.jsonp(result);
		                
		            }
		        });
		    });
		
}

function getStatus(/*callback*/req,res)
{
	var cardId=req.params.text1;
	
	dbo.collection('multitenant', function(err, collection) 
		    {
		    	//var story = {'story_id':req.params.id_story};
		//db.multitenant.find({'kanban.cards.card_id' : 'Card_101_1'});

		       collection.findOne({'kanban.cards.card_id' : 'Card_101_1'}, function(err, result)
		      //collection.find( function(err, result)
		    	{
		            if (err) 
		            {
		                console.log('Error updating scrum ' + err);
		                res.send({'error':'An error has occurred'});
		            }
		            else 
		            {
		                console.log('' + result + ' Doc Fetched!');
		                res.jsonp(result);
		                
		            }
		        });
		    });
		
}

function updateCard(/*callback*/req,res)
{
	/*
	var card_id = req.params.card_id; 
	
    var firstName = req.params.firstName;
    var lastName = req.params.lastName;
    var card_name = req.params.card_name;
    var queueName = req.params.queueName;
    console.log('Queue_name'+queueName);
    */
	
	var card_id = req.param('card_id'); 
	
    var firstName = req.param('firstName');
    var lastName = req.param('lastName');
    var card_name = req.param('card_name');
    var queueName =req.param('queueName');
    console.log('Queue_name'+queueName);
    
    //db.multitenant.update({"kanban.cards.card_id" : "Card_101_1"}, {"$set" : {"kanban.cards.$.queue_name" : "Planned"}})   
    //var user1 = getPreference(req);
    //Updated Query: db.multitenant.update({"kanban.cards.card_id" : "Card_101_1"}, {"$set" : {"kanban.cards.$.queue_name" : "Planned","kanban.cards.$.card_name" : "NewCardName2","kanban.cards.$.user.firstname" : "Purvi","kanban.cards.$.user.lastname" : "Purvi"}})  
    
    dbo.collection('multitenant', function(err, collection) {
        //collection.update({"kanban.cards.card_id" : "Card_101_1"}, {"$set" : {"kanban.cards.$.queue_name" : queueName}}, function(err, result) 
       collection.update({"kanban.cards.card_id" : card_id}, {"$set" : {"kanban.cards.$.queue_name" : queueName,"kanban.cards.$.card_name" : card_name,"kanban.cards.$.user.firstname" : firstName,"kanban.cards.$.user.lastname" : lastName}}, function(err, result)  
        		{
            if (err) 
            {
                res.send({'error':'An error has occurred'});
            }
            else 
            {
                console.log('Updated Successfully!');
                //res.jsonp(user1);
            }
        });
    });
		
}

function createCard(/*callback*/req,res)
{
	var card_id = new ObjectID();
    var firstName = req.param('firstName');
    var lastName = req.param('lastName');
    var card_name = req.param('card_name');
    var queueName =req.param('queueName');
    
   

    
    dbo.collection('multitenant', function(err, collection) {
    	var card = {
    			  "user": {
    			    "firstname": firstName,
    			    "lastname": lastName
    			  },
    			  "card_name": card_name,
    			  "card_id": card_id,
    			  "queue_name": queueName
    			};
    		/*Query: 	db.multitenant.update({
    			  "_id": "101"
    			}, {
    			  $push: {
    			    "kanban.cards": card
    			  }
    			}); */
    	
    	
        collection.update({
			  "_id": "101"   
		}, 
		{
		  $push:{
		    "kanban.cards": card
		  		}
		}, function(err, result) 
        {
            if (err) 
            {
                res.send({'error':'An error has occurred'});
            }
            else 
            {
                console.log('Updated Successfully!');
                //res.jsonp(user1);
            }
        });
    });
		
}
exports.getCard=getCard;
exports.getCardsByQueue=getCardsByQueue;
exports.getStatus=getStatus;
exports.updateCard=updateCard;
exports.createCard=createCard;
