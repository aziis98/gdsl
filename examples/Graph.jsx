import { memo, useEffect, useRef } from 'preact/compat'

import {
    circle,
    fill,
    lineTo,
    moveTo,
    render2d,
    stroke,
    text,
    translate,
} from '../index.ts'

const round = d => Math.round(100 * d) / 100

const rescale = ([sourceMin, sourceMax], [targetMin, targetMax], value) => {
    const sourceRange = sourceMax - sourceMin
    const targetRange = targetMax - targetMin

    return targetMin + ((value - sourceMin) / sourceRange) * targetRange
}

const data1 = []
const data2 = []

let yValue1 = 50
let yValue2 = -50

const updateData = (removeFirst = true) => {
    yValue1 += Math.random() * 10 - 5
    yValue2 += Math.random() * 10 - 5

    if (removeFirst) data1.shift()
    data1.push(round(yValue1))

    if (removeFirst) data2.shift()
    data2.push(round(yValue2))
}

for (let i = 0; i < 100; i++) {
    updateData(false)
}

const render = (canvas, { mouse }) => {
    // The canvas has 100% width and height set from css and lives in a container with `display: grid` to make the canvas fill the whole container
    const [WIDTH, HEIGHT] = [canvas.offsetWidth, canvas.offsetHeight]
    canvas.width = WIDTH
    canvas.height = HEIGHT

    /**
     * @type {CanvasRenderingContext2D}
     */
    const g = canvas.getContext('2d')

    const minY = Math.min(...data1, ...data2)
    const maxY = Math.max(...data1, ...data2)

    const yZero = rescale([minY, maxY], [HEIGHT, 0], 0)

    const mouseIndex = Math.round(
        rescale([0, WIDTH], [0, data1.length], mouse.x)
    )
    const mouseData1 = data1[mouseIndex]
    const mouseData2 = data2[mouseIndex]

    render2d(g, [
        translate(0.5, 0.5),
        [
            { strokeStyle: '#ccc' },
            stroke([
                moveTo(0, yZero),
                lineTo(WIDTH, yZero),

                moveTo(rescale([0, data1.length], [0, WIDTH], mouseIndex), 0),
                lineTo(
                    rescale([0, data1.length], [0, WIDTH], mouseIndex),
                    HEIGHT
                ),
            ]),
        ],
        [
            [[data1, mouseData1], { color: '#f66', labelColor: '#800' }],
            [[data2, mouseData2], { color: '#66f', labelColor: '#008' }],
        ].map(([[data, mouseData], { color, labelColor }]) => [
            [
                { strokeStyle: color, lineWidth: 2 },
                stroke([
                    moveTo(0, rescale([minY, maxY], [HEIGHT, 0], data[0])),
                    data.map((y, i) => [
                        lineTo(
                            rescale([0, data.length], [0, WIDTH], i),
                            rescale([minY, maxY], [HEIGHT, 0], y)
                        ),
                    ]),
                ]),
            ],
            [
                { fillStyle: labelColor },
                fill([
                    circle(
                        rescale([0, data1.length], [0, WIDTH], mouseIndex),
                        rescale([minY, maxY], [HEIGHT, 0], mouseData),
                        3
                    ),
                ]),
            ],
            [
                { fillStyle: labelColor, font: '500 14px Geist Sans' },
                text(
                    rescale([0, data1.length], [0, WIDTH], mouseIndex) + 5,
                    rescale([minY, maxY], [HEIGHT, 0], mouseData) - 5,
                    `${mouseData}`
                ),
            ],
        ]),
        [
            { strokeStyle: '#ccc', lineWidth: 1 },
            data1.map((_, i) =>
                stroke([
                    moveTo(
                        rescale([0, data1.length], [0, WIDTH], i),
                        yZero - (i % 10 === 0 ? 4 : 2)
                    ),
                    lineTo(
                        rescale([0, data1.length], [0, WIDTH], i),
                        yZero + (i % 10 === 0 ? 4 : 2)
                    ),
                ])
            ),
        ],
    ])
}

export const Graph = memo(({}) => {
    const canvasRef = useRef(null)
    const graphStateRef = useRef({
        mouse: { x: 0, y: 0 },
    })

    useEffect(() => {
        if (!canvasRef.current) return

        render(canvasRef.current, graphStateRef.current)

        const interval = setInterval(() => {
            updateData()
            render(canvasRef.current, graphStateRef.current)
        }, 250)

        return () => {
            console.log('unmount')
            clearInterval(interval)
        }
    }, [canvasRef.current])

    return (
        <canvas
            ref={canvasRef}
            onMouseMove={e => {
                graphStateRef.current.mouse.x = e.offsetX
                graphStateRef.current.mouse.y = e.offsetY
                render(e.target, graphStateRef.current)
            }}
        ></canvas>
    )
})
