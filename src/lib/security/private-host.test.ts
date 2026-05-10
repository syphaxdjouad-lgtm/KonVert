import { describe, it, expect } from 'vitest'
import { isPrivateHost } from './private-host'

describe('isPrivateHost — IPv4', () => {
  it('blocks localhost', () => {
    expect(isPrivateHost('localhost')).toBe(true)
    expect(isPrivateHost('LOCALHOST')).toBe(true)
  })

  it('blocks 127.0.0.0/8 loopback', () => {
    expect(isPrivateHost('127.0.0.1')).toBe(true)
    expect(isPrivateHost('127.255.255.254')).toBe(true)
  })

  it('blocks 10.0.0.0/8', () => {
    expect(isPrivateHost('10.0.0.1')).toBe(true)
    expect(isPrivateHost('10.255.255.255')).toBe(true)
  })

  it('blocks 192.168.0.0/16', () => {
    expect(isPrivateHost('192.168.1.1')).toBe(true)
  })

  it('blocks 172.16.0.0/12', () => {
    expect(isPrivateHost('172.16.0.1')).toBe(true)
    expect(isPrivateHost('172.31.255.255')).toBe(true)
    expect(isPrivateHost('172.15.0.1')).toBe(false) // hors plage
    expect(isPrivateHost('172.32.0.1')).toBe(false)
  })

  it('blocks 169.254.0.0/16 link-local + AWS/GCP metadata', () => {
    expect(isPrivateHost('169.254.169.254')).toBe(true)
    expect(isPrivateHost('169.254.0.1')).toBe(true)
  })

  it('blocks CGNAT 100.64.0.0/10', () => {
    expect(isPrivateHost('100.64.0.1')).toBe(true)
    expect(isPrivateHost('100.127.255.255')).toBe(true)
    expect(isPrivateHost('100.63.0.1')).toBe(false) // hors plage
    expect(isPrivateHost('100.128.0.1')).toBe(false)
  })

  it('blocks multicast 224.0.0.0/4', () => {
    expect(isPrivateHost('224.0.0.1')).toBe(true)
    expect(isPrivateHost('239.255.255.255')).toBe(true)
  })

  it('allows public IPv4', () => {
    expect(isPrivateHost('8.8.8.8')).toBe(false)
    expect(isPrivateHost('1.1.1.1')).toBe(false)
    expect(isPrivateHost('142.250.74.46')).toBe(false)
  })
})

describe('isPrivateHost — IPv6', () => {
  it('blocks ::1 loopback (with and without brackets)', () => {
    expect(isPrivateHost('::1')).toBe(true)
    expect(isPrivateHost('[::1]')).toBe(true)
  })

  it('blocks fe80::/10 link-local', () => {
    expect(isPrivateHost('fe80::1')).toBe(true)
    expect(isPrivateHost('FE80::')).toBe(true)
  })

  it('blocks fc00::/7 unique local', () => {
    expect(isPrivateHost('fc00::1')).toBe(true)
    expect(isPrivateHost('fd12:3456::1')).toBe(true)
  })

  it('blocks IPv4-mapped IPv6 (::ffff:127.0.0.1 etc)', () => {
    expect(isPrivateHost('::ffff:127.0.0.1')).toBe(true)
    expect(isPrivateHost('::ffff:10.0.0.1')).toBe(true)
    expect(isPrivateHost('::ffff:8.8.8.8')).toBe(false) // IPv4 publique mappée → autorisée
  })

  it('blocks multicast ff00::/8', () => {
    expect(isPrivateHost('ff02::1')).toBe(true)
  })

  it('blocks documentation 2001:db8::/32', () => {
    expect(isPrivateHost('2001:db8::1')).toBe(true)
  })

  it('allows public IPv6', () => {
    expect(isPrivateHost('2606:4700:4700::1111')).toBe(false) // Cloudflare DNS
    expect(isPrivateHost('2a00:1450:4001::200e')).toBe(false) // Google
  })
})

describe('isPrivateHost — DNS particuliers', () => {
  it('blocks .local mDNS', () => {
    expect(isPrivateHost('macbook.local')).toBe(true)
    expect(isPrivateHost('printer.LOCAL')).toBe(true)
  })

  it('blocks .internal', () => {
    expect(isPrivateHost('api.internal')).toBe(true)
  })

  it('blocks GCP metadata DNS', () => {
    expect(isPrivateHost('metadata.google.internal')).toBe(true)
  })

  it('blocks .lan, .localhost subdomains', () => {
    expect(isPrivateHost('foo.lan')).toBe(true)
    expect(isPrivateHost('foo.localhost')).toBe(true)
  })

  it('allows real public domains', () => {
    expect(isPrivateHost('example.com')).toBe(false)
    expect(isPrivateHost('shop.aliexpress.com')).toBe(false)
    expect(isPrivateHost('konvert.app')).toBe(false)
  })

  it('blocks empty input as private (defensive)', () => {
    expect(isPrivateHost('')).toBe(true)
  })
})
