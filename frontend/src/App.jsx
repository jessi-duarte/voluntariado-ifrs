import { useEffect, useState, useRef } from 'react';
import './App.css';

const API_URL = 'http://localhost:3000';

const emptyForm = {
  title: '',
  description: '',
  event_date: '',
  location: '',
  max_volunteers: 20,
};
const emptyVolunteerForm = {
  name: '',
  email: '',
  phone: '',
};

function formatDate(date) {
  if (!date) return 'Data não informada';

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Data não disponível';
  }

  return parsedDate.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [formMessage, setFormMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const [volunteerForm, setVolunteerForm] = useState(emptyVolunteerForm);
  const [volunteerMessage, setVolunteerMessage] = useState('');
  const [savingVolunteer, setSavingVolunteer] = useState(false);

  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editMessage, setEditMessage] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const editFormRef = useRef(null);

  async function loadEvents() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/events`);

      if (!response.ok) {
        throw new Error('Não foi possível carregar os eventos.');
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Formato de resposta inesperado.');
      }

      setEvents(data);
      setError('');
    } catch (err) {
      setError('Não foi possível conectar à API. Verifique o back-end.');
      console.error('Erro ao carregar eventos:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchInitialEvents() {
      await loadEvents();
    }

    fetchInitialEvents();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível entrar.');
      }

      if (!data.token || !data.user) {
        throw new Error('A API não retornou os dados de autenticação.');
      }

      if (data.user.role !== 'admin') {
        throw new Error('Esta área é exclusiva para administradores.');
      }

      setToken(data.token);
      setUser(data.user);
      setPassword('');
      setLoginError('');
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    setToken('');
    setUser(null);
    setPassword('');
    setFormMessage('');
    setForm(emptyForm);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleCreateEvent(event) {
    event.preventDefault();
    setFormMessage('');

    if (!token || user?.role !== 'admin') {
      setFormMessage('Faça login como administrador para continuar.');
      return;
    }

    const maxVolunteers = Number(form.max_volunteers);

    if (!Number.isInteger(maxVolunteers) || maxVolunteers < 1) {
      setFormMessage('Informe uma quantidade de vagas válida.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          max_volunteers: maxVolunteers,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        setToken('');
        setUser(null);
        throw new Error(data.message || 'Acesso negado. Faça login novamente.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar evento.');
      }

      setForm(emptyForm);
      setFormMessage('Evento cadastrado com sucesso!');
      await loadEvents();
    } catch (err) {
      setFormMessage(err.message);
    } finally {
      setSaving(false);
    }
  }
    function handleVolunteerChange(event) {
    const { name, value } = event.target;

    setVolunteerForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleVolunteerSubmit(event) {
    event.preventDefault();
    setVolunteerMessage('');

    if (!token || user?.role !== 'admin') {
      setVolunteerMessage(
        'Faça login como administrador para cadastrar voluntários.',
      );
      return;
    }

    setSavingVolunteer(true);

    try {
      const response = await fetch(`${API_URL}/volunteers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(volunteerForm),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 403) {
        setToken('');
        setUser(null);
        throw new Error(
          data.message || 'Acesso negado. Faça login novamente.',
        );
      }

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar voluntário.');
      }

      setVolunteerForm(emptyVolunteerForm);
      setVolunteerMessage('Voluntário cadastrado com sucesso!');
    } catch (error) {
      setVolunteerMessage(error.message);
    } finally {
      setSavingVolunteer(false);
    }
  }

  function startEditing(event) {
    const date = new Date(event.event_date);

    if (Number.isNaN(date.getTime())) {
      setEditMessage('Não foi possível interpretar a data do evento.');
      return;
    }

    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);

    setEditingEvent(event.id);
    setEditMessage('');

    setEditForm({
      title: event.title || '',
      description: event.description || '',
      event_date: localDate,
      location: event.location || '',
      max_volunteers: event.max_volunteers ?? 20,
      status: event.status || 'open',
    });

    setTimeout(() => {
      editFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  function handleEditChange(event) {
    const { name, value } = event.target;

    setEditForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleUpdateEvent(event) {
    event.preventDefault();
    setSavingEdit(true);
    setEditMessage('');

    try {
      const response = await fetch(`${API_URL}/events/${editingEvent}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editForm,
          event_date: editForm.event_date.replace('T', ' '),
          max_volunteers: Number(editForm.max_volunteers),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setToken('');
          setUser(null);
        }

        throw new Error(data.message || 'Erro ao atualizar evento.');
      }

      setEditingEvent(null);
      setEditMessage('Evento atualizado com sucesso!');
      await loadEvents();
    } catch (error) {
      setEditMessage(error.message);
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDeleteEvent(id) {
    const confirmed = window.confirm(
      'Tem certeza de que deseja excluir este evento? Esta ação não pode ser desfeita.',
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        if (response.status === 401 || response.status === 403) {
          setToken('');
          setUser(null);
        }

        throw new Error(data.message || 'Erro ao excluir evento.');
      }

      if (editingEvent === id) {
        setEditingEvent(null);
      }

      setEditMessage('Evento excluído com sucesso!');
      await loadEvents();
    } catch (error) {
      setEditMessage(error.message);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">V</span>
          <div>
            <h1>Voluntariado IFRS</h1>
            <p>Conectando pessoas e causas</p>
          </div>
        </div>

        {user ? (
          <div className="user-session">
            <span className="user-name">Olá, {user.name}</span>
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        ) : (
          <span className="status">
            <span className="status-dot"></span>
            Plataforma de voluntariado
          </span>
        )}
      </header>

      <main className="main-content">
        <section className="welcome">
          <span className="eyebrow">PLATAFORMA DE VOLUNTARIADO</span>
          <h2>Faça parte da mudança.</h2>
          <p>
            Descubra oportunidades, participe de ações solidárias e transforme
            sua comunidade por meio do voluntariado.
          </p>
        </section>

        <section className="stats">
          <article className="stat-card">
            <span>01</span>
            <h3>Eventos</h3>
            <p>
              {loading
                ? 'Carregando eventos...'
                : `${events.length} evento(s) cadastrado(s).`}
            </p>
          </article>

          <article className="stat-card">
            <span>02</span>
            <h3>Voluntários</h3>
            <p>Pessoas unidas por boas causas.</p>
          </article>

          <article className="stat-card">
            <span>03</span>
            <h3>Impacto social</h3>
            <p>Pequenas ações, grandes mudanças.</p>
          </article>
        </section>

        {!user && (
          <section className="panel">
            <div className="panel-heading">
              <span className="eyebrow">ÁREA RESTRITA</span>
              <h2>Login do administrador</h2>
              <p>Entre para cadastrar novos eventos na plataforma.</p>
            </div>

            <form className="app-form" onSubmit={handleLogin}>
              <label htmlFor="login-email">E-mail</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Seu e-mail de administrador"
                autoComplete="username"
                required
              />

              <label htmlFor="login-password">Senha</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Sua senha"
                autoComplete="current-password"
                required
              />

              {loginError && <p className="form-message error">{loginError}</p>}

              <button
                className="primary-button"
                type="submit"
                disabled={loginLoading}
              >
                {loginLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </section>
        )}

        {user?.role === 'admin' && (
          <section className="panel">
            <div className="panel-heading">
              <span className="eyebrow">ADMINISTRAÇÃO</span>
              <h2>Cadastrar evento</h2>
              <p>
                Preencha os dados para adicionar uma oportunidade de
                voluntariado.
              </p>
            </div>

            <form className="app-form" onSubmit={handleCreateEvent}>
              <label htmlFor="event-title">Nome do evento</label>
              <input
                id="event-title"
                name="title"
                value={form.title}
                onChange={handleFormChange}
                placeholder="Ex.: Campanha de arrecadação"
                required
              />

              <label htmlFor="event-description">Descrição</label>
              <textarea
                id="event-description"
                name="description"
                value={form.description}
                onChange={handleFormChange}
                placeholder="Descreva o objetivo da ação"
                rows="3"
                required
              />

              <label htmlFor="event-date">Data e horário</label>
              <input
                id="event-date"
                name="event_date"
                type="datetime-local"
                value={form.event_date}
                onChange={handleFormChange}
                required
              />

              <label htmlFor="event-location">Local</label>
              <input
                id="event-location"
                name="location"
                value={form.location}
                onChange={handleFormChange}
                placeholder="Ex.: Campus IFRS"
                required
              />

              <label htmlFor="event-vacancies">Número de vagas</label>
              <input
                id="event-vacancies"
                name="max_volunteers"
                type="number"
                min="1"
                step="1"
                value={form.max_volunteers}
                onChange={handleFormChange}
                required
              />

              {formMessage && (
                <p
                  className={`form-message ${
                    formMessage.includes('sucesso') ? 'success' : 'error'
                  }`}
                >
                  {formMessage}
                </p>
              )}

              <button
                className="primary-button"
                type="submit"
                disabled={saving}
              >
                {saving ? 'Salvando...' : 'Cadastrar evento'}
              </button>
            </form>
          </section>
        )}
                {user?.role === 'admin' && (
          <section className="panel">
            <div className="panel-heading">
              <span className="eyebrow">ADMINISTRAÇÃO</span>
              <h2>Cadastrar voluntário</h2>
              <p>Cadastre as pessoas que desejam participar das ações.</p>
            </div>

            <form className="app-form" onSubmit={handleVolunteerSubmit}>
              <label htmlFor="volunteer-name">Nome completo</label>
              <input
                id="volunteer-name"
                name="name"
                type="text"
                value={volunteerForm.name}
                onChange={handleVolunteerChange}
                placeholder="Nome do voluntário"
                required
              />

              <label htmlFor="volunteer-email">E-mail</label>
              <input
                id="volunteer-email"
                name="email"
                type="email"
                value={volunteerForm.email}
                onChange={handleVolunteerChange}
                placeholder="email@exemplo.com"
                required
              />

              <label htmlFor="volunteer-phone">Telefone</label>
              <input
                id="volunteer-phone"
                name="phone"
                type="tel"
                value={volunteerForm.phone}
                onChange={handleVolunteerChange}
                placeholder="Telefone para contato"
              />

              {volunteerMessage && (
                <p
                  className={`form-message ${
                    volunteerMessage.includes('sucesso')
                      ? 'success'
                      : 'error'
                  }`}
                >
                  {volunteerMessage}
                </p>
              )}

              <button
                className="primary-button"
                type="submit"
                disabled={savingVolunteer}
              >
                {savingVolunteer
                  ? 'Salvando...'
                  : 'Cadastrar voluntário'}
              </button>
            </form>
          </section>
        )}

        {user?.role === 'admin' && editMessage && (
          <div className="feedback">{editMessage}</div>
        )}

        {user?.role === 'admin' && editingEvent !== null && (
          <section className="panel" ref={editFormRef}>
            <div className="panel-heading">
              <span className="eyebrow">ADMINISTRAÇÃO</span>
              <h2>Editar evento #{editingEvent}</h2>
            </div>

            <form className="app-form" onSubmit={handleUpdateEvent}>
              <label htmlFor="edit-title">Nome do evento</label>
              <input
                id="edit-title"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                required
              />

              <label htmlFor="edit-description">Descrição</label>
              <textarea
                id="edit-description"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                rows="3"
              />

              <label htmlFor="edit-date">Data e horário</label>
              <input
                id="edit-date"
                name="event_date"
                type="datetime-local"
                value={editForm.event_date}
                onChange={handleEditChange}
                required
              />

              <label htmlFor="edit-location">Local</label>
              <input
                id="edit-location"
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
                required
              />

              <label htmlFor="edit-vacancies">Número de vagas</label>
              <input
                id="edit-vacancies"
                name="max_volunteers"
                type="number"
                min="1"
                step="1"
                value={editForm.max_volunteers}
                onChange={handleEditChange}
                required
              />

              <label htmlFor="edit-status">Status</label>
              <select
                id="edit-status"
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                required
              >
                <option value="open">Inscrições abertas</option>
                <option value="closed">Inscrições encerradas</option>
                <option value="completed">Concluído</option>
              </select>

              <button
                className="primary-button"
                type="submit"
                disabled={savingEdit}
              >
                {savingEdit ? 'Salvando...' : 'Salvar alterações'}
              </button>

              <button
                className="retry-button"
                type="button"
                onClick={() => setEditingEvent(null)}
              >
                Cancelar edição
              </button>
            </form>
          </section>
        )}

        <section className="events-section">
          <div className="section-heading">
            <span className="eyebrow">OPORTUNIDADES</span>
            <h2>Eventos cadastrados</h2>
            <p>Informações consultadas diretamente na API.</p>
          </div>

          {loading && <div className="feedback">Carregando eventos...</div>}

          {!loading && error && (
            <div className="feedback error">
              <p>{error}</p>
              <button className="retry-button" onClick={loadEvents}>
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="feedback">Nenhum evento cadastrado no momento.</div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="events-grid">
              {events.map((event) => (
                <article className="event-card" key={event.id}>
                  <div className="event-card-top">
                    <span className="event-label">VOLUNTARIADO</span>
                    <span className="event-id">#{event.id}</span>
                  </div>

                  <h3>{event.title}</h3>

                  <p className="event-description">
                    {event.description || 'Participe desta ação solidária.'}
                  </p>

                  <div className="event-details">
                    <p>
                      <strong>Data:</strong> {formatDate(event.event_date)}
                    </p>
                    <p>
                      <strong>Local:</strong> {event.location || 'A confirmar'}
                    </p>
                    <p>
                      <strong>Vagas:</strong>{' '}
                      {event.max_volunteers ?? 'Não informado'}
                    </p>
                  </div>

                  <span
                    className={`event-status ${
                      event.status === 'open' ? 'open' : ''
                    }`}
                  >
                    {event.status === 'open'
                      ? 'Inscrições abertas'
                      : event.status || 'Status não informado'}
                  </span>
                  {/* Botões de administração */}
                  {user?.role === 'admin' && (
                    <div className="event-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => startEditing(event)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="next-step">
          <div>
            <h3>Juntos podemos fazer a diferença.</h3>
            <p>
              Uma plataforma para aproximar pessoas e oportunidades de
              voluntariado.
            </p>
          </div>
          <span className="arrow">→</span>
        </section>
      </main>

      <footer>Projeto acadêmico · Voluntariado IFRS · 2026</footer>
    </div>
  );
}

export default App;
