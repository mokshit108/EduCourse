# Production Configuration Guide

## Environment Variables Setup for Render

### Automatic Configuration
The `render.yaml` file automatically configures most environment variables. However, you may need to manually set some sensitive values in the Render dashboard.

### Backend Environment Variables

| Variable | Description | Auto-configured | Manual Setup Required |
|----------|-------------|-----------------|----------------------|
| `NODE_ENV` | Environment mode | ✅ Yes | ❌ No |
| `PORT` | Server port | ✅ Yes | ❌ No |
| `DATABASE_URL` | PostgreSQL connection | ✅ Yes | ❌ No |
| `JWT_SECRET` | JWT signing secret | ✅ Yes (auto-generated) | ❌ No |
| `FRONTEND_URL` | Frontend URL for CORS | ✅ Yes | ⚠️ Update if needed |
| `DATABASE_CONNECTION_LIMIT` | DB connection pool | ✅ Yes | ❌ No |
| `DATABASE_TIMEOUT` | DB timeout (ms) | ✅ Yes | ❌ No |
| `BCRYPT_ROUNDS` | Password hashing rounds | ✅ Yes | ❌ No |

### Frontend Environment Variables

| Variable | Description | Auto-configured | Manual Setup Required |
|----------|-------------|-----------------|----------------------|
| `NODE_ENV` | Environment mode | ✅ Yes | ❌ No |
| `NEXT_PUBLIC_GRAPHQL_URL` | Backend GraphQL endpoint | ✅ Yes | ❌ No |
| `NEXT_PUBLIC_APP_NAME` | Application name | ✅ Yes | ❌ No |
| `NEXT_PUBLIC_APP_VERSION` | App version | ✅ Yes | ❌ No |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Analytics flag | ✅ Yes | ❌ No |
| `NEXT_PUBLIC_ENABLE_DEBUG` | Debug mode flag | ✅ Yes | ❌ No |

## Manual Configuration Steps

### 1. Custom JWT Secret (Optional)
If you want to use a custom JWT secret instead of auto-generated:

1. Generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```

2. In Render dashboard:
   - Go to your backend service
   - Navigate to Environment tab
   - Update `JWT_SECRET` with your custom value

### 2. Custom Domain Setup (Optional)
If you have custom domains:

1. Update `FRONTEND_URL` in backend service
2. Update `NEXT_PUBLIC_GRAPHQL_URL` in frontend service

### 3. Database Migration
After deployment, run database migrations:

1. Go to your backend service in Render
2. Open the Shell tab
3. Run:
   ```bash
   cd backend && npx prisma db push
   cd backend && npx prisma db seed
   ```

## Service URLs
After deployment, your services will be available at:

- **Backend**: `https://edtech-backend.onrender.com`
- **Frontend**: `https://edtech-frontend.onrender.com`
- **GraphQL Playground**: `https://edtech-backend.onrender.com/graphql`

## Security Considerations

### Production Security Checklist
- ✅ JWT_SECRET is secure and unique
- ✅ Database credentials are managed by Render
- ✅ CORS is configured for your frontend domain
- ✅ Environment variables are not exposed in client-side code
- ✅ HTTPS is enforced (automatic with Render)

### Additional Security (Recommended)
- Set up database backups
- Configure monitoring and alerts
- Implement rate limiting
- Set up SSL certificate monitoring
- Configure security headers

## Monitoring and Maintenance

### Health Checks
Both services include basic health checks:
- Backend: `GET /health` (if implemented)
- Frontend: Next.js built-in health checks

### Logs
Access logs through Render dashboard:
- Real-time logs in the service dashboard
- Download historical logs
- Set up log alerts for errors

### Performance Monitoring
- Monitor response times
- Track database query performance
- Monitor memory and CPU usage
- Set up uptime monitoring

## Troubleshooting

### Common Issues
1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database service is running
   - Check connection limits

2. **CORS Errors**
   - Verify FRONTEND_URL is correct
   - Check if frontend domain changed

3. **Build Failures**
   - Check build logs in Render dashboard
   - Verify all dependencies are listed in package.json
   - Check Node.js version compatibility

4. **Environment Variable Issues**
   - Verify all required variables are set
   - Check for typos in variable names
   - Ensure NEXT_PUBLIC_ prefix for client-side variables

### Getting Help
- Check Render documentation
- Review application logs
- Check GitHub repository issues
- Contact support if needed