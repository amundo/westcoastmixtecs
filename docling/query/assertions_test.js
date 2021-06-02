import { assert, equal } from "https://deno.land/std/testing/asserts.ts";

Deno.test('the whole truth', () => {
  assert(1 === 1)
})

Deno.test('and nothing but the truth', () => {
  equal(1, 1)
})
