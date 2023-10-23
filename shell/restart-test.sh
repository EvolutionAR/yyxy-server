git pull origin test
git add .
git commit -m 'feat: merge by shell'
git push origin test
npm run stop-test
npm run start-test
