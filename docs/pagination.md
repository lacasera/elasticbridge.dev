# Pagination

## Basic Usage

There are several ways to paginate documents from elasticsearch using elasticbridge. The simplest is by using the `paginate` method.  The `from` parameter defines the number of hits to skip, defaulting to 0. The `size` parameter is the maximum number of hits to return. Together, these two parameters define a page of results.

```php
<?php

// inital request
$rooms = HotelRoom::query()
    ->asBoolean()
    ->matchAll()
    ->paginate(size: 20)
    ->get();

// number of hits to skip for results of the next page
$from = $rooms->nextPage(); 
$nexPage = $query->paginate(size: 20, from: $from)->get();

```

> [!WARNING]
> Avoid using the `paginate(from and size)` method to page too deeply or request too many results at once. Search requests usually span multiple shards. Each shard must load its requested hits and the hits for any previous pages into memory. For deep pages or large sets of results, these operations can significantly increase memory and CPU usage. If not properly managed, these operations can result in degraded performance or node failures. read more [here](https://www.elastic.co/guide/en/elasticsearch/reference/current/paginate-search-results.html#from-and-size-pagination)

## Cursor Pagination

The cursor pagination is ideal for scenarios where users click a "next" or "load more" button, rather than selecting a specific page. This pagination is also know as the `search_after` pagination.

Using `cursor` or `search_after` pagaination requires multiple search requests with the same query and sort values. The first step is to run an initial request.

```php
<?php

// make initial query to get first 15 rooms
$query = HotelRoom::query()
    ->asBoolean()
    ->mustMatch('advertiser', 'booking.com')
    ->orderBy("price")
    ->cursor(15);

$rooms = $query->get();

// get next page of rooms matching the same query
$nextPage = $query->cursor(size: 15, after: $rooms->nextSort())
    ->get();

$previousPage = $query->cursor(size: 15, after: $rooms->previousSort())
    ->get();

dump($nextPage, $previousPage);
```

## Pagination Links

The links() method returns a structured pagination object containing an array of all available pages with their corresponding from values, making it easy to build custom pagination controls. Each entry in the `pages` array includes the `page number` and its associated `from offset`. The response also includes metadata such as the `current_page`, `total_pages`, and boolean flags `has_more` and `has_previous` to indicate if there are next or previous pages available. This helps in managing UI navigation and ensuring accurate paging through results.

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
            ->orderBy("price", "ASC")
            ->paginate(15);

        if ($request->has('from')) {
            $query->paginate(15, $request->get('from'))
        }

        $rooms = $query->get();

        return response()->json([
            'data' => $rooms,
            'links' => $rooms->links(),
        ]);
    }
}

```

```json
{
    "data": [...],
    "links": {
        "pages": [
            {
                "page": 0,
                "from": 0
            },
            {
                "page": 1,
                "from": 50
            },
            {
                "page": 2,
                "from": 100
            },
            {
                "page": 3,
                "from": 150
            },
            {
                "page": 4,
                "from": 200
            }
        ],
        "current_page": 1,
        "has_more": true,
        "has_previous": false,
        "total_pages": 5
    }
}
```

## Simple Paginator Instance Methods
Each paginator instance provides additional pagination information via the following methods:

| Method  |  Description |
|---|---|
| `nextPage`  |   Returns the `from` value for the next page of results. |
| `previousPage` |  Returns the `from` value for the previous page of results. |
| `hasMorePages`  |  Determines whether there are more results beyond the current page. |
| `hasPreviousPage`  |  Determines whether there is a previous page of results. |
| `links`  | Returns an array of all pages with their corresponding `from` values for building pagination links.  |
| `currentPage`  |  Returns the current page number based on the `from` and `size` values. |
| `total` | Returns the total number of documents that match the current query criteria.   |
| `items`  |   |




## Cursor Paginator Instance Methods
| Method        |      Description      | 
| ------------- | :-----------: |
| `nextSort`    | Returns the `search_after` value needed to retrieve the next set of documents that match the current query.|
| `previousSort`    | Returns the `search_after` value needed to retrieve the previous set of documents that match the current query. |
| `links` | Extract the next, previous, and total parameters from the query builder to manage pagination state effectively.|
| `total` | Returns the total number of documents that match the current query criteria.   |
| `items` |   |


