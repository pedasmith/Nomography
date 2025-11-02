# TODO file for ExampleHtml for Nomography

[PAGES](https://pedasmith.github.io/Nomography/ExampleHtml/Example_Nomographs.html)

Contains exploratory code for making a variety of Nomographs. Examples are from "Elements of Nomography", first edition, 1947 by Raymond D. Douglass and Douglass P. Adams, both professors at MIT, published by McGraw-Hill Book company

## Simple TODO items

Add UX to set the UWV values.
Why can't I move stuff with a touch?
DONE: 2025-11-01: Add UX boxes to see the UWV values

DONE: 2025-10-26: The Page 45 graph has weird looking V ticks. They should have maxes at 1, 2, 3 etc. but don't. Maybe it's the text bounding boxes?
DONE: 2025-20-26: Handle the case where the V and U scales are different (e.g.: U is 0..6 V is 0..12). (type II nomograph)
DONE: 2025-10-25: Allow for graphs with ordering UVW. In this scheme, the V scale is in the middle, is 2x the U scale, and both the V and W scale are flipped top to bottom.
DONE: 2025-10-25: Setup to make this available on Github Pages. Clean up code and make diagraph 32 bottom.
DONE: 2025-10-25: Allow user to pick from a set of options. The set is easy to update.
DONE: 2025-10-24: Can move the cursor around.
DONE: 2025-10-24: Resize. On size changes, redraw.
DONE: 2025-10-23: Auto-size. Graph should have space for title + footer, and the rest of the SVG should be for the diagram

## Can the exported SVG be used for laser engraving?

Maybe? Can I import the SVG into Inkscape and then exort EPS?

See [Edge](https://blogs.windows.com/msedgedev/2024/07/11/seamless-svg-copy-paste-on-the-web/) for help?


## Fancy Web Elements

### Done: 2025-11-01: Touch APIs

The simple version of the SVG control has a problem: it doesn't work with touch! The ideal case here is that the user can just poke their finger on the blue circles and then move the line up and down.

As it turns out, there are new touch events, and I have to tap into those (2025-11-01). The touchstart events are added just like the mousedown events were, with some slight changes. The move function was updated to work with either mouse or touch.

And it works with the pen, too!


### IP: The web page can be an "application"

Handy links:
* See [making PWA installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
)* [Blog about application titles](https://blogs.windows.com/msedgedev/2025/02/05/control-your-installed-web-application-title/)   <meta name="application-title">
* See  [manifest](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/manifest)
* [Store link](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/microsoft-store)
* [PWABUILDER](https://pwabuilder.com)

Changes needed:
* Added manifest.webmanifest (originally .json but it popped up as a potential issues in F12)


### Fixing all of the "issues"

Status as of 2025-11-01: no issues show up in the tracker.

#### LANG attribute

Issue: <html> element must have a lang attribute: The <html> element does not have a lang attribute
Link: [Dequeue](https://dequeuniversity.com/rules/axe/4.4/html-has-lang?application=axeAPI)
Fix: added lang="en" to my <html> tag

#### Viewport

Issue: A 'viewport' meta element was not specified.
Link: 
Fix: added <meta name="viewport" content="width=device-width, initial-scale=1">

#### Charset

Issue: 'charset' meta element was not specified.
Fixed: added <meta charset="UTF-8"> as the first element in head.