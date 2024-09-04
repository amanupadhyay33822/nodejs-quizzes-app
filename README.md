# Node.js Quizzes App

A Node.js application designed to help students practice quizzes before tests. This app was developed with students in mind, offering an interactive platform for creating, taking, and reviewing quizzes. It’s a great tool for self-assessment and test preparation.

## Table of Contents

- [Background](#background)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [License](https://github.com/AlexzGut/nodejs-quizzes-app/blob/main/LICENSE)

## Background

As a **Computer Programming student** and **tutor at Lambton College**, I noticed a growing need for a tool to help students practice quizzes before their tests. While working as a tutor, I realized that I wanted to expand my leadership and collaborative skills outside the tutoring center, which inspired me to create the **NodeJS Quizzes App**.

This app not only addresses the need for quiz practice but also showcases my abilities in **Full Stack development**, including building secure user authentication, managing dynamic content, and handling data efficiently. I developed this project with the goal of offering students a practical resource while also furthering my own professional growth.

## Features

- **User Authentication**: Secure registration and login system.
- **Create and Manage Quizzes**: Users can create multiple-choice and true/false quizzes.
- **Real-Time Quiz Scoring**: Instant feedback with real-time scoring after completing a quiz.
- **Responsive Design**: Fully responsive for mobile and desktop users, making it accessible on any device.

## Technologies Used

- **Node.js**: Backend logic and server-side operations.
- **Express.js**: Web framework for handling routing and requests.
- **MongoDB**: Database for storing quiz data, user information, and results.
- **EJS**: Templating engine for dynamic content rendering.
- **Bootstrap**: Frontend framework for responsive and modern UI design.

### Installation

### Prerequisites

Ensure you have Node.js and MongoDB installed on your machine.

## Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/AlexzGut/nodejs-quizzes-app

2. Navigate into the project directory:

    ```bash
    cd nodejs-quizzes-app

3. Install the dependencies:

    ```bash
    npm install

4. Set up your environment variables:

    - Create a .env file in the root directory and add the following:

        ```makefile
        MONGO_URI=your-mongodb-uri
        SESSION_SECRET=your-session-secret

5. Start the server:

    ```bash
    npm start

The application will run on <http://localhost:3000>.

## Usage

- **Create an Account**: Sign up or log in as a user.
- **Create Quizzes**: Once logged in, you can create quizzes with multiple questions and options.
- **Take Quizzes**: Attempt any quiz, view your score in real time, and review answers.
- **Manage Quizzes**: Edit or delete your quizzes as needed.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/AlexzGut/nodejs-quizzes-app/blob/main/LICENSE) file for more details.
