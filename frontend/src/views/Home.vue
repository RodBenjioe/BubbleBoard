<template>
    <div>
        <h1>BubbleBoard</h1>
        <p>Welcome to BubbleBoard</p>
        
        <p>
            <a :href="loginUrl">Log in</a>
            |
            <button @click="logout">Log out</button>
        </p>
    </div>
</template>

<script>
export default {
    data() {
        return { //
            domain: "https://us-west-282bustkgj.auth.us-west-2.amazoncognito.com",
            clientId: "4p1vju94ejtl5aa5p2p9jkrte0",
            loginRedirectUri: "https%3A%2F%2Fbubbleboard.click%2Fauth",
            logoutRedirectUri: "https://bubbleboard.click/"
        }
    },
    computed: {
        loginUrl() {
            return (
                `${this.domain}/login` +
                `?client_id=${this.clientId}` +
                `&response_type=code` +
                `&scope=email+openid+phone` +
                `&redirect_uri=${this.loginRedirectUri}`
            )
        },
        logoutUrl() {
            return (
                `${this.domain}/logout` +
                `?client_id=${this.clientId}` +
                `&logout_uri=${encodeURIComponent(this.logoutRedirectUri)}`
            )
        }
    },
    methods: {
        logout() {
            // clears the local session flag
            localStorage.removeItem("bb_logged_in")

            // redirects to Cognito logout
            window.location.href = this.logoutUrl
        }
    }
}
</script>