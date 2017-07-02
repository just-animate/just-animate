// import { jsdom } from '../dom'
import * as chai from 'chai'
const { expect, assert } = chai 

import { propsToKeyframes } from '../../src/transformers'

describe('propsToKeyframes', () => {
    // jsdom()

    it('should change opacity: [1,0,1,0] to appropriate keyframes', () => {
        const actual = propsToKeyframes({
            opacity: [1, 0, 1, 0]
        })
        
        assert.deepEqual(actual, [
            { offset: 0, opacity: 1 },
            { offset: 1 / 3, opacity: 0 },
            { offset: 2 / 3, opacity: 1 },
            { offset: 1, opacity: 0 }
        ])
    })

    it('should change opacity: [1,0] to appropriate keyframes', () => {
        const actual = propsToKeyframes({
            opacity: [1, 0]
        })

        assert.deepEqual(actual, [
            { offset: 0, opacity: 1 },
            { offset: 1, opacity: 0 }
        ])
    })

    it('should change rotate: [0, 90deg, -360deg] to appropriate keyframes', () => {
        const actual = propsToKeyframes({
            rotate: [0, '90deg', '-360deg']
        })

        assert.deepEqual(actual, [
            { offset: 0, rotate: 0 },
            { offset: 1 / 2, rotate: '90deg' },
            { offset: 1, rotate: '-360deg' }
        ])
    })
})
