<template>
    <div>
        <h1>Signing you in...</h1>
        <p v-if="error" style="color: red">{{ error }}</p>
    </div>
</template>

<script>
import { getCurrentUser } from "aws-amplify/auth"

export default {
    data() {
        return { error: null }
    },
    async mounted() {
        try {
            await getCurrentUser()
            this.$router.replace("/dashboard")
        } catch (e) {
            console.error(e)
            this.error = "Sign-in failed. Try again"
        }
    }
}
</script>