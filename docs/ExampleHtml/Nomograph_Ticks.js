class Ticks
{
    constructor()
    {
    }

    IsEvenlyDivisible(value, divisor)
    {
        let remainder = Math.abs(value % divisor);
        let delta = Math.abs(remainder - divisor);
        if (delta < 0.000001 || remainder < 0.000001) delta = 0;
        //if (value == 50) console.log(`NOTE: IsEvenlyDivisible: value=${value} divisor=${divisor} delta=${delta} remainder=${remainder}`);
        return delta == 0;
    }

    // Uses the TickSettings from the scale to determine the size of the tick mark at value y.
    TickSize(y, scale)
    {
        y = Math.round(y*1000000) / 1000000; // helps with weird round-off.
        let tickType = 3;

        if (this.IsEvenlyDivisible(y, scale.tick_settings.large_mod))
        {
            tickType = 1;
        }
        else if (this.IsEvenlyDivisible(y, scale.tick_settings.medium_mod))
        {
            //if (y==9.8) console.log(`NOTE: TickSize: scale=${scale.name} y=${y} is medium tick`);
            tickType = 2;
        }
        else if (this.IsEvenlyDivisible(y, scale.tick_settings.small_mod))
        {
            tickType = 3;
        }

        //if (scale.name == "W") console.log(`NOTE: Scale: scale=${scale.name} y=${y} tick=${tickType} l=${scale.tick_settings.large_mod} m=${scale.tick_settings.medium_mod} s=${scale.tick_settings.small_mod}`);
        let retval = 2;
        switch (tickType)
        {
            case 1: retval = 10; break;
            case 2: retval = 6; break;
            case 3: retval = 2; break;
            default: retval = 2; break;
        }
        return retval;
    }


    // Uses the TickSettings that are passed in from the original Nomograph constructor (and which
    // are stored in the Scale object and have had UpdateTickSettings() called) to draw ticks on the scale.
    DrawTicks(scale)
    {
        for (let y = scale.tick_settings.tick_first; y<=(scale.ymax + 0.0000001); y+=scale.tick_settings.small_mod)
        {
            const ticksize = this.TickSize(y, scale)
            let tickLeft = scale.tick_settings.tick_side.includes("left") ? ticksize : 0;
            let tickRight = scale.tick_settings.tick_side.includes("right") ? ticksize : 0;
            scale.DrawLine(scale.parent, scale.x_pixel-tickLeft, y, scale.x_pixel+tickRight, y, scale.linestyle);
        }

        for (let y = scale.tick_settings.tick_label_first; y<=scale.ymax; y+=scale.tick_settings.tick_label_delta)
        {
            var str = y.toFixed(); // NOTE: old code was used scale.tick_settings.tick_precision); 
            // This qualifies as a code issue for Daily WTF. But it's quick and it works for now.
            str = str.replace(".0000", "     ");
            str = str.replace(".000", "    ");
            str = str.replace(".00", "   ");
            str = str.replace(".0", "  ");
            scale.DrawText(scale.parent, str, scale.tick_settings.tick_label_alignment, scale.x_pixel+2, y, scale.tick_textstyle, scale.name);
        }
    }
}

// Passed into the constructor for e.g., NomographTypeI to specify tick settings for a scale.
// These are saved and then passed into the Scale constructor.
class TickSettings
{
    small_mod = undefined;
    medium_mod = undefined;
    large_mod = undefined;

    clone()
    {
        return new TickSettings(this, this.small_mod, this.medium_mod, this.large_mod);
    }
    
    constructor(optionalValue, small_mod, medium_mod, large_mod)
    {
        this.tick_first = undefined;
        this.tick_side = "left+right";
        this.tick_label_first = undefined;
        this.tick_label_delta = undefined;
        this.tick_label_alignment = undefined;

        if (optionalValue != undefined)
        {
            this.tick_first = optionalValue.tick_first;
            this.tick_side = optionalValue.tick_side;
            this.tick_label_first = optionalValue.tick_label_first;
            this.tick_label_delta = optionalValue.tick_label_delta;
            this.tick_label_alignment = optionalValue.tick_label_alignment;
            this.small_mod = optionalValue.small_mod;
            this.medium_mod = optionalValue.medium_mod;
            this.large_mod = optionalValue.large_mod;
        }

        this.small_mod = small_mod;
        this.medium_mod = medium_mod;
        this.large_mod = large_mod;
    }

    // Fill in any undefined values from the scale defaults.
    UpdateTickSettings(scale, default_label_alignment)
    {
        this.small_mod = this.small_mod ?? 0.1;
        this.medium_mod = this.medium_mod ?? 0.5;
        this.large_mod = this.large_mod ?? 1.0;

        if (this.medium_mod < this.small_mod) this.medium_mod = this.small_mod;
        if (this.large_mod < this.medium_mod) this.large_mod = this.medium_mod;
        
        if (this.tick_first == undefined)
        {
            this.tick_first = scale.ymin;
        }
        if (this.tick_label_delta == undefined)
        {
            this.tick_label_delta = this.medium_mod;
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

