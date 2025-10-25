        // Classes for drawing Nomographs using SVG graphics.
        // A Nomograph contains multiple Scales; a Scale includes a single Ticks.
        
        class Ticks
        {
            constructor()
            {
            }

            TickSize(y, scale)
            {
                let tickType = 3;
                let isInt = Math.round(y) == y;
                if (y == scale.ymin || y == scale.ymax)
                {
                    tickType = 1;
                }
                else if (y % 5 == 0)
                {
                    tickType = 1;
                }
                else if (isInt)
                {
                    tickType = 2;
                }
                else
                {
                    tickType = 3;
                }
                let retval = 2;
                switch (tickType)
                {
                    case 1: retval = 8; break;
                    case 2: retval = 6; break;
                    case 3: retval = 4; break;
                    default: retval = 2; break;
                }
                return retval;
            }


            DrawTicks(scale)
            {
                let tickLeft = 4;
                let tickRight = 4;

                for (let y = scale.ymin; y<=scale.ymax; y+=scale.tick_delta)
                {
                    tickLeft = this.TickSize(y, scale);
                    tickRight = tickLeft;
                    scale.DrawLine(scale.parent, scale.x_pixel-tickLeft, y, scale.x_pixel+tickRight, y, scale.linestyle);
                }

                for (let y = scale.tick_first_label; y<=scale.ymax; y+=scale.tick_label_delta)
                {
                    var str = y.toFixed(scale.tick_precision);
                    // This qualifies as a code issue for Daily WTF. But it's quick and it works for now.
                    str = str.replace(".0000", "     ");
                    str = str.replace(".000", "    ");
                    str = str.replace(".00", "   ");
                    str = str.replace(".0", "  ");
                    scale.DrawText(scale.parent, str, scale.tick_label_alignment, scale.x_pixel+2, y, scale.tick_textstyle);
                }

            }
        }


        // Scales are e.g., the U V and W. They are vertical lines with a linear mapping from a "y" value to a pixel value.
        // The scales will have ticks (see the Ticks class).
        class Scale
        {
            constructor (svg, name, x_pixel, ystart_pixel, height_pixel, ymin, ymax, title, tick_label_alignment)
            {
                this.tick_start = ymin;
                this.tick_delta = 0.5;
                this.tick_precision = 1;
                this.tick_first_label = ymin;
                this.tick_label_delta = 1.0;

                this.ymin = ymin;
                this.ymax = ymax;

                this.svg = svg;
                this.name = name;
                this.x_pixel = x_pixel;
                this.ystart_pixel = ystart_pixel; // this is at the top (e.g., y pixel pos of ymax)
                this.height_pixel = height_pixel;
                this.ybottom_pixel = this.ystart_pixel + this.height_pixel;
                this.title = title;

                this.tick_label_alignment = tick_label_alignment;
                if (tick_label_alignment != "left" && tick_label_alignment != "right")
                {
                    console.log(`Error: Scale:Ticks: tick_label_alignment is ${tick_label_alignment}. It must be left or right.`);
                }

                this.tick_textstyle = "font-family:Courier New, monospace;white-space: pre;";
                this.linestyle = "stroke:black; fill:none;";
                this.svgns = "http://www.w3.org/2000/svg";


                this.ticks = new Ticks();
            }


            // Given a Y value (ymin to ymax), return the pixel location
            YToPixel(y)
            {
                let range = this.ymax - this.ymin;
                let ratio = (y - this.ymin) / range;
                let retval = ((1.0 - ratio) * this.height_pixel) + this.ystart_pixel;
                return retval;
            }


            // Given a pixel location, return the corresponding y value.
            PixelToY(ypixel)
            {
                if (ypixel < this.ystart_pixel) return this.ymax;
                if (ypixel > this.ystart_pixel + this.height_pixel) return this.ymin;

                let range = this.height_pixel;
                let ratio = (ypixel - this.ystart_pixel) / range;
                let retval = ((1.0 - ratio) * (this.ymax-this.ymin)) + this.ymin;
                return retval;
            }


            ElementCreate(svg)
            {
                const child = document.createElementNS(this.svgns, "svg");
                svg.appendChild(child);
                return child;
            }


            /// NOTE: this method might be part of an Scale, but it's "static" and can
            /// be called from anywhere.
            DrawCirclePixel(parent, cx_pixel, cy_pixel, radius_pixel, style)
            {
                const circle = document.createElementNS(this.svgns, "circle");
                circle.setAttribute("cx", cx_pixel);
                circle.setAttribute("cy", cy_pixel);
                circle.setAttribute("r", radius_pixel);
                circle.setAttribute("style", style);
                parent.appendChild(circle);
                return circle; // just in case we need to refer to this later.
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


            /// NOTE: this method might be part of an Scale, but it's "static" and can
            /// be called from anywhere.
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


            DrawText(parent, str, tick_label_alignment, x, y, style)
            {
                //console.log(`DrawText: called: str=<<${str}>> alignment=${tick_label_alignment} x=${x}`);
                let x_pixel = x;
                let y_pixel = this.YToPixel(y);

                const text = document.createElementNS(this.svgns, "text");
                if (tick_label_alignment == "left")
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

                this.ScaleW_pixel = 120;

                this.resizeObserver = new ResizeObserver(this.OnSizeChange.bind(this)).observe(svg);
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
                this.XW_pixel = this.XU_pixel + this.ScaleW_pixel;
                this.XV_pixel = this.XU_pixel + 2*this.ScaleW_pixel;

                let h_pixel = height - this.HTitle_pixel - this.HFooter_pixel;
                let h_per_unit_u = h_pixel / (this.umax - this.umin); 
                let h_per_unit_v = h_pixel / (this.vmax - this.vmin);
                let h_per_unit = h_per_unit_u < h_per_unit_v ? h_per_unit_u : h_per_unit_v; 

                this.U = new Scale (this.svg, "U", 
                    this.XU_pixel, 
                    this.HTitle_pixel, h_per_unit*(this.umax-this.umin), 
                    this.umin, this.umax, 
                    "U", "left"); 
                if ("U_tick_delta" in this) this.U.tick_delta = this.U_tick_delta;
                if ("U_tick_label_delta" in this) this.U.tick_label_delta = this.U_tick_label_delta;
                if ("U_tick_label_alignment" in this) this.U.tick_label_alignment = this.U_tick_label_alignment;

                this.V = new Scale (this.svg, "V", 
                    this.XV_pixel, 
                    this.HTitle_pixel, h_per_unit*(this.vmax-this.vmin), 
                    this.vmin, this.vmax, 
                    "V", "right"); 
                if ("V_tick_delta" in this) this.V.tick_delta = this.V_tick_delta;
                if ("V_tick_label_delta" in this) this.V.tick_label_delta = this.V_tick_label_delta;
                if ("V_tick_label_alignment" in this) this.V.tick_label_alignment = this.V_tick_label_alignment;

                this.W = new Scale (this.svg, "W", 
                    this.XW_pixel, 
                    this.HTitle_pixel, h_per_unit*(this.wmax-this.wmin) / 2, 
                    this.wmin, this.wmax, 
                    "W", "right"); 
                if ("W_tick_delta" in this) this.W.tick_delta = this.W_tick_delta;
                if ("W_tick_label_delta" in this) this.W.tick_label_delta = this.W_tick_label_delta;
                if ("W_tick_label_alignment" in this) this.W.tick_label_alignment = this.W_tick_label_alignment;

                this.cursor_style = "stroke:blue; fill:none; stroke-width:4px"; 
                this.cursorMarker_style = "stroke:blue; fill:blue; fill-opacity:50%; stroke-width:1px";
                this.cursorMarkerRadius = 10;
                this.cursorMarkerSelectedRadius = 15;

                // All the cursor stuff!
                this.cursor = this.U.DrawLinePixel(this.svg, 
                    this.U.x_pixel, this.U.ybottom_pixel, 
                    this.V.x_pixel, this.V.ybottom_pixel, this.cursor_style);
                this.cursorMarkerLeft = this.U.DrawCirclePixel(this.svg, this.U.x_pixel, this.U.ybottom_pixel, 
                    this.cursorMarkerRadius, this.cursorMarker_style);                
                this.cursorMarkerRight = this.U.DrawCirclePixel(this.svg, this.V.x_pixel, this.V.ybottom_pixel, 
                    this.cursorMarkerRadius, this.cursorMarker_style);

                this.trackingMarker = null;
                this.trackingScale = null;
                this.trackingY = "y1";
                this.trackingArrowFunction = (evt) => 
                    { 
                        if (this.trackingMarker != null && this.trackingScale != null)
                        {
                            // Move the marker + cursor!
                            let rect = this.svg.getBoundingClientRect();
                            let ypixel = evt.y - rect.top;
                            let y = this.trackingScale.PixelToY(ypixel);
                            //console.log(`MOUSE: tracking ypixel=${ypixel} y=${y}`);

                            this.cursor.setAttribute(this.trackingY, ypixel);
                            this.trackingMarker.setAttribute("cy", ypixel);
                        }
                    };
                this.mouseUpArrowFunction = (evt) => 
                    { 
                        // console.log(`MOUSE: UP x=${evt.x}`)

                        evt.preventDefault();
                        this.trackingMarker.setAttribute("r", this.cursorMarkerRadius);
                        this.svg.removeEventListener("mousemove", this.trackingArrowFunction);
                        this.svg.removeEventListener("mouseup", this.mouseUpArrowFunction);
                        this.trackingMarker = null;
                        this.trackingScale = null;
                    };

                this.cursorMarkerLeft.addEventListener("mousedown", (evt) => {
                    this.trackingScale = this.U;
                    this.trackingY = "y1";

                    evt.preventDefault();
                    this.trackingMarker = evt.currentTarget;
                    this.trackingMarker.setAttribute("r", this.cursorMarkerSelectedRadius);
                    this.svg.addEventListener("mousemove", this.trackingArrowFunction);
                    this.svg.addEventListener("mouseup", this.mouseUpArrowFunction);
                    //console.log(`MOUSE: mousedown on ${this.trackingMarker}`)
                });

                // Same as the Left but binds to the V Scale not the U one
                this.cursorMarkerRight.addEventListener("mousedown", (evt) => {
                    this.trackingScale = this.V;
                    this.trackingY = "y2";

                    evt.preventDefault();
                    this.trackingMarker = evt.currentTarget;
                    this.trackingMarker.setAttribute("r", this.cursorMarkerSelectedRadius);
                    this.svg.addEventListener("mousemove", this.trackingArrowFunction);
                    this.svg.addEventListener("mouseup", this.mouseUpArrowFunction);
                    //console.log(`MOUSE: mousedown on ${this.trackingMarker}`)
                });

                // At the very end, draw the nomograph
                this.U.DrawGraduations();
                this.V.DrawGraduations();
                this.W.DrawGraduations();
            }

        }
