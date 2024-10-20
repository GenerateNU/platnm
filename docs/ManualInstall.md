# Manual Install

- **Try NIX Install First**
- **Only Follow this guide if instructed by a tech lead.**


## Prerequisites
- [Git](https://git-scm.com/)
- [Golang](https://go.dev/)
  - Install through the official website, don't rely on package manager
- A [Supabase](https://supabase.com/) account
  - You can use your Github account for this
- [NodeJS](https://nodejs.org/en/)

## Frontend Setup

1. Install [ExpoGo](https://expo.dev/go) on your mobile device

2. Run `cd frontend` to change to the frontend directory.

3. Run `npm install` to install the Yarn package manager.

4. Run `npm install expo` to install all packages used in the project.

5. Run `npx expo start` to run the frontend!

## Backend setup

1. Let's first create a `.env` file for you to store your configuration and environment secrets.

2. Don't install Postgres locally. Supabase is provisioning our database instead. Create/Log in to your Supabase account.
   - Reach out to the TL's the necessary keys for the Supabase organization
   - Supabase contains lots of features that can be useful when debugging and developing, such as its Table Editor, SQL Editor, and Schema Visualizer. Explore a little!

4. You should now have the necessary setup to run the project. Change into the backend directory by running `cd platnm/backend/cmd/server`. Then run the backend with `task backend:run`.
