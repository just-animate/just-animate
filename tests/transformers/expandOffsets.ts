import { jsdom } from '../dom'
import * as chai from 'chai'
const { expect } = chai

import { expandOffsets } from '../../src/transformers'

describe('expandOffsets', () => {
    jsdom()

    it('should copy offset: [0, 1] to { offset: 0 }, { offset: 1}', () => {
        const keyframes = [
            { offset: [0, 1], opacity: 1 },
            { offset: .5, opacity: 0 }
        ]

        expandOffsets(keyframes)

        expect(keyframes[0]).to.deep.equal({ offset: 0, opacity: 1 })
        expect(keyframes[1]).to.deep.equal({ offset: 1 / 2, opacity: 0 })        
        expect(keyframes[2]).to.deep.equal({ offset: 1, opacity: 1 })
    })
})
