---
title: "DISTINCT FROM to compare NULL-able values in Postgres"
date: 2022-12-19T06:45:24-05:00
draft: false
categories: ['Tech']
tags: ['Postgresql', 'TIL', 'Querying']
---
It turns out I've been comparing potentially null values in postgres the wrong way for years. Any comparisons will a null value result in null so `null <> 3` isn't `true` it's `null`. To avoid this I would do something like `coalesce(potentially_null_field, 0) <> 3` when I could have instead  done `potentially_null_field IS DISTINCT FROM 3`.

For example I want to find books written by authors from a different country and include results where country is listed on the author or book, but null on the other table. The query coalesces the potentially null `country` field on each table to an empty string so that if one is null `null <> 'USA'` will be `true`.

```sql
SELECT
  *
FROM
  books b
  JOIN authors a on a.id = book.author_id
WHERE coalesce(b.country, '') <> coalesce(a.country, '')
```

I should have written it

```sql
SELECT
  *
FROM
  books b
  JOIN authors a on a.id = book.author_id
WHERE b.country IS DISTINCT FROM a.country
```

[IS DISTINCT FROM](https://www.postgresql.org/docs/current/functions-comparison.html) Will treat `null <> 'USA'`  as `TRUE` and `null <> null` as `FALSE`. Not only is the syntax clearer, there are potential performance gains as `coalesce` can cause index misses in some situations.
