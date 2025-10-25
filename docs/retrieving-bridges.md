# Retrieving Data

<a name="introduction"></a>
After creating a bridge and its associated elastic search index, you are ready to start retrieving data from your elasticsearch.
You can think of each bridge as a powerful [query builder](builder.md) allowing you to fluently query the elasticsearch index associated with the bridge.

<a name="all-method"></a>

## The `all` Method

The `all` method retrieves all documents from the bridge's index using cursor pagination. This method is ideal for iterating through large datasets efficiently without loading all records into memory at once.

### How It Works

Internally, the `all` method:
1. Executes a `match_all` query to retrieve all documents
2. Uses boolean query mode (`asBoolean()`)
3. Implements cursor pagination for efficient memory usage
4. Returns a paginated collection that can be iterated

### Signature

```php
public static function all(int $perPage = 15)
```

### Parameters

- **`$perPage`** (int, optional): The number of records to retrieve per page. Default is `15`.

### Usage Examples

**Basic Usage:**

```php
<?php
declare(strict_types=1);

namespace App\Bridges;

use Lacasera\ElasticBridge\ElasticBridge;

class HotelRoom extends ElasticBridge
{
    protected $index = 'hotel-room';
}

// Retrieve all hotel rooms with default pagination (15 per page)
foreach (HotelRoom::all() as $hotelRoom) {
    echo $hotelRoom->price;
}
```

**Custom Page Size:**

```php
// Retrieve all hotel rooms with 50 records per page
foreach (HotelRoom::all(50) as $hotelRoom) {
    echo $hotelRoom->name . ': $' . $hotelRoom->price;
}
```

**Working with the Collection:**

```php
$rooms = HotelRoom::all(25);

// Access pagination information
echo 'Total: ' . $rooms->total();
echo 'Per Page: ' . $rooms->perPage();
echo 'Current Page: ' . $rooms->currentPage();

// Iterate through the results
$rooms->each(function ($room) {
    echo $room->name;
});
```

### Performance Considerations

- The `all` method uses cursor pagination, which is memory-efficient for large datasets
- Adjust the `$perPage` parameter based on your needs:
  - **Smaller values** (10-25): Better for memory-constrained environments
  - **Larger values** (50-100): Fewer network requests, but higher memory usage
- For very large datasets, consider using [pagination](pagination.md) with specific filters

### When to Use

Use the `all` method when you:
- Need to retrieve all documents from an index
- Want to iterate through results without complex filtering
- Require automatic pagination handling
- Don't need to apply additional query constraints

For filtered queries, use the [query builder](builder.md) instead:

```php
// For filtered queries, use the query builder
$filteredRooms = HotelRoom::asBoolean()
    ->mustMatch('advertiser', 'booking.com')
    ->where('price', '>', 100)
    ->get();
```

<a name="queries"></a>

## Building Queries

Each bridge serves as a [query builder](builder.md) that allows you to add additional constraints to queries and then invoke the `get` method to retrieve the results.

```php
use App\Bridges\HotelRoom;

$rooms = HotelRoom::asBoolean()
    ->mustMatch('advertiser', 'booking.com')
    ->orderBy('price', 'ASC')
    ->take(10)
    ->get(['price', 'advertiser']); // select fields

// Inspect the generated body (array or JSON)
$asArray = HotelRoom::asRaw()->matchAll()->toQuery();
$asJson = HotelRoom::asRaw()->matchAll()->toQuery(asJson: true);
```

<a name="aggregates"></a>

## Retrieving Single Bridges

<a name="find-method"></a>

### The `find` Method

The `find` method allows you to retrieve one or more documents by their Elasticsearch `_id` values. This is useful when you know the exact document ID(s) you want to retrieve.

### How It Works

Internally, the `find` method:
1. Uses the `ids` query type in Elasticsearch
2. Returns a single bridge instance if you pass a single ID
3. Returns a collection of bridge instances if you pass an array of IDs
4. Returns `null` (or empty collection) if no matching documents are found

### Signature

```php
public function find(string|int|array $ids): ElasticBridge|Collection|null
```

### Parameters

- **`$ids`** (string|int|array): A single document ID or an array of document IDs to retrieve.

### Usage Examples

**Retrieving a Single Document:**

```php
use App\Bridges\HotelRoom;

// Find by ID - returns a single HotelRoom instance or null
$room = HotelRoom::find(1);

if ($room) {
    echo $room->name;
    echo $room->price;
}
```

**Retrieving Multiple Documents:**

```php
use App\Bridges\HotelRoom;

// Find multiple rooms by IDs - returns a Collection
$rooms = HotelRoom::find([1, 2, 3, 42]);

// Iterate through the collection
foreach ($rooms as $room) {
    echo $room->name . ': $' . $room->price . PHP_EOL;
}

// Access collection methods
echo 'Found ' . $rooms->count() . ' rooms';
```

**Working with String IDs:**

```php
use App\Bridges\Log;

// Elasticsearch often uses UUID or hash-based IDs
$log = Log::find('9cac02e7-d063-456f-90ad-0b145bb04fde');

if ($log) {
    echo $log->message;
}
```

**Chaining with Collection Methods:**

```php
use App\Bridges\HotelRoom;

// Find multiple rooms and apply collection methods
$expensiveRooms = HotelRoom::find([1, 2, 3, 4, 5])
    ->filter(fn($room) => $room->price > 200)
    ->sortBy('price')
    ->values();

echo 'Expensive rooms: ' . $expensiveRooms->count();
```

### When to Use

Use the `find` method when you:
- Know the exact document ID(s) you need to retrieve
- Want to fetch specific documents without complex queries
- Need to retrieve documents by their Elasticsearch `_id` field
- Want the most efficient way to get documents by ID

