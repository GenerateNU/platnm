We are using a Supabase-hosted Postgres database. Our schema is relational and we handle changes by making migration scripts so that we have a changelog of the database schema history.

The following pathway allows you to make and test schema changes locally via migration script without affecting the shared database until you're ready. More information on local development best practices can be found in the [Supabase docs](https://supabase.com/docs/guides/cli/local-development). **Note that running the DB locally requires Docker to be installed and running.**

1. Create a new feature branch off of main to make sure you are up-to-date with any recently-added migration scripts.
2. `cd` into `/backend/internal`
3. Create a new migration script by running `supabase migration new migration-name`. Your migration-name should be concise but descriptive of what's going on!
   - Ex. `supabase migration new update_track_add_url` if adding a URL column to the track table.
4. Add your SQL to the auto-generated script file in `/migrations`
5. Add or update the `seed.sql` data to see populated values for your change if relevant
6. With Docker running, run `supabase db reset` to apply your changes locally. This might take some time on the first try, since Supabase is using Docker to pull some stuff from the internet (more concrete explanation coming soon ...)
7. If applying the db changes goes smoothly, go to http://localhost:54323 to see a local version of the Supabase dashboard, where your sample data will be visible.
8. When done, run `supabase db stop` to stop the local instance of the DB.

After script is approved/merged:

1. Run the actual scripts against the supabase db using `supabase db push`

- This will run the script and add a log to the migrations table.
