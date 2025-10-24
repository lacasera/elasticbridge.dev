# Query Builder Reference

Below are commonly used methods available on the bridge builder. Chain them fluently from your bridge class.

Term selection
- `asBoolean()` — sets a bool query context
- `asRaw()` — allows passing a raw body via `raw([...])`
- `asMatch()`, `asFuzzy()`, `asIds()`, `asPrefix()`, `asRange()`, `asRegex()`, `asTerm()`, `asTerms()`, `asTermSet()`, `asWildCard()`

Full-text helpers
- `match(field, query, options = [])`
- `orMatch(field, query)`
- `matchPhrase(field, query, options = [])`
- `multiMatch(fields, query)`

Bool helpers
- `shouldMatchAll(boost = 1.0)`
- `matchAll(boost = 1.0)`
- `mustMatch(field, value)`
- `must(query, field, value)`
- `mustNot(query, field, payload)`
- `mustExist(field)` / `shouldExist(field)`

Pagination and sorting
- `orderBy(field, direction = 'ASC')`
- `take(size)` / `limit(size)`
- `skip(from)` / `offset(from)`
- `simplePaginate(size = 15, from = 0)`
- `cursorPaginate(size = 15, sort = [])`

Execution
- `get(columns = ['*'])`
- `count()`
- `toQuery(asJson = false)` — returns the built body as array or JSON

Aggregations
- `avg(field)`, `min(field)`, `max(field)`, `sum(field)`
- `stats(field)` returns a Stats object
- `histogram(field, interval)` returns buckets
- `withAggregate(type, field, options = [])` to attach to a query

Filters
- `filterByTerm(field, value)`
- `filterByRange(field, value, operator)` or chain `range(field, operator, value)`
- Geo: `filterByGeoShape`, `filterByGeoDistance`, `filterByGeoPolygon`, `filterByGeoDistanceRange`, `filterByGeoBoundingBox`

Indexing and updates
- `create(attributes)` — returns created `_id` (string)
- `save()` — updates existing or creates if missing (boolean)
- `increment(field, counter = 1)` / `decrement(field, counter = 1)`

Utilities
- `find(id|array)` — returns a single bridge or a collection
- `withValues(values, field = null, options = [])` — for queries that accept `values`
