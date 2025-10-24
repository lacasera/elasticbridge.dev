# Updates and Inserts

## Inserts
When using elastic bridge, not only can we retrieve documents from our elastic index, we can also 
index new documents. Elastic bridge makes this super easy. 
To index a new document, just create an instance of the bridge class, 
set your attributes and call the save method on the bridge index. 

```php

<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Bridges\Log;
use Illuminate\Http\Request;


class LogController extends Controller 
{
    /**
     * Index a new log.
     */
    public function store(Request $request)
    {
        $log = new Log();
        
        $log->status = $request->status_code;
        $log->message = $request->message;
        
        $log->save();
        
        return response()->json([
            'message' => "log indexed successfully"
        ], 201);
    }
}
```
> [!TIP]
> Alternatively you can use the `create` method to index a new document. `save()` returns a boolean, while `create()` returns the created document `_id`.



```php
<?php

use App\Bridges\Log;

$id = Log::create([
    'status' => 500,
    'message' => 'this is a log message'
]);
dump($id); // e.g. "9cac02e7-d063-456f-90ad-0b145bb04fde"
```

> [!IMPORTANT]
> Just as like elastic search, whenever you set the `id` on a `new bridge` instance, it will be set as the `_id` of the document.

## Updates

The `save` method may be used to update documents that already exist in elasticsearch. 
To Update a document, you should first retrieve it and set the attributes you wish to update and then call the `save`
method. 

```php
use App\Bridges\HotelRoom;

$room = HotelRoom::find(1);

$room->price = 50;

$room->save();

```

In addition, you can use the `increment` or `decrement` methods to increase or decrease numeric fields via an update script. Both accept an optional `counter` (default `1`). Note that these methods update Elasticsearch, not the in-memory object; refresh or re-fetch the document to see updated values.

```php

use App\Bridges\HotelRoom;

$room = HotelRoom::find(1);

// increase price by 3
$room->increment('price', 3);

// then re-fetch to reflect changes locally
$room = HotelRoom::find(1);
echo $room->price;
```
