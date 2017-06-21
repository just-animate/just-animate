import { AnimationTargetContext, Resolver } from '../types'
import { isFunction, unitExpression, isNumber, isDefined } from '../utils'

/**
 *  Resolves the property/value of an animation
 */
export const resolve = <T1>(input: T1 | Resolver<T1>, ctx: AnimationTargetContext, isStep = false): any => {
    let output = isFunction(input)
        ? resolve((input as Resolver<T1>)(ctx), ctx)
        : input as T1 | number | string

    if (isDefined(output) && !isNumber(output)) {
        const match = unitExpression.exec(output as any as string) as RegExpExecArray
        if (match) {
            const stepTypeString = match[1]
            const startString = match[2]
            const unitTypeString = match[3]
            const num = startString ? parseFloat(startString) : 0
            const sign = stepTypeString === '-=' ? -1 : 1
            const step = isStep || stepTypeString && isDefined(ctx.index) ? (ctx.index || 0) + 1 : 1
            const val = sign * num * step
            return unitTypeString ? val + unitTypeString : val
        }
    }
    if (isNumber(output) && isStep) {
        return (output as number) * ctx.index
    }
    return output
}
