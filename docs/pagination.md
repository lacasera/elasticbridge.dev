# Pagination

## Basic Usage

There are two pagination strategies:

- Offset-based pagination via `simplePaginate(size: int, from: int = 0)`
- Cursor-based pagination via `cursorPaginate(size: int, sort: array = [])` (Elasticsearch search_after)

```php
<?php

// initial request using offset pagination
$query = HotelRoom::query()
    ->asBoolean()
    ->matchAll()
    ->orderBy('price', 'ASC')
    ->simplePaginate(size: 20);

$rooms = $query->get();

// next page (e.g. in a controller)
$nextFrom = 20;
$nextPage = $query->simplePaginate(size: 20, from: $nextFrom)->get();

```

> [!WARNING]
> Avoid using the `paginate(from and size)` method to page too deeply or request too many results at once. Search requests usually span multiple shards. Each shard must load its requested hits and the hits for any previous pages into memory. For deep pages or large sets of results, these operations can significantly increase memory and CPU usage. If not properly managed, these operations can result in degraded performance or node failures. read more [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html#from-and-size-pagination)

## Cursor Pagination

Cursor pagination is ideal for "Load more" UIs. It requires a deterministic sort.

```php
<?php

// initial query to get first 15 rooms
$query = HotelRoom::query()
    ->asBoolean()
    ->mustMatch('advertiser', 'booking.com')
    ->orderBy('price', 'ASC')
    ->cursorPaginate(15);

$rooms = $query->get();

// get next/previous pages using sort values
$nextPage = $query->cursorPaginate(15, $rooms->links()['next'])->get();
$previousPage = $query->cursorPaginate(15, $rooms->links()['previous'])->get();

dump($nextPage, $previousPage);
```

## Pagination Links

For cursor pagination, `links()` returns an array with the previous and next `search_after` sort values and the `total` hit count:

```php
<?php

namespace App\Controllers;

class RoomController extends Controller
{

    public function index(Request $request) 
    {
        $query = HotelRoom::query()
            ->asBoolean()
            ->matchAll()
            ->orderBy('price', 'ASC')
            ->cursorPaginate(15);

        $rooms = $query->get();

        return response()->json([
            'data' => $rooms,
            'links' => $rooms->links(), // ['previous' => [...], 'next' => [...], 'total' => 123]
        ]);
    }
}

```

```json
{
  "data": [/* ... */],
  "links": {
    "previous": [594],
    "next": [695],
    "total": 86
  }
}
```

