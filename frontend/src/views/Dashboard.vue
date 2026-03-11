<template>
    <div>
        <h1 class="bubble-title mb-4">Dashboard</h1>

        <div class="card shadow border-0 bubble-card mb-4">
            <div class="card-body">
                <h5 class="mb-3">Generate Random Data</h5>

                <div class="row g-3 align-items-end">
                    <div class="col-md-3">
                        <label class="form-label">Min</label>
                        <input v-model="min" type="number" class="form-control bubble-input" />
                    </div>

                    <div class="col-md-3">
                        <label class="form-label">Max</label>
                        <input v-model="max" type="number" class="form-control bubble-input" />
                    </div>

                    <div class="col-md-3">
                        <label class="form-label">Count</label>
                        <input v-model="count" type="number" class="form-control bubble-input" />
                    </div>

                    <div class="col-md-3">
                        <button @click="generateNumbers" class="btn bubble-btn-primary w-100">
                            Generate
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="numbers.length" class="card shadow border-0 bubble-card mb-4">
            <div class="card-body">
                <h5>Generated Numbers</h5>
                <p class="bubble-numbers mb-0">{{ numbers.join(", ") }}</p>
            </div>
        </div>

        <div>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="h4 bubble-title mb-0">Your Last Runs</h2>

                <button v-if="history.length" @click="clearHistory" class="btn bubble-btn-outline btn-sm">
                    Clear All
                </button>
            </div>

            <div v-if="loadingHistory" class="alert bubble-alert-secondary">
                Loading history...
            </div>

            <div v-if="historyError" class="alert alert-danger">
                {{ historyError }}
            </div>

            <div v-if="!loadingHistory && history.length === 0" class="alert bubble-alert-secondary">
                No runs yet. generate one!
            </div>

            <div v-for="run in history" :key="run.createdAt" class="card shadow border-0 bubble-card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <div>
                            <strong>{{ new Date(run.createdAt).toLocaleString() }}</strong>

                            <div class="text-muted small">
                                Range {{ run.min }} - {{ run.max }} | Count {{ run.count }}
                            </div>
                        </div>

                        <button @click="deleteRun(run.createdAt)" class="btn btn-sm bubble-btn-outline">
                            Delete
                        </button>
                    </div>

                    <p>
                        <strong>Numbers:</strong> {{ run.numbers }}
                    </p>

                    <div v-if="run.stats" class="row g-2 text-center">
                        <div class="col-6 col-md-3">
                            <div class="bubble-stat">
                                <small>Min</small>
                                <strong>{{ run.stats.min }}</strong>
                            </div>
                        </div>

                        <div class="col-6 col-md-3">
                            <div class="bubble-stat">
                                <small>Max</small>
                                <strong>{{ run.stats.max }}</strong>
                            </div>
                        </div>

                        <div class="col-6 col-md-3">
                            <div class="bubble-stat">
                                <small>Sum</small>
                                <strong>{{ run.stats.sum }}</strong>
                            </div>
                        </div>

                        <div class="col-6 col-md-3">
                            <div class="bubble-stat">
                                <small>Avg</small>
                                <strong>{{ run.stats.avg.toFixed(2) }}</strong>
                            </div>
                        </div>
                    </div>
                </div>
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
            loadingHistory: false,
            historyError: "",
            apiBase: "https://g1fy1zpjo2.execute-api.us-west-2.amazonaws.com/prod",
        };
    },

    async mounted() {
        try {
            const token = await this.getAccessToken();
            if (token) await this.loadHistory();
        } catch { }
    },

    methods: {
        async getAccessToken() {
            const session = await fetchAuthSession();
            return session.tokens?.accessToken?.toString();
        },

        async generateNumbers() {
            try {
                const token = await this.getAccessToken();

                const response = await fetch(
                    `${this.apiBase}/random?min=${this.min}&max=${this.max}&count=${this.count}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Random API failed");

                this.numbers = await response.json();

                await fetch(`${this.apiBase}/runs`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        min: this.min,
                        max: this.max,
                        count: this.count,
                        numbers: this.numbers,
                    }),
                });

                await this.loadHistory();
            } catch (error) {
                console.error(error);
            }
        },

        async loadHistory() {
            this.loadingHistory = true;
            this.historyError = "";

            try {
                const token = await this.getAccessToken();

                const response = await fetch(`${this.apiBase}/runs`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error(`History failed: ${response.status}`);

                const data = await response.json();
                this.history = data.items || [];
            } catch (error) {
                this.historyError = error.message;
            } finally {
                this.loadingHistory = false;
            }
        },

        async deleteRun(createdAt) {
            const token = await this.getAccessToken();

            await fetch(`${this.apiBase}/runs/${encodeURIComponent(createdAt)}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await this.loadHistory();
        },

        async clearHistory() {
            const token = await this.getAccessToken();

            await fetch(`${this.apiBase}/runs`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await this.loadHistory();
        },
    },
};
</script>