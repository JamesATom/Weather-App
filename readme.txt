Weather Dashboard API Guide
=========================

Running the Application
---------------------
1. Open the project in CodeSandbox
2. Run the following command in the terminal:
   yarn start:dev
3. Once the server starts, open the External URL + "/api" to access Swagger UI

API Endpoints
-----------

1. Authentication
   ------------
   POST /auth/register
   - Register new user
   - Body: {
       "name": "John",
       "surname": "Doe",
       "username": "johndoe",
       "password": "strongPassword123"
     }
   - Returns: JWT token

   POST /auth/login
   - Login existing user
   - Body: {
       "username": "johndoe",
       "password": "strongPassword123"
     }
   - Returns: JWT token

2. Weather Data
   -----------
   GET /weather?countries=[]
   - Requires Bearer token authentication
   - Query examples:
     * Single location: /weather?countries=london,uk
     * Multiple locations: /weather?countries=london,uk&countries=paris,france
   - Returns weather data including:
     * Temperature in Celsius
     * Wind speed in km/h
     * Cloud coverage percentage
     * Color indicators for each metric

Testing Flow
-----------
1. Register a new user using /auth/register
2. Login with credentials using /auth/login
3. Copy the received JWT token
4. Click "Authorize" button in Swagger UI and enter token as: Bearer <your-token>
5. Test weather endpoint with different city queries

Note: All endpoints are documented in Swagger UI with example requests and responses.