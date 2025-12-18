// Classes for drawing Nomographs using SVG graphics.
// A Nomograph contains multiple Scales; a Scale includes a single Ticks.
// Requires Nomograph_Ticks.js Nomograph_Scale.js


class NomographTypeI
{
    ValidationInfo = undefined;

    constructor(svg, umin, umax, vmin, vmax, u_tick_settings, v_tick_settings, w_tick_settings)
    {
        this.label_textstyle = ""; // tick_textstyle from Scale: "font-family:Courier New, monospace;white-space: pre;";
        //this.linestyle = "stroke:black; fill:none;";
        this.svgns = "http://www.w3.org/2000/svg";

        this.svg = svg;

        this.umin = umin;
        this.umax = umax;
        this.vmin = vmin;
        this.vmax = vmax;

        // Values used to make a type II nomograph
        this.v_zoom = 1.0;
        this.v_autozoom = false; // when true makes U and V same pixel size with correct v_zoom settings.
        // Initialized to true for the NomographTypeII class

        this.HTitle_pixel = 20;
        this.HFooter_pixel = 20;
        this.HLabel_pixel = 0;
        if (this.label != "")
        {
            this.HLabel_pixel += 20;
        }

        this.ScaleUV_pixel = 240;

        this.u_tick_settings = u_tick_settings;
        this.v_tick_settings = v_tick_settings;
        this.w_tick_settings = w_tick_settings;

        this.currentValues = {
            valueU: this.umin,
            valueV: this.vmin,
            valueW: this.wmin,

            valueUPixel: 0,
            valueVPixel: 0,
            valueWPixel: 0,
        };

        this.label = "";

        // DOM element for our eventing system
        this.onUWVValueChangedElement = document.createElement("div");
    }

    // Public method: use this to wire up a handler for when the U V W values change
    AddValueChangedListener(fnc)
    {
        this.onUWVValueChangedElement.addEventListener("onUWVValueChanged", fnc);
    }


    OnSizeChange()
    {
        let height = this.svg.getBoundingClientRect().height;
        if (this.suppressResizeObserverCallback == true)
        {
            this.suppressResizeObserverCallback = false;
            return;
        }
        this.svg.innerHTML = "";
        this.Initialize();
    }



    get wmin() { return this.wmin_override ?? this.umin + this.vmin;} 
    get wmax() { return this.wmax_override ?? this.umax + this.vmax;}
    get urange() { return this.umax - this.umin;} 
    get vrange() { return this.vmax - this.vmin;} 


    // childScaleName is e.g., "P" for P scale overlaying U scale. The required elements of the scaleSettings
    // are the toUnderlyingValue and toOverlayValue functions. Optionally, ymin and ymax can be provided.
    // (the ymin and ymax are required for R scales)
    SetOverlayScaleSettings(childScaleName, scaleSettings)
    {
        scaleSettings.name = scaleSettings.name ?? childScaleName;
        scaleSettings.title = scaleSettings.title ?? scaleSettings.name;

        switch (childScaleName)
        {
            case "P": 
                scaleSettings.ymin = scaleSettings.ymin ?? this.umin;
                scaleSettings.ymax = scaleSettings.ymax ?? this.umax;
                this.umin = scaleSettings.toUnderlyingValue(scaleSettings.ymin);
                this.umax = scaleSettings.toUnderlyingValue(scaleSettings.ymax);
                this.pOverlayScaleSettings = scaleSettings; 
                break;
            case "Q": 
                scaleSettings.ymin = scaleSettings.ymin ?? this.vmin;
                scaleSettings.ymax = scaleSettings.ymax ?? this.vmax;
                this.vmin = scaleSettings.toUnderlyingValue(scaleSettings.ymin);
                this.vmax = scaleSettings.toUnderlyingValue(scaleSettings.ymax);
                this.qOverlayScaleSettings = scaleSettings; 
                break;
            case "R": 
                scaleSettings.ymin = scaleSettings.ymin ?? (scaleSettings.toOverlayValue(this.umin + this.vmin));
                scaleSettings.ymax = scaleSettings.ymax ?? (scaleSettings.toOverlayValue(this.umax + this.vmax));
                this.wmin_override = scaleSettings.toUnderlyingValue(scaleSettings.ymin);
                this.wmax_override = scaleSettings.toUnderlyingValue(scaleSettings.ymax);
                this.rOverlayScaleSettings = scaleSettings; 
                break;
        }
    }

