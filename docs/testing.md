# Testing

Use the provided fake connection to test without a live Elasticsearch cluster.

## Faking the Connection

Any bridge can call `::fake($response, $status = 200)` to bind a mock connection that returns your payload.

```php
use App\Bridges\HotelRoom;

HotelRoom::fake([
    'hits' => [
        'total' => ['value' => 0, 'relation' => 'eq'],
        'hits' => [],
    ],
]);

$query = HotelRoom::asBoolean()->matchAll()->toQuery();
```

## Example PHPUnit Test

```php
public function test_builds_term_filter(): void
{
    HotelRoom::fake([
        'hits' => [
            'total' => ['value' => 0, 'relation' => 'eq'],
            'hits' => [],
        ],
    ]);

    $query = HotelRoom::asBoolean()
        ->filterByTerm('code', 'usd')
        ->toQuery();

    $this->assertSame([
        'query' => [
            'bool' => [
                'filter' => [
                    ['term' => ['code' => 'usd']],
                ],
            ],
        ],
    ], $query);
}
```
