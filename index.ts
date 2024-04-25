type CRC2D = CanvasRenderingContext2D

export type Primitive = (g: CRC2D) => void

export type Attrs = {
    shadowBlur?: number
    shadowColor?: string
    shadowOffsetX?: number
    shadowOffsetY?: number

    direction?: CanvasDirection
    font?: string
    fontKerning?: CanvasFontKerning
    fontStretch?: CanvasFontStretch
    fontVariantCaps?: CanvasFontVariantCaps
    letterSpacing?: string
    textAlign?: CanvasTextAlign
    textBaseline?: CanvasTextBaseline
    textRendering?: CanvasTextRendering
    wordSpacing?: string

    lineCap?: CanvasLineCap
    lineJoin?: CanvasLineJoin
    lineWidth?: number
    miterLimit?: number

    lineDash?: number[]
    lineDashOffset?: number

    filter?: string
}

export type DSL = (Primitive | Attrs | DSL)[]

/**
 *  Utility type to extract the function signature of a method in `CanvasRenderingContext2D`
 */
type PrimitiveFromCRC2DFunction<K extends keyof CRC2D> = CRC2D[K] extends (
    ...args: infer A
) => any
    ? (...args: A) => Primitive
    : never

export const render2d = (g: CRC2D, dsl: DSL) => {
    g.save()
    for (const cmd of dsl) {
        if (Array.isArray(cmd)) {
            render2d(g, cmd)
        } else if (typeof cmd === 'function') {
            cmd(g)
        } else {
            applyAttrs(g, cmd)
        }
    }
    g.restore()
}

const applyAttrs = (g: CRC2D, attrs: Attrs) => {
    for (const [k, v] of Object.entries(attrs)) {
        switch (k) {
            case 'lineDash':
                // @ts-ignore
                g.setLineDash(v)
                break
            default:
                // @ts-ignore
                g[k] = v
                break
        }
    }
}

export const stroke = (dsl: DSL) => (g: CRC2D) => {
    g.beginPath()
    render2d(g, dsl)
    g.stroke()
}

export const fill = (dsl: DSL) => (g: CRC2D) => {
    g.beginPath()
    render2d(g, dsl)
    g.fill()
}

// Transformations

export const translate: PrimitiveFromCRC2DFunction<'translate'> =
    (x, y) => g => {
        g.translate(x, y)
    }

export const scale: PrimitiveFromCRC2DFunction<'scale'> = (x, y) => g => {
    g.scale(x, y)
}

export const rotate: PrimitiveFromCRC2DFunction<'rotate'> = angle => g => {
    g.rotate(angle)
}

export const transform: PrimitiveFromCRC2DFunction<'transform'> =
    (a, b, c, d, e, f) => g => {
        g.transform(a, b, c, d, e, f)
    }

// Text

export const text: PrimitiveFromCRC2DFunction<'fillText'> =
    (text, x, y) => g => {
        g.fillText(text, x, y)
    }

export const fillText: PrimitiveFromCRC2DFunction<'fillText'> =
    (text, x, y) => g => {
        g.fillText(text, x, y)
    }

export const strokeText: PrimitiveFromCRC2DFunction<'strokeText'> =
    (text, x, y) => g => {
        g.strokeText(text, x, y)
    }

// Paths

export const moveTo: PrimitiveFromCRC2DFunction<'moveTo'> = (x, y) => g => {
    g.moveTo(x, y)
}

export const lineTo: PrimitiveFromCRC2DFunction<'lineTo'> = (x, y) => g => {
    g.lineTo(x, y)
}

export const circle = (x: number, y: number, radius: number) => (g: CRC2D) => {
    g.arc(x, y, radius, 0, Math.PI * 2)
}

export const arc: PrimitiveFromCRC2DFunction<'arc'> =
    (x, y, radius, startAngle, endAngle, anticlockwise) => g => {
        g.arc(x, y, radius, startAngle, endAngle, anticlockwise)
    }

export const rect: PrimitiveFromCRC2DFunction<'rect'> = (x, y, w, h) => g => {
    g.rect(x, y, w, h)
}

export const ellipse: PrimitiveFromCRC2DFunction<'ellipse'> =
    (
        x,
        y,
        radiusX,
        radiusY,
        rotation,
        startAngle,
        endAngle,
        counterclockwise
    ) =>
    g => {
        g.ellipse(
            x,
            y,
            radiusX,
            radiusY,
            rotation,
            startAngle,
            endAngle,
            counterclockwise
        )
    }

export const bezierCurveTo: PrimitiveFromCRC2DFunction<'bezierCurveTo'> =
    (cp1x, cp1y, cp2x, cp2y, x, y) => g => {
        g.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    }

export const quadraticCurveTo: PrimitiveFromCRC2DFunction<'quadraticCurveTo'> =
    (cpx, cpy, x, y) => g => {
        g.quadraticCurveTo(cpx, cpy, x, y)
    }
