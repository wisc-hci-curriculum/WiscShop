# WiscShop API

The following API can be accessed at `https://mysqlcs639.cs.wisc.edu`

| Endpoint                                       | Auth Required | Token Required | Get | Post | Put | Delete |
|------------------------------------------------|---------------|----------------|-----|------|-----|--------|
| /login                                         | ✔︎             |                | ✔︎   |      |     |        |
| /users                                         |               |                |     | ✔︎    |     |        |
| /users/`<username>`                            |               | ✔︎              | ✔︎   | ✔︎    | ✔︎   | ✔︎      |
| /tags                                          |               |                | ✔︎   |      |     |        |
| /categories                                    |               |                | ✔︎   |      |     |        |
| /categories/<category_title>/tags              |               |                | ✔︎   |      |     |        |
| /products                                      |               |                | ✔︎   |      |     |        |
| /products/`<product_id>`                       |               |                | ✔︎   |      |     |        |
| /products/`<product_id>`/tags                  |               |                | ✔︎   |      |     |        |
| /products/`<product_id>`/reviews               |               |                | ✔︎   |      |     |        |
| /products/`<product_id>`/reviews/`<review_id>` |               |                | ✔︎   |      |     |        |
| /application                                   |               | ✔︎              | ✔︎   |      | ✔︎   |        |
| /application/tags                              |               | ✔︎              | ✔︎   |      |     | ✔︎      |
| /application/tags/`<tag_value>`                |               | ✔︎              |     | ✔︎    |     | ✔︎      |
| /application/messages                          |               | ✔︎              | ✔︎   | ✔︎    |     | ✔︎      |
| /application/messages/`<message_id>`           |               | ✔︎              | ✔︎   |      | ✔︎   | ✔︎      |
| /application/products                          |               | ✔︎              | ✔︎   |      |     | ✔︎      |
| /application/products/`<product_id>`           |               | ✔︎              |     | ✔︎    |     | ✔︎      |

### Auth and Tokens

For this API, users need to provide credentials in order to access information specific to themselves. They get these credentials by requesting tokens, which are short-lived codes which tell the server that you are who you are saying you are, without having to provide username and password each time. The steps to get these tokens are outlined below.

#### Signup

So you want the user to sign up. This can be done with a `POST` request to the `/users` endpoint. You will need to tell the API a bit about the user. You should provide this data in the message body (stringified) in the following form:

```
{username:<str>,                 // Required
 password:<str>,                 // Required
 firstName:<str>,                // Optional
 lastName:<str>,                 // Optional
 goalDailyCalories:<float>,      // Optional
 goalDailyProtein:<float>,       // Optional
 goalDailyCarbohydrates:<float>, // Optional
 goalDailyFat:<float>,           // Optional
 goalDailyActivity:<float>       // Optional
}
```

Only the `username` and `password` fields are required. Don't worry about the other ones for creating a user, as they can be updated later with `PUT` requests.

If the user is successfully created, you will recieve a positive message back from the server. You will then need to login with that user.

#### Login

Alright, now you have a user and their password, but you need to log them in. You can do this via the `/login` endpoint, with a `GET` request. Effectively, you will be sending the username and password in the authorization header (Basic Auth) of the `GET`, and will recieve back a token that you can use to access information from the API. This call takes in no message body. The token you receive can then be added in the header under the `x-access-token` field.

### USER

Users cannot query `/users`, since that would involve exposing all the other users' data. Instead, they must get/modify the information for their user separately. They do this by using the `/users/<username>` endpoint, where `<username>` is filled in with their actual username. Suppose your username is `Fred639`, then you could fetch (`GET`) `/users/Fred639` to get the information about yourself, but only if you provide the right token. Likewise, you can `PUT` to `/users/Fred639` to modify your goals, by providing the changes in the form of a `json`. You can modify the following fields:

- `password`
- `firstName`
- `lastName`
- `goalDailyCalories`      // Not needed
- `goalDailyProtein`       // Not needed
- `goalDailyCarbohydrates` // Not needed
- `goalDailyFat`           // Not needed
- `goalDailyActivity`      // Not needed

