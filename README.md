# Getting Started with PWA (React Project) 

This is a PWA project for code generator. In this Readme file,
following is the instructions and resources to convert a react project into Progressive Web Application (PWA).


## Resources -

1.  [You Tube](https://youtu.be/RvEEZLxiAlQ)
2.  [Make manifest file](https://app-manifest.firebaseapp.com/)
3.  [Favicon](https://favicon.io/favicon-converter/)
4.  [Maskable Icon](https://maskable.app/editor)


## Creating PWA with template

    ```npx create-react-app <app_name> --template cra-template-pwa```

-   Create the service-worker.js and serviceWorkerRegistration.js 
    and import it in `index.js`.
    Make sure to change `unregister` to `register`.