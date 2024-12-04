# E-commerce API

## Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Sequilize ORM: To make it easier to perform database querying
- Docker: To make it easy for developers to setup database locally

## Prerequisites

Before running this project, make sure you have the following installed:
- Docker & Docker Compose
- Node.js (v16 or higher)
- npm

## Project Setup

1. Clone the repository:
```bash
git clone https://github.com/well-mannered-goat/Ecom-api
cd Ecom-api
```

2. Create environment file:
   - Copy the `.env.example` file to create a new `.env` file:
   - 
   - Update the following variables in `.env`:
     ```
     # Server Configuration
     PORT=3000

     # Database Configuration
     DB_HOST=postgres
     DB_PORT=5432
     DB_NAME=products_db
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_URL=production_db_url
      
     # Server Configuration
     JWT_SECRET=your_jwt_secret
     ```

3. Start the Docker containers:
  ```bash
  docker-compose up -d
  ```

This will start the PostgreSQL database container.

## API Endpoints

### **User Routes**
| Method | Endpoint         | Description                          |
|--------|------------------|--------------------------------------|
| POST   | `user/create`        | Create a new user                   |
| GET    | `user/getUser`       | Retrieve user information           |
| PUT    | `user/updateUser`    | Update user details                 |

### **Product Routes**
| Method | Endpoint         | Description                          |
|--------|------------------|--------------------------------------|
| POST   | `product/create`        | Create a new product                |
| GET    | `product/getProduct`    | Retrieve product information        |
| PUT    | `product/updateProduct` | Update product details              |
| GET    | `product/total-stock`   | Get total product stock             |

### **Order Routes**
| Method | Endpoint          | Description                          |
|--------|-------------------|--------------------------------------|
| POST   | `order/book`           | Create a new order                  |
| PUT    | `order/success`        | Mark order as successful            |
| PUT    | `order/failed`         | Mark order as failed                |
| PUT    | `order/update`         | Update order details                |
| PUT    | `order/cancel`         | Cancel an order                     |
| GET    | `order/recent`         | Retrieve recent orders               |
| GET    | `order/user-orders`    | Get orders for a specific user       |
| GET    | `order/users-by-product` | Get users who ordered a product    |

## Development

### Running Locally Without Docker

1. Install dependencies:
```bash
npm install
```

2. Build and start container:
```bash
docker-compose up -d
```

3. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file based on `.env.example`. Here's what each variable means:

- `PORT`: The port number where the server will run
- `DB_HOST`: Database host
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_URL`: Production DB URL is present
- `MODE`: `DEV` for development purpose, `PROD` for production purpose

## Error Handling

The API returns appropriate HTTP status codes:

- 200: Success
- 201: Resource created
- 400: Bad request
- 404: Resource not found
- 500: Internal server error
