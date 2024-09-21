# SnapLinkr 📸🔗

A scalable image-sharing application where users can upload, group, and share images via a single link, with automatic expiration handling.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Monorepo Structure](#monorepo-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Overview
SnapLinkr allows users to easily upload multiple images, set an expiry time, and generate a single sharable link for a group of images. Images are stored securely in the file system, and the backend manages automatic deletion after expiry. Built using **TurboRepo** for efficient development, the project consists of two apps:
- **Web**: A user-friendly frontend for image uploads and link sharing.
- **Server**: The backend API for handling file uploads, image storage, and expiration management.

## Tech Stack

### Web (Frontend)
- **React** with **TypeScript**
- **Shadcn** UI Components
- **Vite** for fast builds and development

### Server (Backend)
- **Node.js** with **Express**
- **Multer** for handling file uploads
- **TypeScript** for type safety
- **PostgreSQL** with **Prisma** for metadata storage

### Tools
- **TurboRepo**: Monorepo management for faster and organized development.
- **PostgreSQL**: Database to store image metadata and expiry times.

## Features
- Upload up to 20 images at once (20MB max per image).
- Generate a single sharable link for grouped images.
- Set an expiry time for the images.
- Automatic image deletion after the expiry period.
- Responsive and modern UI using Shadcn components.

## Monorepo Structure
This project uses **TurboRepo** to manage the codebase efficiently, keeping the `web` (frontend) and `server` (backend) apps separate but interconnected.

## Getting Started

### Prerequisites
- **Node.js** (v16+)
- **Yarn** or **npm**
- **PostgreSQL** (ensure you have a running instance)
