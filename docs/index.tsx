/** @jsx Snabbdom.createElement */
import Snabbdom from 'snabbdom-pragma'
import { run } from '@cycle/run'
import { makeDOMDriver, MainDOMSource } from '@cycle/dom'
import { Stream } from 'xstream'
import cssData from './css-data.json'

const properties = (cssData.properties as any) as {
  [key: string]: Array<[string, string]>
}

const selectors = (cssData.selectors as any) as {
  [key: string]: Array<[string, string]>
}

function main (sources: Sources): {
  DOM: Stream<JSX.Element>
} {
  const filter$ = sources.DOM
    .select('#search-input')
    .events('input')
    .map(function (e: InputEvent) {
      return (e.target as HTMLInputElement).value
    })
    .startWith('')

  const view$ = filter$
    .map(function (filterVal) {
      const filter = filterVal.toUpperCase()

      return (
        <div key='app' className='max-width-3 mx-auto p2'>
          <div className='mb3 pb2 border-bottom pure-form pure-form-stacked max-width-1 mx-auto'>
            <label for='search-input'>Enter property name</label>
            <input id='search-input' className='col-12' placeholder='Example: "margin" or "padding-right"' />
          </div>
          {filterVal !== '_'
            ? Object.keys(properties)
              .filter(function (propertyName) {
                return propertyName.toUpperCase().includes(filter)
              })
              .sort(function (a, b) {
                return a.toUpperCase().indexOf(filter) > b.toUpperCase().indexOf(filter)
                  ? 1
                  : -1
              })
              .map(function (propertyName) {
                const pairs = properties[propertyName]

                return (
                  <div key={propertyName} className='flex pb2 mb2 border-bottom'>
                    <span className='col-4 md-col-6'>
                      {propertyName}
                    </span>
                    <div className='col-8 md-col-6'>
                      {pairs.map(function ([className, value]) {
                        const siblings = selectors[className]
                        const otherSiblings = siblings.length > 1
                          ? siblings.filter(([sibPropertyName]) => sibPropertyName.indexOf('--') !== 0)
                            .filter(function ([sibPropertyName, sibValue]) {
                              return sibPropertyName !== propertyName || sibValue !== value
                            })
                          : []

                        return (
                          <div key={className} className='mb1'>
                            <span className='bold pr1' data-id={className}>{className}</span><i>{value}</i>
                            {(otherSiblings.length > 0)
                              ? (
                                <div className='pl2 h5 mb2 mt1'>
                                  {otherSiblings.map(function ([sibPropertyName, sibValue]) {
                                    return (
                                      <div key={sibPropertyName}>
                                        <span className='pr1' data-id={className}>{sibPropertyName}:</span><i>{sibValue}</i>
                                      </div>
                                    )
                                  })}
                                </div>
                              )
                              : null}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            : null}
        </div>
      )
    })

  return {
    DOM: view$
  }
}

if (process.env.NODE_ENV !== 'test') {
  run(main, {
    DOM: makeDOMDriver(document.getElementById('app') as Element)
  })
}

interface Sources {
  DOM: MainDOMSource
}
