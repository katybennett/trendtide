const { validateComment } = require("../validators/validators")

describe("validateComment function", () => {

    test('should return correct errors message if both arguments are missing', () => {
        expect(validateComment()).toEqual(["username is required", "body is required"]);
    });

    describe('should return correct error message', () => {
        test("if username is missed, responds with error message username is required", () => {
            const username = '';
            const body = 'This is some text';
            
            const result = validateComment(username, body);
            expect(result).toEqual(["username is required"]);
            });
        
            test("if body is missed, responds with error message body is required", () => {
            const username = 'OneUserName';
            const body = '';

            const result = validateComment(username, body);
            expect(result).toEqual(["body is required"]);
        });
    });
});