import * as chai from 'chai';
const assert = chai.assert

import { animate } from '../../src/main'

describe('basic', () => { 
  it('seeks to 50% on an HTML attribute', () => {
    /* Test code */
    const target = document.createElement('div')
    document.body.appendChild(target)
 
    const timeline = animate({
      targets: target,
      duration: 1000,
      props: {
        dataValue: [100, 200]
      }
    })
    
    timeline.pause().seek(500)
    
    assert.equal(target.getAttribute('data-value'), '150')
    document.body.removeChild(target)
  })
  
  it('seeks to 50% on a CSS variable', () => {
    /* Test code */
    const target = document.createElement('div')
    target.style.opacity = 'var(--opacity)'
    document.body.appendChild(target)
 
    const timeline = animate({
      targets: target,
      duration: 1000,
      props: {
        '--opacity': [0, 1]
      }
    })
    
    timeline.pause().seek(500)
    
    assert.equal(target.style.getPropertyValue('--opacity'), '0.5')
    assert.equal(getComputedStyle(target).opacity, '0.5')
    
    document.body.removeChild(target)
  })
  
  it('seeks to 50% on innerHTML', () => {
    /* Test code */
    const target = document.createElement('div')
    document.body.appendChild(target)
 
    const timeline = animate({
      targets: target,
      duration: 1000,
      props: {
        innerHTML: ['first', 'middle', 'last']
      }
    })
    
    timeline.pause().seek(500)
    assert.equal(target.innerHTML, 'middle')
    
    document.body.removeChild(target)
  })
  
  it('cancel restores the original value of a property', () => {
    /* Test code */
    const target = document.createElement('div')
    target.textContent = 'Tuna salad'
    document.body.appendChild(target)
 
    const timeline = animate({
      targets: target,
      duration: 1000,
      props: {
        innerHTML: ['first', 'middle', 'last']
      }
    })
    
    timeline.pause().seek(500).cancel()
    assert.equal(target.textContent, 'Tuna salad')
    
    document.body.removeChild(target)
  })
});
