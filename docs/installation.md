# Installation

You can install the package via composer:

```bash
composer require lacasera/elastic-bridge
```

You can publish the config file with:

```bash
php artisan vendor:publish --tag="elastic-bridge-config"
```

This is the published config file (config/elasticbridge.php):

```php
<?php

/**
 * for more information visit
 * https://www.elastic.co/guide/en/elasticsearch/reference/current/run-elasticsearch-locally.html
 */
return [

    // Authentication method for Elasticsearch client
    // Supported: 'basic-auth', 'api-key'
    'auth_method' => env('ELASTICSEARCH_AUTH_METHOD', 'basic-auth'),

    // Elasticsearch hosts
    // Provide a single host via ELASTICSEARCH_HOST, or override this array in config
    'host' => [env('ELASTICSEARCH_HOST', 'https://localhost:9200')],

    // Basic auth
    'username' => env('ELASTICSEARCH_USERNAME', 'elastic'),
    'password' => env('ELASTICSEARCH_PASSWORD', null),

    // API key auth (used when auth_method = 'api-key')
    'api_key' => env('ELASTICSEARCH_API_KEY', null),

    // SSL verification
    // If true, you must provide ELASTICSEARCH_SSL_CERT
    'verify_ssl' => env('ELASTICSEARCH_VERIFY_SSL', false),
    'certificate' => env('ELASTICSEARCH_SSL_CERT', null),

    // Where bridge files should be generated
    'namespace' => 'App\\Bridges',
];
```

Environment variables you’ll typically set:

- `ELASTICSEARCH_HOST` (e.g. https://localhost:9200)
- `ELASTICSEARCH_AUTH_METHOD` = `basic-auth` or `api-key`
- For basic auth: `ELASTICSEARCH_USERNAME` and `ELASTICSEARCH_PASSWORD`
- For API key auth: `ELASTICSEARCH_API_KEY`
- Optional SSL: `ELASTICSEARCH_VERIFY_SSL=true` and `ELASTICSEARCH_SSL_CERT=/path/to/http_ca.crt`
