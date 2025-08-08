# Deployment Guide - Mini EdTech Platform

## Branch Structure

- **`local`**: Development branch with your current implementation
- **`master`**: Production-ready branch for deployment

## Render Deployment

### Prerequisites

1. GitHub account
2. Render account (free tier available)
3. Database (PostgreSQL recommended for production)

### Deployment Steps

1. **Push to GitHub**:
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin master
   ```

2. **Set up Render Services**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Configure Environment Variables**:
   
   **Backend Service**:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `NODE_ENV`: production
   - `PORT`: 10000 (automatically set by Render)

   **Frontend Service**:
   - `NEXT_PUBLIC_API_URL`: Your backend GraphQL endpoint
   - `NODE_ENV`: production

4. **Database Setup** (if using PostgreSQL):
   - Create a PostgreSQL database on Render
   - Update the `DATABASE_URL` environment variable
   - Run database migrations after deployment

### Local Testing Before Deployment

```bash
# Test the build process
npm run build

# Test backend
cd backend && npm start

# Test frontend (in another terminal)
cd frontend && npm start
```

### Environment Variables Template

Create these environment variables in Render:

**Backend (.env)**:
```
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="production"
```

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_URL="https://your-backend-service.onrender.com/graphql"
```

### Troubleshooting

1. **Build Failures**: Check the build logs in Render dashboard
2. **Database Connection**: Ensure DATABASE_URL is correctly formatted
3. **CORS Issues**: Update CORS settings in backend if needed
4. **Environment Variables**: Double-check all required env vars are set

### Monitoring

- Use Render's built-in logging and monitoring
- Set up health checks for both services
- Monitor database performance and usage

## Development Workflow

1. Work on the `local` branch for development
2. When ready to deploy, merge changes to `master`
3. Push `master` branch to trigger deployment
4. Test the deployed application

## Support

For deployment issues, check:
- Render documentation
- Application logs in Render dashboard
- GitHub repository settings