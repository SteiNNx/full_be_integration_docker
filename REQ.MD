mira te explico en dockers tengo un script.sh que ejecuta una series de cosas pero al final levanto en el puerto 8000 un server dynamobn con 3 tablas "{
    "TableName": "auth_tokens",
    "AttributeDefinitions": [
        {
            "AttributeName": "username",
            "AttributeType": "S"
        },
        {
            "AttributeName": "auth_token",
            "AttributeType": "S"
        }
    ],
    "KeySchema": [
        {
            "AttributeName": "username",
            "KeyType": "HASH"
        }
    ],
    "GlobalSecondaryIndexes": [
        {
            "IndexName": "authTokenIndex",
            "KeySchema": [
                {
                    "AttributeName": "auth_token",
                    "KeyType": "HASH"
                }
            ],
            "Projection": {
                "ProjectionType": "ALL"
            }
        }
    ]
}" auth.structure.json, "{
    "username": "user1",
    "password": "$2a$10$EIX3jTkJlD/9nf9ZyGr5hO/9JhgP7y1LPt3ihYm8SzKU4r5SkFeW6",
    "auth_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMSIsIm5hbWUiOiJVc2VyIDEiLCJpYXQiOjE1MTYyMzkwMjJ9",
    "expires_at": "2024-12-01T00:00:00Z"
}
"auth.data.json, "{
    "TableName": "comercios",
    "AttributeDefinitions": [
        {
            "AttributeName": "id_comercio",
            "AttributeType": "S"
        }
    ],
    "KeySchema": [
        {
            "AttributeName": "id_comercio",
            "KeyType": "HASH"
        }
    ]
}
"comercios.structure.json, "[
    {
        "id_comercio": "b2e1e9c6-4f89-11ec-81d3-0242ac130003",
        "nombre": "ElectroMundo",
        "categoria": "Electrónica",
        "direccion": "Av. Libertador Bernardo O'Higgins 200, Santiago, Chile",
        "telefono": "+56 2 2917 0000",
        "fecha_de_creacion": "2022-01-15T09:30:00Z"
    },
    {
        "id_comercio": "a5f3a8d7-4f89-11ec-81d3-0242ac130003",
        "nombre": "Moda & Más",
        "categoria": "Ropa y accesorios",
        "direccion": "Paseo Ahumada 555, Santiago, Chile",
        "telefono": "+56 2 2338 0000",
        "fecha_de_creacion": "2023-06-25T14:45:00Z"
    },
    {
        "id_comercio": "c1f4c2a9-4f89-11ec-81d3-0242ac130003",
        "nombre": "Casa y Estilo",
        "categoria": "Hogar y decoración",
        "direccion": "Calle Nueva York 33, Santiago, Chile",
        "telefono": "+56 2 2579 0000",
        "fecha_de_creacion": "2021-11-10T12:00:00Z"
    }
]"comercios.data.json, "{
    "TableName": "sucursales",
    "AttributeDefinitions": [
        {
            "AttributeName": "id_sucursal",
            "AttributeType": "S"
        },
        {
            "AttributeName": "id_comercio",
            "AttributeType": "S"
        }
    ],
    "KeySchema": [
        {
            "AttributeName": "id_sucursal",
            "KeyType": "HASH"
        }
    ],
    "GlobalSecondaryIndexes": [
        {
            "IndexName": "comercioindex",
            "KeySchema": [
                {
                    "AttributeName": "id_comercio",
                    "KeyType": "HASH"
                }
            ],
            "Projection": {
                "ProjectionType": "ALL"
            }
        }
    ]
}
", sucursales.structure.json, "[
    {
        "id_sucursal": "suc1-b2e1e9c6",
        "id_comercio": "b2e1e9c6-4f89-11ec-81d3-0242ac130003",
        "nombre": "Sucursal Providencia",
        "direccion": "Av. Providencia 1200, Santiago, Chile",
        "telefono": "+56 2 2345 6789",
        "gerente": "Carolina Soto",
        "fecha_de_apertura": "2022-02-10T10:00:00Z"
    },
    {
        "id_sucursal": "suc2-b2e1e9c6",
        "id_comercio": "b2e1e9c6-4f89-11ec-81d3-0242ac130003",
        "nombre": "Sucursal Las Condes",
        "direccion": "Av. Las Condes 10230, Santiago, Chile",
        "telefono": "+56 2 2567 8901",
        "gerente": "José Ramírez",
        "fecha_de_apertura": "2022-04-15T09:00:00Z"
    },
    {
        "id_sucursal": "suc3-b2e1e9c6",
        "id_comercio": "b2e1e9c6-4f89-11ec-81d3-0242ac130003",
        "nombre": "Sucursal La Florida",
        "direccion": "Av. Vicuña Mackenna 7890, Santiago, Chile",
        "telefono": "+56 2 2789 6543",
        "gerente": "María Paz González",
        "fecha_de_apertura": "2022-06-20T08:30:00Z"
    },
    {
        "id_sucursal": "suc1-a5f3a8d7",
        "id_comercio": "a5f3a8d7-4f89-11ec-81d3-0242ac130003",
        "nombre": "Sucursal Maipú",
        "direccion": "Av. Pajaritos 1234, Maipú, Chile",
        "telefono": "+56 2 2398 7654",
        "gerente": "Felipe Contreras",
        "fecha_de_apertura": "2023-07-05T11:00:00Z"
    },
    {
        "id_sucursal": "suc2-a5f3a8d7",
        "id_comercio": "a5f3a8d7-4f89-11ec-81d3-0242ac130003",
        "nombre": "Sucursal Quilicura",
        "direccion": "Av. Matta 321, Quilicura, Chile",
        "telefono": "+56 2 2456 7800",
        "gerente": "Lorena Figueroa",
        "fecha_de_apertura": "2023-08-12T09:30:00Z"
    },
    {
        "id_sucursal": "suc1-c1f4c2a9",
        "id_comercio": "c1f4c2a9-4f89-11ec-81d3-0242ac130003",
        "nombre": "Sucursal Centro",
        "direccion": "Paseo Huérfanos 750, Santiago, Chile",
        "telefono": "+56 2 2765 4321",
        "gerente": "Rodrigo Ríos",
        "fecha_de_apertura": "2021-12-15T10:30:00Z"
    },
    {
        "id_sucursal": "suc2-c1f4c2a9",
        "id_comercio": "c1f4c2a9-4f89-11ec-81d3-0242ac130003",
        "nombre": "Sucursal Ñuñoa",
        "direccion": "Av. Irarrázaval 2567, Ñuñoa, Chile",
        "telefono": "+56 2 2489 1234",
        "gerente": "Daniela Pérez",
        "fecha_de_apertura": "2022-03-20T09:00:00Z"
    },
    {
        "id_sucursal": "suc3-c1f4c2a9",
        "id_comercio": "c1f4c2a9-4f89-11ec-81d3-0242ac130003",
        "nombre": "Sucursal Plaza Italia",
        "direccion": "Av. Vicuña Mackenna 20, Santiago, Chile",
        "telefono": "+56 2 2781 2345",
        "gerente": "Marcela Álvarez",
        "fecha_de_apertura": "2022-05-10T11:15:00Z"
    },
    {
        "id_sucursal": "suc4-c1f4c2a9",
        "id_comercio": "c1f4c2a9-4f89-11ec-81d3-0242ac130003",
        "nombre": "Sucursal Estación Central",
        "direccion": "Alameda 100, Estación Central, Santiago, Chile",
        "telefono": "+56 2 2891 5678",
        "gerente": "Jorge Fernández",
        "fecha_de_apertura": "2022-07-25T09:45:00Z"
    }
]"sucursales.data.json, la idea es tener 2 aplicaciones una node.js en el puerto 3000 la cual hace auth y hace consultas axios a otra app2 la cual quiero que me sugieras en que lenguaje hacer facilmente para ademas si es facil levantaar local.. o levantar local con imagen docker.. la cual haga de api de comercios sucursales ambas tablas de dynamodb y se comuniqeue con la app 1 nodejs 3000 port, me entiendes? a travez de axios.. asi tengo solo 1 capa y esa capa va a atuh dynamo y va a la otra app2 a hacerles consultas y dsps esta le devuelve al cliente a travez de nodejs
