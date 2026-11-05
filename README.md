# SmartHome company and website draft

## Company concept

SmartHome is an early-stage smart-home company focused on making existing homes and small commercial spaces more useful with smart controls. The central customer benefit is transforming conventional lighting and compatible devices into app- and voice-controlled ones, without replacing familiar wall switches or beginning with a renovation.

The initial business phase is **supply and apply**, serving residential customers, small offices, and retail spaces. Customers can choose a point-based bundle or individual devices. They can also choose supply only, or request a service path:

1. Consultation and requirements review
2. Site visit and compatibility assessment
3. Itemized quotation
4. Product supply and implementation, once the scope is agreed

The service can cover upgrading an existing space or planning a new one. The product concept includes smart switch modules (1/2/3 gang), shutter and curtain motor modules, IR blasters, compatible device controllers, sensors, and cameras. Exact product models, wiring, electrical ratings, security features, and installation conditions must be confirmed before a customer quotation.

The longer-term direction is to white-label products and eventually manufacture a proprietary product line. This is a future business goal, not a claim that the current prototype products are company-manufactured.

## Website overview

The website is a dependency-free draft storefront. Its tabs keep each task focused:

- **Home:** interactive two-storey home concept with 13 selectable control points for lighting, shades, garage door, TV, bedroom and office AC, entry sensor, and camera.
- **Bundles & packages:** sample Basic, Basic Plus, Pro, and security bundles, plus packages that combine bundles and a service path.
- **Build a bundle:** select device quantities and switch gang count; see points and estimates update.
- **Devices:** review product concepts and draft estimates, then add individual items.
- **Routines:** explore sample automations.
- **My plan:** set the project type and property type, edit the shortlist, choose supply-only or supply-and-apply, and prepare a local site-visit brief.

The on-screen phone and interactive home illustration stay in sync: lighting and dimming (including separate office lighting), shades, garage door position, TV power, independently controlled bedroom and office AC units, and camera/sensor indicators animate on the matching house details. Camera and sensor indicators use green for active and red for paused. When the driveway camera is selected, its phone slider rotates the camera head and translucent coverage cone to aim at a desired area; the active lens has a subtle scan animation. These controls are demonstrations only; they do not connect to real devices. Selecting a home point opens a compact detail dialog with its draft estimate and an explanation of its added value. On mobile, the selected-device card in the phone has a gold highlight that invites visitors to open those details. The home tab uses its own limited scroll area to leave room for the larger house and phone panels without changing the other tabs.

The house is an original orthographic-style SVG cutaway with a detailed roof, wall and floor treatment, and small translucent control markers placed at their related features. Furniture is drawn in front/side elevation with its feet aligned to room-floor lines; the office has a desk and chair, and the stairwell and dining furniture are omitted. Two wall-mounted AC illustrations sit above the bedroom and office desk, each with its own selectable app control. Shade controls sit at the centers of their windows or garage door. The TV control sits over its screen; the entry sensor marker sits at the top edge of the door. The driveway camera is drawn as a compact wall-mounted bullet unit with a lens and status indicator; its phone slider rotates both the camera head and its coverage cone. The garage door opens without a car illustration. The AC units are modeled as wide, shallow indoor split units based on the [Daikin FTKF-D product/BIM reference](https://www.daikin-bim-library.daikin.com/DKG-BIMDOWNLOAD/en/item/detail?type=category&categoryID=1380000&id=19710000), which lists a 730 × 280 × 213 mm indoor unit. The elevation approach follows the [orthographic projection overview](https://www.designingbuildings.co.uk/wiki/Orthographic_projection). These references guide the illustration only; they do not identify a proposed product.

## Pricing and service assumptions

Displayed prices are **illustrative, non-integer USD draft estimates**, not confirmed retail prices or quotations. Bundle point counts are concept examples: one independently controlled lighting circuit or compatible device is one point. Confirm product choice, compatibility, wiring, load or motor ratings, installation requirements, point count, availability, and pricing during the site review.

The service price is intentionally not estimated by the prototype. It is quoted after assessment. Product totals exclude installation service. Planning entries for generic controllers, sensors, and cameras require exact model and installation confirmation.

The prototype has no backend, payment, order submission, or appointment booking. A plan and generated site-visit brief stay in the current page; visitors can copy the brief manually. No customer information is collected or transmitted.

## Run and validate

Open `index.html` in a current browser. No installation or build step is required. Supplied illustrations are used as locally optimized WebP images under `smarthome-copilot-pack/assets/images/`.

Run the dependency-free catalog checks:

```text
node --test tests
```
