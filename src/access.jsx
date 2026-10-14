import { createContext, useContext } from 'react'
export const AccessContext = createContext({ authorized: false })
export const useAccess = () => useContext(AccessContext)
export const publicPages = ['/', '/learning', '/dictionary', '/progress']
export function needsLogin(authorized, publicNavigation) { return !authorized && !publicNavigation }
