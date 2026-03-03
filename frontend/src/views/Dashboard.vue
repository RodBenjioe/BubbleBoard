<template>
<div>
    <h1>Dashboard</h1>

    <div style="margin-bottom: 20px;">
        <label>Min:</label>
        <input v-model="min" type="number" />

        <label>Max:</label>
        <input v-model="max" type="number" />

        <label>Count:</label>
        <input v-model="count" type="number" />

        <button @click="generateNumbers">Generate</button>
    </div>

    <div v-if="numbers.length">
        <h3>Generated Numbers:</h3>
        <pre>{{ numbers }}</pre>
    </div>

    <hr />

    <div v-if="history.length">
        <h3>Your Last Runs</h3>
        <div v-for="run in history" :key="run.createdAt" style="margin-bottom: 10px;">
        <strong>{{ run.createdAt }}</strong><br />
        Range: {{ run.min }} - {{ run.max }} | Count: {{ run.count }}<br />
        Numbers: {{ run.numbers }}
        </div>
    </div>
</div>
</template>

<script>
import { fetchAuthSession } from "aws-amplify/auth";

export default {
data() {
    return {
        min: 0,
        max: 100,
        count: 5,
        numbers: [],
        history: [],
        apiBase: "https://g1fy1zpjo2.execute-api.us-west-2.amazonaws.com/prod"
    };
},

async mounted() {
    await this.loadHistory();
},

methods: {
    async getAccessToken() {
        const session = await fetchAuthSession();
        return session.tokens?.accessToken?.toString();
    },

    async generateNumbers() {
        try {
        const token = await this.getAccessToken();

        // 1️⃣ Call /random
        const response = await fetch(
            `${this.apiBase}/random?min=${this.min}&max=${this.max}&count=${this.count}`,
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

        if (!response.ok) throw new Error("Random API failed");

        this.numbers = await response.json();

        // 2️⃣ Save run to DynamoDB
        await fetch(`${this.apiBase}/runs`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
            min: this.min,
            max: this.max,
            count: this.count,
            numbers: this.numbers
            })
        });

        // 3️⃣ Refresh history
        await this.loadHistory();

        } catch (error) {
        console.error("Error:", error);
        }
    },

    async loadHistory() {
        try {
        const token = await this.getAccessToken();

        const response = await fetch(`${this.apiBase}/runs`, {
            headers: {
            Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) return;

        const data = await response.json();
        this.history = data.items || [];

            } catch (error) {
        console.error("History load error:", error);
            }
        }
    }
};
</script>