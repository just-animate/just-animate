// import { jsdom } from '../dom'
import * as chai from 'chai'
import { getTargets } from '../../src/utils/get-targets';
const { assert } = chai

describe('getTargets()', () => {

    it('resolves element as element[]', () => {
        const element = document.createElement('div')
        assert.equal(1, getTargets(element).length)
    })

    it('resolves elements by selector', () => {
        const parent = document.createElement('div')
        parent.id = 'elementBySelector'
        document.body.appendChild(parent)

        for (let i = 0; i < 20; i++) {
            const child = document.createElement('span')
            child.classList.add('child')
            parent.appendChild(child)
        }

        assert.equal(20, getTargets('#elementBySelector .child').length)
        document.body.removeChild(parent)
    })

    it('resolves a NodeList or Element[]', () => {
        const parent = document.createElement('div')
        parent.id = 'elementBySelector'
        document.body.appendChild(parent)

        for (let i = 0; i < 20; i++) {
            const child = document.createElement('span')
            child.classList.add('child')
            parent.appendChild(child)
        }

        assert.equal(20, getTargets(document.querySelectorAll('#elementBySelector .child')).length)
        document.body.removeChild(parent)
    })

    it('resolves an element from a function', () => {
        const targets = () => {
            return document.createElement('i')
        }
        assert.equal(1, getTargets(targets).length)
    })

    it('flattens element list', () => {
        const targets = [
            document.createElement('i'),
            [
                document.createElement('i'),
                document.createElement('i'),
                [
                    document.createElement('i'),
                    document.createElement('i'),
                    document.createElement('i')
                ]
            ]
        ]
        assert.equal(6, getTargets(targets as any).length)
    })

    it('handles general ridiculousness', () => {
        const byIdElement = document.createElement('div')
        byIdElement.id = 'byId'
        document.body.appendChild(byIdElement)

        const byId2Element = document.createElement('div')
        byId2Element.id = 'byId2'
        document.body.appendChild(byId2Element)

        const byId3Element = document.createElement('div')
        byId3Element.id = 'byId3'
        document.body.appendChild(byId3Element)

        const targets = () => {
            return [
                byId2Element,
                '#byId2',
                document.createElement('i'),
                document.querySelectorAll('#byId3')
            ]
        }
        assert.equal(4, getTargets(targets as any).length)
    })
})
