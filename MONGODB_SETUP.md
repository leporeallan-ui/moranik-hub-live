# MongoDB Connection Setup

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Sign Up for Free"
3. Create account or use Google/GitHub login

## Step 2: Create Free Cluster
1. Click "Create" → "Build a Database"
2. Choose **M0 (FREE)** tier
3. Select **AWS** region closest to you
4. Click "Create Cluster" (takes 2-3 minutes)

## Step 3: Set Up Database Access
1. Go to "Security" → "Database Access"
2. Click "Add New Database User"
3. Set username: `moranik_user`
4. Set password: Create a strong password (save it!)
5. Database User Privileges: **Atlas Admin**
6. Click "Add User"

## Step 4: Whitelist IP Address
1. Go to "Security" → "Network Access"
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0)
4. Click "Confirm"

## Step 5: Get Connection String
1. Go to "Clusters" → Click "Connect"
2. Choose "Drivers" → "Node.js"
3. Copy the connection string
4. Replace `<username>` with `moranik_user`
5. Replace `<password>` with your database password

Example:
```
mongodb+srv://moranik_user:YourPasswordHere@cluster0.mongodb.net/moranik-hub?retryWrites=true&w=majority
```

## Step 6: Save to Environment Variables
Add this to your `backend/.env` file:
```
MONGODB_URI=mongodb+srv://moranik_user:YourPasswordHere@cluster0.mongodb.net/moranik-hub?retryWrites=true&w=majority
```

## Step 7: Create Database Collections
Collections will be auto-created when code runs, but you can create them manually:
1. Go to "Collections"
2. Create database: `moranik-hub`
3. Collections will auto-create:
   - users (user accounts)
   - tokens (reset tokens)
   - admins (admin accounts)

That's it! Your free MongoDB is ready.

## Free Tier Limits
- **Storage**: 512 MB (enough for 10,000+ users)
- **Data Transfer**: Unlimited
- **Connections**: Up to 500 concurrent
- **Perfect for**: Development, testing, and small production apps
- **Cost**: FREE forever (as long as under limits)

## If You Need More Storage Later
Upgrade to M2 tier ($9/month) for 10GB storage.
