To submit changes, create a pull request and fill out the provided template. **Make sure that the pull request title is descriptive.**

Once submitted, your pull request will require at least one of the tech leads' approval as well as no issues during the CI/CD tests. This is super important to keep our main branch clean and well-tested. Once both an approval is given and the CI/CD pipeline has been completed successfully, then your pull request may be merged.

If your pull request is reviewed and not approved, the reviewer will leave some suggestions for changes (but sometimes we will approve and still leave suggestions). Once you have made your changes, make sure to re-request a review and/or message one of the TLs on Slack to ensure another review.

Best Practices:

- Make code easy to read and follow
  - If you feel any parts are not self-explanatory, please comment the code
- Add tests to complex parts of your code
  - This is to ensure that the code is working straight away and make debugging easier down the road
- Include screenshots from manual testing (Postman, etc!)
  - This helps us verify that endpoints are working as expected without needing to pull your branch
- When working on frontend:
  - Include screenshots in your PR
- Naming Conventions:
  - Golang: TitleCase
  - React Native: camelCase
