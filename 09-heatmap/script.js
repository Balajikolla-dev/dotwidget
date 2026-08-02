const ghForm = document.getElementById('gh-form');
const ghInput = document.getElementById('gh-input');
const loadingEl = document.getElementById('gh-loading');
const contentEl = document.getElementById('gh-content');

const avatarEl = document.getElementById('user-avatar');
const nameEl = document.getElementById('user-name');
const handleEl = document.getElementById('user-handle');
const bioEl = document.getElementById('user-bio');

const statRepos = document.getElementById('stat-repos');
const statFollowers = document.getElementById('stat-followers');
const statFollowing = document.getElementById('stat-following');

const reposList = document.getElementById('repos-list');
const btnChange = document.getElementById('btn-change-user');

async function fetchGitHubUser(username) {
  ghForm.classList.add('hidden');
  loadingEl.classList.remove('hidden');

  try {
    // 1. Fetch User Profile
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
    if (!userRes.ok) throw new Error('User not found');
    const userData = await userRes.json();

    // 2. Fetch User Public Repositories (Sorted by updated date)
    const reposRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=5`);
    const reposData = await reposRes.json();

    // Render User Header
    avatarEl.src = userData.avatar_url;
    nameEl.textContent = userData.name || userData.login;
    handleEl.textContent = `@${userData.login}`;
    handleEl.href = userData.html_url;
    bioEl.textContent = userData.bio || 'No bio provided.';

    statRepos.textContent = userData.public_repos;
    statFollowers.textContent = userData.followers;
    statFollowing.textContent = userData.following;

    // Render Repositories
    reposList.innerHTML = '';
    reposData.forEach(repo => {
      const repoEl = document.createElement('a');
      repoEl.className = 'repo-card';
      repoEl.href = repo.html_url;
      repoEl.target = '_blank';

      repoEl.innerHTML = `
        <div class="repo-header">
          <span class="repo-name">📦 ${repo.name}</span>
        </div>
        <div class="repo-meta">
          <span>${repo.language || 'Plain'}</span>
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
        </div>
      `;
      reposList.appendChild(repoEl);
    });

    // Save to localStorage
    Storage.set('github_username', username);

    loadingEl.classList.add('hidden');
    contentEl.classList.remove('hidden');
  } catch (err) {
    alert('Failed to load GitHub user. Please check the username!');
    showForm();
  }
}

function showForm() {
  loadingEl.classList.add('hidden');
  contentEl.classList.add('hidden');
  ghForm.classList.remove('hidden');
  ghInput.value = '';
  ghInput.focus();
}

ghForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = ghInput.value.trim();
  if (username) fetchGitHubUser(username);
});

btnChange.addEventListener('click', showForm);

// Load saved username or show prompt
const savedUsername = Storage.get('github_username', null);
if (savedUsername) {
  fetchGitHubUser(savedUsername);
} else {
  showForm();
}