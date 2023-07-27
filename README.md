[![NPM](https://img.shields.io/badge/NPM-ba443f?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![logo](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![logo](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://www.w3schools.com/html/)
[![docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![elasticsearch](https://img.shields.io/badge/elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)](https://www.elastic.co/)
[![socket.io](https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/mongodb-4479A1?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

# ArticleHub

Article moderation site inspired by Git. Make it easier and more efficient for team to manage article versions.
[ArticleHub](https://emmalinstudio.com/)

## Features

#### branch create

Create a branch to allow team members to make edits to the article without affecting each other.

![img](./img/branch.png)

#### version control

Each time you save an edited article, a new version is created, allowing you to access historical versions of the edits.

![img](./img/version%20contorl.png)

#### text compare

Apart from the main branch, you have the option to compare article versions with the latest content in the main branch and indicate the added and deleted sections.

![img](./img/text%20compare.png)

#### Share URL

Click the share button, then paste the URL to enable others to view the article and see the number of people viewing it simultaneously.

![img](./img/share.png)

#### sync modifications to the main branch

After making modifications in the branch, send a synchronization request, and once approved, the updated content will be visible in the main branch as a new version.

![img](./img/requset.png)

Only the project creator can approve the sync request

![img](./img/approve.png)

## Server structure

![img](./img/structure.png)

## Tech Stack

**Client:** React-TypeScript, React Router, CSS/SCSS

**Server:** Node, Express, TypeScript

**DataBase:** MongoDB, Redis, Elasticsearch

**Tool:** Socket.IO, Docker

## Test Account

- email:1234@gmail.com

- password:1234

## Feedback

If you have any feedback, please reach out to us at aoao3218@gmail.com
