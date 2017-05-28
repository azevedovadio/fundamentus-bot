'use strict';

const Telegram = require('telegram-node-bot');

class FundamentusController extends Telegram.TelegramBaseController {

    constructor(crawler, repository) {
        super();
        this._crawler = crawler;
        this._repository = repository;
    }

    handle($) {
        let self = this;

        if ($.message.text == null)
            return;

        let commands = $.message.text.split(' ');

        let stock = commands[0].replace('/', '');
        let fund = commands[1];

        let regex = new RegExp('(/|[ ]+)', 'gm');

        let processor = function ($, response) {
            if (!response) {
                $.sendMessage('Desculpe-me, ainda não consigo encontrar esta informação');
                return;
            }

            if (fund) {
                var value = response.find((item) => {
                    return item && item.Name.toLowerCase().replace(regex, '') === fund.toLowerCase().replace(regex, '');
                });

                if (value)
                    $.sendMessage(value.Value);
                else
                    $.sendMessage('Desculpe-me, ainda não consigo encontrar esta informação');

                return;
            }

            var result = "";
            response.forEach((e) => result += e.Name ? (e.Name + ':' + e.Value + '\n') : '');
            if (result != '')
                $.sendMessage(result);
            else
                $.sendMessage('Desculpe-me, ainda não consigo encontrar esta informação');
        }

        self._repository.retrieveFundamentus({ Stock: stock }, function (response) {
            if (response.length > 0) {
                console.log('stock fundamentus already in database');
                processor($, response);
            }
            else {
                console.log('stock fundamentus will be crawled and saved to database');
                self._crawler.load(stock, function (response) {
                    self._repository.saveFundamentus(response);
                    processor($, response);
                });
            }
        });
    }

    get routes() {
        return {};
    }
}

module.exports = FundamentusController;