# Inventory Management

This project is an Inventory Management application built with Next.js, Firebase, and Material-UI. It allows users to manage pantry items, track inventory, and get recipe suggestions based on the available items using OpenAI API.

## Features

- User Authentication (Email/Password & Google Sign-In)
- Inventory Management (Add, Update, Delete Items)
- Recipe Suggestions based on Pantry Contents
- Smart Inventory Alerts
- Email Notifications using SendGrid

## Technologies Used

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Material-UI](https://mui.com/)
- [OpenAI API](https://beta.openai.com/)
- [SendGrid](https://sendgrid.com/)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Firebase Account
- SendGrid Account
- OpenAI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone "link"
   cd "file path"

2. npm install

3. 	Create a .env.local file in the root directory and add your API keys and configuration:
	NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
	NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
	NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
	NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
	NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
	NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
	NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

4. npm run dev

