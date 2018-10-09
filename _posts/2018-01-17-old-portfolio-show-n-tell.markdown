---
layout: post
title:  "Old Portfolio Show & Tell"
date:   2018-01-17 15:56:19 -0500
categories: jekyll update
---
This is my old portfolio built with good old AngularJS. 

![screenshot_of_old_portfolio1]({{ site.url }}/{{ site.baseurl }}/assets/img/old_portfolio_show_n_tell-screenshot.png)  

Every time someone pulled it up, a websocket connection would start transmitting and saving to MongoDB their conversation with my bot along with their IP. Its responses came from a loaded Google Spreadsheet via Tabletop.js. 

![screenshot_of_old_portfolio2]({{ site.url }}/{{ site.baseurl }}/assets/img/old_portfolio_show_n_tell-screenshot_2.png)  

There was also a webhook for Telegram that kept track of who was visiting my sites from where. It allowed me to pick and communicate with a site visitor after turning off the bot and outputting my own responses from the Telegram app on my phone or my laptop.  

If you want to check it out, it's [right here](https://grant.ai/oldsite).

Here is the source code for the [client](https://github.com/grant-park/oldsite) and the [server](https://github.com/grant-park/grantbot).
