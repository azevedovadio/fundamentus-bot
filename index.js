'use strict';

const Telegram = require('telegram-node-bot') ,
    tg = new Telegram.Telegram('387240617:AAGrD3NPfe2JUKHtzVLRc5VkT0CdA0MP7nA', {
        workers: 1
    });

const FundamentusController = require('./controllers/fundamentus')
    , FundamentusCrawler = require('./crawler/fundamentus')
    , FundamentusRepository = require('./persistence/fundamentus');

let crawler = new FundamentusCrawler();

let MongoClient = require('mongodb').MongoClient;

let repository = new FundamentusRepository(MongoClient);

let controller = new FundamentusController(crawler, repository);

tg.router.when(new Telegram.TextCommand('/fundamento', 'fundamentoCommand'), controller).otherwise(controller);
