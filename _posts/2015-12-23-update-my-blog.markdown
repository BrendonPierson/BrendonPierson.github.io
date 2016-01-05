---
layout: post
title:  "Help Keep These Posts up to Date!"
date:   2015-12-21 23:23:55 
update_date: 2015-12-23
categories: blog
comments: true
id: 0
---

We've all been there.  You google how to do some specific task in your language and framework of choice.  You find a detailed tutorial that is exactly what you were looking for.  Then the heartbreaker, it's a couple of years old, the technologies have changed, the dependencies are outdated.  I can't stand it when that happens, so if you see anything go out of date or any errors, I welcome anyone to contribute by submitting a pull request.  Here is the basic workflow of keeping these posts updated.  

1. You find some error or technology that has changed.
2. Go to [https://github.com/BrendonPierson/brendonpierson.github.io.git](https://github.com/BrendonPierson/brendonpierson.github.io.git) and fork the repository
3. Make a branch on your repository `git branch whatEverYouWantToNameTheNewFeatureOrChange`
4. To run the blog locally you will need to have all of the dependencies of [jekyll](http://jekyllrb.com/docs/installation/) installed, then from the project folder run `jekyll serve` and direct your browser to `http://localhost:4000/`
4. Make changes. Commit your changes and submit a pull request to [https://github.com/BrendonPierson/brendonpierson.github.io.git](https://github.com/BrendonPierson/brendonpierson.github.io.git)
5. I will review and merge in your changes.  Once they are merged, the website will be updated immediately.

If you aren't comfortable with git/GitHub you can still report any issues and I'll take a look.

1. Go to [https://github.com/BrendonPierson/brendonpierson.github.io/issues](https://github.com/BrendonPierson/brendonpierson.github.io/issues) (you will need to be logged in to GitHub)
2. Click create new issue then be as descriptive as possible when describing the problem.
3. I will try and fix the problem and you will be notified when the issue is closed.