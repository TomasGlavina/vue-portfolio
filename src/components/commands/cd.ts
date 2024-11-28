import {Router} from 'vue-router';

export const cdCommand = (router: Router, currentPath: string, newPath: string) => {
    const validPaths = ['about', 'projects', 'skills', 'contact'];
    if(newPath === "..") {
        if(currentPath === "~") {
            return 'You are already at the root directory';
        }
        router.push("/");
        return;
    } else if(validPaths.includes(newPath)) {
        if(currentPath === "~") {
            router.push(`/${newPath}`);
            return '';
        } else {
            return 'Cannot find directory: ' + newPath;
        }
    } else {
        return 'Cannot find directory: ' + newPath;
    }
};