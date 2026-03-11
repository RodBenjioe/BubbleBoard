<template>
  <div class="app-shell min-vh-100">
    <nav class="navbar shadow-sm bubble-navbar">
      <div class="container">
        <span class="navbar-brand mb-0 h1 fw-bold text-white">BubbleBoard</span>
        <router-link to="/" class="btn bubble-btn-secondary">
          Go to Home
        </router-link>
      </div>
    </nav>

    <main class="container py-4">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {};
</script>