Additionally, you can delete unused users using the `DELETE` method on the `/users/<user_id>` endpoint. As articulated in the Final Notes, please be a good citizen and clean up after yourself.

### Application

Each user has an associated application state. This is accessed at `/application` with a token. This endpoint can provide with a `GET` request an object with the following fields:

- `back`              // Boolean: Whether the page should go back
- `dialogflowUpdated` // Boolean: Whether the last update was from dialogflow (only used by GUI)
- `page`              // String: The URI of that the page should go to (minus the host)

An example would be the following:

```
{
    "back": false,
    "dialogflowUpdated": false,
    "page": "/myUser/bottoms/products/14"
}
```

#### Application Tags

Each application has an additional set of tags associated with it, accessible at the `/application/tags` endpoint. This is simply a set of strings, e.g.

```
{  "tags":
  [
    "fluffy",
    "badger"
  ]
}
```

Tags can be added/deleted from the set of application tags by `POST` and `DELETE` calls to `/application/tags/<tag_value>`. Only valid tags on the server are able to be added. A full set of valid tags is available via `GET` at `/tags`.

As an added feature, if you `DELETE` at the `/application/tags` endpoint, this will clear the current tags.

#### Application Cart

Each application also has a cart, accessible at `/application/products/`. Performing a `GET` will return a list of products, e.g.

```
{  "products":
  [
    ...
  ]
}
```

Each product in the cart has the following data:

- `id`
- `name`        // String: Name of product
- `category`    // String: Category of product
- `count`       // Integer: Number of that product in cart
- `description` // String: Description of product
- `image`       // String: URL to image.
- `price`       // Float: Price of each item.

An example would be as follows:

```
{
    "id": 12,
    "name": "Jump Around Shirt",
    "category": "tees",
    "count": 4,
    "description": "You will be ready for football season with this Jump Around t-shirt! The red tee features 'Jump Around' with a printed Wisconsin motion W and an Under Armour logo across the front. The soft shirt feels great and wicks away sweat on hot days.",
    "image": "https://www.uwbookstore.com/storeimages/177-1522038-1_hi.jpg",
    "price": 30.0
}
```
You can add and delete items from the cart (`/application/products`) with `POST` and `DELETE` requests to `/application/products/<product_id>`. Repeated `POST` requests will increment the count field, and `DELETE` will delete items in the count field, if there is more than one. A full list of products is available at `/products/`.

As an added feature, if you `DELETE` at the `/application/products` endpoint, this will clear the cart.

#### Application Messages

The WiscShop interface supports showing the messages from each of the agents. If you access the raw text, or generate the agent response, you can add to this set of messages. These are accessible at the `/application/messages` endpoint:

```
{  "messages":
  [
    ...
  ]
}
```

Each message has the following attributes:

- `id`
- `isUser` // Boolean: `true` for human, `false` for agent.
- `text`   // String: Human prompt, or agent response.
- `date`   // String: Iso-formatted string.

An example would be like the following:

```
{
  "date": "2019-11-24T22:22:57.149543",
  "isUser":true,
  "text": "Could you show me the hats?",
  "id":32
}
```

Like tags and products in the cart, you can clear all the messages by executing `DELETE` on the `/application/messages/` endpoint.

### Application URLs

Suppose you want to change the page of the application. You can do so by updating the application endpoint, described above. For the `page` attribute of the application, this will correspond to the URL that you want the page to navigate to, minus the protocol and host (e.g., no `http://localhost:3000`). In other words, if you wanted the browser pointed to `http://localhost:3000/myUser/hats`, you would specify `/myUser/hats` as the `page`. If the user were to request them to navigate to the previous page, you can simply toggle the `back` to `true`, and the application will handle the rest. Here are the example `page` URLs you may use.

- `/`           // Welcome
- `/signUp`     // Sign-Up Page
- `/signIn`     // Sign-In Page
- `/<username>` // Welcome page for user <username>
- `/<username>/<category_name>` // Category page for <category_name>
- `/<username>/<category_name>/products/<product_id>` // Product page for <product_id>
- `/<username>/cart` // Cart
- `/<username>/cart-review` // Cart Review
- `/<username>/cart-confirmed` // Purchase Confirmed Page
