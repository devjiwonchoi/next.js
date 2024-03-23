import Loadable from './loadable.shared-runtime'
import { convertModule } from './lazy-dynamic/loadable'
import type { ComponentType } from 'react'
import type {
  ComponentModule,
  DynamicOptionsLoadingProps,
  LazyExoticComponent,
  Loader,
  LoaderComponent,
  LoadableGeneratedOptions,
  LoaderMap,
} from './lazy-dynamic/types'

const isServerSide = typeof window === 'undefined'

function noSSR<P = {}>(
  LoadableInitializer: LoadableFn<P>,
  loadableOptions: DynamicOptions<P>
): ComponentType<P> {
  // Removing webpack and modules means react-loadable won't try preloading
  delete loadableOptions.webpack
  delete loadableOptions.modules

  // This check is necessary to prevent react-loadable from initializing on the server
  if (!isServerSide) {
    return LoadableInitializer(loadableOptions)
  }

  const Loading = loadableOptions.loading!
  // This will only be rendered on the server side
  return () => (
    <Loading error={null} isLoading pastDelay={false} timedOut={false} />
  )
}

/**
 * This function lets you dynamically import a component.
 * It uses [React.lazy()](https://react.dev/reference/react/lazy) with [Suspense](https://react.dev/reference/react/Suspense) under the hood.
 *
 * Read more: [Next.js Docs: `next/dynamic`](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#nextdynamic)
 */
export default function dynamic<P extends ComponentType<any>>(
  dynamicOptions: DynamicOptions<P> | Loader<P>,
  options?: DynamicOptions<P>
): LazyExoticComponent<P> {
  const loadableFn = Loadable as LoadableFn<P>
  let loadableOptions: LoadableOptions<P> = {
    // A loading component is not required, so we default it
    loading: ({ error, isLoading, pastDelay }) => {
      if (!pastDelay) return null
      if (process.env.NODE_ENV !== 'production') {
        if (isLoading) {
          return null
        }
        if (error) {
          return (
            <p>
              {error.message}
              <br />
              {error.stack}
            </p>
          )
        }
      }
      return null
    },
  }

  // Support for direct import(), eg: dynamic(import('../hello-world'))
  // Note that this is only kept for the edge case where someone is passing in a promise as first argument
  // The react-loadable babel plugin will turn dynamic(import('../hello-world')) into dynamic(() => import('../hello-world'))
  // To make sure we don't execute the import without rendering first
  if (dynamicOptions instanceof Promise) {
    loadableOptions.loader = () => dynamicOptions
    // Support for having import as a function, eg: dynamic(() => import('../hello-world'))
  } else if (typeof dynamicOptions === 'function') {
    loadableOptions.loader = dynamicOptions
    // Support for having first argument being options, eg: dynamic({loader: import('../hello-world')})
  } else if (typeof dynamicOptions === 'object') {
    loadableOptions = { ...loadableOptions, ...dynamicOptions }
  }

  // Support for passing options, eg: dynamic(import('../hello-world'), {loading: () => <p>Loading something</p>})
  loadableOptions = { ...loadableOptions, ...options }

  const loaderFn = loadableOptions.loader as () => LoaderComponent<P>
  const loader = () =>
    loaderFn != null
      ? loaderFn().then(convertModule)
      : Promise.resolve(convertModule(() => null))

  // coming from build/babel/plugins/react-loadable-plugin.js
  if (loadableOptions.loadableGenerated) {
    loadableOptions = {
      ...loadableOptions,
      ...loadableOptions.loadableGenerated,
    }
    delete loadableOptions.loadableGenerated
  }

  // support for disabling server side rendering, eg: dynamic(() => import('../hello-world'), {ssr: false}).
  if (typeof loadableOptions.ssr === 'boolean' && !loadableOptions.ssr) {
    delete loadableOptions.webpack
    delete loadableOptions.modules

    return noSSR(loadableFn, loadableOptions) as LazyExoticComponent<P>
  }

  return loadableFn({
    ...loadableOptions,
    loader: loader as Loader<P>,
  }) as LazyExoticComponent<P>
}

export type DynamicOptions<P = {}> = LoadableGeneratedOptions & {
  loading?: (loadingProps: DynamicOptionsLoadingProps) => JSX.Element | null
  loader?: Loader<P> | LoaderMap
  loadableGenerated?: LoadableGeneratedOptions
  ssr?: boolean
  /**
   * @deprecated `suspense` prop is not required anymore
   */
  suspense?: boolean
}
export type LoadableOptions<P = {}> = DynamicOptions<P>
export type LoadableFn<P = {}> = (opts: LoadableOptions<P>) => ComponentType<P>
export type LoadableComponent<P = {}> = ComponentType<P>
export type {
  ComponentModule,
  DynamicOptionsLoadingProps,
  Loader,
  LoaderComponent,
  LoadableGeneratedOptions,
  LoaderMap,
}
