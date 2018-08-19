const expect = require("expect");

const { isRealString } = require("./validation");

describe("isRealString", () => {
  it("should reject non-string values", () => {
    var number = 123;
    var result = isRealString(number);

    expect(result).toBeFalsy();
  });

  it("should reject string with only spaces", () => {
    var str = "     ";
    var result = isRealString(str);

    expect(result).toBeFalsy();
  });

  it("should allow string with non-space characters", () => {
    var str = " My best chat room ";
    var result = isRealString(str);

    expect(result).toBeTruthy();
  });
});
