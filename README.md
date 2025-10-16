# beautyofstrength
White label SPA, Mobile first, progressive web app for the calisthenics and gym industries where professors and students meet for completing planifications and routines.

Open sourced: 10/14/2025

## Example configs
### conf.json
```json
{
  "linkSharingExpirationDays": 30,
  "allowedOrigins": [
    "http://localhost:3000"
  ],
  "address": "http://localhost:3001",
  "addressUi": "http://localhost:3000",
  "whiteListedIPs": [
    "127.0.0.1"
  ],
  "serverStaticUI": true,
  "customExercisesPerUserLimit": 100,
  "customExerciseNameCharacterLimit": 60,
  "exercisesPerBlockLimit": 10,
  "studentFreeAccountRoutineBlocksLimit": 3,
  "googlePEMCertsUrl": "https://www.googleapis.com/oauth2/v1/certs",
  "googleTokenValidIssuers": {
    "accounts.google.com": true,
    "https://accounts.google.com": true
  },
  "s3Config": {
    "region": "YOUR_REGION",
    "accessKey": "YOUR_ACCESS_KEY",
    "secretKey": "YOUR_SECRET_KEY",
    "endpoint": "YOUR_ENDPOINT",
    "mainBucketName": "YOUT_BUCKET"
  }
}
```

### crypto-conf.json
```json
{
  "datasourceName": "YOUR_DATABASE",
  "vapidPublicKey": "NOT_IN_USE",
  "vapidDataKey": "NOT_IN_USE",
  "linkSharingKey": "RANDOMIZED",
  "googleClientId": "YOUR_GOOGLE_CLIENT_ID",
  "googleClientSecret": "YOUR_GOOGLE_CLIENT_SECRET"
}
```

## Links to artifacts
- Value proposal [https://www.figma.com/board/DrQBYbdmfWMNnNup3ngGAd/APP-Value-Proposition?node-id=0-1&t=NE6aIihFiIlOfAqY-1]
- App map [https://www.figma.com/board/DqlgDa97d0QdupkpgNuseM/APP-Map?node-id=0-1&t=FzlzVtoZkyN5CLbW-1] (what can the app currently do)
- Other apps flows [https://www.figma.com/board/guBdQ37JhhK56dfVdnzOMf/bOS---Competitors-Flows?node-id=0-1&t=zBSauaDCVlSqbaur-1]
- Landing proposal [https://www.figma.com/design/TKXa9IFb5yB5NsYLtUUncT/bOS---MUI?node-id=1-10902&t=vvuvNEGxHYXaIRgu-1]
- Onboarding proposal [https://www.figma.com/design/e0nrl6tafLnNzrnckdwt21/bOS-App-Project?node-id=129-150&t=7nqB9h9ihvBnpU0h-1]
- MaterialUI [https://www.figma.com/design/zcCAh6b9l9RCoM6cTQZDxm/MUI-for-Figma-v5.16---Material-UI--Release-?node-id=4662-14&t=5xRKP1FbrFSgcl2C-1]
- Auth flow [https://www.figma.com/board/XGgm9f0pfYg43j5PlcEJGy/bos-auth-flow?node-id=0-1&t=LYa5CY55o63LlK8d-1]
- Onboarding flow [https://www.figma.com/board/kPjIyFyVRS2JlNWipY5F2n/bos-user-flow?node-id=0-1&t=CqRgnzF94bHi4FLe-1]
