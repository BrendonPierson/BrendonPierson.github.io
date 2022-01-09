---
title: "TIL Elixir - Inspect.Opts, deep cuts"
date: 2022-01-02T13:02:35-05:00
draft: false
categories: ['Tech']
tags: ['Elixir', 'TIL', 'Debugging']
---
Since the day I started picking up elixir I've been using `IO.inspect/2`'s to debug and check code outputs. Because it will return whatever its passed, you can paste `|> IO.inspect()`'s pretty much anywhere without changing the program. Even though I've been using this for years I recently learned about some new options to fine tune the inspect behavior.

See all the options here: [https://hexdocs.pm/elixir/Inspect.Opts.html](https://hexdocs.pm/elixir/Inspect.Opts.html)

### Options I have pretty much always used

`:label`

This helps differentiate multiple `IO.inspect`'s. It's pretty common to look over my shoulder and see `|> IO.inspect(label: :here_1)`, `|> IO.inspect(label: :here_2)`, `|> IO.inspect(label: :here_3)` scattered about.

`:limit`

I almost always set this to show everything, `limit: :infintiy`. Specifically it set's the limits to the number of items that are shown in a collection.


### New Options inspiring this post

`:syntax_colors`

The `:syntax_colors` option allows you to change the display color of each data type. I used this to add some extra visibility when I'm connecting to a production environment locally: `IO.inspect("PRODUCTION ENVIRONMENT", syntax_colors: [string: :red])`

`:printable_limit`

This week I had a large generated query that I wanted to print out so that I could paste it in datagrip and debug the results. It was a big query so I went with `IO.inspect(big_query, limit: :infinity, label: :big_query)`. No matter how many times I recompiled though the query was truncated. That's when google led me to the `Inspect.Opts` and `printable_limit`. `IO.inspect(big_query, pritable_limit: :infinity)` was the ticket. By default the output of large strings is truncated to 4096 characters. TIL

