export default function AuthIntegration() {
  return (
    <div>
      <h2 className="section-title">Login integration for your app</h2>
      <p>Provide GitHub or username/password login to your own projects via our hosted auth endpoints.</p>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Webhook callback</h3>
        <p>Point successful sign-ins to your app by configuring a callback URL.</p>
        <div className="form-field">
          <label htmlFor="callback">Callback URL</label>
          <input id="callback" placeholder="https://yourapp.com/auth/callback" />
        </div>
        <button className="button">Save callback</button>
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3>Client snippet</h3>
        <p>Drop this snippet in your frontend to launch the hosted login modal.</p>
        <pre style={{ background: '#0f172a', color: '#e2e8f0', padding: 12, borderRadius: 8 }}>
{`import { openLogin } from 'cloud-ide-auth';
openLogin({ provider: 'github', onSuccess: (user) => console.log(user) });`}
        </pre>
      </div>
    </div>
  );
}
