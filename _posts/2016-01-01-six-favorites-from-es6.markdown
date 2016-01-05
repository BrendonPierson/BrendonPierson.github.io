---
layout: post
title:  "Six Favorite Features of ES6 for 2016"
date:   2016-01-01 23:23:55 
update_date: 2016-01-01
categories: javascript es6
comments: true
id: 1
---

Playing around with react has recently led to a lot of contact with ES6 aka EcmaScript6 aka ES 2015.  Here is a quick introduction to my six favorite features.  The easiest way to play around with ES6 is with [babel](http://babeljs.io/repl/). To actually run the code try [Firefox developer edition's console](https://www.mozilla.org/en-US/firefox/developer/). 

I'll be briefly covering block scoping, arrow functions, spread operators, object property shorthand, modules, and object destructuring


<h3>1. Block Scoping with let and const</h3> JavaScript `var`'s are scoped to their containing function.  `let` and `const` are scoped to their containing block.  Block scoping cleans up some global pollution and makes things such as using multiple loops a breeze. `const` is also immutable which is great if there is a variable you want to make sure doesn't change.  

{% highlight javascript %}
// Example from MDN
function varTest() {
  var x = 31;
  if (true) {
    var x = 71;  // same variable!
    console.log(x);  // 71
  }
  console.log(x);  // 71
}

function letTest() {
  let x = 31;
  if (true) {
    let x = 71;  // different variable
    console.log(x);  // 71
  }
  console.log(x);  // 31
}
{% endhighlight %}

<h3>2. Arrow Functions</h3> aka `=>`.  Anything in front of the arrow is an argument.  If you are returning a single statement no `{}` or `return` is needed, it is returned implicitly.  If it is not a simple statement you can still use `{}` and `return` like normal.  Arrow functions are great for simplifying callbacks or really any anonymous function.  

{% highlight javascript %}
//Examples:
function(x,y) {
  return x + y;
}
// Is the same as
(x,y) => {x + y};

// It can also be argumentless
() => "This function has executed";

// It can be stripped down more
x => x + 2;

// Real world use case
var testScores = [73, 66, 87, 54, 77, 58, 68, 76];
var curvedScores = testScores.map(function(score){
  return score + 5;
}); // Produces the same result as
var curvedScores = testScores.map(score => score + 5);
console.log(curvedScores); //[78, 71, 92, 59, 82, 63, 73, 81];
{% endhighlight %}
The only real difference between arrow functions and old fashioned anonymous functions is how `this` is handled. In javascript all functions have their own `this`, arrow functions don't. They simply refer to their containing scope's `this`;

{% highlight javascript %}
this.whereAmI = "global";

var obj = {
  whereAmI: "obj",
  RegularLocation: function() {
    return this.whereAmI;
  },
  ArrowLocation: () => this.whereAmI
}

console.log(obj.RegularLocation()); //"obj"
console.log(obj.ArrowLocation()); //"global"
{% endhighlight %}
<h3>3. Spread Operator</h3> `...spread` The spread operator allows you to expand an array in place.  This is really useful for combining arrays as well as accepting an unknown number of function arguments.

{% highlight javascript %}
//Example
var pets = ["dog", "cat", "goldfish"];
//Casually insert an array into a new array
var morePets = ["iguana", ...pets, "tRex"];
console.log(morePets); //Array [ "iguana", "dog", "cat", "goldfish", "tRex" ]

//Accept an unknown number of arguments
var rollcall = function(...animals) {
  animals.forEach(function(animal) {
    console.log(animal, "Here!");
  });
}

rollcall("cat", "dog", "Minature Horse"); // cat Here! dog Here! Minature Horse Here!
{% endhighlight %}

<h3>4. Object Property Shorthand</h3> This nice little feature allows you to create objects with variables where the variable name is the key and the value is the variable value.  Sounds so much more complicated than it really is.

{% highlight javascript %}
var fName = "Big";
var lName = "Lebowski";
var line = function() {
  console.log("The dude abides");
}

var dude = {
  fName,
  lName,
  line
}

console.log(dude); //Object { fName: "Big", lName: "Lebowski", line: line() }
dude.line(); //The dude abides
{% endhighlight %}

<h3>5. Modules</h3> Separating code into separate files is something most people do already, but it requires browserify, webpack, requirejs, or some other non-standard package that all come with their limitations and hassles.  Now you can use modules natively where and when you want.  You can export one thing or multiple named things from a module.  Check out [this post](http://exploringjs.com/es6/ch_modules.html) for a more thorough primer.

{% highlight javascript %}
////////// taxCalculator.js //////////
export default function taxCalculator(amount) {
  return amount * 1.07;
}

////////// main.js //////////
import taxCal from "./taxCalculator";
var price = taxCal(2.99);
console.log(price.toFixed(2)); //3.20

{% endhighlight %}
<h3>6. Object destructuring</h3> With ES6 you can quickly pull out values from an object and set them to a variable with minimal syntax.  The most common use case is when importing multiple things from a module.

{% highlight javascript %}
////////// holidays.js //////////
export var christmas = function() {
  console.log("Merry Christmans");
}
export var mayFourth = function() {
  console.log("May the fourth be with you!");
}
export var festivous = function() {
  console.log("A Festivus for the rest of us!");
}

////////// main.js //////////
import {christmas, festivous } from "./holidays";
// note you can pull out whichever modules you need, 
// now there is a christmas and festivous variable in main.js
christmas(); // "Merry Christmans"
festivous(); // "A Festivus for the rest of us!"
{% endhighlight %}

<h3>Conclusion</h3> Thanks for reading, I hope some of it was helpful.  There are a ton more cool features in ES6 and even from future releases, but I found these were the easiest to start incoporating into code right now.  Check out [http://es6-features.org/](http://es6-features.org/) to see all of the ES6 features along with great examples.

