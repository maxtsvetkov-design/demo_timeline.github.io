/* Component: rail — left navigation rail with project avatars */
NB.mountComponent('nb-rail', `
<nav class="rail" aria-label="Primary">
  <div class="logo">n</div>
  <button class="rail-btn active" data-tip="Home" data-rail><svg class="icon"><use href="#i-home"/></svg></button>
  <button class="rail-btn" data-tip="Knowledge base" data-rail><svg class="icon"><use href="#i-book"/></svg></button>
  <button class="rail-btn" data-tip="Help &amp; shortcuts" data-rail data-help><svg class="icon"><use href="#i-help"/></svg></button>
  <div class="rail-sep"></div>
  <button class="proj-av active" data-proj="nabat demo workspace"><span class="av av-n"><i class="av-live"></i>n</span></button>
  <button class="proj-av" data-proj="Aramco Ecopark"><span class="av av-1"><i class="av-live"></i></span><span>Aramco Ecopark</span></button>
  <button class="proj-av" data-proj="Al Marzoum"><span class="av av-2"><i class="av-live"></i></span><span>Al Marzoum</span></button>
  <div class="spacer"></div>
  <button class="rail-btn bell" data-tip="Notifications"><svg class="icon"><use href="#i-bell"/></svg></button>
  <button class="me" data-tip="Account — AZ">AZ</button>
</nav>
`);
