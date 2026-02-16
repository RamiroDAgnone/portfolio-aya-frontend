import { getAllPages } from "./pagesService";
import { getWorks } from "./worksService";
import { getTeam } from "./teamService";
import { getBProjects } from "./bProjectsService";
import { getDecorations } from "./decorationsService"

let preloadStarted = false;

export function preloadSecondaryData(isAuthenticated) {
    if (preloadStarted) return;
    preloadStarted = true;

    setTimeout(() => {
        getAllPages(isAuthenticated).catch(() => {});
        getWorks().catch(() => {});
        getTeam().catch(() => {});
        getBProjects().catch(() => {});
        getDecorations().catch(() => {});
    }, 0);
}
