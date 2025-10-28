// Example Nomographs from the 1947 book "Elements of Nomography" 
// by Raymond D. Douglass (MIT professor of Mathematics) and Douglas P. Adams (MIT assistant professor)
// Given that the book's goal is to teach people how to make nomographs, it's a surprisinly
// difficult and painful read.

const Examples = {
    "page 30": {
        "Short": "Page 30",
        "Title": "Page 30 example nomograph",
        "Details": "This nomograph is a recreation of the first nomograph discussed in the book, on page 30. Set the 'cursor' to be at any number on the U and V scales, and the answer W = U + V can be read from the W scale. ",
        "Create": MakePage_30Diagram
    },

    "page 32 top": {
        "Short": "Page 32 (top)",
        "Title": "Page 32 example nomograph (top)",
        "Details": "Demonstrates that the scales don't need to start at 0",
        "Create": MakePage_32TopDiagram
    },

    "page 32 bottom": {
        "Short": "Page 32 (bottom)",
        "Title": "Page 32 example nomograph (bottom)",
        "Details": "Demonstrates that the scales don't need to even include the 0 point. Note that the W scale lables are on the left, not the right.",
        "Create": MakePage_32BottomDiagram
    },

    "page 34": {
        "Short": "Page 34",
        "Title": "Page 34 example nomograph",
        "Details": "This nomograph is used as part of a problem set. It doesn't have any additional features that the earlier nomographs don't have",
        "Create": MakePage_34Diagram
    },

    "page 36": {
        "Short": "Page 36",
        "Title": "Page 36 example nomograph",
        "Details": "This nomograph is used as part of a problem set. It doesn't have any additional features that the earlier nomographs don't have",
        "Create": MakePage_36Diagram
    },

    "page 38": {
        "Short": "Page 38",
        "Title": "Page 38 example nomograph",
        "Details": "Radical change: with UVW scales, the V scale is in the middle. For this to work, the V and W scales are inverted, the V scaling is like the classic W scaling and the W scaling is like the classes V scaling.",
        "Create": MakePage_38Diagram
    },

    "page 45": {
        "Short": "Page 45",
        "Title": "Page 45 example nomograph type II",
        "Details": "The W scale can be positioned at points other than the .5 halfway point. The V scale is set to be zoom=2 so that a single unit jump on the U scale is 2 units on the V scale. ",
        "Create": MakePage_45Diagram
    },

    "page 47": {
        "Short": "Page 47",
        "Title": "Page 47 example nomograph type II",
        "Details": "The W scale can be positioned at points other than the .5 halfway point. The V scale is set to be zoom=0.10 so that a 10 unit jump on the U scale is a single unit on the V scale.",
        "Create": MakePage_47Diagram
    },

}


function MakePage_30Diagram(svg)
{
    var uTickSettings = new TickSettings();
    var vTickSettings = new TickSettings(uTickSettings);
    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.tick_delta = 1.0;
    wTickSettings.tick_label_delta = 2;

    // U scale is 0..4 V scale is 0..6
    var nomograph = new NomographTypeI(svg, 0.0, 4.0, 0.0, 6.0,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.Initialize();
    return nomograph;
}

function MakePage_32TopDiagram(svg)
{
    var uTickSettings = new TickSettings();
    uTickSettings.tick_delta = 0.25;
    var vTickSettings = new TickSettings(uTickSettings);
    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.tick_delta = 0.50;

    // U scale is -3..0.5 V scale is -2..0.5
    var nomograph = new NomographTypeI(svg, -3.0, 0.5, -2.0, 1.5,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.Initialize();
    return nomograph;
}

function MakePage_32BottomDiagram(svg)
{
    var uTickSettings = new TickSettings();
    uTickSettings.tick_delta = 0.25;
    var vTickSettings = new TickSettings(uTickSettings);
    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.tick_delta = 0.50;
    wTickSettings.tick_label_alignment ="left";

    var nomograph = new NomographTypeI(svg, 12.0, 15.5, 24, 27.5,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.Initialize();
    return nomograph;
}

function MakePage_34Diagram(svg)
{
    var uTickSettings = new TickSettings();
    uTickSettings.tick_delta = 0.5;
    uTickSettings.tick_label_delta = 2.0;

    var vTickSettings = new TickSettings(uTickSettings);

    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.tick_delta = 1.;
    wTickSettings.tick_label_alignment ="left";

    var nomograph = new NomographTypeI(svg, 0.0, 12.0, 0.0, 12.0,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.Initialize();
    return nomograph;
}

function MakePage_36Diagram(svg)
{
    var uTickSettings = new TickSettings();
    uTickSettings.tick_delta = 1.0;
    uTickSettings.tick_label_delta = 10.0;
    uTickSettings.tick_label_first = -20.0;

    var vTickSettings = new TickSettings(uTickSettings);
    vTickSettings.tick_label_first = 20.0;
    vTickSettings.tick_label_alignment = "left"; // this is actually an issue with the diagram

    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.tick_delta = 2.0;
    wTickSettings.tick_first = -8.0; // otherwise the ticks are offset from the labels
    wTickSettings.tick_label_first = 0.0;
    wTickSettings.tick_label_alignment ="left";

    var nomograph = new NomographTypeI(svg, -27.0, 9.0, 18.0, 54.0,
        uTickSettings, vTickSettings, wTickSettings);
    nomograph.Initialize();
    return nomograph;
}

function MakePage_38Diagram(svg)
{
    var uTickSettings = new TickSettings();
    var vTickSettings = new TickSettings(uTickSettings);
    vTickSettings.tick_label_alignment = "left";
    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.tick_label_alignment = "left";

    var nomograph = new NomographTypeI(svg, -2.0, 2.0, -4.0, 4.0,
        uTickSettings, vTickSettings, wTickSettings);
    nomograph.order = "UVW"; // allowed: UWV default or UVW
    nomograph.wmin = -2;
    nomograph.wmax = 2;
    // UVW also sets the direction of V and W to "down"
    // and sets their scale correctly.

    nomograph.Initialize();
    return nomograph;
}

function MakePage_45Diagram(svg)
{
    var uTickSettings = new TickSettings();
    uTickSettings.tick_delta = 0.1;
    uTickSettings.tick_label_delta = 1;
    uTickSettings.tick_side = "left";
    var vTickSettings = new TickSettings(uTickSettings);
    vTickSettings.tick_delta = 0.2;
    vTickSettings.tick_label_delta = 2;
    vTickSettings.tick_side="left+right";
    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.tick_delta = 0.5;
    wTickSettings.tick_label_delta = 3;
    wTickSettings.tick_side = "right";

    var nomograph = new NomographTypeI(svg, 0.0, 6.0, 0.0, 12,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.v_zoom = 2; // when the U goes up by 1, the V should go up by 2
    nomograph.Initialize();
    return nomograph;
}

function MakePage_47Diagram(svg)
{
    var uTickSettings = new TickSettings();
    uTickSettings.tick_delta = 5;
    uTickSettings.tick_label_delta = 50;
    uTickSettings.tick_side = "left";
    var vTickSettings = new TickSettings(uTickSettings);
    vTickSettings.tick_delta = 0.5;
    vTickSettings.tick_label_delta = 5;
    vTickSettings.tick_side="left+right";
    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.tick_delta = 10;
    wTickSettings.tick_label_delta = 50;
    wTickSettings.tick_label_first = -50;
    wTickSettings.tick_side = "right";

    var nomograph = new NomographTypeI(svg, -100, 200, 30, 60,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.v_zoom = 0.1;
    nomograph.Initialize();
    return nomograph;
}

