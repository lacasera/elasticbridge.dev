# Filters

ElasticBridge includes helpers for common filters, including term, range, and geospatial filters. Use them within a bool context via `asBoolean()` unless you are composing a raw payload.

## Term
```php
HotelRoom::asBoolean()
    ->filterByTerm('code', 'usd')
    ->get();
```

## Range
Use operators such as `gte`, `gt`, `lte`, `lt`.

```php
HotelRoom::asBoolean()
    ->filterByRange('price', 100, 'gte')
    ->filterByRange('price', 500, 'lte')
    ->get();
```

Alternatively, chain multiple range operators using `range()`:

```php
HotelRoom::asBoolean()
    ->range('price', 'gte', 100)
    ->range('price', 'lte', 500)
    ->get();
```

## Geo Filters

### Geo Bounding Box
```php
HotelRoom::asBoolean()
    ->filterByGeoBoundingBox('hotel.location', ['lat' => 10, 'lon' => 10], ['lat' => 0, 'lon' => 0])
    ->get();
```

### Geo Distance
```php
HotelRoom::asBoolean()
    ->filterByGeoDistance('hotel.location', distance: 5, latitude: 40.71, longitude: -74.0, distanceType: 'arc')
    ->get();
```

### Geo Polygon
```php
HotelRoom::asBoolean()
    ->filterByGeoPolygon('hotel.location', points: [
        ['lat' => 40.73, 'lon' => -74.1],
        ['lat' => 40.01, 'lon' => -71.12],
        ['lat' => 41.12, 'lon' => -71.12],
    ])
    ->get();
```

### Geo Distance Range
```php
HotelRoom::asBoolean()
    ->filterByGeoDistanceRange('hotel.location', from: 1, to: 5, latitude: 40.71, longitude: -74.0, unit: 'km')
    ->get();
```

### Geo Shape Envelope
```php
HotelRoom::asBoolean()
    ->filterByGeoShape('hotel.location', coordinates: [
        [13.0, 53.0], // top-left
        [14.0, 52.0], // bottom-right
    ])
    ->get();
```

