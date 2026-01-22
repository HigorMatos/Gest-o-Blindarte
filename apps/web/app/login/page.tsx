export default function LoginPage() {
  return (
    <div>
      <h1>Login</h1>
      <div className="card">
        <div className="form-grid">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Senha" />
        </div>
        <button style={{ marginTop: 12 }}>Entrar</button>
      </div>
    </div>
  );
}
