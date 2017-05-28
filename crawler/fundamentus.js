'use strict';

var Crawler = require('crawler');

class FundamentusCrawler {

  constructor() {
    this.Crawler = new Crawler();
  }

  load(stock, callback) {

    console.log('crawlling ' + stock);

    this.Crawler.queue({
      uri: 'http://www.fundamentus.com.br/detalhes.php?papel=' + stock,
      callback: function (error, res, done) {
        
        var $ = res.$;

        let i = 0;
        let ignore = [96, 109, 110, 111];

        let preresult = [];
        
        $('.txt, .oscil').each(function () {
          if (ignore.indexOf(i) < 0)
            preresult.push($(this).text().replace(/(\r?\n|\r)/gm, ' ').trim());
          i++;
        });

        let result = [];
        for (i = 0; i < preresult.length; i += 2)
          result[i/2] = { Stock: stock, Name: preresult[i], Value: preresult[i + 1] };

        callback(result);
      }
    });
  }
}

module.exports = FundamentusCrawler;