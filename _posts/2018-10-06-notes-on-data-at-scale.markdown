---
layout: post
title:  "Notes on Data@Scale 2018"
date:   2018-10-25 12:00:00 -0600
categories: keyboards
comments: true
---

The following notes are quick thoughts and summarizations of various talks at the Data@Scale conference I attended today. The full schedule of events along with some videos of the presentations are found [here](https://atscaleconference.com/events/data-scale-2018/)

**Lessons and Observations Scaling a Timeseries Database** _by_ **Ryan Betts**_, Director of Platform Engineering at InfluxData_  
* Timeseries Database  
* LSM  

**Leveraging Sampling to Reduce Data Warehouse Resource Consumption** _by_ **Gabriela Jacques Da Silva**_, Software Engineer at Facebook; and_ **Donghui Zhang**_, Software Engineer at Facebook_  
* Various research papers and a closed form error estimate  

**Voting with Witnesses the Apache Cassandra Way** _by_ **Ariel Weisberg**_, PMC Member at Apache Cassandra_
* Quorums  
* Merkle Tree  
* Consistent Hashing (Hash Rings)  
* Visible / Witness  

**Deleting Data @ Scale** _by_ **Ben Strahs**_, Software Engineer, Privacy & Data Use at Facebook_
* Schemas  
* Widespread testing  
* Restoration (Continuous)  

**Scaling Data Plumbing at Wayfair** _by_ **Ben Clark**_, Chief Architect at Wayfair_
* Sliding Window on Pipeline  
* Leaky Bucket  
* ETL  

**Presto: Pursuit of Performance** _by_ **Andrii Rosa**_, Software Engineer at Facebook and_ **Matt Fuller**_, VP of Engineering at Starburst_
* Cost-based optimizer  
* Fast SQL querying  
* Use of coefficients to determine cost of three things: storage usage, CPU usage, and complexity  

**Building Highly Reliable Data Pipelines at Datadog** _by_ **Jeremy Karn**_, Staff Data Engineer at Datadog_
* Spot Instances  
* On-demand instances  
* Isolate issues via preventatively running multiple pipelines  
