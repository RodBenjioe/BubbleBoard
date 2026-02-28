<template>
    <div>
        <h1>Dashboard</h1>

    <div>
        <label>
            Min:
            <input type="number" v-model.number="min" />
        </label>

        <label>
            Max:
            <input type="number" v-model.number="max" />
        </label>

        <label>
            Count:
            <input type="number" v-model.number="count"/>
        </label>

        <button @click="getNumbers" :disabled="loading">
            {{ loading ? "Generating..." : "Generate" }}
        </button>
    </div>

    <div v-if="numbers.length">
        <h2>Results</h2>
        <p>{{ numbers.join(", ") }}</p>

        <h3>Stats</h3>
        <p>Min: {{ stats.min }}</p>
        <p>Max: {{ stats.max }}</p>
        <p>Average: {{ stats.avg.toFixed(2) }}</p>
    </div>

        <p v-if="error" style="color: red">{{ error }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            min: 0,
            max: 100,
            count: 5,

            numbers: [],
            error: null,
            loading: false,

            // API gateway base
            apiBase: "https://g1fy1zpjo2.execute-api.us-west-2.amazonaws.com/prod"
        };
    },
    computed: {
        stats() {
            if (!this.numbers.length) return { min: 0, max: 0, avg: 0}
            const min = Math.min(...this.numbers)
            const max = Math.max(...this.numbers)
            const avg =
                this.numbers.reduce((a, b) => a + b, 0) / this.numbers.length
            return { min, max, avg };
        }
    },

    methods: {
        async getNumbers() {
            this.error = null

            if (this.min >= this.max) {
                this.error = "Min must be less than Max.";
                return;
            }
            if (this.count < 1 || this.count > 100) {
                this.error = "Count must be between 1 and 100";
                return;
            }

            this.loading = true;

            try {
                const url = `${this.apiBase}/random` +
                `?min=${encodeURIComponent(this.min)}` +
                `&max=${encodeURIComponent(this.max)}` +
                `&count=${encodeURIComponent(this.count)}`;
                const res = await fetch(url);

                if (!res.ok) throw new Error(`API request failed: ${res.status}`);

                const data = await res.json()
                this.numbers = data
            } catch (err) {
                console.error(err)
                this.error = "Failed to fetch numbers (Check CORS or API status)."
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>

<script setup>
import { ref, onMounted } from 'vue'

const loggedIn = ref(false)

onMounted(() => {
    loggedIn.value =
localStorage.getItem('bb_logged_in')
=== 'true'
})
</script>