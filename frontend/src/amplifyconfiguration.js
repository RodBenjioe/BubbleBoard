const awsconfig = {
    Auth: {
        Cognito: {
            region: "us-west-2",
            userPoolId: "us-west-2_82BUSTkgJ",
            userPoolClientId: "4p1vju94ejtl5aa5p2p9jkrte0",
            userPoolDomain: "us-west-282bustkgj.auth.us-west-2.amazoncognito.com",
            loginWith: {
                oauth: {
                    domain: "us-west-282bustkgj.auth.us-west-2.amazoncognito.com",
                    scopes: ["email", "openid", "profile"],
                    redirectSignIn: ["https://bubbleboard.click/auth"],
                    redirectSignOut: ["https://bubbleboard.click/"],
                    responseType: "code",
                },
            },
        },
    },
};

export default awsconfig;