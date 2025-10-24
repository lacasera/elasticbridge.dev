# Syntax Basics

ElasticBridge mirrors Eloquent-like chaining while building Elasticsearch queries.

Core ideas
- Choose a term context first via `as...()` (e.g. `asBoolean()`, `asMatch()`, `asRaw()`).
- Chain helpers to add clauses, filters, sort, and pagination.
- Call `get()` to execute or `toQuery()` to inspect the request body.

Examples
```php
// Bool with filters and sorting
HotelRoom::asBoolean()
    ->matchAll()
    ->filterByTerm('currency', 'usd')
    ->orderBy('price', 'ASC')
    ->cursorPaginate(15)
    ->get(['price', 'currency']);

// Raw body when you need full control
HotelRoom::asRaw()
    ->raw(['bool' => ['must' => ['match' => ['code' => 'xoxo']]]])
    ->get();
```
