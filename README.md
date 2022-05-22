## Exchange Frontend

- [Develop Application](https://soteria-team.vercel.app/login)
  - Test Account (staging/local)
    - email: test@soteria.com
    - password: testtest

## How to run locally?

As there are many ways to run it locally but the most working way & steps are as below:

```bash
  - yarn install
  - npm i -g vercel
  - yarn run dev:vercel
```

Note: For the first time setup, you would be prompted with few setup steps as below:

- Set up and develop “..\soteria\exchange-frontend? [Y/n] => `Y`
- Which scope should contain your project? scope => `let it be default or choose accoordingly`
- Link to existing project? [y/N] => `N`
- What’s your project’s name? exchange-frontend
- In which directory is your code located? ./
- Want to override the settings? [y/N] => `N`

## Other ways to run locally

_Note: Some of them might not be working._

First, run the development server:

```bash
npm install
npm run dev
# or
yarn install
yarn dev
```

If you want to run on docker

```bash
docker-compose run --rm app yarn install
docker-compose up -d
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Change the APY

Currently, the front-end and back-end each use a magic number to set the APY.
If we need to change the APY more often in the future, we need to consider using Firestore.

### Change the APY of the frontend

```bash
vim <frontend-dir>/src/components/organism/Exchange/AccountOverview.tsx
# change the interestRatePerDay or apy
```

### Change the APY of the backend

```bash
vim <soteria-backend-cloudfunctions-dir>/index.js
# change the APY_PER_DAY
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

If you want to deploy using docker

```bash
docker-compose up -d
docker-compose exec app sh
# Deploy to development (Deployed to a random URL)
# Vercel asks for login by email
# If requested, hit the same command again.
yarn deploy:dev
# Deploy to production (Deployed to a random URL)
rm -rf .vercel
yarn deploy:prod
# Deploy to production (Deployed to a fixed URL)
yarn deploy:prod --prod
```

## Automatic deploy on staging

Another way to automatically deploy this service into vercel is to merge a PR into staging branch.

- Create a PR for your local branch `my_branch`
- Merge this PR to `master` (now `master` has the lastest code)
- From github, create a new PR and select `staging` for "base" and `master` for "compare".
- Merge this PR to `staging` (now `staging` has the same code as master)
- staging deployment will start automatically in versel once PR is merged.

_Note: Before merging to `master` branch, make sure prodction build also has no react specific issues by running `yarn run build` (error related to `invalid firebase project` can be ignored)_
