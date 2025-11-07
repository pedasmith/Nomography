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

