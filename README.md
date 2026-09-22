# ChatPlug

### A voice-first AI assistant you can drop into any website

ChatPlug lets businesses build a branded AI assistant, connect it to Gemini or OpenAI, and publish it on an external website with one script tag. Visitors can speak naturally, ask questions about the business, and get guided to the right page without leaving the site.

<p align="center">
  <strong>Configure once. Embed anywhere. Talk to every visitor.</strong>
</p>

## What It Does

- Voice conversations through the browser microphone
- Spoken AI responses using browser speech synthesis
- Gemini and OpenAI provider support
- Custom assistant name, business name, tone, and visual theme
- Website-aware answers using page headings, links, navigation, and page text
- Optional voice navigation to routes such as pricing, contact, login, and billing
- Embeddable floating launcher and popup for third-party websites
- Usage limits, free and pro plans, and Razorpay billing support
- Google authentication through Firebase

## Product Flow

```text
Create account
	|
	v
Configure assistant  --->  Add provider API key
	|
	v
Copy generated script tag
	|
	v
Paste into any HTTPS website
	|
	v
Visitor speaks ---> ChatPlug reads page context ---> AI responds or navigates
```

## Architecture

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Dashboard | React, Vite, Tailwind CSS | Authentication, assistant builder, billing, preview |
| API | Node.js, Express | Authentication, assistant configuration, AI requests, billing |
| Data | MongoDB, Mongoose | Users, assistant settings, plans, usage, website pages |
| Authentication | Firebase Auth | Google sign-in on the dashboard |
| AI providers | Google Gemini, OpenAI | Generate assistant responses |
| Payments | Razorpay | Orders and subscription checkout |
| Embed | Vanilla JavaScript and CSS | Independent widget loaded on customer websites |

## Repository Layout

```text
.
├── backend/
│   ├── Controllers/       Request handlers and assistant logic
│   ├── Middleware/        Authentication middleware
│   ├── Models/            Mongoose models
│   ├── Routes/            API routes
│   ├── configs/           Database, AI, token, and payment setup
│   └── index.js           Express server entry point
├── frontend/
│   ├── public/
│   │   ├── assistant.js   Standalone embeddable widget
│   │   └── assistant.css  Widget styles
│   └── src/
│       ├── components/    Shared UI components
│       └── pages/         Home, login, builder, and billing screens
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB database
- Firebase project with Google sign-in enabled
- Gemini API key or OpenAI API key for assistant responses
- Razorpay credentials if billing is enabled

## Local Development

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure the backend

Create `backend/.env`:

```env
PORT=8000
MONGODB_URL=mongodb://127.0.0.1:27017/chatplug
JWT_SECRET=replace-with-a-long-random-secret
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

Provider API keys are stored per user through the Assistant Builder. They are not hard-coded into the repository.

### 3. Configure Firebase

Create `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=your-firebase-web-api-key
```

Enable Google authentication in Firebase Authentication before signing in locally.

### 4. Start the applications

In terminal 1:

```bash
cd backend
npm run dev
```

In terminal 2:

```bash
cd frontend
npm run dev
```

The dashboard runs at `http://localhost:5173`. The API uses the port configured in `backend/.env`.

## Embedding ChatPlug

The Assistant Builder generates the exact tag for each assistant. It follows this format:

```html
<script
  src="https://ai-virtual-assistant-ukw3.onrender.com/assistant.js"
  data-user-id="YOUR_USER_ID"
  data-backend-url="https://ai-virtual-assistant-backend-mqd6.onrender.com"
></script>
```

Paste the tag into the external website, preferably immediately before its closing `</body>` tag. The widget loads its own CSS and assets from the script host, so it does not require React, Tailwind, or any code from the dashboard application.

### Embed requirements

- The host site must allow third-party JavaScript.
- Use HTTPS in production. Browsers restrict microphone access on insecure origins.
- Visitors must grant microphone permission when prompted.
- The generated `data-user-id` must belong to the configured assistant.
- If you update the deployed widget, hard refresh the host website to clear cached assets.

### What the widget reads

Before sending a question, the widget collects limited page context from the host page:

- Page title and current URL
- Headings
- Visible page text, limited to 8,000 characters
- Labeled links and navigation candidates

This lets the assistant answer in the context of the website where it is embedded. Do not embed it on pages containing sensitive information that should be sent to your configured AI provider.

## API Surface

Public assistant endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/assistant/config/:userId` | Load public assistant configuration |
| `POST` | `/api/assistant/ask` | Submit a visitor message and page context |

Dashboard endpoints are protected with authentication cookies. The assistant endpoints use public CORS because they are called from external websites.

## Production Build

Build the frontend for deployment:

```bash
cd frontend
npm run build
```

Useful frontend commands:

```bash
npm run dev       # Start Vite development server
npm run build     # Create production bundle
npm run preview   # Preview the production bundle
npm run lint      # Run ESLint
```

Start the backend in production with:

```bash
cd backend
node index.js
```

Deploy the frontend and backend as separate services. The public URLs must match the URLs used by the dashboard constants and the generated embed tag. After changing those URLs, rebuild and redeploy the frontend.

## Security Notes

- Never commit `.env` files or provider API keys.
- Use a strong, unique `JWT_SECRET` in production.
- Restrict private CORS origins to trusted dashboard domains.
- Review the page context sent to AI providers before embedding on authenticated or sensitive pages.
- Configure rate limits and monitoring before exposing the API to high-volume traffic.
- Rotate provider, database, payment, and JWT credentials if they are ever exposed.

## Troubleshooting

### The popup does not appear

Confirm that:

1. The script URL returns `200` in the browser.
2. The script has a valid `data-user-id`.
3. The script is loaded after the page or is allowed to wait for `DOMContentLoaded`.
4. The browser console has no Content Security Policy error.
5. The host page is not blocking the widget with an iframe or script policy.

### The assistant appears but does not answer

Check that:

1. The backend URL is reachable.
2. The assistant has a valid Gemini or OpenAI key.
3. The user still has available messages on the current plan.
4. The browser microphone permission is enabled.
5. The deployed backend can connect to MongoDB.

## License

This project is currently private and does not include an open-source license.
