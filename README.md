# Backend-Assessment
Backend developer assessment exercise

Due to the ambiguity of the exercise, these are the calls to the API.

### Using server

Host: http://localhost:3000
Body: x-www-form-urlencoded

- Create user: ```POST /user/signup```

Request body:
```
{
    "id": String, 
    "name": String,
    "email": String,
    "password": String,
    "role": String ( "admin" | "user" )
} 
```

Response
```
{
    "success": Boolean,
    "userId": String
}
```

- Login user: ```POST /user/login```

Request body:
```
{
    "email": String,
    "password": String
} 
```

Response
```
{
    "success": Boolean,
    "userId": String
    "token": String
}
```

- Get user data:

```GET /user/get-data?id=String?token=String```

or

```GET /user/get-data?name=String?token=String```

Response
```
{
    "success": Boolean,
    "client": {
      "success": Boolean,
      "id": String,
      "name": String,
      "email": String,
      "role": String
    }
}
```

- Get user data: ```GET /user/get-data?name=String?token=String```

Response
```
{
    "success": Boolean,
    "policies": [
        {
            "id": String,
            "amountInsured": Number,
            "email": String,
            "inceptionDate": String,
            "installmentPayment": Boolean,
            "clientId": String
        },
        ...
    ]
}
```