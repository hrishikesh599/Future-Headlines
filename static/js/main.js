/* ── STATE ── */
let selectedMode = 'Neutral';

/* ── MODE PILL SELECTION ── */
function selectMode(mode) {
  selectedMode = mode;
  ['Optimistic', 'Neutral', 'Dystopian'].forEach(m => {
    const pill = document.getElementById('pill-' + m.toLowerCase());
    pill.className = 'mode-pill' + (m === mode ? ' active-' + m.toLowerCase() : '');
  });
}

document.querySelectorAll('.mode-pill').forEach(pill => {
  pill.addEventListener('click', () => selectMode(pill.dataset.mode));
});


/* ── LOADING STATE ── */
function setLoading(on) {
  const overlay = document.getElementById('loadingOverlay');
  const stage   = document.getElementById('paperStage');
  const btn     = document.getElementById('generateBtn');

  overlay.style.display = on ? 'flex' : 'none';
  overlay.classList.toggle('visible', on);
  stage.style.display   = on ? 'none' : 'flex';
  btn.disabled          = on;
  btn.textContent       = on ? 'Printing...' : 'Print Edition →';
}


/* ── GENERATE ── */
async function generateNewspaper() {
  const year  = document.getElementById('yearInput').value  || '2077';
  const theme = document.getElementById('themeSelect').value;
  const mode  = selectedMode;

  setLoading(true);

  try {
    const res = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({  year,  theme,  mode,  apiKey: document.getElementById('apiKeyInput').value})
    });

    const data = await res.json();

    if (!data.ok) throw new Error(data.error || 'Unknown server error');

    renderNewspaper(data.paper, mode, theme);

  } catch (err) {
    setLoading(false);
    document.getElementById('paperStage').innerHTML = `
      <div style="padding:2rem;text-align:center;width:100%">
        <div class="error-notice">
          The printing press encountered an error. Please try again.
          <small>${escHtml(err.message)}</small>
        </div>
      </div>`;
  }
}

document.getElementById('generateBtn').addEventListener('click', generateNewspaper);

/* Also allow pressing Enter in the year input */
document.getElementById('yearInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') generateNewspaper();
});


/* ── RENDER ── */
function renderNewspaper(p, mode, theme) {
  const ribbonClass = 'ribbon-' + mode.toLowerCase();

  /* Duplicate ticker items for seamless looping */
  const allTickers = [...p.ticker, ...p.ticker];
  const tickerHTML = allTickers
    .map(t => `<span><span class="ticker-label">BREAKING</span>${escHtml(t)}</span>`)
    .join('');

  const html = `
  <div class="newspaper">
    <div class="paper-texture"></div>

    <div class="masthead">
      <div class="masthead-top">
        <span>${escHtml(p.volume || 'Est. 2025')} &nbsp;|&nbsp; ${escHtml(p.edition || 'MORNING EDITION')}</span>
        <span><span class="mode-ribbon ${ribbonClass}">${escHtml(mode.toUpperCase())} FUTURE</span></span>
        <span>${escHtml(p.price || 'FREE')}</span>
      </div>
      <div class="newspaper-name">${escHtml(p.newspaper_name)}</div>
      <div class="masthead-bottom">
        <span style="font-style:italic">${escHtml(p.tagline || '')}</span>
        <span>${escHtml(p.date)}</span>
        <span>Theme: ${escHtml(theme)}</span>
      </div>
    </div>

    <div class="ticker">
      <div class="ticker-inner">${tickerHTML}</div>
    </div>

    <div class="paper-body">

      <!-- LEAD STORY -->
      <div class="lead-story">
        <div class="lead-headline">${escHtml(p.lead.headline)}</div>
        <div class="lead-deck">${escHtml(p.lead.deck)}</div>
        <div class="lead-columns">
          <div class="lead-col">
            <div class="lead-byline">${escHtml(p.lead.byline || 'Staff Reporter')}</div>
            <div class="article-body drop-cap">${escHtml(p.lead.col1)}</div>
          </div>
          <div class="lead-col">
            <div class="pull-quote">${escHtml(p.lead.pull_quote || '')}</div>
            <div class="article-body">${escHtml(p.lead.col2)}</div>
          </div>
          <div class="lead-col">
            <div class="article-body">${escHtml(p.lead.col3)}</div>
          </div>
        </div>
      </div>

      <div class="ornament">✦ ✦ ✦</div>

      <!-- SECONDARY STORIES + ADS -->
      <div class="columns-grid" style="margin:0.8rem 0 1rem">
        <div>
          <div class="story-headline">${escHtml(p.story2.headline)}</div>
          <div class="story-subhead">${escHtml(p.story2.subhead)}</div>
          <div class="lead-byline">${escHtml(p.story2.byline || 'Staff Reporter')}</div>
          <div class="article-body">${escHtml(p.story2.body)}</div>
        </div>
        <div class="col-divider"></div>
        <div style="display:flex;flex-direction:column;gap:0.8rem">
          <div>
            <div class="section-label">Advertisement</div>
            <div class="ad-box">
              <div class="ad-title">${escHtml(p.ad1.title)}</div>
              <div class="ad-body">${escHtml(p.ad1.body)}</div>
              <div class="ad-cta">— ${escHtml(p.ad1.cta)} —</div>
            </div>
          </div>
          <div>
            <div class="ad-box">
              <div class="ad-title">${escHtml(p.ad2.title)}</div>
              <div class="ad-body">${escHtml(p.ad2.body)}</div>
              <div class="ad-cta">— ${escHtml(p.ad2.cta)} —</div>
            </div>
          </div>
        </div>
        <div class="col-divider"></div>
        <div>
          <div class="story-headline">${escHtml(p.story3.headline)}</div>
          <div class="story-subhead">${escHtml(p.story3.subhead)}</div>
          <div class="lead-byline">${escHtml(p.story3.byline || 'Staff Reporter')}</div>
          <div class="article-body">${escHtml(p.story3.body)}</div>
        </div>
      </div>

      <!-- WEATHER + TRENDING -->
      <div class="bottom-strip">
        <div>
          <div class="section-label">Weather</div>
          <div class="weather-box">
            <span class="weather-temp">${escHtml(p.weather.temp)}</span>
            <strong>${escHtml(p.weather.condition)}</strong><br>
            ${escHtml(p.weather.detail)}
          </div>
        </div>
        <div class="col-divider"></div>
        <div></div>
        <div class="col-divider"></div>
        <div>
          <div class="section-label">Trending Now</div>
          <ul class="trending-list">
            ${(p.trending || []).map((t, i) =>
              `<li><span class="trending-num">${i + 1}.</span>${escHtml(t)}</li>`
            ).join('')}
          </ul>
        </div>
      </div>

    </div><!-- /paper-body -->
  </div><!-- /newspaper -->`;

  setLoading(false);
  const stage = document.getElementById('paperStage');
  stage.innerHTML = html;
  stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


/* ── UTILS ── */
function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

