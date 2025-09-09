export function testInput(input: string) {
    const inputRegex = /[<>`$;`]/g;
    return inputRegex.test(input);
}