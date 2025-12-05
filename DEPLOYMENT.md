# Deployment Guide

This guide covers how to deploy the Machine Monitoring application to production.

## 1. Database Deployment (MongoDB Atlas)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  Create a new **Cluster** (Shared/Free tier is sufficient).
3.  **Network Access**: Whitelist `0.0.0.0/0` (allow access from anywhere) so your backend server can connect.
4.  **Database Access**: Create a database user with a password.
5.  **Connect**: Click "Connect" -> "Drivers" -> Copy the connection string.
    *   It looks like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
    *   Replace `<password>` with your actual database user password.
    *   **Save this connection string**, you will need it for the Backend deployment.

---

## 2. Backend Deployment (Render)

We will use [Render](https://render.com/) to host the NestJS backend.

1.  Push your code to GitHub (if you haven't already).
2.  Log in to Render and click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository.
4.  **Configuration**:
    *   **Name**: `machine-monitoring-backend`
    *   **Root Directory**: `backend` (Important!)
    *   **Runtime**: `Node`
    *   **Build Command**: `pnpm install && npm run build`
    *   **Start Command**: `npm run start:prod`
5.  **Environment Variables** (Advanced Section):
    Add the following variables:
    *   `MONGODB_URI`: Paste your MongoDB Atlas connection string from Step 1.
    *   `JWT_SECRET`: A long, random strinxxg (e.g., generated via `openssl rand -hex 32`).
    *   `JWT_EXPIRATION`: `1h` (or your preferred duration).
    *   `FRONTEND_URL`: Leave this blank for now, we will update it after deploying the frontend.
    *   `PORT`: `3002` (Render will automatically override this, but good to set).
6.  Click **"Create Web Service"**.
7.  Wait for the deployment to finish. Render will give you a URL (e.g., `https://machine-monitoring-backend.onrender.com`). **Copy this URL.**

---

## 3. Frontend Deployment (Vercel)

We will use [Vercel](https://vercel.com/) to host the Next.js frontend.

1.  Log in to Vercel and click **"Add New..."** -> **"Project"**.
2.  Import your GitHub repository.
3.  **Configuration**:
    *   **Framework Preset**: Next.js (should be auto-detected).
    *   **Root Directory**: Click "Edit" and select `frontend`.
4.  **Environment Variables**:
    Add the following variable:
    *   `NEXT_PUBLIC_API_URL`: Paste your Backend URL from Step 2 (e.g., `https://machine-monitoring-backend.onrender.com`).
        *   *Note: Do not add a trailing slash `/`.*
5.  Click **"Deploy"**.
6.  Wait for the deployment to finish. Vercel will give you a URL (e.g., `https://machine-monitoring-frontend.vercel.app`). **Copy this URL.**

---

## 4. Final Configuration

Now that you have the Frontend URL, go back to your Backend deployment to configure CORS.

1.  Go to your **Render Dashboard** -> Select your Backend service.
2.  Go to **"Environment"**.
3.  Add/Update the `FRONTEND_URL` variable:
    *   `FRONTEND_URL`: Paste your Vercel Frontend URL (e.g., `https://machine-monitoring-frontend.vercel.app`).
4.  **Save Changes**. Render will automatically redeploy your backend.

## 🎉 Done!

Your application is now live!
- **Frontend**: Access via your Vercel URL.
- **Backend**: Running on Render, connected to MongoDB Atlas.
