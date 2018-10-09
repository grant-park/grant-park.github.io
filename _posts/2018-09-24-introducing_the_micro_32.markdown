---
layout: post
title:  "Introducing the micro_32"
date:   2018-09-24 12:34:17 -0600
categories: keyboards
---

I've been piloting a 32-key layout for a year now, primarily for LaTeX and essay writing. Since I've graduated and no longer have homework, I now only type for work. 

My layout is in reach of all the fingers and I can do any combo or config that I can think of with ease. On [10fastfingers](), my WPM is comfortably 144 on the normal test and 110 on the advanced test. On [speedcoder.net](), my WPM is 64 for the C++ test.

![result]({{ site.url }}/{{ site.baseurl }}/assets/img/keymap_micro_32.png)  

__Some notes__:  
  
* I have modifers on the homerow because I will accidentally activate them elsewhere from lagging my fingers during fast typing. 

* My modifiers form symmetries with each other on both halves of the layout so that I can always form a combo.

* I have all my macros and layouts implemented via QMK. You probably get the point about how many combos you can form with just 32 keys so I won't be pedantic with the math here.

* [Here is a snapshot of my QMK keymap.](https://gist.github.com/grant-park/13990d95307ea56e2c5f95a35234efcb)

Meanwhile, I've handwired a prototype as shown below:

![result]({{ site.url }}/{{ site.baseurl }}/assets/img/micro_32.jpg)  

The halves are flashed with [Let's Split firmware](https://github.com/qmk/qmk_firmware/tree/master/keyboards/lets_split) and communicate via I2C over a TRRS cable. The switches are Gateron silent black, have O-Rings, and have Krytox-lubed springs and stems. They're pretty silent so I like using them at work.

I am prototyping a PCB and some case designs for a new keyboard with my layout -- I'm calling it the micro_32 since it's a tiny-ass keyboard with 32 keys and it coincidentally sounds like a combination of ProMicro and Atmega32u4. Originally I wanted to name it the "Micro32", but I realized it was [already taken and trademarked](https://www.favero.com/en2_billiard_electronic_digital_controller_to_time_accounting_system_for_billiard-59-22.html) -- hence the casing and added underscore.

[Email me](mailto:granthpark@gmail.com) if you would like to get your hands on one.

