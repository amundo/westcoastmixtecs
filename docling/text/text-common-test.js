import { assertEquals } from "https://deno.land/std@0.93.0/testing/asserts.ts";
import { parseRange } from "./text-common.js";

// Simple name and function, compact form, but not configurable
Deno.test("Parse range #1", () => {
  assertEquals(parseRange('1'), [1])
})


Deno.test("Parse range #2", () => {
  assertEquals(parseRange('1,3'), [1,3])
})


Deno.test("Parse range #3", () => {
  assertEquals(parseRange('1-3'), [1,2,3])
})



Deno.test("Parse range #4", () => {
  assertEquals(parseRange('1-3,5'), [1,2,3,5])
})

Deno.test("Parse range #4", () => {
  assertEquals(parseRange('1,3-5'), [1,3,4,5])
})

Deno.test("Parse range #5", () => {
  assertEquals(parseRange('1 , 3 - 6'), [1,3,4,5,6])
})


Deno.test("Parse range #6", () => {
  assertEquals(parseRange('1 , 3 - 6, 19'), [1,3,4,5,6,19])
})
