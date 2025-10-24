        class Ticks
        {
            constructor(alignment)
            {
            }
            DrawTicks(axis)
            {
                let tickLeft = 4;
                let tickRight = 4;

                for (let y = axis.ymin; y<=axis.ymax; y+=axis.tick_delta)
                {
                    if (y == axis.ymin || y == axis.ymax)
                    {
                        tickLeft = 6;
                        tickRight = 6;
                    }
                    else if (y % 5 == 0)
                    {
                        tickLeft = 4;
                        tickRight = 4;
                    }
                    else
                    {
                        tickLeft = 2;
                        tickRight = 2;
                    }
                    axis.DrawLine(axis.parent, axis.x_pixel-tickLeft, y, axis.x_pixel+tickRight, y, axis.linestyle);
                    var str = y.toFixed(axis.tick_precision);
                    // This qualifies as a code issue for RTFM. But it's quick and it works for now.
                    str = str.replace(".0000", "     ");
                    str = str.replace(".000", "    ");
                    str = str.replace(".00", "   ");
                    str = str.replace(".0", "  ");
                    axis.DrawText(axis.parent, str, axis.alignment, axis.x_pixel+2, y, axis.tick_textstyle);
                }
            }
        }
        class Axis
        {
            constructor (svg, name, x_pixel, ystart_pixel, height_pixel, ymin, ymax, title, alignment)
            {
                this.tick_start = ymin;
                this.tick_delta = 0.5;
                this.tick_precision = 1;

                this.ymin = ymin;
                this.ymax = ymax;

                this.svg = svg;
                this.name = name;
                this.x_pixel = x_pixel;
                this.ystart_pixel = ystart_pixel;
                this.height_pixel = height_pixel;
                this.title = title;

                this.alignment = alignment;
                if (alignment != "left" && alignment != "right")
                {
                    console.log(`Error: Axis:Ticks: alignment is ${alignment}. It must be left or right.`);
                }

                this.tick_textstyle = "font-family:Courier New, monospace;white-space: pre;";
                this.linestyle = "stroke:black; fill:none;";
                this.svgns = "http://www.w3.org/2000/svg";


                this.ticks = new Ticks();
            }

            YToPixel(y)
            {
                let range = this.ymax - this.ymin;
                let ratio = (y - this.ymin) / range;
                let retval = ((1.0 - ratio) * this.height_pixel) + this.ystart_pixel;
                return retval;
            }

            ElementCreate(svg)
            {
                const child = document.createElementNS(this.svgns, "svg");
                svg.appendChild(child);
                return child;
            }
            DrawLine(parent, x1_pixel, y1, x2_pixel, y2, style)
            {
                let y1_pixel = this.YToPixel(y1);
                let y2_pixel = this.YToPixel(y2);
                const line = document.createElementNS(this.svgns, "line");
                line.setAttribute("x1", x1_pixel);
                line.setAttribute("x2", x2_pixel);
                line.setAttribute("y1", y1_pixel);
                line.setAttribute("y2", y2_pixel);
                line.setAttribute("style", style);
                parent.appendChild(line);
                return line; // just in case we need to refer to this later.
            }
            DrawLinePixel(parent, x1_pixel, y1_pixel, x2_pixel, y2_pixel, style)
            {
                const line = document.createElementNS(this.svgns, "line");
                line.setAttribute("x1", x1_pixel);
                line.setAttribute("x2", x2_pixel);
                line.setAttribute("y1", y1_pixel);
                line.setAttribute("y2", y2_pixel);
                line.setAttribute("style", style);
                parent.appendChild(line);
                return line; // just in case we need to refer to this later.
            }

            DrawText(parent, str, alignment, x, y, style)
            {
                console.log(`DrawText: called: str=<<${str}>> alignment=${alignment} x=${x}`);
                let x_pixel = x;
                let y_pixel = this.YToPixel(y);

                const text = document.createElementNS(this.svgns, "text");
                if (alignment == "left")
                {
                    text.setAttribute("x", x_pixel-8);
                    text.setAttribute("text-anchor", "end");
                }
                else
                {
                    text.setAttribute("x", x_pixel+6);
                    text.setAttribute("text-anchor", "start");
                }
                // small vertical adjustment so number centers on the tick
                text.setAttribute("y", y_pixel+4);
                text.setAttribute("font-size", "12");
                text.setAttribute("fill", "black");
                if (style != undefined)
                {
                    text.setAttribute("style", style);
                }
                text.textContent = str;
                this.parent.appendChild(text);
                return text; // just in case we need it later.
            }
            
            DrawTitlePixel(parent, str, x, y)
            {
                const text = document.createElementNS(this.svgns, "text");
                text.setAttribute("x", x-4);
                // small vertical adjustment so number centers on the tick
                text.setAttribute("y", y-4);
                text.setAttribute("font-size", "16");
                text.setAttribute("fill", "black");
                text.textContent = str;
                this.parent.appendChild(text);
                return text; // just in case we need it later.
            }

            DrawGraduations ()
            {
                this.parent = this.ElementCreate(this.svg);
                this.DrawLinePixel(this.parent, this.x_pixel, this.ystart_pixel, this.x_pixel, this.ystart_pixel+this.height_pixel, this.linestyle);
                this.DrawTitlePixel(this.parent, this.title, this.x_pixel, this.ystart_pixel);
                this.ticks.DrawTicks(this);
            }            
        }

        class NomographTypeI
        {
            constructor(svg, umin, umax, vmin, vmax)
            {
                this.svg = svg;
                this.umin = umin;
                this.umax = umax;
                this.vmin = vmin;
                this.vmax = vmax;
                this.wmin = this.umin + this.vmin;
                this.wmax = this.umax + this.vmax;

                this.HTitle_pixel = 20;
                this.HFooter_pixel = 20;

                this.AxisW_pixel = 80;

                this.resizeObserver = new ResizeObserver(this.OnSizeChange.bind(this)).observe(svg)

            }

            OnSizeChange()
            {
                let height= this.svg.getBoundingClientRect().height;
                this.svg.innerHTML = "";
                this.Initialize();
            }

            Initialize()
            {
                //let bbox = this.svg.getBBox(); // Nope; this is the height after all the objects are placed
                //let height= this.svg.getAttribute("height");
                //let height= this.svg.offsetHeight;
                let height= this.svg.getBoundingClientRect().height;

                this.XU_pixel = 40;
                this.XW_pixel = this.XU_pixel + this.AxisW_pixel;
                this.XV_pixel = this.XU_pixel + 2*this.AxisW_pixel;

                let h_pixel = height - this.HTitle_pixel - this.HFooter_pixel;
                let h_per_unit_u = h_pixel / (this.umax - this.umin); 
                let h_per_unit_v = h_pixel / (this.vmax - this.vmin);
                let h_per_unit = h_per_unit_u < h_per_unit_v ? h_per_unit_u : h_per_unit_v; 

                this.U = new Axis (this.svg, "U", 
                    this.XU_pixel, 
                    this.HTitle_pixel, h_per_unit*(this.umax-this.umin), 
                    this.umin, this.umax, 
                    "U", "left"); 
                this.U.DrawGraduations();

                this.V = new Axis (this.svg, "V", 
                    this.XV_pixel, 
                    this.HTitle_pixel, h_per_unit*(this.vmax-this.vmin), 
                    this.vmin, this.vmax, 
                    "V", "right"); 
                this.V.DrawGraduations();

                this.W = new Axis (this.svg, "W", 
                    this.XW_pixel, 
                    this.HTitle_pixel, h_per_unit*(this.wmax-this.wmin) / 2, 
                    this.wmin, this.wmax, 
                    "W", "right"); 
               this.W.DrawGraduations();
            }


            ZZZMakePage_30Diagram(svg)
            {
                var nomograph = new NomographTypeI(svg);
                let Width = 80;
                let HPerUnit = 50;

                let U = new Axis (svg, "U", 20, 50, HPerUnit*4, 0.0, 4.0, "U", "left"); 
                U.DrawGraduations();

                let V = new Axis (svg, "V", 20+2*Width, 50, HPerUnit*6, 0.0, 6.0, "V", "right"); 
                V.DrawGraduations();

                let W = new Axis (svg, "W", 20+1*Width, 50, HPerUnit*5, 0.0, 10.0, "W", "right"); 
                W.DrawGraduations();
            }

        }

        function MakePage_30Diagram(svg)
        {
            var nomograph = new NomographTypeI(svg, 0.0, 4.0, 0.0, 6.0);
            nomograph.Initialize();
            return nomograph;
        }

        function OnLoad()
        {
            let svg = document.getElementById("nomo");
            MakePage_30Diagram(svg);
        }

