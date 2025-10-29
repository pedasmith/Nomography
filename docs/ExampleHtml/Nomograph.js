        // Classes for drawing Nomographs using SVG graphics.
        // A Nomograph contains multiple Scales; a Scale includes a single Ticks.
        
        class Ticks
        {
            constructor()
            {
            }

            TickSize(y, scale)
            {
                y = Math.round(y*1000000) / 1000000; // helps with weird round-off.
                let tickType = 3;
                let isInt = Math.round(y) == y;
                let ld = scale.tick_settings.tick_label_delta / 5;
                if (y == scale.ymin || y == scale.ymax)
                {
                    tickType = 1;
                }
                else if (y % scale.tick_settings.tick_label_delta == 0)
                {
                    tickType = 1;
                }
                else if ((y % ld) == 0)
                {
                    tickType = 2;
                }
                else
                {
                    tickType = 3;
                }
                //if (scale.name == "U")
                //{
                //    console.log(`NOTE: Scale: scale=${scale.name} y=${y} ld=${ld} tick=${tickType}`);
                //}
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

                // console.log(`NOTE: Ticks: scale=${scale.name} first=${scale.tick_settings.tick_first} ymax=${scale.ymax} delta=${scale.tick_settings.tick_delta}`);
                for (let y = scale.tick_settings.tick_first; y<=scale.ymax; y+=scale.tick_settings.tick_delta)
                {
                    const ticksize = this.TickSize(y, scale)
                    tickLeft = scale.tick_settings.tick_side.includes("left") ? ticksize : 0;
                    tickRight = scale.tick_settings.tick_side.includes("right") ? ticksize : 0;
                    scale.DrawLine(scale.parent, scale.x_pixel-tickLeft, y, scale.x_pixel+tickRight, y, scale.linestyle);
                }

                for (let y = scale.tick_settings.tick_label_first; y<=scale.ymax; y+=scale.tick_settings.tick_label_delta)
                {
                    var str = y.toFixed(scale.tick_settings.tick_precision);
                    // This qualifies as a code issue for Daily WTF. But it's quick and it works for now.
                    str = str.replace(".0000", "     ");
                    str = str.replace(".000", "    ");
                    str = str.replace(".00", "   ");
                    str = str.replace(".0", "  ");
                    scale.DrawText(scale.parent, str, scale.tick_settings.tick_label_alignment, scale.x_pixel+2, y, scale.tick_textstyle);
                }

            }
        }

        class TickSettings
        {
            constructor(optionalValue)
            {
                this.tick_first = undefined;
                this.tick_delta = 0.5;
                this.tick_precision = 1;
                this.tick_side = "left+right";
                this.tick_label_first = undefined;
                this.tick_label_delta = undefined;
                this.tick_label_alignment = undefined;

                if (optionalValue != undefined)
                {
                    this.tick_first = optionalValue.tick_first;
                    this.tick_delta = optionalValue.tick_delta;
                    this.tick_precision = optionalValue.tick_precision;
                    this.tick_side = optionalValue.tick_side;
                    this.tick_label_first = optionalValue.tick_label_first;
                    this.tick_label_delta = optionalValue.tick_label_delta;
                    this.tick_label_alignment = optionalValue.tick_label_alignment;
                }
            }

            Update(scale, default_label_alignment)
            {
                if (this.tick_first == undefined)
                {
                    this.tick_first = scale.ymin;
                }
                if (this.tick_label_delta == undefined)
                {
                    this.tick_label_delta = this.tick_delta;
                }
                if (this.tick_label_first == undefined)
                {
                    this.tick_label_first = scale.ymin;
                }
                if (this.tick_label_alignment == undefined)
                {
                    this.tick_label_alignment = default_label_alignment;
                }
            }
        }


        // Scales are e.g., the U V and W. They are vertical lines with a linear mapping from a "y" value to a pixel value.
        // The scales will have ticks (see the Ticks class).
        class Scale
        {
            constructor (svg, name, x_pixel, ystart_pixel, height_pixel, ymin, ymax, title, default_label_alignment, tick_settings)
            {
                this.svg = svg;
                this.name = name;
                this.ymin = ymin;
                this.ymax = ymax;

                // Some of the tick settings have a default values from the scale.
                // For example, tick_first is usually scale.ymin, but sometimes isn't.
                this.tick_settings = tick_settings;
                this.tick_settings.Update(this, default_label_alignment);

                this.direction = "up"; // either "up" or "down". Default is down.

                this.x_pixel = x_pixel;
                this.ystart_pixel = ystart_pixel; // this is at the top (e.g., y pixel pos of ymax)
                this.height_pixel = height_pixel;
                this.ybottom_pixel = this.ystart_pixel + this.height_pixel;
                this.title = title;

                // is handled in settings now: TODO: remove: this.tick_label_alignment = tick_label_alignment;
                if (tick_settings.tick_label_alignment != "left" && tick_settings.tick_label_alignment != "right")
                {
                    console.log(`Error: Scale:Ticks: tick_label_alignment is ${tick_settings.tick_label_alignment}. It must be left or right.`);
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
                if (this.direction == "down") ratio = 1.0 - ratio;
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
                if (this.direction == "down") ratio = 1.0 - ratio;
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
            constructor(svg, umin, umax, vmin, vmax, u_tick_settings, v_tick_settings, w_tick_settings)
            {
                this.svg = svg;

                this.umin = umin;
                this.umax = umax;
                this.vmin = vmin;
                this.vmax = vmax;
                this.wmin = this.umin + this.vmin;
                this.wmax = this.umax + this.vmax;

                // Values used to make a type II nomograph
                this.v_zoom = 1.0;
                this.v_autozoom = false; // when true makes U and V same pixel size with correct v_zoom settings.
                // Initialized to true for the NomographTypeII class

                this.HTitle_pixel = 20;
                this.HFooter_pixel = 20;

                this.ScaleUV_pixel = 240;

                this.u_tick_settings = u_tick_settings;
                this.v_tick_settings = v_tick_settings;
                this.w_tick_settings = w_tick_settings;
                this.resizeObserver = new ResizeObserver(this.OnSizeChange.bind(this)).observe(svg);
            }


            OnSizeChange()
            {
                let height= this.svg.getBoundingClientRect().height;
                this.svg.innerHTML = "";
                this.Initialize();
            }

            get urange() { return this.umax - this.umin;} 
            get vrange() { return this.vmax - this.vmin;} 


            Initialize()
            {
                //let bbox = this.svg.getBBox(); // Nope; this is the height after all the objects are placed
                //let height= this.svg.getAttribute("height");
                //let height= this.svg.offsetHeight;
                let height= this.svg.getBoundingClientRect().height;
                // Sometimes needed when debugging height issues: 
                // height = height - 40; // a little bit of space

                if (this.v_autozoom)
                {
                    this.v_zoom = this.vrange / this.urange;
                }
                let u_scale = 1.0;
                let v_scale = u_scale / this.v_zoom;
                let w_scale = 0.5;

                let make_type_II = u_scale != v_scale || this.v_autozoom;
                if (make_type_II)
                {
                    w_scale = (u_scale * v_scale) / (u_scale + v_scale);
                    this.alpha = u_scale / (u_scale + v_scale);
                }
                else
                {
                    this.alpha = 0.5;
                }

                this.XU_pixel = 70;
                this.XW_pixel = this.XU_pixel + (this.alpha * this.ScaleUV_pixel);
                this.XV_pixel = this.XU_pixel + this.ScaleUV_pixel;
                this.XRight_pixel = this.XV_pixel;

                //console.log(`NOTE: Initialize: II=${make_type_II} alpha=${this.alpha} scale u=${u_scale} v=${v_scale} w=${w_scale}`);

                if (this.order == "UVW")
                {
                    var temp = this.XW_pixel;
                    this.XW_pixel = this.XV_pixel;
                    this.XV_pixel = temp;
                    this.XRight_pixel = this.XW_pixel;

                    this.V_direction = "down";
                    this.W_direction = "down";

                    temp = v_scale;
                    v_scale = w_scale;
                    w_scale = temp;
                }

                let h_pixel = height - this.HTitle_pixel - this.HFooter_pixel;
                let h_per_unit_u = h_pixel / ((this.umax - this.umin) * u_scale); 
                let h_per_unit_v = h_pixel / ((this.vmax - this.vmin) * v_scale);
                let h_per_unit_w = h_pixel / ((this.wmax - this.wmin) * w_scale);
                let h_per_unit_right = (this.order == "UVW") ? h_per_unit_w : h_per_unit_v;
                let h_per_unit = Math.min (h_per_unit_u, h_per_unit_right); 

                this.U = new Scale (this.svg, "U", 
                    this.XU_pixel, 
                    this.HTitle_pixel, h_per_unit*(this.umax-this.umin) * u_scale, 
                    this.umin, this.umax, 
                    "U", "left", this.u_tick_settings); 
                if ("U_direction" in this) this.U.direction = this.U_direction;

                this.V = new Scale (this.svg, "V", 
                    this.XV_pixel, 
                    this.HTitle_pixel, h_per_unit*(this.vmax-this.vmin)  * v_scale, 
                    this.vmin, this.vmax, 
                    "V", "right", this.v_tick_settings); 
                if ("V_direction" in this) this.V.direction = this.V_direction;

                this.W = new Scale (this.svg, "W", 
                    this.XW_pixel, 
                    this.HTitle_pixel, h_per_unit*(this.wmax-this.wmin) * w_scale, 
                    this.wmin, this.wmax, 
                    "W", "right", this.w_tick_settings); 
                if ("W_direction" in this) this.W.direction = this.W_direction;

                this.cursor_style = "stroke:blue; fill:none; stroke-width:4px"; 
                this.cursorMarker_style = "stroke:blue; fill:blue; fill-opacity:50%; stroke-width:1px";
                this.cursorMarkerRadius = 10;
                this.cursorMarkerSelectedRadius = 15;

                // All the cursor stuff!
                let scaleRight = this.V;
                if (this.order == "UVW") scaleRight =this.W;
                this.cursor = this.U.DrawLinePixel(this.svg, 
                    this.U.x_pixel, this.U.ybottom_pixel, 
                    scaleRight.x_pixel, scaleRight.ybottom_pixel, this.cursor_style);
                this.cursorMarkerLeft = this.U.DrawCirclePixel(this.svg, this.U.x_pixel, this.U.ybottom_pixel, 
                    this.cursorMarkerRadius, this.cursorMarker_style);                
                this.cursorMarkerRight = this.U.DrawCirclePixel(this.svg, scaleRight.x_pixel, scaleRight.ybottom_pixel, 
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

        class NomographTypeII extends NomographTypeI
        {
            constructor(svg, umin, umax, vmin, vmax, u_tick_settings, v_tick_settings, w_tick_settings)
            {
                super(svg, umin, umax, vmin, vmax, u_tick_settings, v_tick_settings, w_tick_settings);
                this.v_autozoom = true; // when true makes U and V same pixel size with correct v_zoom settings.
            }
        }        
