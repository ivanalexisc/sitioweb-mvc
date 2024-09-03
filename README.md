# Web Application Project

This project is a comprehensive web application built with a modern tech stack, providing a robust experience on both the server and client sides.

## Description

This repository contains a web application utilizing a server-side architecture based on Node.js and Express, with views rendered through EJS. The database is managed using MySQL and Sequelize, an ORM that simplifies database interactions.

Additionally, the project includes an interactive dashboard developed with React, which consumes the API routes provided by the server. The main API routes exposed are:

- **`/api/products`**: For product management.
- **`/api/users`**: For user management.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side code.
- **Express**: Framework to streamline server development.
- **EJS**: Templating engine for server-side rendering of views.
- **MySQL**: Relational database management system.
- **Sequelize**: ORM for easy MySQL database management.
- **React**: Library for building the user interface of the dashboard.

## Installation

To clone and run this project locally, follow these steps:

1. **Clone the repository**

   `git clone https://github.com/ivanalexisc/sitioweb-mvc.git`

2. **Install server dependencies**

   Navigate to the server directory and run:

   `npm install`

3. **Install dashboard dependencies**

   Navigate to the dashboard directory and run:

   `npm install`

4. **Configure the database**

   Ensure MySQL is installed and create a database. Then, configure the Sequelize configuration file with the correct credentials.

5. **Start the development server**

   From the root directory of the project, run:

   `npm run dev`

   This command will start both the server and the React dashboard in development mode.

## Usage

Once the development server is running, you can access the React dashboard at `http://localhost:3000` (or the configured port), and the API routes will be available at `http://localhost:port/api/products` and `http://localhost:port/api/users`.

## Contributing

Contributions are welcome. If you have suggestions or find issues, please open an issue or submit a pull request.

