<template>
    <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
            <div class="card shadow border-0 bubble-card">
                <div class="card-body p-4">
                    <h1 class="card-title mb-3 bubble-title">Welcome to BubbleBoard</h1>

                    <p v-if="loading" class="text-light">Checking session...</p>

                    <div v-else>
                        <div v-if="userEmail" class="alert bubble-alert-success">
                            You're signed in as <strong>{{ userEmail }}</strong>
                        </div>

                        <div v-else class="alert bubble-alert-secondary">
                            Not signed in
                        </div>

                        <div class="d-flex gap-2 flex-wrap">
                            <button v-if="!userEmail" @click="handleSignIn" class="btn bubble-btn-primary">
                                Sign in
                            </button>

                            <button v-else @click="handleSignOut" class="btn bubble-btn-outline">
                                Sign out
                            </button>

                            <router-link to="/dashboard" class="btn bubble-btn-secondary"
                                :class="{ disabled: !userEmail }" :tabindex="!userEmail ? -1 : 0"
                                :aria-disabled="!userEmail ? 'true' : 'false'" @click="blockDashboardIfSignedOut">
                                Go to Dashboard
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
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
                const idToken = session.tokens?.idToken;

                if (!idToken) {
                    this.loading = false;
                    return;
                }

                const payload = idToken.payload || {};
                this.userEmail =
                    payload.email || payload["cognito:username"] || "(signed in)";
            } catch {
                this.userEmail = null;
            } finally {
                this.loading = false;
            }
        },

        async handleSignIn() {
            try {
                const session = await fetchAuthSession().catch(() => null);
                if (session?.tokens?.idToken) {
                    await this.refreshAuthState();
                    return;
                }
                await signInWithRedirect();
            } catch (e) {
                console.error(e);
            }
        },

        async handleSignOut() {
            await signOut({ global: true });
            this.userEmail = null;
            window.location.href = "https://bubbleboard.click/";
        },

        blockDashboardIfSignedOut(event) {
            if (!this.userEmail) {
                event.preventDefault();
            }
        },
    },
};
</script>