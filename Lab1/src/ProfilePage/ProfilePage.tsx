import './ProfilePage.css';
import Cookies from 'js-cookie';

function getFromToken(key: string): string {
  const token = Cookies.get('accessToken');
  if (!token) return '';
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload[key] || '';
  } catch {
    return '';
  }
}

function getNameFromToken(): string {
  return getFromToken('http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name') || 'Гость';
}

function getIsAdminFromToken(): boolean {
  const token = Cookies.get('accessToken');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload['IsAdmin'] === 'True';
  } catch {
    return false;
  }
}

const ProfilePage = () => {
  const username = getNameFromToken();
  const nickname = getFromToken('Nickname') || username;
  const isAdmin = getIsAdminFromToken();
  return (
    <div className="profile-wrap">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.8"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
              </svg>
            </div>
          </div>
          <div className="profile-info">
            <div className="profile-name-row">
              <h1 className="profile-name">{nickname}</h1>
              {isAdmin && <span className="admin-badge">Admin</span>}
            </div>
            <p className="profile-email">—</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <span className="stat-value">0</span>
            <span className="stat-label">Просмотрено</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">0</span>
            <span className="stat-label">В списке</span>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Последнее просмотренное</h2>
          <p className="profile-empty">Здесь будет история просмотров</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
