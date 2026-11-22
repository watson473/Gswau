// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  KIT_FORM_ACTION,
  KIT_FORM_ID,
  kitGuardSignal,
  parseKitSubscribeResponse,
} from "@/lib/kit-form";

describe("Kit public form", () => {
  it("posts to the form on the owner's landing page", () => {
    expect(KIT_FORM_ID).toBe("10042215");
    expect(KIT_FORM_ACTION).toBe("https://app.kit.com/forms/10042215/subscriptions");
  });

  it("treats success, a Kit security check, and a bad payload differently", () => {
    expect(parseKitSubscribeResponse(200, { status: "success" })).toEqual({ status: "success" });
    expect(
      parseKitSubscribeResponse(200, {
        status: "quarantined",
        url: "https://app.kit.com/forms/guards/f8b79838-2a1a-4b88-a076-bee1defcad51",
      }),
    ).toEqual({
      status: "quarantined",
      url: "https://app.kit.com/forms/guards/f8b79838-2a1a-4b88-a076-bee1defcad51",
    });
    expect(
      parseKitSubscribeResponse(200, {
        status: "quarantined",
        url: "https://evil.example/forms/guards/abc",
      }).status,
    ).toBe("error");
    expect(
      parseKitSubscribeResponse(422, {
        status: "error",
        errors: { messages: ["Email address is invalid"] },
      }),
    ).toEqual({ status: "error", message: "Email address is invalid" });
    expect(parseKitSubscribeResponse(500, null).status).toBe("error");
  });

  it("accepts a confirmation only from Kit", () => {
    expect(
      kitGuardSignal({
        origin: "https://app.kit.com",
        data: { name: "ckjs:guard:confirmed" },
      }),
    ).toBe("confirmed");
    expect(
      kitGuardSignal({
        origin: "https://evil.example",
        data: { name: "ckjs:guard:confirmed" },
      }),
    ).toBeNull();
    expect(
      kitGuardSignal({
        origin: "https://app.kit.com",
        data: { name: "ckjs:guard:failed" },
      }),
    ).toBe("failed");
  });
});