    Initialize()
    {
        // Bad ways to get height include this.svg.getBBox (height after all objects placed), 
        // svg.getAttribute("height") and svg.offsetHeight (may be 0).
        let height = this.svg.getBoundingClientRect().height;

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

        this.XCenter_pixel = this.XU_pixel + (this.ScaleUV_pixel / 2);        

        //console.log(`NOTE: Initialize: II=${make_type_II} alpha=${this.alpha} scale u=${u_scale} v=${v_scale} w=${w_scale}`);

        if (this.order == "UVW") // a normal nomograph has W in the middle (UWV).
        {
            let new_xv = this.XW_pixel;
            this.XW_pixel = this.XV_pixel;
            this.XV_pixel = new_xv;
            this.XRight_pixel = this.XW_pixel;

            this.V_direction = "down";
            this.W_direction = "down";

            let new_wscale = v_scale;
            v_scale = w_scale;
            w_scale = new_wscale;
        }

        let h_pixel = height - this.HTitle_pixel - this.HFooter_pixel - this.HLabel_pixel;
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
        this.P = new ScaleOverlay(this.U, this.pOverlayScaleSettings); // works even when null

        this.V = new Scale (this.svg, "V", 
            this.XV_pixel, 
            this.HTitle_pixel, h_per_unit*(this.vmax-this.vmin)  * v_scale, 
            this.vmin, this.vmax, 
            "V", "right", this.v_tick_settings); 
        if ("V_direction" in this) this.V.direction = this.V_direction;
        this.Q = new ScaleOverlay(this.V, this.qOverlayScaleSettings); // works even when null

        this.W = new Scale (this.svg, "W", 
            this.XW_pixel, 
            this.HTitle_pixel, h_per_unit*(this.wmax-this.wmin) * w_scale, 
            this.wmin, this.wmax, 
            "W", "right", this.w_tick_settings); 
        if ("W_direction" in this) this.W.direction = this.W_direction;
        this.R = new ScaleOverlay(this.W, this.rOverlayScaleSettings); // works even when null

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

        this.currentValues.valueUPixel = this.U.ybottom_pixel;
        this.currentValues.valueVPixel = this.V.ybottom_pixel;

        this.trackingMarker = null;
        this.trackingScale = null; // just for debugging
        this.trackingY = "y1"; // must match the SVG attribute e.g., y1 or y2
        this.trackingArrowFunction = (evt) => 
            { 
                if (this.trackingMarker != null && this.trackingScale != null)
                {
                    // Move the marker + cursor!
                    let rect = this.svg.getBoundingClientRect();
                    // handles both touch and mouse values
                    let yraw = evt.changedTouches ? evt.changedTouches[0].clientY : evt.clientY;
                    let ypixel = yraw - rect.top;
                    //let y = this.trackingScale.PixelToYOverlay(ypixel);
                    //console.log(`MOUSE: tracking ypixel=${ypixel} y=${y} yraw=${yraw}`);

                    this.cursor.setAttribute(this.trackingY, ypixel);
                    this.trackingMarker.setAttribute("cy", ypixel);

                    this.UpdatePixelValue(this.trackingY, ypixel);

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

        this.touchEndArrowFunction = (evt) => 
            { 
                // console.log(`MOUSE: Touch End x=${evt.changedTouches[0].clientX}`)

                evt.preventDefault();
                this.trackingMarker.setAttribute("r", this.cursorMarkerRadius);
                this.svg.removeEventListener("touchmove", this.trackingArrowFunction);
                this.svg.removeEventListener("touchend", this.mouseUpArrowFunction);
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

        this.cursorMarkerLeft.addEventListener("touchstart", (evt) => {
            this.trackingScale = this.U;
            this.trackingY = "y1";

            evt.preventDefault();
            this.trackingMarker = evt.currentTarget;
            this.trackingMarker.setAttribute("r", this.cursorMarkerSelectedRadius);
            this.svg.addEventListener("touchmove", this.trackingArrowFunction);
            this.svg.addEventListener("touchend", this.touchEndArrowFunction);
            // console.log(`MOUSE: touchdown on ${this.trackingMarker}`)
        });                


        this.cursorMarkerRight.addEventListener("touchstart", (evt) => {
            this.trackingScale = this.V;
            this.trackingY = "y2";

            evt.preventDefault();
            this.trackingMarker = evt.currentTarget;
            this.trackingMarker.setAttribute("r", this.cursorMarkerSelectedRadius);
            this.svg.addEventListener("touchmove", this.trackingArrowFunction);
            this.svg.addEventListener("touchend", this.touchEndArrowFunction);
            // console.log(`MOUSE: touchstart on ${this.trackingMarker}`)
        });


        // At the very end, draw the nomograph
        this.P.DrawGraduations();
        this.Q.DrawGraduations();
        this.R.DrawGraduations();
        if (this.label != "")
        {
            this.label_ypixel = height - this.HLabel_pixel;
            this.DrawLabelPixel(this.svg, this.label, this.XCenter_pixel, this.label_ypixel + 10);
        }

        if (this.ValidationInfo != undefined)
        {
            console.log(`Validation Info: ${this.ValidationInfo}`);
        }

        if (this.resizeObserver_set == undefined)
        {
            this.resizeObserver_set = true;
            this.suppressResizeObserverCallback = true;
            console.log(`DBG: Initialize: setting up ResizeObserver`);
            this.resizeObserver = new ResizeObserver(this.OnSizeChange.bind(this)).observe(this.svg);
        }

    }

    DrawLabelPixel(parent, str, x, y)
    {
        const text = document.createElementNS(this.svgns, "text");
        text.setAttribute("x", x);
        // small vertical adjustment so number centers on the tick
        text.setAttribute("y", y-4);
        text.setAttribute("font-size", "16");
        text.setAttribute("fill", "black");
        text.setAttribute("text-anchor", "middle"); // because "center" is too hard a word for SVG.
        text.textContent = str;
        this.svg.appendChild(text);
        return text; // just in case we need it later.
    }

    GetScale(scaleName)
    {
        switch (scaleName)
        {
            case "U": return this.U;
            case "V": return this.V;
            case "W": return this.W;

            case "P": return this.P;
            case "Q": return this.Q;
            case "R": return this.R;
        }
    }
    GetScaleOverlay(scaleName)
    {
        switch (scaleName)
        {
            case "U": return this.P;
            case "V": return this.Q;
            case "W": return this.R;
        }
    }

    GetScaleOverlayName(scaleName)
    {
        switch (scaleName)
        {
            case "U": return "P";
            case "V": return "Q";
            case "W": return "R";
        }
    }

    UpdatePixelValue(mouseName, valuePixel)
    {
        let scaleName = "U";
        if (mouseName == "y2") scaleName="V"; // TODO: handle UVW
        const scale = this.GetScale(scaleName);
        const value = scale.PixelToY(valuePixel);

        const scaleOverlayName = this.GetScaleOverlayName(scaleName);
        const scaleOverlay = this.GetScaleOverlay(scaleName);
        const valueOverlay = scaleOverlay.PixelToYOverlay(valuePixel);

        this.currentValues["value" + scaleName + "Pixel"] = valuePixel;
        this.currentValues["value" + scaleName + ""] = value;

        // Update the W value
        // Later: actually, this should be simpler: the underlying equation is U+V=W. Since I have the U and
        // V values, I can just add them and get the W value. All this fancy trig is a waste of time and
        // processor power.
        const uvDeltaYPixel = this.currentValues.valueUPixel - this.currentValues.valueVPixel;
        this.currentValues.valueWPixel = this.currentValues.valueUPixel - (uvDeltaYPixel * this.alpha);
        this.currentValues.valueW = this.W.PixelToY(this.currentValues.valueWPixel);

        this.currentValues.valueP = this.P.toOverlayValue(this.currentValues.valueU);
        this.currentValues.valueQ = this.Q.toOverlayValue(this.currentValues.valueV);
        this.currentValues.valueR = this.R.toOverlayValue(this.currentValues.valueW);

        // Dispatch the change(scale + "W");
        const uwvChanged = new CustomEvent("onUWVValueChanged", {
        detail: {
            change: scale+"W", // W is always updated :-)
            current: this.currentValues,
        },
        });
        this.onUWVValueChangedElement.dispatchEvent(uwvChanged)
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
