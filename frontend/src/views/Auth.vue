<template>
    <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
            <div class="card shadow border-0 bubble-card text-center">
                <div class="card-body p-5">
                    <h2 class="bubble-title mb-3">Signing you in...</h2>

                    <div class="spinner-border bubble-spinner mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>

                    <p class="text-light mb-0">Redirecting to your dashboard</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    async mounted() {
        setTimeout(() => {
            this.$router.push("/dashboard");
        }, 1500);
    },
};
</script>