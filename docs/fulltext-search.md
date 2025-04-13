# Full Text Search

Elastic bridge offers a variety of methods that allows to run fulltext search queries against elastic search. 

> [!IMPORTANT]
> All these methods takes 2 required argument `field`, `query` and an optional `options` parameter as an array. 
> The content of the `options` array depends in the match method.


## Match 
Returns documents that match a provided text, number, date or boolean value. possible values for the [options](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html#match-field-params) paramter.


```php
<?php

return HotelRoom::query()
    ->match(field: 'advertiser', query: 'hotel', [
        'fuzziness' => 'auto',
        'operator' => 'AND'
    ])
    ->get();

```
## Match Phrase

This query searches for documents that contain the exact sequence of words in the specified field. Possible values for `options` [parameter](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html#match-phrase-field-params)
```php
<?php

return HotelRoom::query()
    ->matchPhrase(field: 'advertiser', query: 'hotel', [
        'fuzziness' => 'auto',
        'operator' => 'AND'
    ])
    ->get();

```

## Match Phrase Prefix
The `match_phrase_prefix` query is similar to match_phrase, but it allows the last word in the phrase to be a prefix. This is useful for autocomplete or search-as-you-type scenarios. possible values for the [options](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase-prefix.html#match-phrase-prefix-top-level-params) paramter

```php
<?php

return HotelRoom::query()
    ->matchPhrasePrefix(field: 'advertiser', query: 'hotel')
    ->get();

```
## Match Bool Prefix
The `match_bool_prefix` query is a special type of match query designed for `search-as-you-type` functionality.
It combines the behavior of a bool query with multiple match_phrase_prefix clauses behind the scenes, allowing term-by-term autocomplete across multiple tokens. 
possible values for the [options](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-bool-prefix-query.html#_parameters) parameter

```php
<?php

return HotelRoom::query()
    ->match(field: 'advertiser', query: 'hotel', [
        'fuzziness' => 'auto',
        'operator' => 'AND'
    ])
    ->get();

```

## Multi Match
The `multi_match` query builds on the [match](#match) query to allow `multi-field` queries.

> [!TIP]
> The`field`  parameter can either be an array of fields or a string of field. 

```php
<?php

return HotelRoom::query()
    ->multiMatch(field: ['advertiser', 'service_type'], query: 'hotel', [
        'fuzziness' => 'auto',
        'operator' => 'AND'
    ])
    ->get();
```
