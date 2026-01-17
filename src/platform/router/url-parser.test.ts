import { test } from 'node:test'
import * as assert from 'node:assert'
import { normalizePathname } from './url-parser.ts'

test('It should provide base route', () => {
  const result = normalizePathname("/", "/")
  assert.equal(result, "/")
})

test('It should provide base route with base href', () => {
  const result = normalizePathname("/dist", "/")
  assert.equal(result, "/dist")
})

test('It should route to path', () => {
  const result = normalizePathname("/", "/foo")
  assert.equal(result, "/foo")
})

test('it should append path to href', () => {
  const result = normalizePathname("/dist", "/foo")
  assert.equal(result, "/dist/foo")
})

test('it should ignore trailing slashes on base href', () => {
  const result = normalizePathname("/dist/", "/foo")
  assert.equal(result, "/dist/foo")
})

test('it should consider an empty basehref as "/"', () => {
  const result = normalizePathname("", "/")
  assert.equal(result, "/")
})

test('It should route to path with empty base href', () => {
  const result = normalizePathname("", "/foo")
  assert.equal(result, "/foo")
})

test('It should lower case path', () => {
  const result = normalizePathname("/", "/Foo")
  assert.equal(result, "/foo")
})

test('It should lower case path and basehref', () => {
  const result = normalizePathname("/Dist", "/Foo")
  assert.equal(result, "/dist/foo")
})