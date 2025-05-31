const api_host = 'https://firebase';
export const environment = {
    apiServer: api_host + '/api',
    filesServer: api_host,
    production: false,
};

export const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};
