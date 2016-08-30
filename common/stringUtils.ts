export class StringUtils {

    public static isBlank(value: string) {
        return (!value || value.trim().length === 0);
    }
}