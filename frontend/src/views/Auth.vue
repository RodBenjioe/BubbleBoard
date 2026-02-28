<template>
    <div>
        <h1>Auth Callback</h1>
        <p v-if="code">Login Successful!! Redirecting to dashboard...</p>
        <p v-else>No code found</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            code: null
        }
    },
    mounted() {
        const params = new URLSearchParams(window.location.search)
        this.code = params.get("code")

        if (this.code) {
            // marks user as logged in
            localStorage.setItem("bb_logged_in", "true")

            // redirect to dashboard after a short moment
            setTimeout(() => {
                this.$router.push("/dashboard")
            }, 500)
        }
    }
}
</script>