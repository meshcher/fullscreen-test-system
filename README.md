# Fullscreen Test System with Violation Tracking

A complete web-based testing system with fullscreen enforcement, violation tracking, and admin dashboard.

## Features

### For Students:
- ✅ Secure login with name and email
- ✅ Fullscreen-only test taking
- ✅ Countdown timer with auto-submit
- ✅ Multiple choice questions
- ✅ Real-time violation tracking
- ✅ Instant results with score and violations

### For Administrators:
- 📊 Admin dashboard with all results
- 📈 Statistics: average score, total violations, average time
- 👁️ Detailed view of each student's answers and violations
- 📥 CSV export for further analysis
- 🔄 Auto-refresh every 30 seconds

### Violation Detection:
- Detects when student exits fullscreen (ESC key)
- Detects when student switches to another app (Cmd+Tab)
- Detects when student switches desktops (Mission Control)
- Records timestamp and duration of each violation
- Shows warning modal when student returns

## Quick Start (Local Testing)

1. **Install dependencies:**
   ```bash
   cd fullscreen-test-system
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Access the system:**
   - Student test: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin.html
   - Admin password: `admin123`

## Customizing Test Questions

Edit the `TEST_CONFIG` object in `server.js` (lines 36-70):

```javascript
const TEST_CONFIG = {
    title: "Your Test Title",
    duration: 30, // minutes
    questions: [
        {
            id: 1,
            question: "Your question here?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct: 0 // Index of correct answer (0-3)
        },
        // Add more questions...
    ]
};
```

## Deploying to Production

### Option 1: Vercel (Recommended - Free)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd fullscreen-test-system
   vercel
   ```

3. **Follow the prompts:**
   - Set up and deploy: Yes
   - Project name: fullscreen-test-system
   - Directory: ./
   - Override settings: No

4. **You'll get a URL like:**
   - https://fullscreen-test-system.vercel.app

5. **Share with students:**
   - Test: https://your-app.vercel.app
   - Admin: https://your-app.vercel.app/admin.html

**Note:** For Vercel, you may need to add a `vercel.json` file for proper Node.js support.

### Option 2: Heroku

1. **Install Heroku CLI:**
   ```bash
   brew tap heroku/brew && brew install heroku
   ```

2. **Login and create app:**
   ```bash
   heroku login
   heroku create your-test-system
   ```

3. **Deploy:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

4. **Open app:**
   ```bash
   heroku open
   ```

### Option 3: Render

1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repo or upload files
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Deploy

### Option 4: Simple VPS (DigitalOcean, AWS, etc.)

1. **SSH into your server:**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Upload files and install:**
   ```bash
   cd /var/www
   git clone your-repo
   cd fullscreen-test-system
   npm install
   ```

4. **Run with PM2 (process manager):**
   ```bash
   sudo npm i -g pm2
   pm2 start server.js
   pm2 save
   pm2 startup
   ```

5. **Set up Nginx reverse proxy (optional):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       location / {
           proxy_pass http://localhost:3000;
       }
   }
   ```

## Security Considerations

### For Production Use:

1. **Change Admin Password:**
   Edit line 72 in `server.js`:
   ```javascript
   const ADMIN_PASSWORD = "your-secure-password";
   ```

2. **Add HTTPS:**
   - Use Cloudflare, Let's Encrypt, or your hosting provider's SSL

3. **Add Proper Authentication:**
   - Replace simple password with JWT tokens
   - Add user roles (admin, student)
   - Hash passwords in database

4. **Use Real Database:**
   - Replace JSON file storage with MongoDB, PostgreSQL, or MySQL
   - Add proper data validation

5. **Add Rate Limiting:**
   - Prevent brute force attacks
   - Use express-rate-limit

6. **Environment Variables:**
   Create `.env` file:
   ```
   PORT=3000
   ADMIN_PASSWORD=your-password
   DATABASE_URL=your-database-url
   ```

## File Structure

```
fullscreen-test-system/
├── server.js              # Backend API server
├── package.json           # Dependencies
├── data/                  # Storage (created automatically)
│   ├── users.json        # Student accounts
│   ├── sessions.json     # Test sessions
│   └── results.json      # Test results
└── public/
    ├── index.html        # Student test interface
    └── admin.html        # Admin dashboard
```

## API Endpoints

- `GET /api/test/config` - Get test questions (without answers)
- `POST /api/student/login` - Student login/register
- `POST /api/test/submit` - Submit test answers
- `POST /api/violation/log` - Log a violation
- `GET /api/admin/results?password=xxx` - Get all results (admin only)

## Troubleshooting

### Students can't access the test:
- Make sure server is running
- Check firewall settings
- Verify URL is correct

### Fullscreen not working:
- Some browsers require user interaction before allowing fullscreen
- On mobile, fullscreen may not be fully supported

### Violations not being detected:
- Check browser console for errors
- Ensure JavaScript is enabled
- Try in Chrome or Firefox (best support)

### Data not saving:
- Check `data/` directory permissions
- Verify server has write access

## Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari (macOS)
- ✅ Edge
- ⚠️ Mobile browsers (limited fullscreen support)

## Future Enhancements

- [ ] Add user authentication with passwords
- [ ] Support different types of questions (text, multiple choice, true/false)
- [ ] Add test scheduling (start/end dates)
- [ ] Email results to students
- [ ] Webcam proctoring
- [ ] Screen recording
- [ ] Database migration from JSON to SQL/NoSQL
- [ ] Multi-language support
- [ ] Randomize question order
- [ ] Question pools

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Default Admin Password:** `admin123` (⚠️ CHANGE THIS IN PRODUCTION!)
