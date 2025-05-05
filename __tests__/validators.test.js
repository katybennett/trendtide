const { validateComment,
    validateUpdateVoteCount } = require("../validators/validators")

describe("validateComment function", () => {
    test('should return correct errors messages if both arguments are missing', () => {
        expect(() => validateComment()).toThrow({
            name: "InvalidRequestError",
            message: "Invalid Request: username is required, body is required",
        });
    });
    describe('should return correct error message', () => {
        test("if username is missed, responds with error message username is required", () => {
            const username = '';
            const body = 'This is some text';
            expect(() => validateComment(username, body)).toThrow({
                name: "InvalidRequestError",
                message: "Invalid Request: username is required",
            });
        });
        test("if body is missed, responds with error message body is required", () => {
            const username = 'OneUserName';
            const body = '';
            expect(() => validateComment(username, body)).toThrow({
                name: "InvalidRequestError",
                message: "Invalid Request: body is required",
            });
        });
    });
});

describe("validateUpdateVoteCount function", () => {
    describe('should return correct error message', () => {
        test('if no argument passed', () => {
            expect(() => validateUpdateVoteCount()).toThrow({
                name: "InvalidRequestError",
                message: "Invalid Request: Vote is not valid",
            });
        });
        test("if given cero as argument", () => {
            const input = 0;
            
            expect(() => validateUpdateVoteCount(input)).toThrow({
                name: "InvalidRequestError",
                message: "Invalid Request: Vote is not valid",
            });
        });
        test("if NOT an integer is passed", () => {
            const input = 3.5

            expect(() => validateUpdateVoteCount(input)).toThrow({
                name: "InvalidRequestError",
                message: "Invalid Request: Vote is not valid",
            });
        });
    });
});