(function (root, factory) {
  const catalog = factory();
  if (typeof module === "object" && module.exports) module.exports = catalog;
  if (root) root.StoreCatalog = catalog;
})(typeof globalThis === "object" ? globalThis : this, function () {
  "use strict";

  const imageRoot = "smarthome-copilot-pack/assets/images/";

  const products = [
    {
      id: "switch",
      name: "Smart switch module",
      description: "Add app and voice control behind the wall switches you already use. The switches still work manually.",
      image: `${imageRoot}device-switch-module.webp`,
      alt: "Wi-Fi switch module wired to an existing wall switch",
      price: 34.99,
      unit: "per circuit",
      pointLabel: "Each independently controlled lighting circuit is one point.",
      variants: [
        { id: "1", name: "1 gang", points: 1, image: `${imageRoot}gang-1.webp`, width: 933, height: 440 },
        { id: "2", name: "2 gang", points: 2, image: `${imageRoot}gang-2.webp`, width: 934, height: 440 },
        { id: "3", name: "3 gang", points: 3, image: `${imageRoot}gang-3.webp`, width: 933, height: 440 }
      ],
      features: ["Smart Life app, voice control and schedules", "Existing wall switch keeps working", "1, 2 or 3 independent circuits"],
      specs: ["AC 100–240 V", "2.4 GHz Wi-Fi", "No hub", "Fits in switch box"],
      safety: "Check per-channel load rating and the neutral or no-neutral version required by your model."
    },
    {
      id: "shutter",
      name: "Shutter & curtain module",
      description: "Control compatible shutters, curtains and awnings, from a window blind to a garage door.",
      image: `${imageRoot}device-shutter-module.webp`,
      alt: "Wi-Fi module for controlling a roller shutter or curtain motor",
      price: 69.99,
      unit: "per motor",
      points: 1,
      pointLabel: "One compatible motor is one point; larger installations need a site assessment.",
      features: ["Open, stop and close from the app", "Set position from 0–100%", "Works with existing push buttons", "Schedule opening and closing"],
      specs: ["AC 100–240 V", "2.4 GHz Wi-Fi", "Shutters · curtains · awnings", "433 MHz remote version"]
    },
    {
      id: "ir",
      name: "IR blaster",
      description: "Bring compatible air conditioners, TVs, receivers and fans into your smart-home routines.",
      image: `${imageRoot}device-ir-blaster.webp`,
      alt: "Smart infrared blaster sending signals to a television and air conditioner",
      price: 39.99,
      unit: "per controlled device",
      points: 1,
      pointLabel: "Each controlled appliance is one point. One blaster may control nearby IR appliances.",
      features: ["Built-in code library for most brands", "Learning mode copies an original remote", "Schedules and scenes", "Some learned buttons work in the app only, not by voice"],
      specs: ["USB 5 V / 1 A", "2.4 GHz Wi-Fi", "IR 38 kHz", "IR + RF versions"]
    },
    {
      id: "controller",
      name: "Smart device controller",
      description: "A smart module for bringing a compatible existing device or circuit into your setup.",
      icon: "bolt",
      price: 39.99,
      unit: "per controlled device",
      points: 1,
      pointLabel: "Each independently controlled compatible device is one point.",
      features: ["Control a compatible existing device", "Bring devices into app-based routines", "Model and electrical compatibility need confirmation"],
      specs: ["2.4 GHz Wi-Fi", "No hub", "Model dependent"]
    },
    {
      id: "sensor",
      name: "Smart sensor",
      description: "Add a sensor point to a home or small business security and automation plan.",
      icon: "sensor",
      price: 24.99,
      unit: "per sensor",
      points: 1,
      pointLabel: "Each sensor is one point. Sensor type and placement are confirmed during consultation.",
      features: ["Plan sensor coverage by room or entry", "Use with compatible smart-home routines", "Choose placement during the site review"],
      specs: ["Sensor type varies", "Compatibility to confirm"]
    },
    {
      id: "camera",
      name: "Smart camera",
      description: "Include camera coverage in a residential, office or retail concept.",
      icon: "camera",
      price: 59.99,
      unit: "per camera",
      points: 1,
      pointLabel: "Each camera is one point. Coverage and model are confirmed during consultation.",
      features: ["Plan coverage around your space", "For home, small office or retail planning", "Camera model and installation need confirmation"],
      specs: ["Camera type varies", "Compatibility to confirm"]
    }
  ];

  const bundles = [
    {
      id: "basic",
      name: "Basic",
      points: 4,
      price: 149.99,
      audience: "A smart start",
      summary: "Two lighting circuits, a TV and an AC. A practical first step for one room or a compact home.",
      contents: ["2 switch circuits (1- or 2-gang module)", "1 TV control point", "1 AC control point"]
    },
    {
      id: "basic-plus",
      name: "Basic Plus",
      points: 6,
      price: 219.99,
      audience: "Everyday comfort",
      summary: "Four lighting circuits plus TV and AC control for connected everyday spaces.",
      contents: ["4 switch circuits", "1 TV control point", "1 AC control point"]
    },
    {
      id: "pro",
      name: "Pro",
      points: 10,
      price: 429.99,
      audience: "More of the home",
      summary: "Six lighting circuits, two shutter motors, and TV and AC control.",
      contents: ["6 switch circuits", "2 shutter or curtain motors", "1 TV and 1 AC control point"]
    },
    {
      id: "security",
      name: "Security add-on",
      points: 4,
      price: 169.99,
      audience: "Add another layer",
      summary: "A sample allowance for camera and sensor points. Confirm devices and placement at the site visit.",
      contents: ["2 camera points", "2 sensor points"]
    }
  ];

  const packages = [
    {
      id: "essential-home",
      name: "Essential Home",
      audience: "Residential",
      bundleIds: ["basic", "security"],
      summary: "A four-point smart-home start combined with a sample four-point security add-on.",
      workflow: ["Consultation", "Site review", "Itemized quotation", "Supply & implementation"]
    },
    {
      id: "connected-home",
      name: "Connected Home",
      audience: "Residential",
      bundleIds: ["basic-plus", "security"],
      summary: "More lighting control with a sample camera and sensor allowance.",
      workflow: ["Consultation", "Site review", "Itemized quotation", "Supply & implementation"]
    },
    {
      id: "small-business",
      name: "Small Business",
      audience: "Office & retail",
      bundleIds: ["pro", "security"],
      summary: "A broader control plan for a small office or retail space, to refine after a site review.",
      workflow: ["Requirements review", "Site review", "Itemized quotation", "Supply & implementation"]
    }
  ];

  const routines = [
    { id: "morning", name: "Good morning", trigger: "Schedule · 7:00", actions: ["Open shutter", "Switch on kitchen light"] },
    { id: "heading-home", name: "Heading home", trigger: "One tap", actions: ["Set AC to 24 °C", "Switch on entrance light"] },
    { id: "leaving", name: "Leaving home", trigger: "One tap", actions: ["Turn off all lights", "Turn off AC and TV"] },
    { id: "good-night", name: "Good night", trigger: "Voice command", actions: ["Close shutter", "Turn off lights and TV"] }
  ];

  return { products, bundles, packages, routines };
});
