# ArticleHub

Article moderation site inspired by Git. Make it easier and more efficient for team to manage article versions.
[ArticleHub](https://emmalinstudio.com/)

## Situation

Before an article is published, there are often multiple rounds of proofreading and revisions at the publishing house. Now, with the addition of a new team member, the chief editor has assigned them to edit the headline of one of the articles.

(The chief editor has added the new team member's account to the NEWS team.)

#### STEP1:Create Branch

Create a new branch in order to have the permissions to edit articles. You won't have the authority to edit articles on branches that you haven't created yourself.

![img](./img/branch.png)

#### STEP2:Edit and Save Article

Each time you save an edited article, a new version is created, allowing you to access historical versions of the edits.

![img](./img/version%20contorl.png)

#### STEP3:Check Article Change

Click the "Compare" button to compare your edits with the main article and display the added and modified sections.

![img](./img/text%20compare.png)

#### STEP4:Confirm the content with the chief editor

Click the "Share" button to copy and paste the URL for browsing the article. This way, the chief editor won't need to search for the article and can easily access it. Additionally, this feature allows the chief editor to see how many people are currently viewing the article at the same time.

![img](./img/share.png)

#### STEP5:Sync modifications to the main branch

Once the synchronization request is submitted and approved by the supervisor, the formal article will be updated with the modified sections that were synchronized.

![img](./img/requset.png)
![img](./img/approve.png)

## Server structure

![img](./img/structure.png)

## Tech Stack

**Client:**

![React](https://img.shields.io/badge/-React-343434?style=for-the-badge&logo=react)
![SCSS](https://img.shields.io/badge/-SCSS-343434?style=for-the-badge&logo=sass)
![Typescript](https://img.shields.io/badge/Typescript-343434?style=for-the-badge&logo=typescript)

**Server:**

![Nodejs](https://img.shields.io/badge/Node.js-343434?style=for-the-badge&logo=node.js&logoColor=3C873A)
![Express.js](https://img.shields.io/badge/Express.js-343434?style=for-the-badge&logo=express)
![SocketIo](https://img.shields.io/badge/Socket.io-343434?&style=for-the-badge&logo=Socket.io)
![Typescript](https://img.shields.io/badge/Typescript-343434?style=for-the-badge&logo=typescript&logoColor=007acc)

**DataBase:**

![mongodb](https://img.shields.io/badge/mongodb-343434?&style=for-the-badge&logo=mongodb&logoColor=RED)
![Redis](https://img.shields.io/badge/redis-343434?&style=for-the-badge&logo=redis&logoColor=RED)
![elasticsearch](https://img.shields.io/badge/elasticsearc-343434?&style=for-the-badge&logo=elasticsearch&logoColor=005571)

**Tool:**

![Docker](https://img.shields.io/badge/Docker-343434?style=for-the-badge&logo=docker)
![AWWS](https://img.shields.io/badge/AWS-343434?style=for-the-badge&logo=amazon-aws)

## Schema

![img](./img/schema.png)

## Test Account

- email:1234@gmail.com

- password:1234

## Feedback

If you have any feedback, please reach out to us at aoao3218@gmail.com
