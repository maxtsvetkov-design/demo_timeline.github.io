/* Component: project-card — card header, view tabs, and mission HUD */
NB.mountComponent('nb-project-card', `
<header class="proj-card glass" id="projCard" data-reveal style="--d:.05s">
  <button class="back" data-tip="Back to projects" id="backBtn">
    <svg class="icon sm"><use href="#i-chev-left"/></svg>
  </button>
  <div class="proj-meta">
    <h2 id="projName">Project name, which can be truncated</h2>
    <div class="area">Area name</div>
    <div class="date" id="currentDateLabel">Current date: 14 Mar 2025</div>
  </div>
  <button class="fold" data-tip="Collapse" id="projFold">
    <svg class="icon sm"><use href="#i-panel"/></svg>
  </button>
</header>

<nav class="tabs glass" id="tabs" data-reveal style="--d:.12s">
  <button class="tab" data-view="dashboard">Dashboard</button>
  <button class="tab" data-view="exploration">Exploration</button>
  <button class="tab active" data-view="story">Story</button>
</nav>

`);
