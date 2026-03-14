export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1 data-anim="fadeInUp">Welcome</h1>
      <p data-anim="fadeInUp" data-anim-delay="200">
        Built with Next.js + data-anim
      </p>

      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
        ↓ Scroll down ↓
      </div>

      <section data-anim-stagger="100">
        <h2 data-anim="fadeInUp">Features</h2>
        <div data-anim="fadeInUp">Fast</div>
        <div data-anim="fadeInUp">Lightweight</div>
        <div data-anim="fadeInUp">Zero config</div>
      </section>
    </main>
  );
}
