# Student Attendance - One QR Per Student, Subject-wise Attendance

GitHub Pages compatible static attendance application.

## Features

- Teacher login
- Student management
- Student QR generation
- Subject management
- Subject/session QR generation
- Subject-wise attendance
- Multiple subjects on the same date
- Camera QR scanner
- Attendance percentage reports
- Excel export
- PDF export
- JSON backup/restore
- PNG QR download
- Email app integration

## Login

Default demo credentials:

Username: `Harsha`
Password: `Harsha@31`

Change these values in `app.js` before deployment if needed.

## GitHub Pages

1. Push all files to a GitHub repository.
2. GitHub → Settings → Pages.
3. Source: Deploy from branch.
4. Branch: `main`, folder `/ (root)`.
5. Open the HTTPS GitHub Pages URL.

Camera access requires HTTPS.

## Important limitation

This version uses browser `localStorage`. It is intended for a teacher/device based workflow.

Different phones and computers do NOT share the same localStorage database.

For a workflow where students scan the teacher QR on their own phones and the attendance immediately appears on the teacher's device, a shared cloud database/backend is required.

## Email limitation

GitHub Pages cannot securely send an email attachment by itself.

The Email QR buttons download the PNG and open the user's mail application with a prepared message. The downloaded PNG must be attached manually.

Do not put SMTP passwords or secret API keys in frontend JavaScript.

## Libraries

The application loads these libraries from CDNs:

- QRCode.js
- html5-qrcode
- SheetJS/XLSX
- jsPDF


## Updated attendance workflow

1. Add students. Each student receives one permanent personal QR code.
2. Add subjects.
3. Open **Attendance** and select the subject.
4. Click **Start Attendance**.
5. Scan students' personal QR codes. No new QR is generated per subject.
6. A student cannot be marked twice for the same subject on the same date.
7. Open **Reports** and filter by subject, student, and from/to dates.
8. Export the filtered subject-wise report to Excel or PDF.

Attendance records store the student, selected subject, session/date, time and status.


## Install as a mobile PWA (Android)

This project is an installable Progressive Web App (PWA), not a compiled APK. It can be installed from Chrome on Android when hosted on HTTPS (for example GitHub Pages).

1. Deploy the project to GitHub Pages or another HTTPS static host. Do not open it directly as a `file://` page.
2. On Android, open the website in Chrome while online.
3. Visit the site once online so the app shell and CDN libraries can be cached.
4. Chrome menu (⋮) → **Install app** or **Add to Home screen**.
5. Open it from the home-screen icon. Core pages can load offline after caching.

### Offline and device storage

- Attendance data is stored in browser `localStorage` on each device.
- Mobile and computer do not automatically share records.
- Use the JSON backup/restore workflow to transfer data between your own devices.
- The service worker caches the app shell and assets fetched while online. For best results, open all features once online before going offline.
- Camera scanning requires browser camera permission and HTTPS. Browser/device restrictions may affect camera access in installed PWA mode.

### Manual Google Drive backup

1. In the app, go to **Backup → Download Database Backup**.
2. Open [Google Drive](https://drive.google.com/drive/my-drive).
3. Choose **New → File upload** and upload the downloaded `attendance_backup_YYYY-MM-DD.json`.
4. To restore on another personal device, download the JSON from Drive, open the app, go to **Backup → Restore Backup**, and select it.

This is a manual backup workflow. No Google Drive API integration or automatic synchronization is included. Protect backup files because they contain student data.

### PWA limitations

- PWA installation requires HTTPS (or localhost for development).
- First visit and first-time downloads of external CDN libraries require internet. The service worker caches those assets as they are successfully fetched; test offline after opening the app and features online once.
- This project does not create an Android APK. If an APK is required later, use a native wrapper such as Capacitor and build it with Android Studio.
