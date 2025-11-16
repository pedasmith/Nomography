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

// As a P, Q, R scale, this class can draw ticks and convert between y values and pixel values. 
// The childScale is the actual arithmetic scale (U, V, W) that the calculations will use.
// The thisScale is the scale (P, Q, R) that the ticks and labels will be drawn for.
class ScaleOverlay
{
    constructor (childScale, overlayScale)
    {
        this.childScale = childScale;
        this.overlayScale = overlayScale;
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
