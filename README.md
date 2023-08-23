# Content management system

## Design

## Considerations

1. Should use s3 or other cloud blob storage to store uploaded file for easier retrieval and storing.
   - Reason didn't use this approach: Requires cost to store items in s3 bucket
2. Should use a seperate db instance.
   - Allow multiple server instances to connect to one db
3. Should add config to handle different environments 

## Endpoints
1. Upload content
- able to upload file with metadata (description and name)
2. Get user's Contents
- Able to fetch all contents and images based on userId


## To run
1. Run docker compose up for `docker-compose.local.yaml`
2. npm run start
3. Go to `http://localhost:3000/api/#/`
## To test
- npm run test:cov

