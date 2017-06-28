import * as chai from 'chai'
const { assert } = chai

import { animate } from '../../src/core/timeline2'

describe('elements', () => {

    it('combines keyframes by property and fills in infers offsets', () => {
        /* Test code */
        const target = {}

        const timeline = animate()
            .fromTo(200, 500, {
                target: [target],
                css: [
                    { opacity: 0, x: 0 },
                    { x: 40, offset: .2 },
                    { opacity: .5, x: 0 },
                    { x: 90, offset: .8 },
                    { opacity: 1, x: 100 }
                ]
            })
            .from(600, {
                target: [target],
                duration: 400,
                css: [
                    { opacity: 1, x: 100 },
                    { opacity: 0, x: 0 }
                ]
            })

        const animations = timeline.toAnimations()
        
        assert.deepEqual<{}>(animations, [
            {
                'target': {},
                'from': 200,
                'to': 1000,
                'duration': 800,
                'css': [
                    {
                        'offset': 0,
                        'opacity': 0
                    },
                    {
                        'offset': 0.15,
                        'opacity': 0.5
                    },
                    {
                        'offset': 0.375,
                        'opacity': 1
                    },
                    {
                        'offset': 0.5,
                        'opacity': 1
                    },
                    {
                        'offset': 1,
                        'opacity': 0
                    }
                ]
            },
            {
                'target': {},
                'from': 200,
                'to': 1000,
                'duration': 800,
                'css': [
                    {
                        'offset': 0,
                        'x': 0
                    },
                    {
                        'offset': 0.075,
                        'x': 40
                    },
                    {
                        'offset': 0.15,
                        'x': 0
                    },
                    {
                        'offset': 0.3,
                        'x': 90
                    },
                    {
                        'offset': 0.375,
                        'x': 100
                    },
                    {
                        'offset': 0.5,
                        'x': 100
                    },
                    {
                        'offset': 1,
                        'x': 0
                    }
                ]
            }
        ])
    })
})