For complex queries or filtering, use the [query builder](builder.md):

```php
// For filtered queries, use the query builder instead
$rooms = HotelRoom::asBoolean()
    ->mustMatch('advertiser', 'booking.com')
    ->where('price', '>', 100)
    ->get();
```

### Performance Considerations

- The `find` method uses Elasticsearch's `ids` query, which is very efficient
- Retrieving documents by ID is one of the fastest operations in Elasticsearch
- When finding multiple IDs, all documents are retrieved in a single request
- Consider using `find` with specific fields if you don't need all document data:

```php
// Retrieve only specific fields (more efficient)
$rooms = HotelRoom::asIds()
    ->withValues([1, 2, 3])
    ->get(['name', 'price']);
```

## Retrieving Aggregates

When interacting with bridges you may use `count`, `sum`, `max`, `min`, `avg` aggregate methods. These return scalar values. `stats` returns a Stats object and `histogram` returns a collection of Bucket objects.

```php
use App\Bridges\HotelRoom;

// count all documents in the given index
echo HotelRoom::count();

// find the minimum price in the documents for the given index
echo HotelRoom::min('price');

// find the maximum price in the documents for the given index
echo HotelRoom::max('price');

// find the avg price in the documents for the given index
echo HotelRoom::avg('price');

// sum the prices in the documents for the given index
echo HotelRoom::sum('price');


// find the sum of the price for the given query
echo HotelRoom::asBoolean()
    ->mustMatch('advertiser', 'booking.com')
    ->sum('price');
```

---

> [!IMPORTANT] 
> 
> Aggregates can also be attached to a query using `withAggregate`, letting you retrieve both documents and aggregate results. Access the aggregate via a camel-cased method on the returned collection: `<field><Aggregate>` e.g. `priceAvg()`.

---

```php
use App\Bridges\HotelRoom;

// collection of bridges.
$rooms = HotelRoom::asBoolean()
     ->mustMatch('advertiser', 'booking.com')
     ->withAggregate('min', 'price')
     ->get();

foreach ($rooms as $room) {
    echo $room->price;
}

// access the aggregate value with the method below
echo $room->priceMin();

$rooms = HotelRoom::asBoolean()
     ->mustMatch('advertiser', 'booking.com')
     ->withAggregate('avg', 'price')
     ->get();

echo $rooms->priceAvg();

$rooms = HotelRoom::asBoolean()
    ->shouldMatch('advertiser', 'booking.com')
    ->withAggregate('range', 'price', [
        'ranges' => [
            'from' => 50,
            'to' => 500,
        ],
    ])
    ->get();

dump($rooms->priceRange());

```

## Other Aggregates

We can access other forms of aggregations such as `stats` and other bucket aggregations.

<a name="stats"></a>

## Stats

You can call the `stats` method on the query builder to return the [stats aggregate](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-stats-aggregation.html).
This method returns an instance of the `Lacasera\ElasticBridge\DTO\Stats` class

```php
$stats = HotelRoom::asBoolean()
     ->mustMatch('advertiser', 'booking.com')
     ->stats();

// get total count
echo $stats->count();

//get the average value
echo $stats->avg();

//get the max value
echo $stats->max();

//get the min value
echo $stats->min();

// get the sum value
echo $stats->sum();

// returns all values as an array
$stats->toArray();

// returns all the values a collection
$stats->toCollection();
```

## Histogram and Ranges

<a name="histogram-and-ranges"></a>

```php
// ranges aggregate query
$rooms = HotelRoom::asBoolean()
    ->shouldMatch('advertiser', 'booking.com')
    ->withAggregate('range', 'price', [
        'ranges' => [
            'from' => 50,
            'to' => 500,
        ],
    ])
    ->get();

dump($rooms->priceRange());


// histogram aggregate query
$rooms = HotelRoom::asBoolean()
    ->shouldMatch('advertiser', 'booking.com')
    ->withAggregate('histogram', 'price', [
        'interval' => 300,
    ])
    ->get();


dump($rooms->priceHistogram());
```

## Ordering, Limit and Offset

<a name="ordering-sorting-limit-and-offset"></a>

<a name="ordering"></a>

##  Ordering

The orderBy method allows you to sort the results of the query by a given column. The first argument accepted by the orderBy method should be the column you wish to sort by, while the second argument determines the direction of the sort and may be either `asc` or `desc`:

```php
use App\Bridges\HotelRoom;

$rooms = HotelRoom::asBoolean()
    ->mustMatch('advertiser', 'booking.com')
    ->orderBy('price', 'desc')
    ->get();
```

To sort by multiple columns, you may simply invoke orderBy as many times as necessary:

```php
use App\Bridges\HotelRoom;

$rooms = HotelRoom::asBoolean()
    ->mustMatch('advertiser', 'booking.com')
    ->orderBy('price', 'desc')
    ->orderBy('created', 'asc')
    ->get();
```

<a name="limit-and-offset"></a>

##  Limit and Offset

##  The `skip` and `take` Methods

You may use the `skip` and `take` methods to limit the number of results returned from the query or to `skip` a given number of results in the query:

```php
use App\Bridges\HotelRoom;

$rooms = HotelRoom::asBoolean()
    ->mustMatch('advertiser', 'booking.com')
    ->skip(10)
    ->take(5)
    ->get();
```

Alternatively, you may use the `limit` and `offset` methods. These methods are functionally equivalent to the `take` and `skip` methods, respectively:

```php
use App\Bridges\HotelRoom;

$rooms = HotelRoom::asBoolean()
    ->mustMatch('advertiser', 'booking.com')
    ->offset(5)
    ->limit(10)
    ->get();
```
