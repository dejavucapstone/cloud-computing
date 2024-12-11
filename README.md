<!-- ABOUT THE PROJECT -->

<h1 align="center">Cloud Computing (API Resources)</h1>

This repository contains resources for a Cloud Computing project focused on implementing Node.js with the Express.js framework for backend development 
and mobile app integration.

<h2 align="center">Project Overview</h2>

The aim of this project is to connect mobile apps with a database to enable interaction and perform processes such as CRUD operations. We utilize a microservices architecture for the backend, where the application is built as a collection of independent small services, each with specific responsibilities. All services are connected through a single API Gateway, which serves as the single entry point for requests from the Android application, managing communication and directing requests to the appropriate microservices.

### Here's the project scope :

- Creating Database : Created a database with 4 tables (login, user, history, and exercise).
- API development : Utilizing Node.js and Express.js frameworks to develop REST APIs that connect Android applications to databases.
- Microservices Architecture: Implemented a microservices architecture for better scalability and maintainability, with each service handling specific functions.


### Built With

There's several components that we use to build this repository :

- [![Node.js][Node.js]][Node-url]
- [![Express.js][Express.js]][Express-url]
- [![Supabase][Supabase]][Supabase-url]


[Node.js]: https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=yellow
[Express-url]: https://expressjs.com/
[Supabase]: https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/



<h2 align="center">Repository Structure</h2>

  ```sh
cloud-computing
│
├── config/
│   └── supabase.js                     # Supabase configuration
│
├── docs/
│   ├── api-docs.yaml                   # API documentation
│   └── cleaned-api-docs.yaml           # Cleaned API documentation
│
├── node_modules/                       # Node.js modules
│
├── services/
│   ├── auth/                            # Authentication services
│   │   ├── controllers/                 # Controllers for authentication
│   │   │   └── authControllers.js       
│   │   ├── middleware/                  # Middleware for authentication
│   │   │   └── authMiddleware.js        
│   │   └── routes/                      # Routes for authentication
│   │       └── authRoutes.js            
│   ├── docs/                            # Documentation services
│   │   ├── controllers/                 # Controllers for documentation
│   │   │   └── docsControllers.js       
│   │   └── routes/                      # Routes for documentation
│   │       └── docsRoutes.js            
│   ├── exercise/                        # Exercise services
│   │   ├── controllers/                 # Controllers for exercises
│   │   │   └── exerciseControllers.js    
│   │   └── routes/                      # Routes for exercises
│   │       └── exerciseRoutes.js        
│   ├── history/                         # History services
│   │   ├── controllers/                 # Controllers for history
│   │   │   └── historyControllers.js     
│   │   └── routes/                      # Routes for history
│   │       └── historyRoutes.js         
│   ├── user/                            # User services
│   │   ├── controllers/                 # Controllers for users
│   │   │   └── userControllers.js       
│   │   └── routes/                      # Routes for users
│   │       └── userRoutes.js            
│
├── utils/
│   ├── createResponse.js                # Utility for creating responses
│   ├── emailSender.js                   # Utility for sending emails
│   └── hashPassword.js                  # Utility for hashing passwords
│
├── README.md                            # Project documentation
├── .env                                  # Environment variables
├── Documentation API.json               # API documentation in JSON format
├── index.js                             # Main entry point of the application
├── package-lock.json                    # Lock file for npm packages
├── package.json                         # Project metadata and dependencies
└── pnpm-lock.yaml                       # Lock file for pnpm packages

  ```

<h2 align="center">Preparation and Running Code</h2>

To get started, clone this repository and install the necessary dependencies:

1. Clone the repository
   ```sh
   git clone https://github.com/dejavucapstone/cloud-computing.git
   ```
2. Change Directory
   ```sh
   cd cloud-computing
   ```
3. install all dependencies
   ```sh
   npm i
   ```
4. running the script
   ```sh
   npm run dev
   ```




<h2 align="center">Contributing</h2>

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<h2 align="center">Top Contributors:</h2>

<p align="center">
  <a href="https://github.com/Deku077-zaldy">
    <img src="https://avatars.githubusercontent.com/u/149594740" alt="Deku077-zaldy" width="100" style="border-radius: 50%;" />
  </a>
  <a href="https://github.com/Galangbuana12">
    <img src="https://avatars.githubusercontent.com/u/157497041" alt="Galangbuana12" width="100" style="border-radius: 50%;" />
  </a>
</p>




