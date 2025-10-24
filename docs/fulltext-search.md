# Full Text Search

ElasticBridge provides fluent methods for building full-text and related queries.

Notes
- All methods accept `field`, `query`, and optional `options` depending on the query type.
- Use `asBoolean()` when combining queries with bool context (must/should/must_not).

## Match
Returns documents that match a provided text, number, date or boolean value. See valid [options](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html#match-field-params).

```php
return HotelRoom::query()
    ->asRaw()
    ->match(field: 'advertiser', query: 'hotel', options: [
        'fuzziness' => 'auto',
        'operator' => 'AND',
    ])
    ->get();
```

### Or Match
Convenience for a `match` with `operator = or`.

```php
return HotelRoom::asRaw()
    ->orMatch('advertiser', 'hotel')
    ->get();
```

## Match Phrase
Searches for the exact sequence of words in a field. See valid [options](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query-phrase.html#match-phrase-field-params).

```php
return HotelRoom::asRaw()
    ->matchPhrase('title', 'new york hotel', [
        'slop' => 1,
    ])
    ->get();
```

## Multi Match
Builds on match to allow multi-field queries. The `field` parameter can be a string or an array of fields.

```php
return HotelRoom::asRaw()
    ->multiMatch(field: ['advertiser', 'service_type'], query: 'hotel')
    ->get();
```

## Bool helpers

```php
// must match within bool context
HotelRoom::asBoolean()
    ->mustMatch('advertiser', 'booking.com')
    ->get();

// match all within should or must contexts
HotelRoom::asRaw()->shouldMatchAll();
HotelRoom::asRaw()->matchAll();
```

Unavailable in this version
- `match_phrase_prefix` and `match_bool_prefix` are not implemented at this time.
