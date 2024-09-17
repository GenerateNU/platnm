We are using a Supabase-hosted Postgres database. Our schema is relational and we handle changes by making migration scripts so that we have a changelog of the database schema history.

The following pathway allows you to make and test schema changes locally via migration script without affecting the shared database until you're ready. More information on local development best practices can be found in the [Supabase docs](https://supabase.com/docs/guides/cli/local-development).

1. Create a new feature branch off of main to make sure you are up-to-date with any recently-added migration scripts.
2. `cd` into `/backend/internal`
3. Create a new migration script by running `supabase migration new migration-name`. Your migration-name should be concise but descriptive of what's going on!
   - Ex. `supabase migration new update_track_add_url` if adding a URL column to the track table.
4. Add your SQL to the auto-generated script file in `/migrations`
5. Add or update the `seed.sql` data to see populated values for your change if relevant
6. With Docker running, run `supabase db reset` to apply your changes locally. This might take some time on the first try, since Supabase is using Docker to pull some stuff from the internet (more concrete explanation coming soon ...)
7. If applying the db changes goes smoothly, go to http://localhost:54323 to see a local version of the Supabase dashboard, where your sample data will be visible.
8. .... coming soon!
9. When done, run `supabase db stop` to stop the local instance of the DB.

Prereqs:

1. Run `supabase login`. Follow the prompts to get your Supabase account connected.
2. Run `supabase link --project-ref <project-id>` - the project-id can be found in the Supabase dashboard, or reach out to the TLs for help
3. Verify by ...
4. Have Docker installed
