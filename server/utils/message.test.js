const expect = require("expect");

var { generateMessage } = require("./message");

describe("generateMessage", () => {
  // done() is not needed here since this is a synchronous function
  it("should generate correct message object", () => {
    let from = "Bill";
    let text = "Hello there!";
    let result = generateMessage(from, text);

    expect(result.created).toBeA("number");
    expect(result).toInclude({ from, text });
  });
});
