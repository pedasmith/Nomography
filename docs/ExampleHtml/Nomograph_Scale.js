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
        this.tick_settings.UpdateTickSettings(this, default_label_alignment);

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


    DrawText(parent, str, tick_label_alignment, x, y, style, name)
    {
        let x_pixel = x;
        let y_pixel = this.YToPixel(y);

        if (false && name == "V")
        {
            console.log(`DrawText: called: name=${name} y=${y} y_pixel=${y_pixel} min=${this.ymin}  max=${this.ymax} dir=${this.direction} str=<<${str}>> alignment=${tick_label_alignment} x=${x}`);
        }

        const text = document.createElementNS(this.svgns, "text");
        if (tick_label_alignment == "left")
        {
            text.setAttribute("x", x_pixel-12);
            text.setAttribute("text-anchor", "end");
        }
        else
        {
            text.setAttribute("x", x_pixel+10);
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

// As a P, Q, R scale, this class can draw ticks and convert between y values and pixel values. 
// The childScale is the actual arithmetic scale (U, V, W) that the calculations will use.
// The thisScale is the scale (P, Q, R) that the ticks and labels will be drawn for.
class ScaleOverlay
{
    constructor (childScale, overlayScaleSettings)
    {
        let settings_provided = true;
        if (overlayScaleSettings == null)
        {
            settings_provided = false;
            overlayScaleSettings = {
                "name": childScale.name,
                "title": childScale.title,
                "ymin": childScale.ymin, 
                "ymax": childScale.ymax, 
                "toUnderlyingValue": function(value) { return value; }, 
                "toOverlayValue" : function(value) { return value; }
            };
        }
        // TODO: just make up a function that does a linear conversion?
        // HUH? why am I always making an overlay scale? Why not just use the child scale directly?
        // 
        this.childScale = childScale;
        const child_tick_first = childScale.tick_settings.tick_first;
        let overlayScale = new Scale(childScale.svg, 
            overlayScaleSettings.name, 
            childScale.x_pixel,
            childScale.ystart_pixel,
            childScale.height_pixel,
            overlayScaleSettings.ymin,
            overlayScaleSettings.ymax,
            overlayScaleSettings.title,
            childScale.default_label_alignment,
            childScale.tick_settings
        );
        overlayScale.direction = childScale.direction;

        // Special fixup: the child W scale will have a default tick_first (set to the ymin, of course). 
        // when we make the R overlay scale, it will use the W tick_first, which is in the wrong units.
        // Issue: the correction get applied twice :-)
        if (childScale.name == "W" && overlayScale.name == "R")
        {
            if (overlayScale.tick_settings.tick_first_was_updated == undefined)
            {
                overlayScale.tick_settings.tick_first_was_updated = true;
                const overlay_tick_first = overlayScaleSettings.toOverlayValue(child_tick_first);
                overlayScale.tick_settings.tick_first = overlay_tick_first;
                console.log(`DBG: ScaleOverlay: R tick_first adjusted from W=${child_tick_first} to R=${overlay_tick_first}`);
            }
        }

        this.overlayScaleUnused = overlayScale;
        if (settings_provided) this.overlayScale = overlayScale;

        this.toOverlayValue = overlayScaleSettings.toOverlayValue;;
        this.toUnderlyingValue = overlayScaleSettings.toUnderlyingValue;
    }

    DrawGraduations ()
    {
        if (this.overlayScale != null)
        {
            ;
        }
        const scale = this.overlayScale != null ? this.overlayScale : this.childScale;
        scale.DrawGraduations();
    }  

    PixelToYOverlay(ypixel)
    {
        const scale = this.overlayScale != null ? this.overlayScale : this.childScale;
        const retval = scale.PixelToY(ypixel);
        return retval;
    }
}
