***
To be able to run application locally, one should have `dev.env` (correspondingly `dev.env.js` please, provide both, or you can create them as for example, `dev.ts` and on the transpilation phase, previously mentioned ones will be generated) file, please, refer to .dev.env as an example. Do the same
for the production environment, just use prod prefix instead. Then use `startDev` script from  `package.json` to run it locally
or `startProd` for the production (actually you won't need this). Before running the app, please, run `watch:build` command to transpile typescript, and see potential 'compile time' errors.
***
To deploy the app in AWS Elastic Bean Stalk, you will need only to zip the project (without node modules) and upload it using console (please, make sure, that the code is transpiled). On the cloud, `start` command will be triggered, which will use production configs`. You can also use AWS EBS CLI for doing this, its a matter of taste, but I think, above mentioned way is simpler.


