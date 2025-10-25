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

