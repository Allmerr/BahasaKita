import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { beforeEach, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ logout: vi.fn() }))
vi.mock('../../src/Account.jsx', () => ({ useAccount: () => ({ logout: mocks.logout }) }))
import AccountMenu from '../../src/AccountMenu.jsx'

function CurrentPath() { return <output data-testid="path">{useLocation().pathname}</output> }
function setup(authorized = true, variant = 'header') {
 return render(<MemoryRouter initialEntries={['/']} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><AccountMenu authorized={authorized} variant={variant} profile={{name:'Dina',grade:'SMA'}}/><CurrentPath/><button>Di luar menu</button></MemoryRouter>)
}
beforeEach(() => { mocks.logout.mockResolvedValue(undefined) })
it('opens the account dropdown and navigates to the profile', () => {
 setup(); expect(screen.queryByRole('navigation',{name:'Menu akun'})).not.toBeInTheDocument()
 fireEvent.click(screen.getByRole('button',{name:'Menu profil'}))
 expect(screen.getByRole('button',{name:'Menu profil'})).toHaveAttribute('aria-expanded','true')
 fireEvent.click(screen.getByRole('link',{name:'Profil'}))
 expect(screen.getByTestId('path')).toHaveTextContent('/profile')
 expect(screen.queryByRole('navigation',{name:'Menu akun'})).not.toBeInTheDocument()
})
it('logs out through Auth and redirects to login', async () => {
 setup();fireEvent.click(screen.getByRole('button',{name:'Menu profil'}));fireEvent.click(screen.getByRole('button',{name:'Log out'}))
 await waitFor(()=>expect(screen.getByTestId('path')).toHaveTextContent('/signin'))
 expect(mocks.logout).toHaveBeenCalledOnce()
})
it('keeps the user on the page and reports a failed logout', async () => {
 mocks.logout.mockRejectedValueOnce(new Error('Koneksi terputus. Coba lagi.'));setup()
 fireEvent.click(screen.getByRole('button',{name:'Menu profil'}));fireEvent.click(screen.getByRole('button',{name:'Log out'}))
 expect(await screen.findByRole('alert')).toHaveTextContent('Koneksi terputus')
 expect(screen.getByTestId('path').textContent).toBe('/')
 expect(screen.getByRole('button',{name:'Log out'})).toBeEnabled()
})
it('closes on Escape and restores trigger focus', () => {
 setup();const trigger=screen.getByRole('button',{name:'Menu profil'});fireEvent.click(trigger)
 fireEvent.keyDown(document,{key:'Escape'})
 expect(screen.queryByRole('navigation',{name:'Menu akun'})).not.toBeInTheDocument();expect(trigger).toHaveFocus()
})
it('closes when clicking outside the dropdown', () => {
 setup();fireEvent.click(screen.getByRole('button',{name:'Menu profil'}));fireEvent.pointerDown(screen.getByRole('button',{name:'Di luar menu'}))
 expect(screen.queryByRole('navigation',{name:'Menu akun'})).not.toBeInTheDocument()
})
it('offers login rather than logout to a guest', () => {
 setup(false);expect(screen.getByRole('link',{name:'Masuk ke akun'})).toHaveAttribute('href','/signin')
 expect(screen.queryByRole('button',{name:'Menu profil'})).not.toBeInTheDocument()
})
it('opens the sidebar arrow without navigating and offers the profile route', () => {
 setup(true,'sidebar');fireEvent.click(screen.getByRole('button',{name:'Menu profil sidebar'}))
 expect(screen.getByTestId('path').textContent).toBe('/')
 expect(screen.getByRole('navigation',{name:'Menu akun sidebar'})).toBeInTheDocument()
 fireEvent.click(screen.getByRole('link',{name:'Profil',exact:true}))
 expect(screen.getByTestId('path')).toHaveTextContent('/profile')
})
it('logs out using the sidebar dropdown', async () => {
 setup(true,'sidebar');fireEvent.click(screen.getByRole('button',{name:'Menu profil sidebar'}));fireEvent.click(screen.getByRole('button',{name:'Log out'}))
 await waitFor(()=>expect(screen.getByTestId('path')).toHaveTextContent('/signin'));expect(mocks.logout).toHaveBeenCalledOnce()
})
it('keeps separate accessible IDs for the header and sidebar controls', () => {
 render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><AccountMenu authorized profile={{name:'Dina'}}/><AccountMenu authorized variant="sidebar" profile={{name:'Dina'}}/></MemoryRouter>)
 expect(screen.getByRole('button',{name:'Menu profil'}).getAttribute('aria-controls')).not.toBe(screen.getByRole('button',{name:'Menu profil sidebar'}).getAttribute('aria-controls'))
})
