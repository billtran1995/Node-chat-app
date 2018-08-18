const expect = require("expect");

var { generateMessage, generateLocationMessage } = require("./message");

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

describe("generateLocationMessage", () => {
  it("should generate correct location object", () => {
    let from = "Leon";
    let latitude = 11;
    let longitude = 12;
    let result = generateLocationMessage(from, latitude, longitude);

    expect(result.created).toBeA("number");
    expect(result).toInclude({
      from,
      url: `https://www.google.com/maps?=11,12`
    });
  });
});
