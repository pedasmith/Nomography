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
    }
}


function MakePage_30Diagram(svg)
{
    var nomograph = new NomographTypeI(svg, 0.0, 4.0, 0.0, 6.0); // U scale is 0..4 V scale is 0..6
    nomograph.W_tick_delta = 1.0;
    nomograph.W_tick_label_delta = 2;
    nomograph.Initialize();
    return nomograph;
}

function MakePage_32TopDiagram(svg)
{
    var nomograph = new NomographTypeI(svg, -3.0, 0.5, -2.0, 1.5); // U scale is -3..0.5 V scale is -2..0.5
    nomograph.U_tick_delta = 0.25;
    nomograph.V_tick_delta = 0.25;
    nomograph.W_tick_delta = 0.50;
    nomograph.Initialize();
    return nomograph;
}

function MakePage_32BottomDiagram(svg)
{
    var nomograph = new NomographTypeI(svg, 12.0, 15.5, 24, 27.5); 
    nomograph.U_tick_delta = 0.25;
    nomograph.V_tick_delta = 0.25;
    nomograph.W_tick_delta = 0.50;
    nomograph.W_tick_label_alignment ="left";
    nomograph.Initialize();
    return nomograph;
}

function MakePage_34Diagram(svg)
{
    var nomograph = new NomographTypeI(svg, 0.0, 12.0, 0.0, 12.0); 
    nomograph.U_tick_delta = 0.5;
    nomograph.V_tick_delta = 0.5;
    nomograph.W_tick_delta = 1.;
    nomograph.U_tick_label_delta = 2.0;
    nomograph.V_tick_label_delta = 2.0;
    nomograph.W_tick_label_delta = 2.0;
    nomograph.W_tick_label_alignment ="left";
    nomograph.Initialize();
    return nomograph;
}

function MakePage_36Diagram(svg)
{
    var nomograph = new NomographTypeI(svg, -27.0, 9.0, 18.0, 54.0); 
    nomograph.U_tick_delta = 1.0;
    nomograph.V_tick_delta = 1.0;
    nomograph.W_tick_delta = 2.0;
    nomograph.W_tick_first = -8.0; // otherwise the ticks are offset from the labels
    nomograph.U_tick_label_delta = 10.0;
    nomograph.V_tick_label_delta = 10.0;
    nomograph.W_tick_label_delta = 10.0;

    nomograph.U_tick_label_first = -20.0;
    nomograph.V_tick_label_first = 20.0;
    nomograph.W_tick_label_first = 0.0;
    nomograph.W_tick_label_alignment ="left";
    nomograph.Initialize();
    return nomograph;
}

function MakePage_38Diagram(svg)
{
    var nomograph = new NomographTypeI(svg, -2.0, 2.0, -4.0, 4.0); 
    nomograph.order = "UVW"; // allowed: UWV default or UVW
    nomograph.wmin = -2;
    nomograph.wmax = 2;
    // UVW also sets the direction of V and W to "down"
    // and sets their scale correctly.

    nomograph.V_tick_label_alignment = "left";
    nomograph.Initialize();
    return nomograph;
}




