# Smart Home — Project Overview · Device Line-up
*Source: SmartHome_Info.pdf (11 slides, November 2026). English.*

> **Tagline:** Small Wi-Fi modules that make any home smart — no renovation, no new switches.

---

## 1. The concept
A small Wi-Fi module fits behind the existing wall switch. Lights and appliances are then controlled from the phone or by voice.

| Benefit | Description | Icon (in PDF) |
|---|---|---|
| **No renovation** | Fits behind the current switch, which keeps working. | home |
| **Control anywhere** | Smart Life app, Google Assistant, Alexa. | globe |
| **Automation** | Schedules, timers and one-tap scenes. | clock |

## 2. How it works
Flow: **User → Tuya cloud → Home Wi-Fi → Smart module**

1. **User** — App tap or voice command
2. **Tuya cloud** — Relays the command
3. **Home Wi-Fi** — 2.4 GHz, no hub needed
4. **Smart module** — Switches the light or device

✔ The wall switch keeps working manually.

---

## 3. Device 1 — Smart switch module (1/2/3 gang)
- On/off from the app, anywhere
- Existing switch still works (2-way control)
- Voice: Google Assistant & Alexa
- Schedules and countdown per channel
- Shared control for family members
- Works in scenes and routines

**Spec tags:** AC 100–240 V · Wi-Fi 2.4 GHz · No hub · Fits in the switch box

### Versions: 1, 2 or 3 gang
| Version | Circuits | Example |
|---|---|---|
| **1 Gang** | 1 circuit | e.g. a room light |
| **2 Gang** | 2 independent circuits | e.g. ceiling light + fan |
| **3 Gang** | 3 independent circuits | e.g. 3 lighting groups |

⚠ **Warning:** Check per-channel load rating and neutral / no-neutral version per model.

## 4. Device 2 — Shutter & curtain module
- Open / stop / close from the app
- Works with the existing push buttons
- Set position 0–100%
- Motor direction reversal in the app
- Open and close on a schedule
- Voice: Google Assistant & Alexa

**Spec tags:** AC 100–240 V · Wi-Fi 2.4 GHz · Shutters · curtains · awnings · RF 433 MHz remote version

## 5. Device 3 — IR blaster (smart universal remote)
- Controls AC, TV, receiver and fans
- Built-in code library for most brands
- Learning mode: copies the original remote
- Turn the AC on before arriving home
- Voice: Google Assistant & Alexa
- Schedules and scenes

*Note: on some models, learned buttons work from the app only (no voice).*

**Spec tags:** USB 5 V / 1 A · Wi-Fi 2.4 GHz · IR 38 kHz · IR + RF versions

---

## 6. Example routines (Automation)
| Routine | Trigger | Actions |
|---|---|---|
| **Good morning** | Schedule · 7:00 | Open shutter, kitchen light on |
| **Heading home** | One tap | AC on at 24 °C, entrance light on |
| **Leaving home** | One tap | All lights, AC and TV off |
| **Good night** | Voice command | Close shutter, lights and TV off |

---

## 7. ⚠ INTERNAL — Price estimate (USD per unit)
*Supplier cost prices, Nov 2026 · excl. shipping, customs and VAT · `*` = estimate, to confirm on AliExpress.*
**These are sourcing costs, not retail prices. Do not publish on the website.**

| Device | AliExpress · 1 pc | Alibaba · 10–99 pcs | Alibaba · 100–499 pcs | Alibaba · 500+ pcs |
|---|---|---|---|---|
| Switch module · 1 gang | ~$4 – 5 | $1.7 – 5.8 | $1.6 – 5.8 | $1.5 – 7.9 |
| Switch module · 2 gang | ~$6 – 9 * | $8.4 – 9.6 | $8.4 – 9.6 | $8.4 – 9.6 |
| Switch module · 3 gang | ~$9 – 12 * | $9.0 | $8.5 | $8.5 |
| Shutter / curtain module | ~$7 – 12 * | $4.3 – 7.3 | $4.3 – 7.2 | $4.3 – 7.2 |
| IR blaster | ~$4 – 7.5 | $2.8 – 6.5 | $2.7 – 6.0 | $2.6 – 5.8 |

Insight: Prices barely drop between 10 and 500 pcs. Bigger breaks start around 1,000–2,000 pcs.

## 8. Buying notes (internal, but useful as FAQ/compatibility copy)
| Topic | Note |
|---|---|
| **One ecosystem** | Tuya / Smart Life only — one app for the whole home. |
| **Wi-Fi, not Zigbee** | Zigbee versions need an extra hub; Wi-Fi connects directly. |
| **Neutral wire** | Stock both neutral and no-neutral versions. |
| **2.4 GHz Wi-Fi** | The customer's router must support 2.4 GHz. |

## 9. Next steps (roadmap)
1. **Add more devices** — Complete the product line-up.
2. **Order samples** — Test each device in a real home.
3. **Pick suppliers** — Lock prices, MOQs and margins.
4. **Launch the website** — Product catalogue and ordering.
