'use strict';

class FundamentusRepository {
    
    constructor(mongoClient){
        this.document = 'fundamentus';
        this.MongoClient = mongoClient;
        this.url = "mongodb://localhost:27017/fundamentus";
    }
    
    saveFundamentus(result){
        this.MongoClient.connect(this.url, function (err, db) {
            var collection = db.collection('fundamentus');
            collection.insertMany(result);
            db.close();
        });
    }

    retrieveFundamentus(filter, callback){
        console.log("url: " + this.url);
        console.log('document: ' + this.document);
        this.MongoClient.connect(this.url, function (err, db) {
            var collection = db.collection('fundamentus');
            collection.find(filter).toArray(function (err, docs) {
                callback(docs);
            });
        });
    }
}

module.exports = FundamentusRepository;