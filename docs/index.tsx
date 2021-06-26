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
            <label for='search-input'>Enter property name or variable</label>
            <input id='search-input' className='col-12' placeholder='Example: "margin" or "--space"' />
          </div>
          {filterVal !== ''
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
                const classes = pairs.map(function ([className, propertyValue]) {
                  const siblings = selectors[className]
                  const siblingProperties = siblings.length > 1
                    ? siblings.filter(([sibPropertyName]) => sibPropertyName.indexOf('--') !== 0)
                      .filter(function ([sibPropertyName, sibValue]) {
                        return sibPropertyName !== propertyName || sibValue !== propertyValue
                      })

                    : []
                  return {
                    className,
                    propertyValue,
                    siblingProperties
                  }
                })
                return (
                  <PropertyDisplay
                    key={propertyName}
                    propertyName={propertyName}
                    classes={classes}
                  />
                )
              })
            : (
              <PropertyDisplay
                propertyName='property-name'
                classes={[
                  {
                    propertyValue: 'property-value',
                    className: '.class-name',
                    siblingProperties: [
                      ['other-property', 'property-value']
                    ]
                  }
                ]}
              />
            )}
        </div>
      )
    })

  return {
    DOM: view$
  }
}

interface PropertyDisplayProps {
  key?: string
  propertyName: string
  classes: Array<{
    propertyValue: string
    className: string
    siblingProperties: Array<[string, string]>
  }>
}

function PropertyDisplay (props: PropertyDisplayProps): JSX.Element {
  return (
    <div className='flex pb2 mb2 border-bottom'>
      <span className='col-4 md-col-6'>
        {props.propertyName}
      </span>
      <div className='col-8 md-col-6'>
        {props.classes.map(function ({ propertyValue, className, siblingProperties }) {
          return (
            <div className='mb1' key={className}>
              <span className='bold pr1'>{className}</span><i>{propertyValue}</i>
              {siblingProperties.length > 0
                ? (
                  <div className='pl3 h5 mb2 mt1'>
                    {siblingProperties.map(function ([siblingPropertyName, siblingPropertyValue]) {
                      return (
                        <div key={siblingPropertyName}>
                          <span className='pr1'>{siblingPropertyName}:</span><i>{siblingPropertyValue}</i>
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
}

if (process.env.NODE_ENV !== 'test') {
  run(main, {
    DOM: makeDOMDriver(document.getElementById('app') as Element)
  })
}

interface Sources {
  DOM: MainDOMSource
}
