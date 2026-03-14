<template>
  <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem;">
    <h1 data-anim="fadeInUp">Nuxt + data-anim</h1>
    <p data-anim="fadeInUp" data-anim-delay="200">
      Built with Nuxt + data-anim
    </p>

    <div style="height: 100vh; display: flex; align-items: center; justify-content: center; color: #999;">
      ↓ Scroll down ↓
    </div>

    <section data-anim-stagger="100">
      <h2 data-anim="fadeInUp">Features</h2>
      <div data-anim="fadeInUp">Fast</div>
      <div data-anim="fadeInUp">Lightweight</div>
      <div data-anim="fadeInUp">Zero config</div>
    </section>
  </div>
</template>
