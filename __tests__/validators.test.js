const { validateComment,
    validateUpdateVoteCount } = require("../validators/validators")

describe("validateComment function", () => {

    test('should return correct errors messages if both arguments are missing', () => {
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

describe("validateUpdateVoteCount function", () => {

    describe('should return correct error message', () => {
        test('if no argument passed', () => {
            expect(validateUpdateVoteCount()).toEqual(["inc_vote must be an integer not equal to 0"]);
        });
        test("if given cero as argument", () => {
            const input = 0;
            
            const result = validateUpdateVoteCount(input);
            expect(result).toEqual(["inc_vote must be an integer not equal to 0"]);
        });
        test("if NOT an integer is passed", () => {
            const input = 3.5

            const result = validateUpdateVoteCount(input);
            expect(result).toEqual(["inc_vote must be an integer not equal to 0"]);
        });
    });
});