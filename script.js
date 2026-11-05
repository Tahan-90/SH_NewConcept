(() => {
  "use strict";

  const { products, bundles, packages, routines } = window.StoreCatalog;
  const app = document.getElementById("storefront");
  const root = document.documentElement;
  const liveStatus = document.getElementById("live-status");
  const themeButton = document.getElementById("theme-toggle");
  const planCount = document.getElementById("plan-count");
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const dialog = document.getElementById("brief-dialog");
  const pointDialog = document.getElementById("point-dialog");
  const plan = new Map();
  const productById = new Map(products.map((product) => [product.id, product]));
  const bundleById = new Map(bundles.map((bundle) => [bundle.id, bundle]));
  const packageById = new Map(packages.map((pack) => [pack.id, pack]));
  const quantities = new Map(products.map((product) => [product.id, 0]));
  let activeTab = "home";
  let switchVariant = "1";
  let activeHomeFeature = "living-lights";
  let activeRoutine = routines[0].id;
  let includeService = false;
  let projectType = "existing";
  let propertyType = "residential";
  const projectTypeLabels = { existing: "Upgrade an existing space", new: "Plan a completely new space" };
  const propertyTypeLabels = { residential: "Residential", "small-office": "Small office", retail: "Retail" };

  const homePoints = [
    { id: "living-lights", name: "Living room lights", room: "Ground floor · Living room", kind: "light", productId: "switch", variantId: "2", points: 2, value: "Keep both existing light circuits and switch plates. Control each lighting group from the app or by voice.", note: "Two independent lighting circuits become app-controlled, while the wall switch still works." },
    { id: "dining-pendant", name: "Dining pendant", room: "Ground floor · Dining", kind: "light", productId: "switch", variantId: "1", points: 1, value: "Add app control and schedules to the pendant light you already have.", note: "A single existing light gets app, voice and schedule control without replacing the switch." },
    { id: "kitchen-lights", name: "Kitchen task lights", room: "Ground floor · Kitchen", kind: "light", productId: "switch", variantId: "2", points: 2, value: "Treat the ceiling and counter lighting as separate circuits for more useful scenes.", note: "Two independent lighting circuits can be controlled separately or together in a scene." },
    { id: "bedroom-lights", name: "Bedroom lights", room: "First floor · Main bedroom", kind: "light", productId: "switch", variantId: "1", points: 1, value: "Keep the familiar wall switch and add app control, a countdown or a bedtime routine.", note: "A useful way to bring an existing bedroom light into a Good night routine." },
    { id: "office-lights", name: "Office lights", room: "First floor · Office", kind: "light", productId: "switch", variantId: "1", points: 1, value: "Add app control and schedules to the office ceiling light while keeping its familiar wall switch.", note: "Set a focused work scene or switch the office lights off from another room." },
    { id: "window-shades", name: "Bedroom window shades", room: "First floor · Main bedroom", kind: "shade", productId: "shutter", points: 1, value: "Move compatible shutters or curtains from the app, set a position or add a schedule.", note: "Control compatible motorized shades while keeping the existing push buttons." },
    { id: "office-shades", name: "Office window shades", room: "First floor · Office", kind: "shade", productId: "shutter", points: 1, value: "Use a schedule to open or close compatible office blinds with the day.", note: "A motorized shade can join the same app routines as lights and other modules." },
    { id: "garage-door", name: "Garage door motor", room: "Ground floor · Garage", kind: "shade", productId: "shutter", points: 1, value: "Explore app and schedule control for a compatible motor. Motor and wiring must be checked first.", note: "Potentially brings an existing motor into app control; compatibility and safe installation need a site review." },
    { id: "living-tv", name: "Living room TV", room: "Ground floor · Living room", kind: "device", productId: "ir", points: 1, value: "Bring a compatible TV remote into app scenes, schedules and routines.", note: "One IR blaster can reduce remote juggling for compatible nearby devices." },
    { id: "bedroom-ac", name: "Bedroom air conditioner", room: "First floor · Main bedroom", kind: "device", productId: "ir", points: 1, value: "Control a compatible AC from the app, including a routine before you arrive home.", note: "A compatible AC can join app scenes and schedules without replacing the unit." },
    { id: "office-ac", name: "Office air conditioner", room: "First floor · Office", kind: "device", productId: "ir", points: 1, value: "Control a compatible office AC independently from the app, including a routine before work.", note: "A compatible office AC can join focused-work schedules without replacing the unit." },
    { id: "entry-sensor", name: "Entry door sensor", room: "Ground floor · Entry", kind: "sensor", productId: "sensor", points: 1, value: "Add an entry point to a planned sensor layout for the site visit.", note: "Sensor type, notifications, compatibility and placement are confirmed during consultation." },
    { id: "drive-camera", name: "Driveway camera", room: "Outside · Driveway", kind: "camera", productId: "camera", points: 1, value: "Explore a camera point and coverage angle as part of a security plan.", note: "Choose camera model and coverage after reviewing the property and installation needs." }
  ];
  const pointById = new Map(homePoints.map((point) => [point.id, point]));
  const pointStates = new Map(homePoints.map((point) => [point.id, {
    on: point.kind !== "sensor",
    value: point.kind === "shade" ? 0 : 76,
    temperature: 24,
    angle: 0
  }]));
  const hotspotPositions = {
    "living-lights": ["35%", "63.8%"],
    "dining-pendant": ["61.7%", "63.8%"],
    "kitchen-lights": ["79%", "62.5%"],
    "bedroom-lights": ["33.7%", "31.8%"],
    "office-lights": ["66.3%", "31.8%"],
    "window-shades": ["21%", "41.3%"],
    "office-shades": ["74.7%", "41.3%"],
    "garage-door": ["92.2%", "74.6%"],
    "living-tv": ["42.6%", "77.1%"],
    "bedroom-ac": ["32%", "37.6%"],
    "office-ac": ["62.8%", "37.6%"],
    "entry-sensor": ["84.3%", "69.8%"],
    "drive-camera": ["89%", "61.3%"]
  };

  function escapeText(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function money(value) {
    return `$${value.toFixed(2)}`;
  }

  function icon(kind) {
    const paths = {
      bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
      sensor: '<rect x="7" y="5" width="10" height="14" rx="3"/><path d="M10 9h4m-2 0v5m-8-7a11 11 0 0 0 0 10m12-10a11 11 0 0 1 0 10"/>',
      camera: '<path d="M4 8h4l2-3h5l2 3h3v11H4z"/><circle cx="12" cy="13" r="3"/>'
    };
    return `<svg class="product-icon" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[kind] || paths.bolt}</g></svg>`;
  }

  function renderHouse() {
    return `<div class="interactive-home">
      <div class="home-scene">
        <div class="scene-heading"><span>EXPLORE THE HOME</span><span>2 STOREYS · 13 CONTROL POINTS</span></div>
        <svg class="home-drawing" viewBox="0 0 980 560" role="img" aria-labelledby="home-scene-title home-scene-desc">
          <title id="home-scene-title">Interactive two-storey smart home</title>
          <desc id="home-scene-desc">A detailed cutaway house with two floors, bedrooms, office, living room, kitchen, garage, windows, lights, TV and entry. Select a glowing point to explore app control.</desc>
          <defs>
            <linearGradient id="upper-floor" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#fbf8ee"/><stop offset="1" stop-color="#e9e3d4"/></linearGradient>
            <linearGradient id="lower-floor" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#faf6eb"/><stop offset="1" stop-color="#e5dfd0"/></linearGradient>
            <linearGradient id="roof-fill" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#526d78"/><stop offset=".55" stop-color="#344f60"/><stop offset="1" stop-color="#22394d"/></linearGradient>
            <linearGradient id="wall-fill" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fffdf7"/><stop offset="1" stop-color="#e7e9df"/></linearGradient>
            <filter id="home-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#102331" flood-opacity=".17"/></filter>
          </defs>
          <ellipse class="house-shadow" cx="490" cy="510" rx="395" ry="25"/>
          <g filter="url(#home-shadow)">
            <path class="roof-shadow" d="M83 153 490 29 897 153 886 168 490 51 94 168Z"/>
            <path class="roof-shape" d="M78 145 490 23 902 145 890 157 490 39 90 157Z"/>
            <path class="roof-tiles" d="M169 119 490 28m-273 105 316-91m-258 108 315-92m-258 108 315-91m-256 108 256-75m-191-49 270 78m-329-61 270 79m-329-61 270 79m-329-61 270 79"/>
            <path class="roof-eave" d="M80 145 490 23 902 145l-12 12L490 39 90 157Z"/>
            <path class="house-outline" d="M124 155 490 52l366 103v338H124z"/>
            <path class="exterior-wall" d="M124 155 143 160v322l-19 14zm713 0 19 5v322l-19-5z"/>
            <rect class="upper-room" x="143" y="158" width="333" height="173" rx="2"/>
            <rect class="upper-room upper-room-alt" x="486" y="158" width="313" height="173" rx="2"/>
            <rect class="lower-room" x="143" y="344" width="333" height="139" rx="2"/>
            <rect class="lower-room lower-room-alt" x="486" y="344" width="313" height="139" rx="2"/>
            <g class="room-lighting">
              <rect class="room-light" data-house-point="bedroom-lights" x="143" y="158" width="333" height="173"/>
              <rect class="room-light" data-house-point="living-lights" x="143" y="344" width="333" height="151"/>
              <rect class="room-light" data-house-point="dining-pendant" x="486" y="344" width="115" height="151"/>
              <rect class="room-light" data-house-point="kitchen-lights" x="601" y="344" width="198" height="151"/>
              <rect class="room-light" data-house-point="office-lights" x="486" y="158" width="313" height="173"/>
            </g>
            <path class="house-wall" d="M124 337h732M480 157v180M806 157v180"/>
            <path class="wall-corner" d="M143 163h333m10 0h318M143 348h333m10 0h318"/>
            <path class="floor-trim" d="M143 330h656m-656 13h656m-656 140h656"/>
            <path class="floorboards" d="M154 470h307m-307 6h307m22-6h306m-306 6h306m-613-142h309m15 0h298"/>
            <path class="room-lines" d="M160 320h298m34 0h292"/>
            <g class="window-frame">
              <rect x="163" y="193" width="86" height="76" rx="3"/><path d="M206 193v76m-43-39h86"/>
              <rect x="688" y="194" width="88" height="77" rx="3"/><path d="M732 194v77m-44-39h88"/>
              <rect x="160" y="371" width="99" height="73" rx="3"/><path d="M209 371v73m-49-37h99"/>
              <rect x="610" y="370" width="91" height="72" rx="3"/><path d="M655 370v72m-45-36h91"/>
            </g>
            <g class="shade-panels">
              <rect data-house-point="window-shades" data-open-offset="74" x="165" y="195" width="82" height="73" rx="2"/>
              <rect data-house-point="office-shades" data-open-offset="74" x="691" y="195" width="82" height="73" rx="2"/>
            </g>
            <g class="bedroom-furniture">
              <path class="furniture-shadow" d="M250 323h150l-8 4H258z"/>
              <path class="bed-frame" d="M263 291h122q7 0 7 7v17h-9v7h-7v-7H273v7h-7v-7h-8v-19q0-5 5-5z"/>
              <rect class="bed-headboard" x="254" y="270" width="12" height="50" rx="4"/>
              <path class="bed-mattress" d="M268 286h112q7 0 7 6v8H268z"/>
              <path class="bed-cover" d="M320 292h61v17h-61z"/>
              <path class="bed-cover-fold" d="M322 296h57"/>
              <rect class="bed-pillow" x="273" y="287" width="20" height="9" rx="4"/>
              <path class="office-chair" d="M631 290v-8q0-6 6-6h13q6 0 6 6v8h-25zm-2 8h30v7h-30zm15 7v13m-11 0h22"/>
              <path class="furniture-shadow" d="M550 323h133l-7 4h-119z"/>
              <rect class="desk-top" x="558" y="291" width="116" height="7" rx="2"/>
              <path class="desk-leg" d="M566 298v24m100-24v24"/>
              <rect class="desk-drawer" x="575" y="299" width="29" height="13" rx="2"/>
              <rect class="desk-monitor" x="590" y="274" width="34" height="18" rx="2"/>
              <path class="desk-monitor-stand" d="M607 292v5m-8 0h16"/>
            </g>
            <g class="living-furniture" data-house-point="living-tv">
              <path class="furniture-shadow" d="M193 478h120l-6 4H199zM386 478h62l-5 4h-52z"/>
              <path class="sofa-base" d="M200 448q0-6 7-6h92q7 0 7 6v20h-8v10h-91v-10h-7z"/>
              <path class="sofa-back" d="M206 431q0-7 7-7h80q7 0 7 7v23h-94z"/>
              <path class="sofa-seat" d="M210 450h42v14h-42zm45 0h39v14h-39z"/>
              <path class="sofa-arms" d="M196 440q0-6 7-6h7v35h-9q-5 0-5-5zm110-6h7q7 0 7 7v23q0 5-5 5h-9z"/>
              <path class="sofa-leg" d="M211 475v4m78-4v4"/>
              <path class="coffee-table" d="M327 458h39l-3 10h-33z"/><path class="coffee-table-legs" d="M333 468v10m27-10v10"/>
              <path class="tv-console" d="M386 456h62v22h-62z"/><path class="tv-console-line" d="M391 463h52m-47 10h10m26 0h10"/>
              <path class="tv-screen" d="M386 416q0-3 3-3h56q3 0 3 3v34h-62z"/>
              <path class="tv-screen-glint" d="M392 418h38l-25 28h-13z"/>
              <path class="tv-stand" d="M417 450v6m-12 0h24"/>
              <g class="floor-plant"><path d="M456 474v-26m0 15-10-11m10 15 11-15m-11 6 8-12"/><path d="M448 474h16l-2 7h-12z"/></g>
            </g>
            <g class="kitchen-furniture">
              <path class="kitchen-counter-shadow" d="M691 478h102l-5 4h-92z"/>
              <path class="kitchen-cabinet" d="M696 435h91v43h-91z"/><path class="kitchen-counter" d="M692 427h99v9h-99z"/>
              <path class="kitchen-cabinet-lines" d="M726 437v39m31-39v39m-57-18h22m37 0h25"/>
              <path class="kitchen-drawer-lines" d="M700 444h21m-21 7h21m40-7h21m-21 7h21"/>
              <ellipse class="kitchen-hob" cx="764" cy="431" rx="16" ry="3"/><circle class="kitchen-hob-ring" cx="759" cy="431" r="2"/><circle class="kitchen-hob-ring" cx="769" cy="431" r="2"/>
              <path class="kitchen-sink" d="M701 441h16v12h-16zM709 435v6m-5 0h10"/>
            </g>
            <g class="entry-door">
              <path class="entry-canopy" d="M799 389h53l-5-7h-43z"/>
              <rect class="door-frame" x="807" y="393" width="38" height="90" rx="2"/>
              <path class="door-leaf" d="M812 398h28v85h-28z"/>
              <path class="door-panel" d="M816 403h20v33h-20zm0 38h20v37h-20z"/>
              <circle cx="834" cy="444" r="2"/>
            </g>
            <g class="garage">
              <rect x="863" y="356" width="81" height="125" rx="3"/>
              <path d="M870 370h67m-67 16h67m-67 16h67m-67 16h67m-67 16h67m-67 16h67"/>
              <rect class="garage-panel" data-house-point="garage-door" data-open-offset="96" x="870" y="370" width="67" height="96" rx="2"/>
            </g>
            <g class="ceiling-lights">
              <g data-house-point="bedroom-lights"><circle class="light-glow" cx="305" cy="178" r="32"/><path d="M305 158v18m-12 0h24l-4 9h-16z"/><circle class="light-bulb" cx="305" cy="178" r="5"/></g>
              <g data-house-point="office-lights"><circle class="light-glow" cx="625" cy="178" r="32"/><path d="M625 158v18m-12 0h24l-4 9h-16z"/><circle class="light-bulb" cx="625" cy="178" r="5"/></g>
              <g data-house-point="living-lights"><circle class="light-glow" cx="318" cy="357" r="31"/><path d="M318 344v12m-10 0h20l-4 8h-12z"/><circle class="light-bulb" cx="318" cy="357" r="4"/></g>
              <g data-house-point="dining-pendant"><circle class="light-glow" cx="582" cy="357" r="31"/><path d="M582 344v12m-10 0h20l-4 8h-12z"/><circle class="light-bulb" cx="582" cy="357" r="4"/></g>
              <g data-house-point="kitchen-lights"><circle class="light-glow" cx="753" cy="350" r="29"/><circle class="light-bulb" cx="753" cy="350" r="4"/></g>
              <g data-house-point="kitchen-lights"><circle class="light-glow" cx="690" cy="350" r="29"/><circle class="light-bulb" cx="690" cy="350" r="4"/></g>
            </g>
            <g class="climate-unit" data-house-point="bedroom-ac">
              <path class="ac-shadow" d="M280 221h67l-4 4h-59z"/>
              <path class="ac-shell" d="M280 201q0-6 7-6h53q7 0 7 6v21h-67z"/>
              <path class="ac-front" d="M285 200h57v10h-57z"/>
              <path class="ac-seam" d="M283 213h61"/>
              <path class="ac-louver" d="M288 217q26 5 52 0"/>
              <circle class="ac-status" cx="340" cy="207" r="2"/>
              <text data-house-point="bedroom-ac" data-house-temperature x="333" y="207" text-anchor="middle">24°</text>
            </g>
            <g class="climate-unit" data-house-point="office-ac">
              <path class="ac-shadow" d="M582 221h67l-4 4h-59z"/>
              <path class="ac-shell" d="M582 201q0-6 7-6h53q7 0 7 6v21h-67z"/>
              <path class="ac-front" d="M587 200h57v10h-57z"/>
              <path class="ac-seam" d="M585 213h61"/>
              <path class="ac-louver" d="M590 217q26 5 52 0"/>
              <circle class="ac-status" cx="642" cy="207" r="2"/>
              <text data-house-point="office-ac" data-house-temperature x="635" y="207" text-anchor="middle">24°</text>
            </g>
            <g class="entry-sensor" data-house-point="entry-sensor">
              <rect class="sensor-body" x="819" y="452" width="10" height="24" rx="4"/>
              <circle class="sensor-led" cx="824" cy="457" r="2.5"/><path d="M822 465h4"/>
            </g>
            <g class="drive-camera" data-house-point="drive-camera">
              <path class="camera-vision" data-camera-view d="M872 343 974 384 974 480Z"/>
              <path class="camera-arm" d="M838 343h8m-8-10v20m8-16v12"/>
              <g class="camera-head" data-camera-view>
                <path class="camera-body" d="M846 336q0-4 4-4h14q4 0 6 4l5 4v7l-5 4q-2 4-6 4h-14q-4 0-4-4z"/>
                <path class="camera-face" d="M870 340v7l5-3.5z"/>
                <circle class="camera-lens-ring" cx="870" cy="343.5" r="5"/>
                <circle class="camera-lens" cx="871" cy="343.5" r="2.6"/>
                <circle class="camera-led" cx="852" cy="338" r="1.8"/>
              </g>
              <path class="camera-base" d="M836 331v24m0-12h5"/>
            </g>
            <path class="outside-ground" d="M64 500h876"/>
            <path class="entry-landing" d="M795 483h61v8h-61zm6 8h49l5 9h-59z"/>
            <path class="driveway" d="M850 484h99v16h-99z"/>
            <g class="landscape"><path d="M95 499v-43m0 15-15-16m15 25 15-20m-15 28 20-16"/><circle cx="95" cy="450" r="7"/><path d="M65 500h55"/><path d="M765 501v-26m0 12-10-11m10 17 10-13"/><circle cx="765" cy="472" r="6"/></g>
          </g>
        </svg>
        ${homePoints.map((point) => {
          const [left, top] = hotspotPositions[point.id];
          return `<button class="home-hotspot hotspot-${point.kind}${activeHomeFeature === point.id ? " is-active" : ""}" type="button" data-home-feature="${point.id}" aria-label="Control ${escapeText(point.name)} in ${escapeText(point.room)}" aria-pressed="${activeHomeFeature === point.id}" style="--hotspot-x:${left};--hotspot-y:${top}"><span class="hotspot-glyph" aria-hidden="true">${point.kind === "light" ? "✦" : point.kind === "shade" ? "↕" : point.kind === "device" ? "⌁" : point.kind === "sensor" ? "◉" : "◌"}</span><span class="hotspot-name">${escapeText(point.name)}</span></button>`;
        }).join("")}
        <div class="floor-key"><span><i class="key-dot key-light"></i>Lighting</span><span><i class="key-dot key-shade"></i>Shades & doors</span><span><i class="key-dot key-device"></i>Devices & security</span></div>
      </div>
      ${renderPhoneApp()}
    </div>`;
  }

  function renderPhoneApp() {
    const point = pointById.get(activeHomeFeature) || homePoints[0];
    const state = pointStates.get(point.id);
    const iconName = point.kind === "light" ? "✦" : point.kind === "shade" ? "↕" : point.kind === "device" ? "⌁" : point.kind === "sensor" ? "◉" : "◌";
    let control = "";
    if (point.kind === "light") {
      control = `<div class="phone-control-row"><span>Power</span><button class="app-toggle${state.on ? " is-on" : ""}" type="button" data-app-power aria-pressed="${state.on}" aria-label="${state.on ? "Turn off" : "Turn on"} ${escapeText(point.name)}"><span></span></button></div>
        <label class="phone-range-label" for="point-range"><span>Brightness</span><strong id="range-value">${state.value}%</strong></label><input class="phone-range" id="point-range" type="range" min="0" max="100" value="${state.value}" data-point-range aria-label="Set light brightness">`;
    } else if (point.kind === "shade") {
      control = `<label class="phone-range-label" for="point-range"><span>Position</span><strong id="range-value">${state.value}% open</strong></label><input class="phone-range shade-range" id="point-range" type="range" min="0" max="100" value="${state.value}" data-point-range aria-label="Set shade or door position"><div class="phone-control-actions"><button type="button" data-shade-position="0">Close</button><button type="button" data-shade-position="100">Open</button></div>`;
    } else if (point.id === "bedroom-ac" || point.id === "office-ac") {
      control = `<div class="climate-control"><button type="button" data-temperature="-1" aria-label="Lower temperature">−</button><strong><span id="temperature-value">${state.temperature}</span><small>°C</small></strong><button type="button" data-temperature="1" aria-label="Raise temperature">＋</button></div><div class="phone-control-row"><span>Power</span><button class="app-toggle${state.on ? " is-on" : ""}" type="button" data-app-power aria-pressed="${state.on}" aria-label="${state.on ? "Turn off" : "Turn on"} ${escapeText(point.name)}"><span></span></button></div>`;
    } else if (point.kind === "device") {
      control = `<div class="phone-control-row"><span>Power</span><button class="app-toggle${state.on ? " is-on" : ""}" type="button" data-app-power aria-pressed="${state.on}" aria-label="${state.on ? "Turn off" : "Turn on"} ${escapeText(point.name)}"><span></span></button></div><p class="phone-status-copy">Compatible IR remote · Smart Life app</p>`;
    } else if (point.kind === "camera") {
      control = `<div class="phone-control-row"><span>Camera</span><button class="app-toggle${state.on ? " is-on" : ""}" type="button" data-app-power aria-pressed="${state.on}" aria-label="${state.on ? "Pause" : "Enable"} ${escapeText(point.name)}"><span></span></button></div>
        <label class="phone-range-label" for="camera-angle-range"><span>View direction</span><strong id="camera-angle-value">${state.angle}°</strong></label><input class="phone-range" id="camera-angle-range" type="range" min="-55" max="55" step="1" value="${state.angle}" data-camera-angle aria-label="Move camera view direction">
        <div class="security-status${state.on ? " is-on" : ""}"><span class="security-indicator"></span><span>${state.on ? "Camera active" : "Camera paused"}<small>Drag the slider to aim the coverage cone</small></span></div>`;
    } else {
      control = `<div class="phone-control-row"><span>Monitoring</span><button class="app-toggle${state.on ? " is-on" : ""}" type="button" data-app-power aria-pressed="${state.on}" aria-label="${state.on ? "Pause" : "Enable"} ${escapeText(point.name)}"><span></span></button></div><div class="security-status${state.on ? " is-on" : ""}"><span class="security-indicator"></span><span>${state.on ? "Entry point monitored" : "Monitoring paused"}<small>Planning concept · verify device at site visit</small></span></div>`;
    }
    return `<aside class="phone-column" aria-label="Interactive smart-home phone app">
      <div class="phone-intro"><span class="phone-live-dot"></span><span>YOUR HOME, IN YOUR HAND</span><span class="phone-live-label">LIVE DEMO</span></div>
      <div class="phone-device">
        <div class="phone-side-button"></div>
        <div class="phone-screen">
          <div class="phone-statusbar"><span>9:41</span><span class="phone-signal" aria-label="Wi-Fi connected">●●●  ▰</span></div>
          <div class="phone-appbar"><span class="phone-app-mark">s</span><span><small>SMART LIFE</small><strong>My Home</strong></span><button class="phone-menu" type="button" aria-label="App menu">•••</button></div>
          <div class="phone-home-status"><span><i></i> Home connected</span><span>2.4 GHz</span></div>
          <div class="phone-room-line"><span>${escapeText(point.room)}</span><span class="phone-room-marker">SELECTED</span></div>
          <button class="phone-selected-device is-prompted" type="button" data-open-point aria-label="View details and choose ${escapeText(point.name)}">
            <div class="phone-device-icon phone-icon-${point.kind}" aria-hidden="true">${iconName}</div>
            <div class="phone-selected-copy"><strong>${escapeText(point.name)}</strong><span>${escapeText(point.kind === "sensor" ? (state.on ? "Monitoring · active" : "Monitoring · paused") : point.kind === "camera" ? (state.on ? "Camera · active" : "Camera · paused") : (state.on ? "Online · ready to control" : "Online · switched off"))}</span><small>View point & added value ↗</small></div>
          </button>
          <div class="phone-control-card">${control}</div>
          <div class="phone-app-footer"><span>⌂<small>Home</small></span><span>◷<small>Scenes</small></span><span>☷<small>Smart</small></span><span>♙<small>Profile</small></span></div>
        </div>
      </div>
      <p class="phone-demo-note">Demo controls only — no hardware is connected.</p>
    </aside>`;
  }

  function pointPrice(point) {
    const product = productById.get(point.productId);
    return productPrice(product, point.variantId || switchVariant);
  }

  function showPointDetails(pointId = activeHomeFeature) {
    const point = pointById.get(pointId);
    if (!point) return;
    const product = productById.get(point.productId);
    const variant = product.variants && product.variants.find((item) => item.id === point.variantId);
    const image = product.image
      ? `<img class="point-detail-image" src="${escapeText(product.image)}" alt="${escapeText(product.alt)}" width="420" height="420">`
      : `<div class="point-detail-icon">${icon(product.icon)}</div>`;
    document.getElementById("point-dialog-content").innerHTML = `<div class="point-dialog-heading">
        <div><p class="eyebrow">${escapeText(point.room)} · ${point.points} point${point.points === 1 ? "" : "s"}</p><h2 id="point-title">${escapeText(point.name)}</h2></div>
        <button class="icon-button" type="button" data-close-point aria-label="Close point details">×</button>
      </div>
      <div class="point-detail-main">${image}<div><span class="point-detail-type">${escapeText(product.name)}${variant ? ` · ${escapeText(variant.name)}` : ""}</span><p>${escapeText(point.value)}</p></div></div>
      <div class="added-value-note"><span class="value-mark" aria-hidden="true">✦</span><div><strong>THE ADDED VALUE</strong><p>${escapeText(point.note)}</p></div></div>
      <div class="point-estimate"><span>Illustrative draft product estimate</span><strong>${money(pointPrice(point))}</strong></div>
      <p class="point-dialog-disclaimer">Not a quotation. Check model compatibility, wiring, motor/load ratings and installation needs at the site visit.</p>
      <div class="point-dialog-actions"><button class="button button-outline" type="button" data-close-point>Keep exploring</button><button class="button button-secondary" type="button" data-add-home-point="${point.id}">Add ${point.points} point${point.points === 1 ? "" : "s"} to my plan <span aria-hidden="true">＋</span></button></div>`;
    pointDialog.showModal();
  }

  function updateHomeFeature(featureId) {
    const point = pointById.get(featureId);
    if (!point) return;
    activeHomeFeature = featureId;
    app.querySelectorAll("[data-home-feature]").forEach((button) => {
      const active = button.dataset.homeFeature === featureId;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    syncHomeEffects();
    const stage = app.querySelector(".phone-column");
    const rendered = document.createElement("div");
    rendered.innerHTML = renderPhoneApp();
    stage.replaceWith(rendered.firstElementChild);
    liveStatus.textContent = `${point.name} selected. Phone controls updated.`;
  }

  function syncHomeEffects() {
    app.querySelectorAll("[data-house-point]").forEach((element) => {
      const state = pointStates.get(element.dataset.housePoint);
      if (!state) return;
      element.classList.toggle("is-on", state.on);
      element.classList.toggle("is-off", !state.on);
      if (element.querySelector(".light-glow")) {
        element.style.setProperty("--light-opacity", String(state.on ? state.value / 150 : 0));
      }
      if (element.classList.contains("room-light")) {
        element.style.setProperty("--room-light-opacity", String(state.on ? state.value / 240 : 0));
      }
      if (element.hasAttribute("data-open-offset")) {
        const maxOffset = Number(element.dataset.openOffset);
        element.style.setProperty("--shade-offset", `${maxOffset * state.value / 100}px`);
      }
      if (element.hasAttribute("data-house-temperature")) {
        element.textContent = `${state.temperature}°`;
      }
    });
    const cameraState = pointStates.get("drive-camera");
    app.querySelectorAll("[data-camera-view]").forEach((element) => {
      element.setAttribute("transform", `rotate(${cameraState.angle} 872 343)`);
    });
  }

  function renderHome() {
    return `<section class="tab-panel home-panel" id="panel-home" role="tabpanel" aria-labelledby="tab-home">
      <div class="home-hero">
        <div class="hero-copy">
          <p class="eyebrow"><span class="status-dot"></span>Smarter, without the renovation</p>
          <h1>Control the home<br><span>you already have.</span></h1>
          <p class="hero-text">Make existing lights, shutters and everyday devices smart. Start with a ready-made bundle or build one point at a time.</p>
          <div class="hero-actions">
            <button class="button button-primary" type="button" data-tab="bundles">Explore bundles <span aria-hidden="true">→</span></button>
            <button class="button button-quiet" type="button" data-tab="build">Build my own <span aria-hidden="true">＋</span></button>
          </div>
          <div class="hero-proof"><span>Smart Life app</span><span>2.4 GHz Wi-Fi</span><span>No hub</span><span>Future direction: own-brand products</span></div>
        </div>
        <div class="hero-product"><span class="hero-orbit"></span><img src="smarthome-copilot-pack/assets/images/hero-wifi-module.webp" width="947" height="967" alt="Compact Wi-Fi module with wireless signal" fetchpriority="high"><span class="hero-caption">Small module. Big difference.</span></div>
      </div>
      <div class="home-bottom">
        <div class="home-explorer">${renderHouse()}</div>
      </div>
    </section>`;
  }

  function renderRoutineWidget() {
    const routine = routines.find((entry) => entry.id === activeRoutine);
    return `<div class="routine-widget-heading"><div><p class="eyebrow">A day, made simpler</p><h2>Try a routine</h2></div><span class="routine-spark" aria-hidden="true">✳</span></div>
      <div class="routine-tabs" role="group" aria-label="Choose an example routine">${routines.map((item) => `<button type="button" class="routine-tab${item.id === routine.id ? " is-active" : ""}" data-routine="${item.id}" aria-pressed="${item.id === routine.id}">${escapeText(item.name)}</button>`).join("")}</div>
      <p class="routine-trigger">${escapeText(routine.trigger)}</p>
      <ul class="routine-actions">${routine.actions.map((action) => `<li><span aria-hidden="true">✓</span>${escapeText(action)}</li>`).join("")}</ul>`;
  }

  function renderRoutines() {
    return `<section class="tab-panel content-panel routines-panel" id="panel-routines" role="tabpanel" aria-labelledby="tab-routines" hidden>
      <div class="panel-heading"><div><p class="eyebrow">Daily automations</p><h1>Your home, your rhythm</h1></div><p>Choose an example routine to explore how schedules, one-tap scenes and voice commands can bring devices together.</p></div>
      <div class="routine-workbench"><div class="routine-widget">${renderRoutineWidget()}</div>
        <p class="routine-disclaimer">Routine actions are examples. They depend on the compatible devices installed and the app setup.</p>
      </div>
    </section>`;
  }

  function packageTotals(pack) {
    return pack.bundleIds.reduce((total, bundleId) => {
      const bundle = bundleById.get(bundleId);
      return { points: total.points + bundle.points, price: total.price + bundle.price };
    }, { points: 0, price: 0 });
  }

  function renderBundleCard(bundle) {
    return `<article class="bundle-card">
      <div class="card-topline"><span class="bundle-audience">${escapeText(bundle.audience)}</span><span class="points-pill">${bundle.points} points</span></div>
      <h3>${escapeText(bundle.name)}</h3><p class="bundle-description">${escapeText(bundle.summary)}</p>
      <ul class="included-list">${bundle.contents.map((item) => `<li><span aria-hidden="true">✓</span>${escapeText(item)}</li>`).join("")}</ul>
      <div class="card-price"><span>Draft product estimate</span><strong>${money(bundle.price)}</strong></div>
      <button class="button button-secondary" type="button" data-add-bundle="${bundle.id}">Choose this bundle <span aria-hidden="true">＋</span></button>
    </article>`;
  }

  function renderPackageCard(pack) {
    const totals = packageTotals(pack);
    const bundleNames = pack.bundleIds.map((id) => bundleById.get(id).name);
    return `<article class="package-card">
      <div class="card-topline"><span class="bundle-audience">${escapeText(pack.audience)}</span><span class="points-pill">${totals.points} points</span></div>
      <p class="package-kicker">PACKAGE · ${bundleNames.length} BUNDLES + SERVICE PATH</p>
      <h3>${escapeText(pack.name)}</h3><p class="bundle-description">${escapeText(pack.summary)}</p>
      <div class="package-composition"><span>Included bundles</span><strong>${bundleNames.map(escapeText).join(" + ")}</strong></div>
      <div class="workflow-mini">${pack.workflow.map((step, index) => `<span><i>${index + 1}</i>${escapeText(step)}</span>`).join("")}</div>
      <div class="card-price"><span>Draft product estimate</span><strong>${money(totals.price)}</strong></div>
      <p class="service-price-note">Installation service is optional; final service scope and price follow a site review.</p>
      <button class="button button-secondary" type="button" data-add-package="${pack.id}">Choose this package <span aria-hidden="true">＋</span></button>
    </article>`;
  }

  function renderBundles() {
    return `<section class="tab-panel content-panel" id="panel-bundles" role="tabpanel" aria-labelledby="tab-bundles" hidden>
      <div class="panel-heading"><div><p class="eyebrow">Choose how to start</p><h1>Bundles & packages</h1></div><p>Choose a product bundle or combine bundles with a site-visit and implementation service.</p></div>
      <div class="subsection-heading"><h2>Point-based bundles</h2><p>One point means one independently controlled circuit or device. Prices are illustrative draft USD estimates.</p></div>
      <div class="bundle-grid">${bundles.map(renderBundleCard).join("")}</div>
      <div class="subsection-heading package-heading"><div><h2>Packages: bundles plus a service path</h2><p>Each package combines more than one bundle. Service costs are quoted after the site review.</p></div></div>
      <div class="package-grid">${packages.map(renderPackageCard).join("")}</div>
      <p class="pricing-disclaimer">Draft pricing only. Product selection, compatibility, availability, point count and final quotation are confirmed after review. Prices exclude any unquoted installation service.</p>
    </section>`;
  }

  function productPoints(product, variantId = switchVariant) {
    if (product.id !== "switch") return product.points;
    return product.variants.find((variant) => variant.id === variantId).points;
  }

  function productPrice(product, variantId = switchVariant) {
    return product.price * productPoints(product, variantId);
  }

  function renderBuildCard(product) {
    const quantity = quantities.get(product.id);
    const points = productPoints(product);
    const price = productPrice(product);
    return `<article class="build-card">
      <div class="build-product-heading">${product.image
        ? `<img src="${escapeText(product.image)}" width="1200" height="1245" alt="${escapeText(product.alt)}" loading="lazy">`
        : `<span class="build-icon">${icon(product.icon)}</span>`}
        <div><h3>${escapeText(product.name)}</h3><p>${money(product.price)} ${escapeText(product.unit)}</p></div>
      </div>
      ${product.id === "switch" ? `<div class="variant-picker" role="group" aria-label="Choose switch module gang">${product.variants.map((variant) => `<button type="button" class="variant-button${variant.id === switchVariant ? " is-active" : ""}" data-switch-variant="${variant.id}" aria-pressed="${variant.id === switchVariant}">${escapeText(variant.name)}<span>${variant.points} pt</span></button>`).join("")}</div>` : ""}
      <p class="build-point-note">${escapeText(product.pointLabel)}</p>
      <div class="quantity-control"><span>Quantity</span><div><button type="button" aria-label="Remove one ${escapeText(product.name)}" data-quantity-step="-1" data-id="${product.id}">−</button><output aria-label="Selected quantity">${quantity}</output><button type="button" aria-label="Add one ${escapeText(product.name)}" data-quantity-step="1" data-id="${product.id}">＋</button></div></div>
      <div class="build-subtotal"><span>${quantity} × ${points} pt</span><strong>${quantity ? money(quantity * price) : "—"}</strong></div>
    </article>`;
  }

  function renderBuild() {
    const total = products.reduce((sum, product) => sum + quantities.get(product.id) * productPrice(product), 0);
    const points = products.reduce((sum, product) => sum + quantities.get(product.id) * productPoints(product), 0);
    return `<section class="tab-panel content-panel" id="panel-build" role="tabpanel" aria-labelledby="tab-build" hidden>
      <div class="panel-heading"><div><p class="eyebrow">You are in control</p><h1>Build a bundle</h1></div><p>Choose the devices and quantity. Your point count and draft estimate update as you go.</p></div>
      <div class="builder-summary"><div><span>Selected points</span><strong id="builder-points">${points}</strong></div><div><span>Draft product estimate</span><strong id="builder-total">${total ? money(total) : "—"}</strong></div><button class="button button-primary" type="button" data-add-custom>Add selection to my plan <span aria-hidden="true">→</span></button></div>
      <div class="build-grid">${products.map(renderBuildCard).join("")}</div>
      <p class="pricing-disclaimer">Draft USD estimates only. Each controlled circuit or device counts as one point. Confirm compatibility, wiring, load ratings, device quantities and final pricing at the site review.</p>
    </section>`;
  }

  function renderDevice(product) {
    const selected = plan.get(`product:${product.id}:${product.id === "switch" ? switchVariant : ""}`);
    return `<article class="device-card">
      <div class="device-visual">${product.image ? `<img src="${escapeText(product.image)}" width="1200" height="1245" alt="${escapeText(product.alt)}" loading="lazy">` : icon(product.icon)}</div>
      <div class="device-copy"><p class="eyebrow">${escapeText(product.unit)}</p><h2>${escapeText(product.name)}</h2><p>${escapeText(product.description)}</p>
        <ul class="device-features">${product.features.map((feature) => `<li><span aria-hidden="true">✓</span>${escapeText(feature)}</li>`).join("")}</ul>
        <div class="spec-list">${product.specs.map((spec) => `<span>${escapeText(spec)}</span>`).join("")}</div>
        ${product.safety ? `<p class="safety-note"><strong>Before installation:</strong> ${escapeText(product.safety)}</p>` : ""}
        ${product.id === "switch" ? `<div class="device-variants" role="group" aria-label="Switch module version">${product.variants.map((variant) => `<button class="device-variant${variant.id === switchVariant ? " is-active" : ""}" type="button" data-switch-variant="${variant.id}" aria-pressed="${variant.id === switchVariant}"><img src="${escapeText(variant.image)}" width="${variant.width}" height="${variant.height}" alt="" loading="lazy"><span>${escapeText(variant.name)}</span><small>${variant.points} point${variant.points > 1 ? "s" : ""}</small></button>`).join("")}</div>` : ""}
        <div class="device-footer"><strong>${money(productPrice(product))}<small> draft estimate</small></strong><button class="button button-secondary" type="button" data-add-device="${product.id}">${selected ? "Add another" : "Add to my plan"} <span aria-hidden="true">＋</span></button></div>
      </div>
    </article>`;
  }

  function renderDevices() {
    return `<section class="tab-panel content-panel" id="panel-devices" role="tabpanel" aria-labelledby="tab-devices" hidden>
      <div class="panel-heading"><div><p class="eyebrow">Buy devices separately</p><h1>Make it your own</h1></div><p>Choose a device, then decide later whether you need supply only or a site visit and implementation.</p></div>
      <div class="device-grid">${products.map(renderDevice).join("")}</div>
      <p class="pricing-disclaimer">All prices shown are illustrative draft USD estimates, not a quotation. Sensors, cameras and compatible controllers require model and installation confirmation.</p>
    </section>`;
  }

  function lineDescription(line) {
    if (line.type === "bundle") return `${bundleById.get(line.id).name} bundle`;
    if (line.type === "package") return `${packageById.get(line.id).name} package`;
    const product = productById.get(line.id);
    const variant = product.variants && product.variants.find((item) => item.id === line.variantId);
    return `${product.name}${variant ? ` · ${variant.name}` : ""}`;
  }

  function linePoints(line) {
    if (line.type === "bundle") return bundleById.get(line.id).points;
    if (line.type === "package") return packageTotals(packageById.get(line.id)).points;
    return productPoints(productById.get(line.id), line.variantId);
  }

  function linePrice(line) {
    if (line.type === "bundle") return bundleById.get(line.id).price;
    if (line.type === "package") return packageTotals(packageById.get(line.id)).price;
    return productPrice(productById.get(line.id), line.variantId);
  }

  function renderPlan() {
    const lines = Array.from(plan.values());
    const total = lines.reduce((sum, line) => sum + line.quantity * linePrice(line), 0);
    const points = lines.reduce((sum, line) => sum + line.quantity * linePoints(line), 0);
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    return `<section class="tab-panel content-panel plan-panel" id="panel-plan" role="tabpanel" aria-labelledby="tab-plan" hidden>
      <div class="panel-heading"><div><p class="eyebrow">Your choices, your call</p><h1>My plan <span class="inline-count">${count}</span></h1></div><p>Review products and bundles. Add installation service if you want to continue through a site visit and quotation.</p></div>
      <div class="plan-layout">
        <div class="plan-main">
          <section class="project-profile" aria-label="Project profile">
            <div><p class="eyebrow">Set the direction</p><h2>What are you planning?</h2></div>
            <label>Project type<select id="project-type"><option value="existing"${projectType === "existing" ? " selected" : ""}>Upgrade an existing space</option><option value="new"${projectType === "new" ? " selected" : ""}>Plan a completely new space</option></select></label>
            <label>Property type<select id="property-type"><option value="residential"${propertyType === "residential" ? " selected" : ""}>Residential</option><option value="small-office"${propertyType === "small-office" ? " selected" : ""}>Small office</option><option value="retail"${propertyType === "retail" ? " selected" : ""}>Retail</option></select></label>
          </section>
          ${lines.length ? `<div class="plan-lines">${lines.map((line) => `<article class="plan-line"><div><span class="plan-line-type">${escapeText(line.type)}</span><h2>${escapeText(lineDescription(line))}</h2><p>${linePoints(line)} point${linePoints(line) === 1 ? "" : "s"} · ${money(linePrice(line))} each</p></div><div class="line-controls"><label class="sr-only" for="qty-${line.key}">Quantity for ${escapeText(lineDescription(line))}</label><input id="qty-${line.key}" type="number" min="0" max="99" value="${line.quantity}" data-plan-quantity="${line.key}"><button type="button" data-remove-line="${line.key}">Remove</button></div><strong class="line-total">${money(line.quantity * linePrice(line))}</strong></article>`).join("")}</div>`
        : `<div class="empty-plan"><span aria-hidden="true">⌂</span><h2>Your plan is ready when you are.</h2><p>Choose a bundle, package or individual device. Your draft stays on this device.</p><button class="button button-secondary" type="button" data-tab="bundles">Explore bundles <span aria-hidden="true">→</span></button></div>`}
          <div class="service-choice"><label><input type="checkbox" id="service-toggle"${includeService ? " checked" : ""}><span class="custom-check" aria-hidden="true"></span><span><strong>Include supply & apply service</strong><small>Consultation, site review, itemized quotation and implementation.</small></span></label>
            <p>${includeService ? "Service selected. Final scope and price will be proposed after the site review." : "Prefer supply only? Leave this off. You can add service at any time."}</p>
          </div>
        </div>
        <aside class="plan-aside">
          <p class="eyebrow">A clear next step</p><h2>From selection to smart home.</h2>
          <ol class="journey-list"><li><span>01</span><div><strong>Choose</strong><small>Bundles or separate devices</small></div></li><li class="${includeService ? "journey-active" : ""}"><span>02</span><div><strong>Site visit</strong><small>Review your space and requirements</small></div></li><li class="${includeService ? "journey-active" : ""}"><span>03</span><div><strong>Quotation</strong><small>Confirm products, points and service</small></div></li><li class="${includeService ? "journey-active" : ""}"><span>04</span><div><strong>Supply & implementation</strong><small>Proceed when the scope is agreed</small></div></li></ol>
          <div class="estimate-total"><span>${points} points · draft product estimate</span><strong>${lines.length ? money(total) : "—"}</strong><small>${includeService ? "Service is selected but not included in this product estimate." : "Supply-only estimate. Installation is not included."}</small></div>
          <button class="button button-primary brief-button" type="button" data-open-brief${lines.length ? "" : " disabled"}>Prepare site-visit brief <span aria-hidden="true">→</span></button>
          <p class="plan-disclaimer">No order is placed and no visit is booked from this draft.</p>
        </aside>
      </div>
    </section>`;
  }

  function render() {
    app.innerHTML = `${renderHome()}${renderBundles()}${renderBuild()}${renderDevices()}${renderRoutines()}${renderPlan()}`;
    syncHomeEffects();
    app.querySelectorAll('[role="tabpanel"]').forEach((panel) => {
      panel.hidden = panel.id !== `panel-${activeTab}`;
    });
    tabs.forEach((tab) => {
      const selected = tab.id === `tab-${activeTab}`;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    planCount.textContent = String(Array.from(plan.values()).reduce((sum, item) => sum + item.quantity, 0));
  }

  function activateTab(tabId, focusTab = false) {
    const tab = tabs.find((entry) => entry.id === `tab-${tabId}`);
    if (!tab) return;
    activeTab = tabId;
    render();
    if (focusTab) document.getElementById(`tab-${tabId}`).focus();
  }

  function addLine(type, id, quantity = 1, variantId = null) {
    const key = type === "product" ? `product:${id}:${variantId || ""}` : `${type}:${id}`;
    const existing = plan.get(key);
    plan.set(key, {
      key, type, id, variantId,
      quantity: Math.min(99, (existing ? existing.quantity : 0) + quantity)
    });
  }

  function addHomePoint(pointId) {
    const point = pointById.get(pointId);
    if (!point) return;
    addLine("product", point.productId, 1, point.variantId || null);
    includeService = false;
    pointDialog.close();
    activeTab = "plan";
    liveStatus.textContent = `${point.name} added to your plan.`;
    render();
  }

  function addCustomSelection() {
    let added = 0;
    products.forEach((product) => {
      const quantity = quantities.get(product.id);
      if (!quantity) return;
      addLine("product", product.id, quantity, product.id === "switch" ? switchVariant : null);
      quantities.set(product.id, 0);
      added += quantity;
    });
    if (!added) {
      liveStatus.textContent = "Choose at least one device before adding your bundle.";
      return;
    }
    activeTab = "plan";
    liveStatus.textContent = "Your custom bundle has been added to the plan.";
    render();
  }

  function renderBriefText() {
    const lines = Array.from(plan.values());
    const total = lines.reduce((sum, line) => sum + line.quantity * linePrice(line), 0);
    const points = lines.reduce((sum, line) => sum + line.quantity * linePoints(line), 0);
    return [
      "SmartHome site-visit brief",
      "",
      ...lines.map((line) => `${line.quantity} × ${lineDescription(line)} — ${linePoints(line)} point(s) each — ${money(line.quantity * linePrice(line))}`),
      "",
      `Estimated points: ${points}`,
      `Project: ${projectTypeLabels[projectType]} · ${propertyTypeLabels[propertyType]}`,
      `Draft product estimate: ${money(total)} USD`,
      `Supply & apply service: ${includeService ? "Requested; scope and price to be quoted after site review." : "Not selected."}`,
      "",
      "Draft only. No order has been placed and no site visit has been booked."
    ].join("\n");
  }

  app.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.tab) {
      activateTab(target.dataset.tab);
    } else if (target.dataset.homeFeature) {
      updateHomeFeature(target.dataset.homeFeature);
    } else if (target.hasAttribute("data-open-point")) {
      showPointDetails();
    } else if (target.hasAttribute("data-app-power")) {
      const state = pointStates.get(activeHomeFeature);
      state.on = !state.on;
      updateHomeFeature(activeHomeFeature);
    } else if (target.dataset.shadePosition) {
      pointStates.get(activeHomeFeature).value = Number(target.dataset.shadePosition);
      updateHomeFeature(activeHomeFeature);
    } else if (target.dataset.temperature) {
      const state = pointStates.get(activeHomeFeature);
      state.temperature = Math.max(16, Math.min(30, state.temperature + Number(target.dataset.temperature)));
      updateHomeFeature(activeHomeFeature);
    } else if (target.dataset.routine) {
      const routine = routines.find((item) => item.id === target.dataset.routine);
      if (!routine) return;
      activeRoutine = routine.id;
      app.querySelector(".routine-widget").innerHTML = renderRoutineWidget();
      app.querySelector(`[data-routine="${routine.id}"]`).focus();
    } else if (target.dataset.addBundle) {
      if (!bundleById.has(target.dataset.addBundle)) return;
      addLine("bundle", target.dataset.addBundle);
      activeTab = "plan";
      liveStatus.textContent = `${bundleById.get(target.dataset.addBundle).name} bundle added to your plan.`;
      render();
    } else if (target.dataset.addPackage) {
      if (!packageById.has(target.dataset.addPackage)) return;
      addLine("package", target.dataset.addPackage);
      includeService = true;
      activeTab = "plan";
      liveStatus.textContent = `${packageById.get(target.dataset.addPackage).name} package added to your plan.`;
      render();
    } else if (target.dataset.addCustom !== undefined) {
      addCustomSelection();
    } else if (target.dataset.addDevice) {
      const product = productById.get(target.dataset.addDevice);
      if (!product) return;
      addLine("product", product.id, 1, product.id === "switch" ? switchVariant : null);
      liveStatus.textContent = `${product.name} added to your plan.`;
      render();
    } else if (target.dataset.switchVariant) {
      switchVariant = target.dataset.switchVariant;
      if (!["1", "2", "3"].includes(switchVariant)) return;
      render();
      const focusTarget = document.getElementById(`panel-${activeTab}`)
        .querySelector(`[data-switch-variant="${switchVariant}"]`);
      if (focusTarget) focusTarget.focus();
    } else if (target.dataset.quantityStep) {
      const id = target.dataset.id;
      if (!quantities.has(id)) return;
      const next = Math.max(0, Math.min(99, quantities.get(id) + Number(target.dataset.quantityStep)));
      quantities.set(id, next);
      render();
    } else if (target.dataset.removeLine) {
      plan.delete(target.dataset.removeLine);
      liveStatus.textContent = "Item removed from your plan.";
      render();
    } else if (target.hasAttribute("data-open-brief")) {
      if (!plan.size) return;
      document.getElementById("brief-content").innerHTML = `<pre class="brief-preview">${escapeText(renderBriefText())}</pre>`;
      dialog.showModal();
    }
  });

  app.addEventListener("input", (event) => {
    if (event.target.matches("[data-camera-angle]")) {
      const angle = Number(event.target.value);
      pointStates.get("drive-camera").angle = angle;
      syncHomeEffects();
      const output = document.getElementById("camera-angle-value");
      if (output) output.textContent = `${angle}°`;
      return;
    }
    if (!event.target.matches("[data-point-range]")) return;
    const value = Number(event.target.value);
    pointStates.get(activeHomeFeature).value = value;
    syncHomeEffects();
    const output = document.getElementById("range-value");
    if (output) output.textContent = pointById.get(activeHomeFeature).kind === "shade" ? `${value}% open` : `${value}%`;
  });

  app.addEventListener("change", (event) => {
    const target = event.target;
    if (target.id === "service-toggle") {
      includeService = target.checked;
      render();
      return;
    }
    if (target.id === "project-type" && Object.hasOwn(projectTypeLabels, target.value)) {
      projectType = target.value;
      return;
    }
    if (target.id === "property-type" && Object.hasOwn(propertyTypeLabels, target.value)) {
      propertyType = target.value;
      return;
    }
    if (target.matches("[data-plan-quantity]")) {
      const line = plan.get(target.dataset.planQuantity);
      if (!line) return;
      const value = Number(target.value);
      if (!Number.isInteger(value) || value < 0 || value > 99) {
        liveStatus.textContent = "Enter a quantity from 0 to 99.";
        target.value = String(line.quantity);
        return;
      }
      if (value === 0) plan.delete(line.key);
      else line.quantity = value;
      liveStatus.textContent = "Your plan has been updated.";
      render();
    }
  });

  document.querySelector(".site-nav").addEventListener("click", (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab && tabs.includes(tab)) activateTab(tab.id.replace("tab-", ""));
  });
  document.querySelector(".site-nav").addEventListener("keydown", (event) => {
    const current = tabs.indexOf(event.target.closest('[role="tab"]'));
    if (current < 0) return;
    let next = current;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
    else return;
    event.preventDefault();
    activateTab(tabs[next].id.replace("tab-", ""), true);
  });
  document.querySelector(".brand[data-tab]").addEventListener("click", (event) => {
    event.preventDefault();
    activateTab("home");
  });

  document.getElementById("close-brief").addEventListener("click", () => dialog.close());
  document.getElementById("done-brief").addEventListener("click", () => dialog.close());
  document.getElementById("copy-brief").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(renderBriefText());
      liveStatus.textContent = "The site-visit brief was copied.";
    } catch (error) {
      liveStatus.textContent = "The brief could not be copied. You can select and copy the text in the preview.";
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  pointDialog.addEventListener("click", (event) => {
    if (event.target === pointDialog) pointDialog.close();
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.addHomePoint) addHomePoint(target.dataset.addHomePoint);
    else if (target.hasAttribute("data-close-point")) pointDialog.close();
  });

  themeButton.addEventListener("click", () => {
    const isDark = root.dataset.theme !== "dark";
    root.dataset.theme = isDark ? "dark" : "light";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeButton.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    themeButton.querySelector(".theme-label").textContent = isDark ? "Light" : "Dark";
    document.querySelector('meta[name="theme-color"]').content = isDark ? "#0f1b2d" : "#f5f6f2";
  });

  render();
})();
