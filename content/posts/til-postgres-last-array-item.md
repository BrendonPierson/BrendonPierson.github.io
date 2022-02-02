---
title: "TIL Selecting the last item in a postgres array"
date: 2022-01-10T19:39:41-05:00
draft: false
categories: ['Tech']
tags: ['Postgresql', 'TIL', 'Querying']
---

To get the last item from a postgres array

```sql
SELECT
  errors[array_upper(errors, 1)]
FROM oban.oban_jobs
```

Oban is a great elixir job processing library. It tracks job attempts and errors with a full stack trace in a postgres `errors` array column. This is great to have but hard to reason about looking at the giant blob. The above snippet let's you limit it to just the most recent error which is really all you care about.

The postgresql `array_upper` function "...Returns the upper bound of the requested array dimension". The  first argument is the array and the second is the dimension of the array (starting from 1).

```
array_upper ( anyarray, integer ) → integer
Returns the upper bound of the requested array dimension.
array_upper(ARRAY[1,8,3,7], 1) → 4'
```

[https://www.postgresql.org/docs/14/functions-array.html](https://www.postgresql.org/docs/14/functions-array.html)
