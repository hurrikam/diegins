export class StringUtils {

    public static isUndefinedOrBlank(testString: string) {
        if (testString === undefined || testString === null) {
            return true;
        }
        return testString.trim().length === 0;
    }

    public static startsWith(testString: string, subString: string) {
        if (testString === undefined || testString === null) {
            throw new Error('testString cannot be undefined or null');
        }
        return testString.indexOf(subString) === 0;
    }
}