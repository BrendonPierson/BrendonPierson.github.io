---
layout: post
title:  "Five Favorite Features of ES6"
date:   2015-12-21 23:23:55 
categories: javascript es6
---

Playing around with react has recently led to a lot of contact with es6.  Here are my five favorite features.

1. Arrow Functions aka `=>`
{% highlight javascript linenos%}
  var testScores = [73, 66, 87, 54, 77, 58, 68, 76];
  var curvedScores = testScores.map(score => score + 5);
  console.log(curvedScores); //[78, 71, 92, 59, 82, 63, 73, 81]
{% endhighlight %}

This is the equivalent to:
{% highlight javascript linenos%}
  var testScores = [73, 66, 87, 54, 77, 58, 68, 76];
  var curvedScores = testScores.map(function(score){
    return score + 5;
  });
  console.log(curvedScores); //[78, 71, 92, 59, 82, 63, 73, 81]
{% endhighlight %}

2. Spread Operator
3. Object Property Shorthand
4. Modules
5. Let and Const