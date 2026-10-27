import { useEffect } from 'react'
import { useGlobalSearchParams, useSegments } from 'expo-router'
import { usePageBridgeClientIfPresent } from '../transport/client-context.web'
import { encodedRouteHref } from './encoded-route-href'

// Report in-document hops while this page owns the host area, so a fold can reopen the same screen natively.
export function useReportedPageLocation(): void {
  const client = usePageBridgeClientIfPresent()
  const ownsHostArea = client?.getShellSession()?.ownsHostArea === true
  const href = encodedRouteHref(useSegments(), useGlobalSearchParams())
  useEffect(() => {
    if (client && ownsHostArea) {
      client.notifyPageLocation(href)
    }
  }, [client, ownsHostArea, href])
}
