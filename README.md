# Project 2: Quiz application

This is a small web application built for repeated practice of learned content. The application allows users to add new questions to predefined topics, and take quizzes to test their knowledge. Additionally, users with admin rights are allowed to add new topics.

The web application is deployed with Render and can be found here: https://kjgregjrgljegerg-wsd-project2.onrender.com/

## Implementation

The application is built using Deno and Oak. It has a three-tier architecture and uses view-controller-service-database architecture in the code. The topics, questions, answer options, users and all previous answers are stored in a database, which is accessed by the various services.

## Testing

The application code, including the app.js file use to deploy it can be found in the drill-and-practice folder. The flyway folder includes files for initializing the SQL database. Although the database is actually deployed on Render separately, the .sql file can be used to recreate the database locally.

Finally, e2e-playwright folder includes 10 automated end-to-end tests used to verify compliance with certain basic requirements of the project, and check basic functionality.

To run E2E tests, launch the project locally using the following command:

```
docker-compose run --entrypoint=npx e2e-playwright playwright test && docker-compose rm -sf
```

### Running the application

The application can be run locally using Docker with the command 

```
docker-compose up
```

ran in the project root folder.

