### To run the frontend:

#### Prereq: Setup the backend:
The frontend is most interesting when connected to the backend. Here, you have two options:
1. Connect to the deployed DigitalOcean backend (will reflect code that has been merged into main)
2. Connect to a locally-running backend. (lets you make and test backend changes that aren't yet in main)

In the frontend/ directory, create a new .env file. This should have 1 value: EXPO_PUBLIC_BASE_URL
- If connecting to the deployed backend:
`EXPO_PUBLIC_BASE_URL="https://platnm-sspx6.ondigitalocean.app"`

- If connecting to your local backend, your value should look like this, except replace 10.110.67.6 with your IP. 
You can find this in your network settings, or you can see it in the logs after running `frontend-run`
`EXPO_PUBLIC_BASE_URL="http://10.110.67.6:8080"`
<img width="667" alt="image" src="https://github.com/user-attachments/assets/ecf7f8a4-bab4-4965-a2a0-5dd4fe5fdfae">

#### Frontend:
1. Run `nix develop --impure`.
2. If all goes well, you should see logs with a QR code. With Expo Go downloaded on your phone, you should be able to scan the code and interact with the app on your phone. Hot reloading should work as well.
<img width="500" alt="image" src="https://github.com/user-attachments/assets/df1e06c7-93e5-4335-a732-769779f510da">

3. If you see any errors (not yellow warnings), or if you scan the QR code and see a default "Welcome to Expo" page on your phone, there's a problem :(
   Slack a TL or #platnm-engineers for help!
