# DotWidget Studio

Design lightweight widgets in a browser studio, then embed them in Notion with one link.

DotWidget Studio is a single HTML file. It has a landing page, a full-screen Studio where you restyle each widget (text, caption, font, colours, size and corners), and an embed link that carries your design into Notion. No framework, no build step, no sign-up, no tracking.

**Live demo:** _add your deployed link here_

## Widgets

| Widget | ID | What it does |
|---|---|---|
| Calendar | `cal` | Monthly calendar with today highlighted and month navigation |
| Flip Clock | `flip` | Live hours and minutes on flip-style cards |
| Stopwatch | `stop` | Start, pause, lap and reset with centisecond display |
| Countdown | `down` | Days, hours, minutes and seconds to any date you pick |
| Habit Tracker | `habit` | Three renamable habits with a 7-day tick grid, saved in the browser |
| Calculator | `calc` | + − × ÷, %, ± and backspace |
| Quote | `quote` | Quote card with an editable quote and author |
| Progress | `prog` | Day, week, month and year progress bars |
| GitHub Profile | `gh` | Profile card with name, bio, avatar and stats; can fetch by username |
| Pomodoro Timer | `pomo` | Focus, short and long sessions with adjustable lengths and a chime |

## What you can customise

- **Content:** text and caption (and widget-specific fields such as the countdown date or habit names)
- **Typography:** Inter, Space Grotesk, JetBrains Mono, Poppins, DM Serif Display or Playfair Display, plus size and weight
- **Colour:** accent, background and text colour
- **Shape:** corner radius, padding and width

The Studio works from phones to large desktop screens. On small screens the widget list becomes a scrolling strip and the controls move to a bottom panel.

## Run it locally

There is nothing to install. Open `index.html` in a modern browser.

Some features (the embed link in particular) need the page to be served from a real address, so for testing you can use any static server, for example:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploy

It is a static site, so any static host works.

- **Vercel:** import the repo, leave the build command empty and deploy.
- **GitHub Pages:** Settings → Pages → deploy from the `main` branch, root folder.
- **Netlify or Cloudflare Pages:** connect the repo, no build step.

Note: Vercel's free Hobby plan is limited to personal, non-commercial use. Check the current terms if you plan to use it commercially.

## Embed in Notion

1. Open the Studio and pick a widget.
2. Customise it.
3. Click **Embed** and copy the link.
4. In Notion, paste the link and choose **Create embed**. Drag the edge to resize.

The link looks like this:

```
https://your-site.com/?w=flip&s=<settings>
```

- `w` is the widget ID from the table above.
- `s` holds only the settings you changed, as base64url-encoded JSON. You normally never write it by hand.
- `https://your-site.com/?w=flip` on its own shows the widget with its default design.

Embed links only work when the page is hosted at its own address, not inside a preview iframe. The Stopwatch and Pomodoro always start fresh, and Habit Tracker ticks are stored separately in each viewer's browser.

## Add your own widget

Everything lives in `index.html`. A widget is one call in the second `<script>` block, in the section with the other widgets (look for `// Calendar`).

```js
add('hello', 'Hello',
  { size: 32, text: 'Hi there' },                           // defaults
  [['Content', [['text', 'Text', 't']]], TY(12, 80), CO, SH], // control panel
  s => `<div style="font-size:${s.size}px;font-weight:${s.weight}">${esc(s.text)}</div>`
);
```

The arguments are `add(id, name, defaults, fields, render, init, act)`.

- **`render(state)`** returns an HTML string. Always pass user text through `esc()`.
- **`init(frame, state)`** (optional) runs after every render. Use `every(fn, ms)` for timers, which are cleared automatically on redraw.
- **`act(key, state, button)`** (optional) handles button fields.
- **Colours** are available inside widgets as CSS variables: `--wa` (accent), `--wb` (background) and `--wf` (text).
- **Field types:** `t` text, `f` font, `w` weight, `r` range (`['size','Size','r',12,96]`), `c` colour, `d` date, `b` button.
- **Ready-made groups:** `CT` (caption), `TY(min, max)` (font, size, weight), `CO` (colours) and `SH` (corners, padding, width).
- **Helpers:** `Studio.redraw()` redraws the current widget and `Studio.set({...})` updates its settings.

To show it on the home page:

1. Add a preview to the `P` object, for example `P['11'] = '<div class="pv">Hi there</div>'`.
2. Add a card to the `W` list: `['11', 'hello', 'Hello', 'Content', 'Says hello.', ['Feature one', 'Feature two', 'Feature three']]`. The first value is the preview key, the second is the widget ID.
3. Update the widget counts in the hero text and stats.

## Privacy and security

- No analytics or trackers. There is no server and no database.
- Settings and habit ticks are stored in the visitor's own browser (`localStorage`) and are never sent anywhere.
- Text typed into widgets is escaped before it is shown.
- Google Fonts is loaded from Google, so visitors' IP addresses reach Google. Self-host the fonts if that matters to you.
- The GitHub Profile **Fetch** button calls `api.github.com` from the visitor's browser. GitHub limits unauthenticated requests per IP address, and the button does nothing useful on pages that block outside requests. You can always type the profile details by hand.
- Never put API keys or tokens in this file. Anyone can read the source.

## Browser support

Current versions of Chrome, Edge, Safari and Firefox. The page uses modern CSS such as `color-mix()`, so very old browsers are not supported.

## Contributing

Ideas and new widgets are welcome. Open an issue to discuss, or send a pull request that adds one widget at a time, following the steps above.

## License

MIT. See [LICENSE](LICENSE).

## Author

Designed and built by [Balaji](https://github.com/Balajikolla-dev).
