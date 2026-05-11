# Dashboardkit React Free Admin Template[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Get%20DashboardKit%20Bootstrap%205%20Admin%20Template&url=https://dashboardkit.io&via=codedthemes&hashtags=bootstrap,webdev,developers)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Price](https://img.shields.io/badge/price-FREE-0098f7.svg)](https://github.com/codedthemes/dashboardkit-free-bootstrap-admin-template/blob/main/LICENSE)

Dashboardkit React Free Admin Template has components like Button, Badges, Breadcrumb, & Authentication pages. The code structure is highly flexible to use and modify.

Its design adapts to any screen size easily even if retina screens. It is a modern concept dashboard design with eye-catching colors.

:star: :star: :star: Support us by giving a star (Top right of this page) if you like the theme :star: :star: :star:
![Dashboardkit React Free Admin Template Preview Image](https://org-public-assets.s3.us-west-2.amazonaws.com/Free-Version-Banners/GITHUB-FREE-REACT-REPO-Dashboard+kit.jpg)

The [Pro version](https://codedthemes.com/item/dashboardkit-react-admin-template/) of Gradient able react template includes features such as Typescript, javascript, apps, authentication, advanced components, form plugins, layouts, widgets, and more.

| [Dashboardkit Free](https://codedthemes.com/item/dashboardkit-free-react-admin-template/) | [Dashboardkit](https://codedthemes.com/item/dashboardkit-react-admin-template/) |
| -------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **7** Demo pages                                                                             | **85+** Demo pages                                                                                                                                                    |
| -                                                                                            | ✓ Multi-Dashboard                                                                                                                                                     |
| -                                                                                            | ✓ Dark/Light Mode 🌓                                                                                                                                                  |
| ✓ Js                                                                                       | ✓ Ts / Js version                                                                                                                                                          |
| -                                                                                            | ✓ Multiple color options                                                                                                                                              |
| -                                                                                            | ✓ RTL                                                                                                                                                                 |
| ✓ [MIT License](https://github.com/codedthemes/dashboardkit-free-admin-template/blob/main/LICENSE)                                                                                | ✓ [Pro License](https://codedthemes.com/item/gradient-able-reactjs-admin-dashboard/?utm_source=free_demo&utm_medium=codedthemes&utm_campaign=button_download_premium) |

## Why DashboardKit?

DashboardKit offers everything needed to build an advanced dashboard application. In the initial release, we included following high-end features,

- Support React18.
- Professional user interface.
- Bootstrap React components.
- Fully responsive, all modern browser supported.
- Easy to use code structure
- Flexible & high-Performance code
- Simple documentation

## Free DashboardKit React version

#### Preview

- [Demo](https://dashboardkit.io/react/free)

## Pro version preview & Purchase

#### Preview

- [Demo](https://dashboardkit.io/react/default/)

#### Purchase

- [Get DashboardKit](https://codedthemes.com/item/dashboardkit-react-admin-template/)

## Table of contents

- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Technology Stack](#technology-stack)
- [Author](#author)
- [Issues?](#issues)
- [License](#license)
- [More Products](#more-free-react-material-admin-templates)
- [Follow us](#follow-us)

## Getting Started

1. Clone from Github

```
git clone https://github.com/codedthemes/dashboardkit-free-admin-template.git
```
2. Go into react folder

3. Install packages

```
yarn
```

4. Run project

```
yarn start
```

## Documentation

DashboardKit documentation helps you out in all aspects from Installation to deployment. Link to access [Documentation](https://codedthemes.gitbook.io/dashboardkit-react).

## Technology stack

- [Bootstrap V5](https://react-bootstrap.netlify.app/)
- Built with React Hooks API.
- Redux & React context API for state management.
- Redux toolkit.
- React Router for navigation routing.
- Support for vite.
- Code splitting.
- CSS-in-JS.

## Author

DashboardKit is managed by Team [CodedThemes](https://codedthemes.com).

## Issues

Please generate a [GitHub issue](https://github.com/codedthemes/dashboardkit-free-admin-template/issues) if you found a bug in any version. We are try our best to resolve the issue.

## License

- Licensed cover under [MIT](https://github.com/codedthemes/dashboardkit-free-admin-template/blob/main/LICENSE)

## Follow us

- Website [https://dashboardkit.io](https://dashboardkit.io)
- Gumroad [https://gumroad.com/dashboardkit](https://gumroad.com/dashboardkit)
- CodedThemes [https://codedthemes.com](https://codedthemes.com)
- Dribbble [https://dribbble.com/codedthemes](https://dribbble.com/codedthemes)
- Facebook [https://www.facebook.com/codedthemes](https://www.facebook.com/codedthemes)
- Twitter [https://twitter.com/codedthemes](https://twitter.com/codedthemes)
"# go-green-admin-panel" 
"# z_cafe_frontend" 

## Firebase Cloud Messaging (Vendor Notifications)

### 1. Environment Variables

Add these variables in your `.env` file:

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_VAPID_KEY=your_web_push_vapid_key
VITE_API_URL=https://zcafe.ekarigar.com
```

Note:
- `vite.config.mjs` is configured with `envPrefix: ['VITE_', 'FIREBASE_']`, so `FIREBASE_*` keys are available in frontend code.

### 2. Install and Run

```bash
npm install
npm start
```

Open dashboard on `localhost` or HTTPS domain.

### 3. How It Works

- Service worker file: `public/firebase-messaging-sw.js`
- Foreground + token lifecycle hook: `src/hooks/useVendorNotifications.js`
- Firebase helpers: `src/services/firebase/firebaseMessaging.js`
- UI bell dropdown: `src/layouts/AdminLayout/NavBar/NavRight/index.jsx`

### 4. Test Checklist

1. Login as vendor.
2. Click `Enable Notifications` if browser asks permission.
3. Check backend token save (`POST /userfcm-token`) is called.
4. Create customer order from customer app/backend trigger.
5. Foreground dashboard should show in-app notification + unread badge.
6. Keep tab hidden/background, then trigger order again.
7. Browser push should appear from service worker.
8. Logout should call token remove (`DELETE /remove-fcmtoken`).

### 5. Troubleshooting

- If permission is denied: enable notifications in browser site settings and retry.
- If token generation fails: use retry button from notifications dropdown.
- Ensure `FIREBASE_VAPID_KEY` is correct Web Push certificate key.
- Ensure backend accepts bearer token for `/userfcm-token` and `/remove-fcmtoken`.
