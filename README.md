<!-- ABOUT THE PROJECT -->

# Gym-app

## Fitness training scheduling tool

Are you bored of those inflexible Excel sheets when preparing a training schedule for your client? Worry no more, because you have the Gym-app. It is intended not only for personal trainers and their clients but also for the ones who want to build their own plans and track progress individually.

## What gym-app has to offer

Gym-app allows users (trainers) to create a base of clients and a base of exercises. Out of the prepared exercise base, the user can create a schedule and assign it to a specific client.

Within the schedule planning view user has many options. Days can be swapped, it is possible to drag and drop individual exercises within a day, delete, copy items, etc. which really gives you a sense of freedom. The training schedule can be saved in a database and exported as a .xlsx file.

Exercises can be created individually by using a form, where users can input exercise names, related muscle groups, and even a link to a demo. Gym-app also offers a faster way of adding exercises to the base - by importing a .xlsx file. Setting up an Excel sheet should be relatively quick and then hundreds of exercises and exercise variants can be imported with just one click.

### Built With

- [Next.js](https://nextjs.org)
- [React.js](https://reactjs.org)
- [Shadcn.ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Tanstack Table](https://tanstack.com/table/v8)
- [Zod](https://zod.dev)
- [SheetsJS](https://sheetjs.com)
- [dnd kit](https://dndkit.com/)
- [Prisma.io](https://prisma.io)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth](https://next-auth.js.org)

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running, please follow these simple steps.

### Prerequisites

Here is what you need to be able to run Gym-app.

- Node.js (Version: >=18.17)
- MongoDB
- Yarn _(recommended)_

## Development

### Setup

1. Clone the repo into a public GitHub repository.

   ```sh
   git clone https://github.com/jprymak/gym-app
   ```

2. Go to the project folder

   ```sh
   cd gym-app
   ```

3. Install packages with yarn

   ```sh
   yarn
   ```

4. Set up your `.env` file

   - Duplicate `.env.example` to `.env`
   - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.

5. Setup Node
   If your Node version does not meet the project's requirements as instructed by the docs, "nvm" (Node Version Manager) allows using Node at the version required by the project:

   ```sh
   nvm use
   ```

   You first might need to install the specific version and then use it:

   ```sh
   nvm install && nvm use
   ```

   You can install nvm from [here](https://github.com/nvm-sh/nvm).

#### Manual setup

1. Configure environment variables in the `.env` file. Replace `<user>`, `<pass>`, `<db-host>` with their applicable values

   ```
   DATABASE_URL='mongodb+srv://<user>:<pass>@<db-host>'
   ```

#### Setting up your first user

1. Open [Prisma Studio](https://prisma.io/studio) to look at or modify the database content:

   ```sh
   yarn db-studio
   ```

2. Click on the `User` model to add a new user record.
3. Fill out the fields `email`, `name`, `password`, `role`, (remembering to encrypt your password with [BCrypt](https://bcrypt-generator.com/)) and click `Save 1 change` to create your first user.
   > Users with `admin` role have access to hidden /createUser page
4. Open a browser to [http://localhost:3000](http://localhost:3000) and login with your just created, first user.

### Running tests

Run tests in watch mode:

```sh
 yarn test:watch
```

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

Special thanks to projects which made gym-app possible:

- [Next.js](https://nextjs.org)
- [React.js](https://reactjs.org)
- [Shadcn.ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Tanstack Table](https://tanstack.com/table/v8)
- [Zod](https://zod.dev)
- [SheetsJS](https://sheetjs.com)
- [dnd kit](https://dndkit.com/)
- [Prisma.io](https://prisma.io)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth](https://next-auth.js.org)
