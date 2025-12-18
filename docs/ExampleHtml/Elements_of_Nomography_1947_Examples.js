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

    "page 49": {
        "Short": "Page 49",
        "Title": "Page 49 example nomograph type II",
        "Details": "The scales can be, e.g., in units of 100 as long as all scales have the same units.",
        "Create": MakePage_49Diagram
    },

    "page 53": {
        "Short": "Page 53",
        "Title": "Page 53 example nomograph with PQR scales",
        "Details": "Demonstrating scale substitution. Instead of a linear U+V=W, instead there's a P + 3Q = R-4 relationship. The P, Q, and R scales are overlays on the U, V, and W scales respectively.",
        "Create": MakePage_53Diagram
    },

    "page 56": {
        "Short": "Page 56",
        "Title": "Page 56 example log-scale PQR nomograph",
        "Details": "Demonstrating the use of log scales. The P, Q, and R scales are all shown as log scales.",
        "Create": MakePage_56Diagram
    },

}


function MakePage_30Diagram(svg)
{
    var uTickSettings = new TickSettings();
    uTickSettings.tick_label_delta = 1.0;
    uTickSettings.small_mod = 0.5;
    var vTickSettings = new TickSettings(uTickSettings);
    var wTickSettings = new TickSettings(uTickSettings, 1.0, 1.0, 1.0);
    wTickSettings.tick_label_delta = 2.0;

    // U scale is 0..4 V scale is 0..6
    var nomograph = new NomographTypeI(svg, 0.0, 4.0, 0.0, 6.0,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.ValidationInfo = "U: 0...3..4 with 1 medium; W 0...8..10 with 1 medium; V 0...5..6 1 medium tick";
    nomograph.Initialize();
    return nomograph;
}

function MakePage_32TopDiagram(svg)
{
    var uTickSettings = new TickSettings();
    uTickSettings.tick_label_delta = 1.0;
    uTickSettings.small_mod = 0.25;
    var vTickSettings = new TickSettings(uTickSettings);
    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.small_mod = 0.5;

    // U scale is -3..0.5 V scale is -2..0.5
    var nomograph = new NomographTypeI(svg, -3.0, 0.5, -2.0, 1.5,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.ValidationInfo = "U: -3...-1..0 with 1 medium 2 small tick; W: -5...1..2 with 1 medium; V -2...0..1 with 1 medium 2 small tick";
    nomograph.Initialize();
    return nomograph;
}

function MakePage_32BottomDiagram(svg)
{
    var uTickSettings = new TickSettings();
    uTickSettings.small_mod = 0.25;
    uTickSettings.tick_label_delta = 1.0;
    var vTickSettings = new TickSettings(uTickSettings);
    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.small_mod = 0.5;
    wTickSettings.tick_label_alignment ="left";

    var nomograph = new NomographTypeI(svg, 12.0, 15.5, 24, 27.5,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.ValidationInfo = "U: 12...14..15 with 1 medium 2 small; W: 36...42..43 with 1 medium; V: 24...26..27 with 1 medium 2 small";
    nomograph.Initialize();
    return nomograph;
}

function MakePage_34Diagram(svg)
{
    var uTickSettings = new TickSettings(undefined, 0.5, 1.0, 2.0);
    uTickSettings.tick_label_delta = 2.0;

    var vTickSettings = new TickSettings(uTickSettings);
    vTickSettings.tick_label_alignment = "left";

    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.small_mod = 1.0;
    wTickSettings.medium_mod = 1.0;
    wTickSettings.tick_label_alignment ="left";

    var nomograph = new NomographTypeI(svg, 0.0, 12.0, 0.0, 12.0,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.Initialize();
    nomograph.ValidationInfo = "U: 0...10..12 with 1 medium 2 small; W: 0...22..24 with 1 medium; V: 0...10..12 with 1 medium 2 small";
    return nomograph;
}

function MakePage_36Diagram(svg)
{
    var uTickSettings = new TickSettings(undefined, 1.0, 5.0, 10.0);
    uTickSettings.tick_label_delta = 10.0;
    uTickSettings.tick_label_first = -20.0;

    var vTickSettings = new TickSettings(uTickSettings);
    vTickSettings.tick_label_first = 20.0;
    vTickSettings.tick_label_alignment = "left"; // this is actually an issue with the diagram

    var wTickSettings = new TickSettings(uTickSettings, 2.0, 2.0, 10);
    wTickSettings.small_mod = 2.0;
    wTickSettings.tick_first = -8.0; // otherwise the ticks are offset from the labels
    wTickSettings.tick_label_first = 0.0;
    wTickSettings.tick_label_alignment ="left";

    var nomograph = new NomographTypeI(svg, -27.0, 9.0, 18.0, 54.0,
        uTickSettings, vTickSettings, wTickSettings);
    nomograph.ValidationInfo = "U: -20...-10..0 with 1 medium 8 small; W: 0...50..60 with 5 medium; V: 20...40..50 with 1 medium 8 small";
    nomograph.Initialize();
    return nomograph;
}

function MakePage_38Diagram(svg)
{
    var uTickSettings = new TickSettings();
    uTickSettings.tick_label_delta = 1.0;
    var vTickSettings = new TickSettings(uTickSettings);
    vTickSettings.small_mod = 0.2;
    vTickSettings.tick_label_alignment = "left";
    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.tick_label_alignment = "left";

    var nomograph = new NomographTypeI(svg, -2.0, 2.0, -4.0, 4.0,
        uTickSettings, vTickSettings, wTickSettings);
    nomograph.ValidationInfo = "U: -2...1..2 with 1 medium 8 small; V: 4...-3..-4 with 4 medium; W: 2...-1..-2 with 1 medium 8 small";

    nomograph.order = "UVW"; // allowed: UWV default or UVW
    nomograph.wmin_override = -2;
    nomograph.wmax_override = 2;

    // UVW also sets the direction of V and W to "down"
    // and sets their scale correctly.

    nomograph.Initialize();

    return nomograph;
}

function MakePage_45Diagram(svg)
{
    var uTickSettings = new TickSettings();
    uTickSettings.tick_label_delta = 1;
    var vTickSettings = new TickSettings(uTickSettings);
    vTickSettings.small_mod = 0.2;
    vTickSettings.tick_label_delta = 2;
    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.small_mod = 0.5;
    wTickSettings.tick_label_delta = 3;

    var nomograph = new NomographTypeI(svg, 0.0, 6.0, 0.0, 12,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.ValidationInfo = "U: 0...5..6 with 1 medium 8 small; W: 0...15..18 with 2 medium 3 small; V: 0...10..12 with 1 medium 8 small";
    nomograph.v_zoom = 2; // when the U goes up by 1, the V should go up by 2
    nomograph.Initialize();
    return nomograph;
}

function MakePage_47Diagram(svg)
{
    var uTickSettings = new TickSettings(undefined, 5, 25, 50);
    uTickSettings.tick_side = "left";
    uTickSettings.tick_label_delta = 50;
    var vTickSettings = new TickSettings(uTickSettings, 0.5, 1, 5);
    vTickSettings.tick_label_delta = 5;
    vTickSettings.tick_side="left+right";
    var wTickSettings = new TickSettings(uTickSettings, 10, 50, 50);
    wTickSettings.tick_label_delta = 50;
    wTickSettings.tick_label_first = -50;
    wTickSettings.tick_side = "right";

    var nomograph = new NomographTypeII(svg, -100, 200, 30, 60,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.ValidationInfo = "U: -100...150..200 with 1 medium 8 small; W: -50...200..250 with 4 medium; V: 30...55..60 with 4 medium 5 small";
    nomograph.Initialize();
    return nomograph;
}

function MakePage_49Diagram(svg)
{
    var uTickSettings = new TickSettings(undefined, 0.2, 0.2, 1.0);
    uTickSettings.tick_first = 9.8;
    uTickSettings.tick_label_delta = 1;
    uTickSettings.tick_label_first = 10;

    var vTickSettings = new TickSettings(uTickSettings, 0.1, 0.5, 1.0);
    vTickSettings.tick_first = undefined;
    vTickSettings.tick_label_delta = 1;
    vTickSettings.tick_label_first = 34.0
    vTickSettings.tick_label_alignment = "left";

    var wTickSettings = new TickSettings(uTickSettings, 0.2, 1.0, 2.0);
    wTickSettings.tick_first = 43;
    wTickSettings.tick_label_delta = 2.0;
    wTickSettings.tick_label_first = 44;

    var nomograph = new NomographTypeII(svg, 9.73, 18.16, 33.3, 38.9,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.ValidationInfo = "U: 10...17..18 with 4 medium; W 44...54..56 with 1 medium 8 small; V: 34...37..38 with 1 medium 8 small";
    nomograph.Initialize();
    return nomograph;
}


function MakePage_53Diagram(svg)
{
    // P + 3Q = R-4
    var uTickSettings = new TickSettings();
    uTickSettings.tick_label_delta = 1;

    var vTickSettings = new TickSettings(uTickSettings);
    vTickSettings.tick_label_alignment = "left";

    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.small_mod = 0.5;
    wTickSettings.tick_label_delta = 5.0;
    wTickSettings.tick_label_first = 5.0;
    wTickSettings.tick_label_alignment = "left";

    var nomograph = new NomographTypeII(svg, 0.0, 6.0, 0.0, 4.0,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.ValidationInfo = "P: 0...5..6 with 1 medium 8 small; R: 5...15..20 with 4 medium 5 small; Q: 0...3..4 with 1 medium 8 small";
    nomograph.label = "P + 3Q = R-4";

    nomograph.SetOverlayScaleSettings("P", {
        "toUnderlyingValue": function(value) { return value; }, 
        "toOverlayValue" : function(value) { return value; }
    });

    nomograph.SetOverlayScaleSettings("Q",  {
        "toUnderlyingValue": function(value) { return value*3; }, 
        "toOverlayValue" : function(value) { return value/3; }
    });

    nomograph.SetOverlayScaleSettings("R", {
        "toUnderlyingValue": function(value) { return value-4; }, 
        "toOverlayValue" : function(value) { return value+4; }
    });

    nomograph.Initialize();
    return nomograph;
}


function MakePage_56Diagram(svg)
{
    // P**2 - 5Q = 3R
    var uTickSettings = new TickSettings();
    uTickSettings.tick_label_delta = 1;

    var vTickSettings = new TickSettings(uTickSettings);
    vTickSettings.tick_label_alignment = "left";

    var wTickSettings = new TickSettings(uTickSettings);
    wTickSettings.small_mod = 0.5;
    wTickSettings.tick_label_delta = 5.0;
    wTickSettings.tick_label_first = 5.0;
    wTickSettings.tick_label_alignment = "left";

    var nomograph = new NomographTypeII(svg, 2.0, 5.0, 1.0, 4.0,
        uTickSettings, vTickSettings, wTickSettings); 
    nomograph.ValidationInfo = "P: 2...4..5 log with 1 medium 8 small; R: -4...4..6 every 2 with 1 medium 8 small; Q: 4...2..1 with 1 medium 8 small";
    nomograph.label = "P² - 5Q = 3R";

    nomograph.SetOverlayScaleSettings("P", {
        "toUnderlyingValue": function(value) { return value*value; }, 
        "toOverlayValue" : function(value) { return Math.sqrt(value); }
    });

    nomograph.SetOverlayScaleSettings("Q",  {
        "toUnderlyingValue": function(value) { return -value*5; }, 
        "toOverlayValue" : function(value) { return -value/5; }
    });

    nomograph.SetOverlayScaleSettings("R", {
        "toUnderlyingValue": function(value) { return value*3; }, 
        "toOverlayValue" : function(value) { return value/3; }
    });

    nomograph.Initialize();
    return nomograph;
}