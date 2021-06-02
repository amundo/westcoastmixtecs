import { equal,assert,assertEquals,assertNotEquals,assertStrictEquals,assertStringIncludes,assertMatch,assertNotMatch,assertArrayIncludes,assertObjectMatch,assertThrows,assertThrowsAsync } from "https://deno.land/std@0.95.0/testing/asserts.ts"
import { handler } from "./match.js"

Deno.test("env", () => {
  if (!handler) {
    throw Error("missing module")
  }
})

Deno.test({
  name: "testing example",
  fn(){
    assertEquals("world", "world")
    assertEquals({ hello: "world" }, { hello: "world" })
  }
})

Deno.test("example", function (){
  assertEquals("world", "world")
  assertEquals({ hello: "world" }, { hello: "world" })
})

Deno.test("isStrictlyEqual", function(){
  const a = {};
  const b = a;
  assertStrictEquals(a, b);
});

Deno.test("isNotStrictlyEqual", function (){
  const a = {}
  const b = {}
  assertStrictEquals(a, b)
})



Deno.test("doesThrow", function (){
  assertThrows(()=> {
    throw new TypeError("hello world!");
  });
  assertThrows(()=> {
    throw new TypeError("hello world!");
  }, TypeError);
  assertThrows(
    ()=> {
      throw new TypeError("hello world!");
    },
    TypeError,
    "hello",
  );
});

// This test will not pass.
Deno.test("fails", function (){
  assertThrows(()=> {
    console.log("Hello world");
  })
})

Deno.test('works', () => {
  let re = /\p{Letter}/gu
  assert(re.test('a'), true)
})