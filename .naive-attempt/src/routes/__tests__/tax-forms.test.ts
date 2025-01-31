import request from "supertest";
import app from "../../index";
import { StatusCodes } from "http-status-codes";

describe("Tax Forms Route", () => {
  it("should return a PDF file", async () => {
    const response = await request(app).get("/tax-forms/test.pdf");

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.type).toBe("application/pdf");
    expect(response.body).toBeTruthy();
  });

  it("should return 404 for invalid route", async () => {
    const response = await request(app).get("/tax-forms/invalid");

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.body.message).toBe("Route not found");
  });
});
