<template>
<div>
    <h1>Welcome to BubbleBoard</h1>

    <p v-if="loading">Checking session...</p>

    <div v-else>
        <p v-if="userEmail">
        You're signed in as <strong>{{ userEmail }}</strong>
        </p>
        <p v-else>Not signed in</p>

        <button v-if="!userEmail" @click="handleSignIn">Sign in</button>
        <button v-else @click="handleSignOut">Sign out</button>
    </div>
</div>
</template>

<script>
import {
signInWithRedirect,
signOut,
fetchAuthSession,
} from "aws-amplify/auth";

export default {
data() {
    return {
        userEmail: null,
        loading: true,
    };
},

async mounted() {
    await this.refreshAuthState();
},

  // When you come back to "/" after login, refresh state
watch: {
    $route() {
        this.refreshAuthState();
    },
},

methods: {
    async refreshAuthState() {
        this.loading = true;
        this.userEmail = null;

        try {
            const session = await fetchAuthSession();

            const idToken = session.tokens?.idToken
            if (!idToken) {
                this.loading = false
                return
            }

            // Pull email directly from the ID token payload
            const payload = idToken.payload || {}
            this.userEmail = payload.email || payload["cognito:username"] || "(signed in)"
        } catch (e) {
            console.log("refreshAuthState error:", e)
            this.userEmail = null
        } finally {
            this.loading = false
        }
    },

    async handleSignIn() {
        try {
        await signInWithRedirect();
        } catch (e) {
        // If already signed in, just refresh UI
        if (String(e).includes("UserAlreadyAuthenticatedException")) {
            await this.refreshAuthState();
            return;
        }
        console.error(e);
        }
    },

    async handleSignOut() {
        await signOut({ global: true });
        this.userEmail = null;

      // Force a clean reload (helps a lot during dev)
        window.location.href = "https://bubbleboard.click/";
    },
},
};
</script>