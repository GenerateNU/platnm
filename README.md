# Platnm

Platnm is the one stop shop for all musical discourse providing a space for you to rate, review, and discuss music. It syncs to your streaming services for a personalised approach to show off your tastes!

# Tech Stack

- The back end is written in Go and uses Fiber as a web framework for efficient routing.
- The database is PostgreSQL, specifically one hosted by Supabase.
- The front end is React Native written with TypeScript using Expo as a build tool to support both iOS and Android users

# Environment Setup

1. [Install Nix](https://zero-to-nix.com/start/install)
2. Activate the development environment by running the following:

<!-- markdownlint-disable MD013 -->
   ```sh
   nix develop --impure
   ```
<!-- markdownlint-enable MD013 -->