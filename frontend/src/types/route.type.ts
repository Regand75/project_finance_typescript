export type RouteType = {
    route: string,
    title?: string,
    template?: string,
    useLayout?: string,
    load(): void,
    styles?: string[],
}