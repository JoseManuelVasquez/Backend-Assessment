# Backend-Assessment
Backend developer assessment exercise

### Server Requiremets

- NodeJS
- Npm
- Git
- Mongo

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
      "id": String,
      "name": String,
      "email": String,
      "role": String
    }
}
```

- Get user policies: ```GET /user/get-policies?name=String?token=String```

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

- Get user by policy ID: ```GET /user/get-user-policy?policy=String?token=String```

Response
```
{
    "success": Boolean,
    "client": {
          "id": String,
          "name": String,
          "email": String,
          "role": String
        }
}
```