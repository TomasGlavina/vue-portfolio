export const lsCommand = (currentPath: string) => {
    if (currentPath === "~") {
        return ['about', 'projects', 'skills', 'contact'];
    }
    return[];
}